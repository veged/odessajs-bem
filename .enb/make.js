var techs = {
        // essential
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),

        // optimization
        borschik: require('enb-borschik/techs/borschik'),

        // css
        cssSass: require('enb-sass/techs/css-sass'),
        cssAutoprefixer: require('enb-autoprefixer/techs/css-autoprefixer'),

        // js
        nodeJs: require('enb-diverse-js/techs/node-js'),
        browserJs: require('enb-diverse-js/techs/browser-js'),

        // bemtree
        // bemtree: require('enb-bemxjst-2/techs/bemtree'),

        // bemhtml
        bemhtml: require('enb-bemxjst-2/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = ['blocks'];

module.exports = function(config) {
    var isProd = process.env.YENV === 'production';

    config.nodes('pages/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.cssSass, { target: '?.noprefix.css' }],
            [techs.cssAutoprefixer, {
                sourceTarget: '?.noprefix.css',
                destTarget: '?.css',
                browserSupport: ['last 2 versions', 'ie 10', 'opera 12.1']
            }],

            // bemtree
            // [techs.bemtree, { devMode: process.env.BEMTREE_ENV === 'development' }],

            // bemhtml
            [techs.bemhtml, { naming: { elem: '__', mod: '--' } }],

            // client bemhtml
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bemhtml.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            }],
            [techs.bemhtml, {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.bemhtml.files',
                naming: { elem: '__', mod: '--' }
            }],

            // js
            [techs.nodeJs],
            [techs.browserJs],
            [techs.fileMerge, {
                target: '?.js',
                sources: ['?.browser.bemhtml.js', '?.browser.js']
            }],

            // borschik
            [techs.borschik, { sourceTarget: '?.js', destTarget: '?.min.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: '?.min.css', tech: 'cleancss', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.node.js', '?.min.css', '?.min.js']);
    });
};
