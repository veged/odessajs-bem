var fs = require('fs'),
    path = require('path'),
    vm = require('vm'),
    vow = require('vow'),

    http = require('http'),
    https = require('https'),
    port = process.env.PORT || 3000,

    apiHost = 'api.content.market.yandex.ru',
    apiVersion = 'v1',
    apiKey = 'QudqJj8k1bsBxNLnMeNc575ghYn86r',
    handler = 'popular',

    pagesDir = 'pages',
    bundleName = 'text-only',
    bundleDir = path.join(pagesDir, bundleName),

    template = require(path.resolve(bundleDir, bundleName + '.bemhtml.js')).BEMHTML;

function getData(params, cb) {
    https.get({
        hostname: apiHost,
        path: '/' + apiVersion + '/' + handler + '.json?geo_id=213',
        method: 'GET',
        headers: { Authorization: apiKey }
    }, function(res) {
        if (res.statusCode !== 200) {
            console.error('Error ', res.statusCode);
            return;
        }

        var data = '';

        res
            .on('data', function(chunk) {
                data += chunk;
            })
            .on('end', function() {
                cb(JSON.parse(data));
            });
    }).on('error', function(err) {
        console.log('Got error: ' + err.message);
    });
}

function renderJson(json) {
    return '<pre>' + JSON.stringify(json, null, 4) + '</pre>';
}

