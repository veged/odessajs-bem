var path = require('path'),
    fs = require('fs'),
    mkdirpSync = require('mkdirp').sync,
    glob = require('glob'),
    html2bemjson = require('html2bemjson').convert,
    bemjson2deps = require('bemjson-to-deps').convert,
    stringifyObject = require('stringify-object');

glob(
    'libs/material-design-lite/templates/*/index.html',
    {},
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            console.log('? ', file);

            var dirName = path.dirname(file),
                baseName = path.basename(dirName),
                newDir = path.join('pages', baseName),
                newFile = path.join(newDir, baseName + '.bemjson.js');

            mkdirpSync(newDir);
            var html = String(fs.readFileSync(file))
                    .replace('<link rel="stylesheet" href="styles.css">', '')
                    .replace('<link rel="stylesheet" href="material.min.css">', '<link rel="stylesheet" href="' + baseName + '.min.css">')
                    .replace('<script src="../../material.min.js"></script>', '<script src="' + baseName + '.min.js"></script>'),
                bemjson = html2bemjson(html, { naming : { elem: '__', mod: '--' } });

            bemjson[2].block = 'page';

            fs.writeFileSync(
                newFile,
                '(' + stringifyObject(
                    bemjson,
                    { indent : '    ' }
                ) + ')'
            );

            var materialFile = path.join(dirName, 'material.scss');
            if(fs.existsSync(materialFile)) {
                var newMaterialDir = path.join(newDir, 'blocks', 'mdl-color-definitions'),
                    newMaterialFile = path.join(newMaterialDir, 'mdl-color-definitions.scss');

                mkdirpSync(newMaterialDir);
                fs.writeFileSync(
                    newMaterialFile,
                    String(fs.readFileSync(materialFile)).replace(/@import [^;]+;\n/g, '')
                );
                console.log('! ', newMaterialFile);
            }

            var stylesFile = path.join(dirName, 'styles.css');
            if(fs.existsSync(stylesFile)) {
                var newStylesDir = path.join(newDir, 'blocks', 'page'),
                    newStylesFile = path.join(newStylesDir, 'page.scss');

                mkdirpSync(newStylesDir);
                fs.writeFileSync(newStylesFile, fs.readFileSync(stylesFile));
                fs.writeFileSync(
                    path.join(newStylesDir, 'page.deps.js'),
                    '(' + stringifyObject(
                        { mustDeps : bemjson2deps(bemjson) },
                        { indent : '    ' }
                    ) + ')'
                );

                console.log('! ', newStylesFile);
            }

            console.log('! ', newFile);
        });
    });
