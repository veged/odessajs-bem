var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    html2bemjson = require('html2bemjson').convert,
    stringifyObject = require('stringify-object');

glob(
    'libs/material-design-lite/templates/*/index.html',
    {},
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            console.log('? ', file);

            var baseName = path.basename(path.dirname(file)),
                newDir = path.join('pages', baseName),
                newFile = path.join(newDir, baseName + '.bemjson.js');

            fs.existsSync(newDir) || fs.mkdirSync(newDir);
            var html = String(fs.readFileSync(file))
                    .replace('<link rel="stylesheet" href="styles.css">', '')
                    .replace('<link rel="stylesheet" href="material.min.css">', '<link rel="stylesheet" href="' + baseName + '.min.css">')
                    .replace('<script src="../../material.min.js"></script>', '<script src="' + baseName + '.min.js"></script>'),
                bemjson = html2bemjson(html, { naming : { elem: '__', mod: '--' } });

                bemjson.block = 'page';
                bemjson = ['<!doctype html>', bemjson];

            fs.writeFileSync(
                newFile,
                '(' + stringifyObject(
                    bemjson,
                    { indent : '    ' }
                ) + ')'
            );

            console.log('! ', newFile);
        });
    });