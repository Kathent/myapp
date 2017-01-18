/**
 * Created by liangkj on 2017/1/18.
 */
var UTIL = require('util');
var URL = require('url');
var http = require('http');
var https = require('https');

function getHttpModule (protocol) {
    if (protocol == 'https')
        return https;
    return http;
}

function doAction(url, options) {
    var realAction = ActionFactory.getAction(ActionFactory.parse(url, options));
    realAction.selfDo();
}


var ActionFactory = {
    reg : /([a-zA-Z]+):\\\\\\(.*)/,
    parse: function (url) {
        return url.match(this.reg);
    },

    getAction:function (array, options) {
        var actionName = array && array.length >= 1 ? array[0] : '';
        var realUrl = array && array.length >= 2 ? array[1] : '';
        var orignParams = array && array.length >= 3 ? array[2] : '';
        if (actionName == 'rf'){
            return new RequestFetchAction(realUrl, orignParams, options);
        }else if (actionName == 'fs'){
            return new FileSaveAction(realUrl, orignParams, options);
        }

        return new BaseAction(realUrl, orignParams, options);
    }
};

function BaseAction(url, params, options) {
    function selfDo() {
        UTIL.log(url, params, options);
        return null;
    }
};

function RequestFetchAction(url, params, options) {
    function selfDo() {
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
            })
        });

        req.on('error', function (error) {
            UTIL.error(error);
        });

        req.end();
        return allData;
    }

    function checkParams() {
        if (! url){
            UTIL.log(`url wrong...origions: ${params}, options: ${options}`);
            return false;
        }

        var parse = URL.parse(url, true);
        if (! parse){
            UTIL.log(`url parse wrong...origions: ${params}, options: ${options}`);
            return false;
        }

        if (! parse.protocol){
            UTIL.log(`protocol wrong...origions: ${params}, options: ${options}`);
            return false;
        }
        return true;
    }
}

function FileSaveAction(url, params, options) {
    var fs = require('fs');
    function selfDo() {
        if (! checkParams(url, options)){
            return false;
        }

        fs.writeFile();
    }

    function checkParams() {
        if (!url){
            UTIL.log(`url wrong...${url}, ${options}`);
            return false;
        }
        return true;
    }
}

