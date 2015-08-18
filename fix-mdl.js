var path = require('path'),
    pathJoin = path.join,
    dirname = path.dirname,
    basename = path.basename,
    decamelize = require('decamelize');

setImmediate(function() {

// process all main blocks
forEachMDLFile(['src', '*', '_*.scss'], function(file) {
    var dirName = dirname(file),
        baseName = basename(dirName),
        fileBaseName = basename(file, '.scss').substr(1).replace('_', '-'),
        newBaseName = 'mdl-' + (fileBaseName === 'palette' ? 'color' : fileBaseName),
        newDir = pathJoin('blocks', newBaseName),
        newFile = newBaseName + '.scss';

    if(fileBaseName === baseName) { // main case: file name same as block name
        writeNewScss(file, newBaseName, newDir, newFile);
    } else {
        if(baseName === 'resets') { // hack for resets block
            newBaseName = 'mdl-' + baseName;
            newDir = pathJoin('blocks', newBaseName);
            var deps = [];

            copyFile(
                file,
                newDir,
                basename(file),
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
        } else { // hack for other files with names different from block name (i.e. footer)
            writeNewScss(file, newBaseName, newDir, newFile);
        }
    }

    copyFile(
        pathJoin(dirName, baseName + '.js'),
        newDir,
        newBaseName + '.js');
});

// process additional partials as blocks
forEachMDLFile(['src', '_*.scss'], function(file) {
    var newBaseName = 'mdl-' + basename(file, '.scss').substr(1);
    writeNewScss(
        file,
        newBaseName,
        pathJoin('blocks', newBaseName),
        newBaseName + '.scss',
        true);
});

// process mdlComponentHandler.js as block
forEachMDLFile(['src', 'mdlComponentHandler.js'], function(file) {
    var newBaseName = decamelize(basename(file, '.js'), '-');
    copyFile(
        file,
        pathJoin('blocks', newBaseName),
        newBaseName + '.js');
});

// make page block for proper order of deps
writeDeps(pathJoin('blocks', 'mdl-page'), 'mdl-page', ['mdl-resets', 'mdl-typography', 'mdl-component-handler']);

// process templates as pages
forEachMDLFile(['templates', '*', 'index.html'], function(file) {
    var dirName = dirname(file),
        baseName = basename(dirName),
        newDir = pathJoin('pages', baseName),
        bemjson;

    copyFile(
        file,
        newDir,
        baseName + '.bemjson.js',
        function(html) {
            bemjson = html2bemjson(html
                .replace(
                    '<script src="$$hosted_libs_prefix$$/$$version$$/material.min.js"></script>',
                    '<script src="' + baseName + '.min.js"></script>')
                .replace(
                    /<link rel="stylesheet" href="\$\$hosted_libs_prefix\$\$\/\$\$version\$\$\/material(\.[^.]+)?\.min\.css">/,
                    '<link rel="stylesheet" href="' + baseName + '.min.css">')
                .replace('<link rel="stylesheet" href="styles.css">', '')
                .replace(/mdl-mega-footer--/g, 'mdl-mega-footer__'));

            bemjson[2].block = 'mdl-page';

            return stringifyObject(bemjson);
        });

    // converts color definitions as block on page blocks level
    copyFile(
        pathJoin(dirName, 'material.scss'),
        pathJoin(newDir, 'blocks', 'mdl-color-definitions'),
        'mdl-color-definitions.scss',
        function(content) {
            return content.replace(/@import [^;]+;\n/g, '');
        });

    // convert styles definitions as block definition on page level
    var newStylesDir = pathJoin(newDir, 'blocks', 'mdl-page');
    copyFile(
        pathJoin(dirName, 'styles.css'),
        newStylesDir,
        'mdl-page.scss',
        function(content) {
            writeDeps(newStylesDir, 'mdl-page', bemjson2deps(bemjson)); // hack for proper order of page level definitions
            return content;
        });
});

});


// utils

var fs = require('fs');
function readFile(file) {
    return String(fs.readFileSync(file));
}
function writeFile(file, content) {
    fs.writeFileSync(file, content);
}

var glob = require('glob').sync;
function forEachMDLFile(mask, fn) {
    glob(pathJoin.apply(null, ['libs', 'material-design-lite'].concat(mask)))
        .forEach(fn);
}

var _html2bemjson = require('html2bemjson').convert;
function html2bemjson(html) {
    return _html2bemjson(html, { naming : { elem: '__', mod: '--' } });
}

var bemjson2deps = require('bemjson-to-deps').convert;

var _stringifyObject = require('stringify-object');
function stringifyObject(obj) {
    return '(' + _stringifyObject(obj, { indent : '    ' }) + ')';
}

function writeNewScss(file, newBaseName, newDir, newFile, nonBlockNaming) {
    copyFile(
        file,
        newDir,
        newFile,
        function(content) {
            var deps = [];

            nonBlockNaming ||
                (content = content.replace(/@import "([^\/]+?)";\n/g, '@import "_$1.scss";\n'));

            content = content.replace(/@import "(?:\.\.\/)?([^_][^\/]*?)";\n/g, function(_, dep) {
                deps.push('mdl-' + dep);
                return '';
            });

            writeDeps(newDir, newBaseName, deps);

            return content;
        });
}

var arrayUniq = require('lodash/array').uniq,
    runInNewContext = require('vm').runInNewContext;

function writeDeps(newDir, newBaseName, deps) {
    var newFile = pathJoin(newDir, newBaseName + '.deps.js'),
        depsObj = fs.existsSync(newFile) ?
            runInNewContext(readFile(newFile)) :
            { mustDeps : [] };

    depsObj.mustDeps = arrayUniq(depsObj.mustDeps.concat(deps));

    if(depsObj.mustDeps.length) {
        mkdirpSync(newDir);
        writeFile(newFile, stringifyObject(depsObj));
        console.log('! ', newFile);
    }
}

var mkdirpSync = require('mkdirp').sync;
function idFn(x) { return x; }
function copyFile(file, newDir, newFile, contentTransform) {
    if(fs.existsSync(file)) {
        console.log('? ', file);

        mkdirpSync(newDir);

        newFile = pathJoin(newDir, newFile);
        if(!fs.existsSync(newFile)) {
            writeFile(
                newFile,
                (contentTransform || idFn)(readFile(file)));

            console.log('! ', newFile);
        }
    }
}
