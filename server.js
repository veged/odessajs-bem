var fs = require('fs'),
    path = require('path'),
    hbs = require('handlebars'),

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

    tmplSource = fs.readFileSync(path.join(bundleDir, bundleName + '.hbs'), 'utf8'),
    template = hbs.compile(tmplSource);

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

http.createServer(function(req, res) {
    var url = req.url,
        params = {};

    if (/\.min\.(js|css)$/.test(url)) {
        res.writeHead(200, {'Content-Type': 'text/' + url.split('.').pop() });

        return res.end(fs.readFileSync(path.join(bundleDir, req.url)));
    }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    getData(params, function(data) {
        res.end(/json$/.test(url)?
            '<pre>' + JSON.stringify(data, null, 4) + '</pre>' :
            template(data.popular));
    });
}).listen(port);

console.log('Server running at port', port);
