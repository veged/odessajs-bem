var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    sass= require('node-sass'),
    stringifyObject = require('stringify-object'),
    decamelize = require('decamelize');

glob(
    'libs/material-design-lite/src/*/_*.scss',
    { ignore : '*/node_modules/*' },
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            var dirName = path.dirname(file),
                baseName = path.basename(dirName),
                newBaseName = 'mdl-' + baseName,
                newDir = path.join(path.dirname(dirName), newBaseName),
                newFile = path.join(newDir, newBaseName + '.scss'),
                fileJS = path.join(dirName, baseName + '.js'),
                newFileJS = path.join(newDir, newBaseName + '.js');

            if(path.basename(file, '.scss').substr(1) === path.basename(dirName)) {
                writeNewScss(file, newBaseName, newDir, newFile);
            } else {
                copyFile(file, newDir, path.join(newDir, path.basename(file)));
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
                .replace(/@import "(\.\.\/[^\/]+)\/([^\/]+?)";\n/g, '@import "$1/_$2.scss";\n')
        );

        deps.length && fs.writeFileSync(
            path.join(newDir, newBaseName + '.deps.js'),
            '(' + stringifyObject(
                { mustDeps : deps },
                { indent : '    ' }
            ) +')'
        )
    }
    console.log('! ', newFile);
}

function copyFile(file, newDir, newFile) {
    fs.existsSync(newDir) || fs.mkdirSync(newDir);
    fs.existsSync(newFile) || fs.writeFileSync(newFile, fs.readFileSync(file));
}
