var fs = require('fs'),
    glob = require('glob'),
    sass= require('node-sass');

glob(
    'libs/material-design-lite/src/*/_*.scss',
    { ignore : '*/node_modules/*' },
    function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            console.log('? ', file);
            sass.render({ file : file }, function(err, res) {
                if(err) throw err;
                var newFile = file.replace(/^(.*)_(.*)\.scss$/, '$1$2.css');
                fs.writeFileSync(newFile, res.css);
                console.log('! ', newFile);
            });
        });
    });
