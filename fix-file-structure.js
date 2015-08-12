var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    sass= require('node-sass'),
    stringifyObject = require('stringify-object'),
    decamelize = require('decamelize'),
    vm = require('vm'),
    _ = require('lodash/array');

glob(
    'libs/material-design-lite/src/*/_*.scss',
    { ignore : '*/node_modules/*' },
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            var dirName = path.dirname(file),
                baseName = path.basename(dirName),
                fileBaseName = path.basename(file, '.scss').substr(1).replace('_', '-'),
                newBaseName = 'mdl-' + fileBaseName,
                newDir = path.join(path.dirname(dirName), newBaseName),
                newFile = path.join(newDir, newBaseName + '.scss'),
                fileJS = path.join(dirName, baseName + '.js'),
                newFileJS = path.join(newDir, newBaseName + '.js');

            if(fileBaseName === baseName) {
                writeNewScss(file, newBaseName, newDir, newFile);
            } else {
                if(baseName === 'resets') {
                    newBaseName = 'mdl-' + baseName;
                    newDir = path.join(path.dirname(dirName), newBaseName);
                    var deps = [];

                    copyFile(
                        file,
                        newDir,
                        path.join(newDir, path.basename(file)),
                        function(content) {
                            return content.replace(
                                /@import "\.\.\/([^\/]+?)";\n/g,
                                function(_, dep) {
                                    deps.push('mdl-' + dep);
                                    return '';
                                }
                            );
                        });

                    writeDeps(newDir, newBaseName, deps);
                } else {
                    writeNewScss(file, newBaseName, newDir, newFile);
                }
            }

            if(fs.existsSync(fileJS)) {
                console.log('? ', fileJS);
                !fs.existsSync(newFileJS) &&
                    fs.symlinkSync(path.relative(newDir, fileJS), newFileJS);
                console.log('! ', newFileJS);
            }
        });
    });

glob(
    'libs/material-design-lite/src/_*.scss',
    { ignore : '*/node_modules/*' },
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            var newBaseName = 'mdl-' + path.basename(file, '.scss').substr(1),
                newDir = path.join(path.dirname(file), newBaseName),
                newFile = path.join(newDir, newBaseName + '.scss');

            writeNewScss(file, newBaseName, newDir, newFile);
        });
    });

glob(
    'libs/material-design-lite/src/mdlComponentHandler.js',
    { ignore : '*/node_modules/*' },
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            var newBaseName = decamelize(path.basename(file, '.js'), '-'),
                newDir = path.join(path.dirname(file), newBaseName),
                newFile = path.join(newDir, newBaseName + '.js');

            copyFile(file, newDir, newFile);
        });
    });

function writeNewScss(file, newBaseName, newDir, newFile) {
    console.log('? ', file);
    fs.existsSync(newDir) || fs.mkdirSync(newDir);
    if(!fs.existsSync(newFile)) {
        var content = String(fs.readFileSync(file)),
            deps = [];

        fs.writeFileSync(
            newFile,
            content
                .replace(/@import "(?:\.\.\/)?_?([^\/]+?)";\n/g, function(_, dep) {
                    deps.push('mdl-' + dep);
                    return '';
                })
                .replace(/@import "\.\.\/[^\/]+\/([^\/]+?)";\n/g, '@import "_$1.scss";\n')
        );

        writeDeps(newDir, newBaseName, deps);
    }
    console.log('! ', newFile);
}

function writeDeps(newDir, newBaseName, deps) {
    var newFile = path.join(newDir, newBaseName + '.deps.js'),
        depsObj = fs.existsSync(newFile) ?
            vm.runInNewContext(String(fs.readFileSync(newFile))) :
            { mustDeps : [] };

    depsObj.mustDeps = _.uniq(depsObj.mustDeps.concat(deps));

    depsObj.mustDeps.length &&
        fs.writeFileSync(newFile, '(' + stringifyObject( depsObj, { indent : '    ' }) +')');
}

function copyFile(file, newDir, newFile, contentTransform) {
    contentTransform || (contentTransform = function(c) { return c; });
    fs.existsSync(newDir) || fs.mkdirSync(newDir);
    fs.existsSync(newFile) ||
        fs.writeFileSync(
            newFile,
            contentTransform(String(fs.readFileSync(file))));
}