var blocks = {
    page: function(data) {
        return [
            '<!doctype html>',
            {
                block: 'mdl-page',
                attrs: { lang: 'en' },
                content: [
                    {
                        tag: 'head',
                        content: blocks.pageHead(data)
                    },
                    {
                        block: 'mdl-demo',
                        mix: [
                            { block: 'mdl-color', mods: { 'grey-100': true } },
                            { block: 'mdl-color-text', mods: { 'grey-700': true } },
                            { block: 'mdl-base' }
                        ],
                        content: [
                            {
                                block: 'mdl-layout',
                                mix: { block: 'mdl-js-layout' },
                                mods: { 'fixed-header': true },
                                content: [
                                    {
                                        elem: 'header',
                                        elemMods: { scroll: true },
                                        mix: { block: 'mdl-color', mods: { primary: true } },
                                        content: [
                                            {
                                                block: 'mdl-layout',
                                                mods: { 'large-screen-only': true },
                                                mix: { block: 'mdl-layout', elem: 'header-row' }
                                            },
                                            {
                                                block: 'mdl-layout',
                                                mods: { 'large-screen-only': true },
                                                mix: { block: 'mdl-layout', elem: 'header-row' },
                                                content: {
                                                    tag: 'h3',
                                                    content: 'Name &amp; Title'
                                                }
                                            },
                                            {
                                                block: 'mdl-layout',
                                                mods: { 'large-screen-only': true },
                                                mix: { block: 'mdl-layout', elem: 'header-row' }
                                            },
                                            {
                                                block: 'mdl-layout',
                                                elem: 'tab-bar',
                                                mix: [
                                                    { block: 'mdl-js-ripple-effect' },
                                                    { block: 'mdl-color', mods: { 'primary-dark': true } }
                                                ],
                                                content: [
                                                    {
                                                        elem: 'tab',
                                                        mix: { block: 'is-active' },
                                                        attrs: { href: '#overview' },
                                                        content: 'Overview'
                                                    },
                                                    {
                                                        elem: 'tab',
                                                        attrs: { href: '#features' },
                                                        content: 'Features'
                                                    },
                                                    {
                                                        elem: 'tab',
                                                        attrs: { href: '#features' },
                                                        content: 'Details'
                                                    },
                                                    {
                                                        elem: 'tab',
                                                        attrs: { href: '#features' },
                                                        content: 'Technology'
                                                    },
                                                    {
                                                        elem: 'tab',
                                                        attrs: { href: '#features' },
                                                        content: 'FAQ'
                                                    },
                                                    {
                                                        block: 'mdl-button',
                                                        mix: [
                                                            { block: 'mdl-js-button' },
                                                            { block: 'mdl-js-ripple-effect' },
                                                            { block: 'mdl-shadow', mods: { '4dp': true } },
                                                            { block: 'mdl-color', mods: { accent: true } }
                                                        ],
                                                        mods: {
                                                            fab: true,
                                                            colored: true
                                                        },
                                                        tag: 'button',
                                                        attrs: { id: 'add' },
                                                        content: [
                                                            {
                                                                block: 'material-icons',
                                                                attrs: { role: 'presentation' },
                                                                content: 'add'
                                                            },
                                                            {
                                                                block: 'visuallyhidden',
                                                                content: 'Add'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        elem: 'content',
                                        content: [
                                            {
                                                block: 'mdl-layout',
                                                elem: 'tab-panel',
                                                mix: { block: 'is-active' },
                                                attrs: { id: 'overview' },
                                                content: [
                                                    data.topCategoryList[1].topVendors.map(function(vendor) {
                                                        return {
                                                            block: 'section',
                                                            mods: { center: true },
                                                            mix: [
                                                                { block: 'mdl-grid', mods: { 'no-spacing': true } },
                                                                { block: 'mdl-shadow', mods: { '2dp': true } }
                                                            ],
                                                            content: [
                                                                {
                                                                    elem: 'play-btn',
                                                                    mix: [
                                                                        {
                                                                            block: 'mdl-cell',
                                                                            mods: {
                                                                                '3-col-desktop': true,
                                                                                '2-col-tablet': true,
                                                                                '4-col-phone': true
                                                                            }
                                                                        },
                                                                        { block: 'mdl-color', mods: { 'teal-100': true } },
                                                                        { block: 'mdl-color-text', mods: { white: true } }
                                                                    ],
                                                                    content: {
                                                                        tag: 'img',
                                                                        attrs: { src: vendor.topModelImage }
                                                                    }
                                                                },
                                                                {
                                                                    block: 'mdl-card',
                                                                    mix: {
                                                                        block: 'mdl-cell',
                                                                        mods: {
                                                                            '9-col-desktop': true,
                                                                            '6-col-tablet': true,
                                                                            '4-col-phone': true
                                                                        }
                                                                    },
                                                                    content: [
                                                                        {
                                                                            elem: 'supporting-text',
                                                                            content: [
                                                                                {
                                                                                    tag: 'h4',
                                                                                    content: vendor.name
                                                                                },
                                                                                ' Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Nostrud in laboris labore nisi amet do dolor eu fugiat consectetur elit cillum esse. '
                                                                            ]
                                                                        },
                                                                        {
                                                                            elem: 'actions',
                                                                            content: {
                                                                                block: 'mdl-button',
                                                                                attrs: { href: '#' },
                                                                                content: 'Read our features'
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    block: 'mdl-button',
                                                                    mix: [
                                                                        { block: 'mdl-js-button' },
                                                                        { block: 'mdl-js-ripple-effect' }
                                                                    ],
                                                                    mods: { icon: true },
                                                                    tag: 'button',
                                                                    attrs: { id: 'btn1' },
                                                                    content: {
                                                                        block: 'material-icons',
                                                                        content: 'more_vert'
                                                                    }
                                                                },
                                                                {
                                                                    block: 'mdl-menu',
                                                                    mix: { block: 'mdl-js-menu' },
                                                                    mods: { 'bottom-right': true },
                                                                    attrs: { for: 'btn1' },
                                                                    content: [
                                                                        {
                                                                            elem: 'item',
                                                                            content: 'Lorem'
                                                                        },
                                                                        {
                                                                            elem: 'item',
                                                                            attrs: { disabled: '' },
                                                                            content: 'Ipsum'
                                                                        },
                                                                        {
                                                                            elem: 'item',
                                                                            content: 'Dolor'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    }),
                                                    {
                                                        block: 'section',
                                                        mods: { center: true },
                                                        mix: [
                                                            { block: 'mdl-grid', mods: { 'no-spacing': true } },
                                                            { block: 'mdl-shadow', mods: { '2dp': true } }
                                                        ],
                                                        content: [
                                                            {
                                                                block: 'mdl-card',
                                                                mix: { block: 'mdl-cell', mods: { '12-col': true } },
                                                                content: [
                                                                    {
                                                                        elem: 'supporting-text',
                                                                        mix: { block: 'mdl-grid', mods: { 'no-spacing': true } },
                                                                        content: [
                                                                            {
                                                                                block: 'mdl-cell',
                                                                                mods: { '12-col': true },
                                                                                tag: 'h4',
                                                                                content: 'Details'
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'circle-container',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '2-col': true,
                                                                                        '1-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: {
                                                                                    cls: 'section__circle-container__circle',
                                                                                    block: 'mdl-color',
                                                                                    mods: { primary: true }
                                                                                }
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'text',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '10-col-desktop': true,
                                                                                        '6-col-tablet': true,
                                                                                        '3-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: [
                                                                                    {
                                                                                        tag: 'h5',
                                                                                        content: 'Lorem ipsum dolor sit amet'
                                                                                    },
                                                                                    ' Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Duis nulla tempor do aute et eiusmod velit exercitation nostrud quis ',
                                                                                    {
                                                                                        tag: 'a',
                                                                                        attrs: { href: '#' },
                                                                                        content: 'proident minim'
                                                                                    },
                                                                                    '. '
                                                                                ]
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'circle-container',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '2-col': true,
                                                                                        '1-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: {
                                                                                    cls: 'section__circle-container__circle',
                                                                                    block: 'mdl-color',
                                                                                    mods: { primary: true }
                                                                                }
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'text',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '10-col-desktop': true,
                                                                                        '6-col-tablet': true,
                                                                                        '3-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: [
                                                                                    {
                                                                                        tag: 'h5',
                                                                                        content: 'Lorem ipsum dolor sit amet'
                                                                                    },
                                                                                    ' Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Duis nulla tempor do aute et eiusmod velit exercitation nostrud quis ',
                                                                                    {
                                                                                        tag: 'a',
                                                                                        attrs: { href: '#' },
                                                                                        content: 'proident minim'
                                                                                    },
                                                                                    '. '
                                                                                ]
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'circle-container',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '2-col': true,
                                                                                        '1-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: {
                                                                                    cls: 'section__circle-container__circle',
                                                                                    block: 'mdl-color',
                                                                                    mods: { primary: true }
                                                                                }
                                                                            },
                                                                            {
                                                                                block: 'section',
                                                                                elem: 'text',
                                                                                mix: {
                                                                                    block: 'mdl-cell',
                                                                                    mods: {
                                                                                        '10-col-desktop': true,
                                                                                        '6-col-tablet': true,
                                                                                        '3-col-phone': true
                                                                                    }
                                                                                },
                                                                                content: [
                                                                                    {
                                                                                        tag: 'h5',
                                                                                        content: 'Lorem ipsum dolor sit amet'
                                                                                    },
                                                                                    ' Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Duis nulla tempor do aute et eiusmod velit exercitation nostrud quis ',
                                                                                    {
                                                                                        tag: 'a',
                                                                                        attrs: { href: '#' },
                                                                                        content: 'proident minim'
                                                                                    },
                                                                                    '. '
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        elem: 'actions',
                                                                        content: {
                                                                            block: 'mdl-button',
                                                                            attrs: { href: '#' },
                                                                            content: 'Read our features'
                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                block: 'mdl-button',
                                                                mix: [
                                                                    { block: 'mdl-js-button' },
                                                                    { block: 'mdl-js-ripple-effect' }
                                                                ],
                                                                mods: { icon: true },
                                                                tag: 'button',
                                                                attrs: { id: 'btn2' },
                                                                content: {
                                                                    block: 'material-icons',
                                                                    content: 'more_vert'
                                                                }
                                                            },
                                                            {
                                                                block: 'mdl-menu',
                                                                mix: { block: 'mdl-js-menu' },
                                                                mods: { 'bottom-right': true },
                                                                attrs: { for: 'btn2' },
                                                                content: [
                                                                    {
                                                                        elem: 'item',
                                                                        content: 'Lorem'
                                                                    },
                                                                    {
                                                                        elem: 'item',
                                                                        attrs: { disabled: '' },
                                                                        content: 'Ipsum'
                                                                    },
                                                                    {
                                                                        elem: 'item',
                                                                        content: 'Dolor'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        block: 'section',
                                                        mods: { center: true },
                                                        mix: [
                                                            { block: 'mdl-grid', mods: { 'no-spacing': true } },
                                                            { block: 'mdl-shadow', mods: { '2dp': true } }
                                                        ],
                                                        content: [
                                                            {
                                                                block: 'mdl-card',
                                                                mix: { block: 'mdl-cell', mods: { '12-col': true } },
                                                                content: [
                                                                    {
                                                                        elem: 'supporting-text',
                                                                        content: [
                                                                            {
                                                                                tag: 'h4',
                                                                                content: 'Technology'
                                                                            },
                                                                            ' Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Nostrud in laboris labore nisi amet do dolor eu fugiat consectetur elit cillum esse. Pariatur occaecat nisi laboris tempor laboris eiusmod qui id Lorem esse commodo in. Exercitation aute dolore deserunt culpa consequat elit labore incididunt elit anim. '
                                                                        ]
                                                                    },
                                                                    {
                                                                        elem: 'actions',
                                                                        content: {
                                                                            block: 'mdl-button',
                                                                            attrs: { href: '#' },
                                                                            content: 'Read our features'
                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                block: 'mdl-button',
                                                                mix: [
                                                                    { block: 'mdl-js-button' },
                                                                    { block: 'mdl-js-ripple-effect' }
                                                                ],
                                                                mods: { icon: true },
                                                                tag: 'button',
                                                                attrs: { id: 'btn3' },
                                                                content: {
                                                                    block: 'material-icons',
                                                                    content: 'more_vert'
                                                                }
                                                            },
                                                            {
                                                                block: 'mdl-menu',
                                                                mix: { block: 'mdl-js-menu' },
                                                                mods: { 'bottom-right': true },
                                                                attrs: { for: 'btn3' },
                                                                content: [
                                                                    {
                                                                        elem: 'item',
                                                                        content: 'Lorem'
                                                                    },
                                                                    {
                                                                        elem: 'item',
                                                                        attrs: { disabled: '' },
                                                                        content: 'Ipsum'
                                                                    },
                                                                    {
                                                                        elem: 'item',
                                                                        content: 'Dolor'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        block: 'section',
                                                        mods: { footer: true },
                                                        mix: [
                                                            { block: 'mdl-color', mods: { white: true } },
                                                            { block: 'mdl-grid' }
                                                        ],
                                                        content: [
                                                            {
                                                                elem: 'circle-container',
                                                                mix: {
                                                                    block: 'mdl-cell',
                                                                    mods: {
                                                                        '2-col': true,
                                                                        '1-col-phone': true
                                                                    }
                                                                },
                                                                content: {
                                                                    cls: 'section__circle-container__circle',
                                                                    block: 'mdl-color',
                                                                    mods: { accent: true },
                                                                    mix: {
                                                                        block: 'section',
                                                                        elem: 'circle',
                                                                        elemMods: { big: true }
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                elem: 'text',
                                                                mix: {
                                                                    block: 'mdl-cell',
                                                                    mods: {
                                                                        '4-col-desktop': true,
                                                                        '6-col-tablet': true,
                                                                        '3-col-phone': true
                                                                    }
                                                                },
                                                                content: [
                                                                    {
                                                                        tag: 'h5',
                                                                        content: 'Lorem ipsum dolor sit amet'
                                                                    },
                                                                    ' Qui sint ut et qui nisi cupidatat. Reprehenderit nostrud proident officia exercitation anim et pariatur ex. '
                                                                ]
                                                            },
                                                            {
                                                                elem: 'circle-container',
                                                                mix: {
                                                                    block: 'mdl-cell',
                                                                    mods: {
                                                                        '2-col': true,
                                                                        '1-col-phone': true
                                                                    }
                                                                },
                                                                content: {
                                                                    cls: 'section__circle-container__circle',
                                                                    block: 'mdl-color',
                                                                    mods: { accent: true },
                                                                    mix: {
                                                                        block: 'section',
                                                                        elem: 'circle',
                                                                        elemMods: { big: true }
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                elem: 'text',
                                                                mix: {
                                                                    block: 'mdl-cell',
                                                                    mods: {
                                                                        '4-col-desktop': true,
                                                                        '6-col-tablet': true,
                                                                        '3-col-phone': true
                                                                    }
                                                                },
                                                                content: [
                                                                    {
                                                                        tag: 'h5',
                                                                        content: 'Lorem ipsum dolor sit amet'
                                                                    },
                                                                    ' Qui sint ut et qui nisi cupidatat. Reprehenderit nostrud proident officia exercitation anim et pariatur ex. '
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                block: 'mdl-layout',
                                                elem: 'tab-panel',
                                                attrs: { id: 'features' },
                                                content: {
                                                    block: 'section',
                                                    mods: { center: true },
                                                    mix: { block: 'mdl-grid', mods: { 'no-spacing': true } },
                                                    content: {
                                                        block: 'mdl-cell',
                                                        mods: { '12-col': true },
                                                        content: [
                                                            {
                                                                tag: 'h4',
                                                                content: 'Features'
                                                            },
                                                            ' Minim duis incididunt est cillum est ex occaecat consectetur. Qui sint ut et qui nisi cupidatat. Reprehenderit nostrud proident officia exercitation anim et pariatur ex. ',
                                                            {
                                                                block: 'toc',
                                                                content: [
                                                                    {
                                                                        tag: 'h4',
                                                                        content: 'Contents'
                                                                    },
                                                                    {
                                                                        tag: 'a',
                                                                        attrs: { href: '#lorem1' },
                                                                        content: 'Lorem ipsum'
                                                                    },
                                                                    {
                                                                        tag: 'a',
                                                                        attrs: { href: '#lorem2' },
                                                                        content: 'Lorem ipsum'
                                                                    },
                                                                    {
                                                                        tag: 'a',
                                                                        attrs: { href: '#lorem3' },
                                                                        content: 'Lorem ipsum'
                                                                    },
                                                                    {
                                                                        tag: 'a',
                                                                        attrs: { href: '#lorem4' },
                                                                        content: 'Lorem ipsum'
                                                                    },
                                                                    {
                                                                        tag: 'a',
                                                                        attrs: { href: '#lorem5' },
                                                                        content: 'Lorem ipsum'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag: 'h5',
                                                                attrs: { id: 'lorem1' },
                                                                content: 'Lorem ipsum dolor sit amet'
                                                            },
                                                            ' Excepteur et pariatur officia veniam anim culpa cupidatat consequat ad velit culpa est non. ',
                                                            {
                                                                tag: 'ul',
                                                                content: [
                                                                    {
                                                                        tag: 'li',
                                                                        content: 'Nisi qui nisi duis commodo duis reprehenderit consequat velit aliquip.'
                                                                    },
                                                                    {
                                                                        tag: 'li',
                                                                        content: 'Dolor consectetur incididunt in ipsum laborum non et irure pariatur excepteur anim occaecat officia sint.'
                                                                    },
                                                                    {
                                                                        tag: 'li',
                                                                        content: 'Lorem labore proident officia excepteur do.'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Sit qui est voluptate proident minim cillum in aliquip cupidatat labore pariatur id tempor id. Proident occaecat occaecat sint mollit tempor duis dolor cillum anim. Dolore sunt ea mollit fugiat in aliqua consequat nostrud aliqua ut irure in dolore. Proident aliqua culpa sint sint exercitation. Non proident occaecat reprehenderit veniam et proident dolor id culpa ea tempor do dolor. Nulla adipisicing qui fugiat id dolor. Nostrud magna voluptate irure veniam veniam labore ipsum deserunt adipisicing laboris amet eu irure. Sunt dolore nisi velit sit id. Nostrud voluptate labore proident cupidatat enim amet Lorem officia magna excepteur occaecat eu qui. Exercitation culpa deserunt non et tempor et non. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Do dolor eiusmod eu mollit dolore nostrud deserunt cillum irure esse sint irure fugiat exercitation. Magna sit voluptate id in tempor elit veniam enim cupidatat ea labore elit. Aliqua pariatur eu nulla labore magna dolore mollit occaecat sint commodo culpa. Eu non minim duis pariatur Lorem quis exercitation. Sunt qui ex incididunt sit anim incididunt sit elit ad officia id. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                attrs: { id: 'lorem2' },
                                                                content: ' Tempor voluptate ex consequat fugiat aliqua. Do sit et reprehenderit culpa deserunt culpa. Excepteur quis minim mollit irure nulla excepteur enim quis in laborum. Aliqua elit voluptate ad deserunt nulla reprehenderit adipisicing sint. Est in eiusmod exercitation esse commodo. Ea reprehenderit exercitation veniam adipisicing minim nostrud. Veniam dolore ex ea occaecat non enim minim id ut aliqua adipisicing ad. Occaecat excepteur aliqua tempor cupidatat aute dolore deserunt ipsum qui incididunt aliqua occaecat sit quis. Culpa sint aliqua aliqua reprehenderit veniam irure fugiat ea ad. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Eu minim fugiat laborum irure veniam Lorem aliqua enim. Aliqua veniam incididunt consequat irure consequat tempor do nisi deserunt. Elit dolore ad quis consectetur sint laborum anim magna do nostrud amet. Ea nulla sit consequat quis qui irure dolor. Sint deserunt excepteur consectetur magna irure. Dolor tempor exercitation dolore pariatur incididunt ut laboris fugiat ipsum sunt veniam aute sunt labore. Non dolore sit nostrud eu ad excepteur cillum eu ex Lorem duis. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Id occaecat velit non ipsum occaecat aliqua quis ut. Eiusmod est magna non esse est ex incididunt aute ullamco. Cillum excepteur sint ipsum qui quis velit incididunt amet. Qui deserunt anim enim laborum cillum reprehenderit duis mollit amet ad officia enim. Minim sint et quis aliqua aliqua do minim officia dolor deserunt ipsum laboris. Nulla nisi voluptate consectetur est voluptate et amet. Occaecat ut quis adipisicing ad enim. Magna est magna sit duis proident veniam reprehenderit fugiat reprehenderit enim velit ex. Ullamco laboris culpa irure aliquip ad Lorem consequat veniam ad ipsum eu. Ipsum culpa dolore sunt officia laborum quis. '
                                                            },
                                                            {
                                                                tag: 'h5',
                                                                attrs: { id: 'lorem3' },
                                                                content: 'Lorem ipsum dolor sit amet'
                                                            },
                                                            {
                                                                tag: 'p',
                                                                attrs: { id: 'lorem4' },
                                                                content: ' Eiusmod nulla aliquip ipsum reprehenderit nostrud non excepteur mollit amet esse est est dolor. Dolore quis pariatur sit consectetur veniam esse ullamco duis Lorem qui enim ut veniam. Officia deserunt minim duis laborum dolor in velit pariatur commodo ullamco eu. Aute adipisicing ad duis labore laboris do mollit dolor cillum sunt aliqua ullamco. Esse tempor quis cillum consequat reprehenderit. Adipisicing proident anim eu sint elit aliqua anim dolore cupidatat fugiat aliquip qui. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                attrs: { id: 'lorem5' },
                                                                content: ' Nisi eiusmod esse cupidatat excepteur exercitation ipsum reprehenderit nostrud deserunt aliqua ullamco. Anim est irure commodo eiusmod pariatur officia. Est dolor ipsum excepteur magna aliqua ad veniam irure qui occaecat eiusmod aute fugiat commodo. Quis mollit incididunt amet sit minim velit eu fugiat voluptate excepteur. Sit minim id pariatur ex cupidatat cupidatat nostrud nostrud ipsum. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Enim ea officia excepteur ad veniam id reprehenderit eiusmod esse mollit consequat. Esse non aute ullamco Lorem aliqua qui dolore irure eiusmod aute aliqua proident labore aliqua. Ipsum voluptate voluptate exercitation laborum deserunt nulla elit aliquip et minim ex veniam. Duis cupidatat aute sunt officia mollit dolor ad elit ad aute labore nostrud duis pariatur. In est sint voluptate consectetur velit ea non labore. Ut duis ea aliqua consequat nulla laboris fugiat aute id culpa proident. Minim eiusmod laboris enim Lorem nisi excepteur mollit voluptate enim labore reprehenderit officia mollit. '
                                                            },
                                                            {
                                                                tag: 'p',
                                                                content: ' Cupidatat labore nisi ut sunt voluptate quis sunt qui ad Lorem esse nisi. Ex esse velit ullamco incididunt occaecat dolore veniam tempor minim adipisicing amet. Consequat in exercitation est elit anim consequat cillum sint labore cillum. Aliquip mollit laboris ad labore anim. '
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                block: 'mdl-mega-footer',
                                                content: [
                                                    {
                                                        elem: 'middle-section',
                                                        content: [
                                                            {
                                                                block: 'mdl-mega-footer',
                                                                elem: 'drop-down-section',
                                                                content: [
                                                                    {
                                                                        elem: 'heading-checkbox',
                                                                        attrs: {
                                                                            type: 'checkbox',
                                                                            checked: ''
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'heading',
                                                                        content: 'Features'
                                                                    },
                                                                    {
                                                                        elem: 'link-list',
                                                                        content: [
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'About'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Terms'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Partners'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Updates'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                block: 'mdl-mega-footer',
                                                                elem: 'drop-down-section',
                                                                content: [
                                                                    {
                                                                        elem: 'heading-checkbox',
                                                                        attrs: {
                                                                            type: 'checkbox',
                                                                            checked: ''
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'heading',
                                                                        content: 'Details'
                                                                    },
                                                                    {
                                                                        elem: 'link-list',
                                                                        content: [
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Spec'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Tools'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Resources'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                block: 'mdl-mega-footer',
                                                                elem: 'drop-down-section',
                                                                content: [
                                                                    {
                                                                        elem: 'heading-checkbox',
                                                                        attrs: {
                                                                            type: 'checkbox',
                                                                            checked: ''
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'heading',
                                                                        content: 'Technology'
                                                                    },
                                                                    {
                                                                        elem: 'link-list',
                                                                        content: [
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'How it works'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Patterns'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Usage'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Products'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Contracts'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                block: 'mdl-mega-footer',
                                                                elem: 'drop-down-section',
                                                                content: [
                                                                    {
                                                                        elem: 'heading-checkbox',
                                                                        attrs: {
                                                                            type: 'checkbox',
                                                                            checked: ''
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'heading',
                                                                        content: 'FAQ'
                                                                    },
                                                                    {
                                                                        elem: 'link-list',
                                                                        content: [
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Questions'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Answers'
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: 'li',
                                                                                content: {
                                                                                    tag: 'a',
                                                                                    attrs: { href: '#' },
                                                                                    content: 'Contact us'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        elem: 'bottom-section',
                                                        content: [
                                                            {
                                                                block: 'mdl-logo',
                                                                content: ' More Information '
                                                            },
                                                            {
                                                                block: 'mdl-mega-footer',
                                                                elem: 'link-list',
                                                                content: [
                                                                    {
                                                                        tag: 'li',
                                                                        content: {
                                                                            tag: 'a',
                                                                            attrs: { href: 'https://developers.google.com/web/starter-kit/' },
                                                                            content: 'Web Starter Kit'
                                                                        }
                                                                    },
                                                                    {
                                                                        tag: 'li',
                                                                        content: {
                                                                            tag: 'a',
                                                                            attrs: { href: '#' },
                                                                            content: 'Help'
                                                                        }
                                                                    },
                                                                    {
                                                                        tag: 'li',
                                                                        content: {
                                                                            tag: 'a',
                                                                            attrs: { href: '#' },
                                                                            content: 'Privacy and Terms'
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                block: 'mdl-button',
                                mix: [
                                    { block: 'mdl-js-button' },
                                    { block: 'mdl-js-ripple-effect' },
                                    { block: 'mdl-color', mods: { accent: true } },
                                    { block: 'mdl-color-text', mods: { 'accent-contrast': true } }
                                ],
                                mods: { raised: true },
                                attrs: {
                                    href: 'https://github.com/google/material-design-lite/blob/master/templates/text-only/',
                                    target: '_blank',
                                    id: 'view-source'
                                },
                                content: 'View Source'
                            },
                            {
                                tag: 'script',
                                attrs: { src: 'text-only.min.js' }
                            }
                        ]
                    }
                ]
            }
        ];
    },
    meta: function(data) {
        return {
            tag: 'meta',
            attrs: data
        };
    },
    pageHead: function(data) {
        return [
            blocks.meta({ charset: 'utf-8' }),
            blocks.meta({
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge'
            }),
            blocks.meta({
                name: 'description',
                content: 'A front-end template that helps you build fast, modern mobile web apps.'
            }),
            blocks.meta({
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }),
            {
                tag: 'title',
                content: 'Material Design Lite'
            },
            blocks.meta({
                name: 'mobile-web-app-capable',
                content: 'yes'
            }),
            {
                tag: 'link',
                attrs: {
                    rel: 'icon',
                    sizes: '192x192',
                    href: 'images/touch/chrome-touch-icon-192x192.png'
                }
            },
            blocks.meta({
                name: 'apple-mobile-web-app-capable',
                content: 'yes'
            }),
            blocks.meta({
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'black'
            }),
            blocks.meta({
                name: 'apple-mobile-web-app-title',
                content: 'Material Design Lite'
            }),
            {
                tag: 'link',
                attrs: {
                    rel: 'apple-touch-icon-precomposed',
                    href: 'apple-touch-icon-precomposed.png'
                }
            },
            blocks.meta({
                name: 'msapplication-TileImage',
                content: 'images/touch/ms-touch-icon-144x144-precomposed.png'
            }),
            blocks.meta({
                name: 'msapplication-TileColor',
                content: '#3372DF'
            }),
            {
                tag: 'link',
                attrs: {
                    href: 'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en',
                    rel: 'stylesheet'
                }
            },
            {
                tag: 'link',
                attrs: {
                    href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
                    rel: 'stylesheet'
                }
            },
            {
                tag: 'link',
                attrs: {
                    rel: 'stylesheet',
                    href: 'text-only.min.css'
                }
            },
            {
                tag: 'style',
                content: ' #view-source {\n position: fixed;\n display: block;\n right: 0;\n bottom: 0;\n margin-right: 40px;\n margin-bottom: 40px;\n z-index: 900;\n } '
            }
        ];
    }
}

function buildBemjson(data) {
    return blocks.page(data);
}

http.createServer(function(req, res) {
    var url = req.url,
        params = {};

    if (/\.min\.(js|css)$/.test(url)) {
        res.writeHead(200, {'Content-Type': 'text/' + url.split('.').pop() });

        return res.end(fs.readFileSync(path.join(bundleDir, req.url)));
    }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    getData(params, function(data) {
        if (/\.json$/.test(url)) {
            return res.end(renderJson(data));
        }

        var bemjson = buildBemjson(data.popular);

        res.end(/\.bemjson$/.test(url)? renderJson(bemjson) : template.apply(bemjson));

    });
}).listen(port);

console.log('Server running at port', port);
