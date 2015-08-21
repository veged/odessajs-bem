var path = require('path'),
    pathJoin = path.join,
    dirname = path.dirname,
    basename = path.basename,
    decamelize = require('decamelize'),
    vow = require('vow');

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

    copyFile(
        pathJoin(dirName, 'README.md'),
        newDir,
        newBaseName + '.en.md');
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
var bemhtmls = {},
    bemhtmlsDefer = vow.defer();

forEachMDLFile(['templates', '*', 'index.html'], function(file) {
    var dirName = dirname(file),
        baseName = basename(dirName),
        newDir = pathJoin('pages', baseName);

    copyFile(
        file,
        newDir,
        baseName + '.bemjson.js',
        function(html) {
            var bemjson = html2bemjson(html
                .replace( // fix path for page JS
                    '<script src="$$hosted_libs_prefix$$/$$version$$/material.min.js"></script>',
                    '<script src="' + baseName + '.min.js"></script>')
                .replace( // fix path for page CSS
                    /<link rel="stylesheet" href="\$\$hosted_libs_prefix\$\$\/\$\$version\$\$\/material(\.[^.]+)?\.min\.css">/,
                    '<link rel="stylesheet" href="' + baseName + '.min.css">')
                .replace('<link rel="stylesheet" href="styles.css">', '') // hack additional styles since they gonna be block definition
                .replace( // add mdl-page block
                    '<html ',
                    '<html class="mdl-page" ' + baseName + '.min.js"></script>')
                .replace(/mdl-(mega|mini)-footer--/g, 'mdl-$1-footer__')); // hack incorrect usage of modifier instead of element

            // accumulate stats for BEMHTML templates based on all pages
            iterateBEMJSON(bemjson, function(item, ctx) {
                if(item.block || item.elem) {
                    var tag = item.tag || 'div',
                        block = item.block || ctx.block,
                        blockBemhtml = def(bemhtmls, block),
                        bemhtmlStats;

                    if(item.elem) {
                        var elemsBemhtml = def(blockBemhtml, '__'),
                            elem = item.elem;

                        itemBemhtml = def(elemsBemhtml, elem);
                    } else if(item.block) {
                        itemBemhtml = blockBemhtml;
                    }

                    if(itemBemhtml) {
                        var itemBemhtmlTagStats = def(def(itemBemhtml, 'tag'), tag, [0, []]);
                        itemBemhtmlTagStats[0]++;
                        itemBemhtmlTagStats[1].push(item);
                        def(blockBemhtml, '.pages', []).push(newDir);
                    }
                }
            });

            return bemhtmlsDefer.promise().then(function() {
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

                return beautifyBemjson(stringifyObject(bemjson));
            });
        });
});

// generate BEMHTML templates based on stats accumulated previously
writeBemhtmls(bemhtmls, bemhtmlsDefer);

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

var _bemjson2deps = require('bemjson-to-deps').convert;
function cloneJSON(json) {
    return JSON.parse(JSON.stringify(json));
}
function bemjson2deps(bemjson) {
    return _bemjson2deps(cloneJSON(bemjson))
}

var _stringifyObject = require('stringify-object');
function stringifyObject(obj) {
    return '(' + _stringifyObject(obj, { indent : '    ' }) + ')';
}
function beautifyBemjson(str) {
    return str
        .replace(/{\n\s+([^:]+: \S+)\n\s+}/g, '{ $1 }')
        .replace(/{\n\s+(block: \S+)\n\s+(elem: \S+)\n\s+}/g, '{ $1 $2 }')
        .replace(/{\n\s+(block: \S+)\n\s+(mods: [^\n]+)\n\s+}/g, '{ $1 $2 }');
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
            vow.when((contentTransform || idFn)(readFile(file)), function(content) {
                writeFile(newFile, content);
                console.log('! ', newFile);
            });
        }
    }
}

function isSimple(obj) {
    var t = typeof obj;
    return t === 'string' || t === 'number' || t === 'boolean';
}
function iterateBEMJSON(bemjson, fn, ctx) {
    if(bemjson && !isSimple(bemjson))
        if(Array.isArray(bemjson)) {
            var i = 0, l = bemjson.length;
            while(i < l) iterateBEMJSON(bemjson[i++], fn, ctx);
        } else {
            fn(bemjson, ctx);
            iterateBEMJSON(
                bemjson.content,
                fn,
                {
                    block : bemjson.block || ctx.block,
                    mods: bemjson.mods || (bemjson.block? undefined : ctx.mods)
                });
        }
    return bemjson;
}

function def(obj, key, val) {
    arguments.length === 2 && (val = {});
    return key in obj ? obj[key] : obj[key] = val;
}

var _ = require('lodash');

function buildBemhtmlTagString(itemBemhtml) {
    if(!itemBemhtml.tag) return '';

    var itemBemhtmlTags = _.pairs(itemBemhtml.tag),
        mostPopularTag = _.max(itemBemhtmlTags, function(i) { return i[1][0]; }),
        itemTagString = "'" + mostPopularTag[0] + "'";

    itemBemhtmlTags.length > 1 && (itemTagString = 'function() { return this.ctx.tag || ' + itemTagString + '; }')

    mostPopularTag[1][1].forEach(function(item) { delete item.tag; });

    return itemTagString === "'div'" ? '' : 'tag()(' + itemTagString + ')';
}

function writeBemhtml(newDir, newFile, content) {
    mkdirpSync(newDir);
    newFile = pathJoin(newDir, newFile);
    writeFile(newFile, content);
    console.log('! ', newFile);
}

function writeBemhtmls(bemhtmls, bemhtmlsDefer) {
    _.forOwn(bemhtmls, function(blockBemhtml, block) {
        var bemhtmlString = 'block(\'' + block + '\')',
            elemsBemhtmlTags = blockBemhtml.__,
            pages = blockBemhtml['.pages'];

        delete blockBemhtml.__;
        delete blockBemhtml['.pages'];

        var bemhtmlBlockTagString = buildBemhtmlTagString(blockBemhtml);

        if(elemsBemhtmlTags) {
            var subBemhtmlStrings = [];
            _.forOwn(elemsBemhtmlTags, function(elemBemhtml, elem) {
                var bemhtmlElemTagString = buildBemhtmlTagString(elemBemhtml);
                bemhtmlElemTagString &&
                    subBemhtmlStrings.push(
                        'elem(\'' + elem + '\')' +
                        '.' + bemhtmlElemTagString);
            });
            bemhtmlBlockTagString && subBemhtmlStrings.unshift(bemhtmlBlockTagString);
            subBemhtmlStrings.length ?
                bemhtmlString += '(\n    ' + subBemhtmlStrings.join(',\n    ') + '\n)' :
                bemhtmlString = '';
        } else {
            bemhtmlBlockTagString ?
                bemhtmlString += '.' + bemhtmlBlockTagString :
                bemhtmlString = '';
        }

        if(bemhtmlString) {
            var newDir = pathJoin('blocks', block),
                newFile = block + '.bemhtml.js';
            block.indexOf('mdl-')?
                pages.forEach(function(page) {
                    writeBemhtml(pathJoin(page, newDir), newFile, bemhtmlString);
                }) :
                writeBemhtml(newDir, newFile, bemhtmlString);
        }
    });

    bemhtmlsDefer.resolve();
}
