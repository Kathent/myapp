var http = require('http');
var https = require('https');
var url = require('url');
var util = require('util');
var fs = require('fs')

var argUrl = process.argv[2];
var parsedUrl = url.parse(argUrl, true);

var options = {host: null, port: -1, path: null, method: 'GET'};
options.host = parsedUrl.hostname;
options.port = parsedUrl.port;
options.path = parsedUrl.pathname;

if (parsedUrl.search) options.path += "?" + parsedUrl.search;

var req = https.request(options, function(res){
    util.log('STATUS: ' + res.statusCode);
    util.log('HEADERS: ' + util.inspect(res.headers));
    var messages = "";
    var totalSize = 0;
    res.setEncoding('binary');
    res.on('data', function(chunk){
        totalSize += chunk.length;
        messages+=chunk;
    });
    res.on('error', function(err){
        util.log('RESPONSE ERROR: ' + err);
    });

    res.on('end', function(){
        fs.writeFile('a.jpeg', messages, 'binary', (err) => {
            if (err) {
                util.log('error...');
            }
            util.log('it\'s saved..totalSize:'+totalSize);
        });
    });
});

req.on('error', function(err){
    util.log('REQUEST ERROR: ' + err);
});
req.end();


//https://images.unsplash.com/photo-1473642676276-2d4ab561542e?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;s=fda6c92b02daf700051628cd6d6d8565