var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    sass= require('node-sass'),
    stringifyObject = require('stringify-object');

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

            writeNewScss(file, newBaseName, newDir, newFile);

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

function writeNewScss(file, newBaseName, newDir, newFile) {
    console.log('? ', file);
    fs.existsSync(newDir) || fs.mkdirSync(newDir);
    if(!fs.existsSync(newFile)) {
        var content = String(fs.readFileSync(file)),
            deps = [];

        fs.writeFileSync(
            newFile,
            content.replace(/@import "(?:\.\.\/)?_?(.+)";\n/g, function(_, dep) {
                deps.push('mdl-' + dep);
                return '';
            }));

        fs.writeFileSync(
            path.join(newDir, newBaseName + '.deps.js'),
            '(' + stringifyObject(
                { mustDeps : deps },
                { indent : '    ' }
            ) +')'
        )
    }
    console.log('! ', newFile);
}
