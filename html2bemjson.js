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
                newDir = path.join('desktop.bundles', baseName),
                newFile = path.join(newDir, baseName + '.bemjson.js');

            fs.existsSync(newDir) || fs.mkdirSync(newDir);

            fs.writeFileSync(
                newFile,
                stringifyObject(
                    html2bemjson(
                        String(fs.readFileSync(file)),
                        { naming : { elem: '__', mod: '--' } }
                    ),
                    { indent : '    ' }
                )
            );

            console.log('! ', newFile);
        });
    });
