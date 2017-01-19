/**
 * Created by liangkj on 2017/1/18.
 */
var UTIL = require('util');
var URL = require('url');
var http = require('http');
var https = require('https');

function getHttpModule (protocol) {
    if (protocol.startsWith('https'))
        return https;
    return http;
}

var ActionFactory = {
    //reg : /([a-zA-Z]+):\\\\\\(.*)/,
    // parse: function (url) {
    //     return url.match(this.reg);
    // },
    getAction:function (actionName, url, options, call) {
        if (actionName == 'rf'){
            return new RequestFetchAction(url, options, call);
        }else if (actionName == 'fs'){
            return new FileSaveAction(url, options, call);
        }

        return new BaseAction(url, options, call);
    }
};

function BaseAction(url, options, call) {
    BaseAction.prototype.selfDo = function () {
        UTIL.log(url, options, call);
        return null;
    }
};

function RequestFetchAction(url, options, call) {
    BaseAction.call(this);
    this.selfDo = function () {
        if (!checkParams()){
            return null;
        }

        var parsedUrl = URL.parse(url);
        var requestOptions = {host: null, port: -1, path: null, method: 'GET'};
        requestOptions.host = parsedUrl.host;
        requestOptions.port = parsedUrl.port;
        requestOptions.method = parsedUrl.method;
        requestOptions.path = parsedUrl.path;
        if (options.encoding) requestOptions.encoding = options.encoding;
        var protocol = getHttpModule(parsedUrl.protocol);

        var allData = null;
        var req = protocol.request(requestOptions, function (res) {
            res.on('data', function (chunk) {
                allData += chunk;
                UTIL.log(`chunk size...${chunk.length}`);
            });

            res.on('end', call);
        });

        req.on('error', function (error) {
            console.error(error);
        });
        req.end();
    }

    function checkParams() {
        if (! url){
            UTIL.log(`url wrong...url: ${url}, options: ${options}`);
            return false;
        }

        var parse = URL.parse(url, true);
        if (! parse){
            UTIL.log(`url parse wrong...url: ${url}, options: ${options}`);
            return false;
        }

        if (! parse.protocol){
            UTIL.log(`protocol wrong...url: ${url}, options: ${options}`);
            return false;
        }
        return true;
    }
}

function FileSaveAction(url, options, call) {
    BaseAction.call(this);
    var fs = require('fs');
    this.selfDo = function () {
        if (! checkParams(url, options)){
            return false;
        }

        var data = options.data;
        options.delete(options.data);
        fs.writeFile(url, data, options, call);
    }

    function checkParams() {
        if (!url){
            UTIL.log(`url wrong...${url}, ${options}`);
            return false;
        }

        if (!options.data){
            UTIL.log(`options data wrong...${url}, ${options}`);
            return false;
        }
        return true;
    }
}
exports.ActionFactory = ActionFactory;
