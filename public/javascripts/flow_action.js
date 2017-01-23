/**
 * Created by liangkj on 2017/1/18.
 */
var UTIL = require('util');
var URL = require('url');
var http = require('http');
var https = require('https');

const ACTION_OVER_EVENT = 'actionOver';
const EventEmitter = require('events');

function getHttpModule (protocol) {
    if (protocol.startsWith('https'))
        return https;
    return http;
}

var WorkNode = {
    action: null,
    next: null,
    work : function () {
        if (this.action){
            this.action.selfDo();
            this.action.emiter.on(ACTION_OVER_EVENT, (args) =>{
               if (this.next) {
                   if (this.next.action){
                       this.next.action.argsDeal(args);
                   }
                   this.next.work()
               };
            });
        }
    }
};




var ActionFactory = {
    //reg : /([a-zA-Z]+):\\\\\\(.*)/,
    // parse: function (url) {
    //     return url.match(this.reg);
    // },
    getAction:function (actionName, args) {
        if (actionName == 'rf'){
            return new RequestFetchAction(args);
        }else if (actionName == 'fs'){
            return new FileSaveAction(args);
        }

        return new BaseAction(args);
    }
};

function BaseAction(args) {
    this.emiter = new EventEmitter();
    this.args = args;
    this.selfDo = function () {
        UTIL.log('BaseAction SelfDo....');
        return null;
    };

    this.argsDeal= function (args){
      UTIL.log('args:'+ args);
    };
};

function RequestFetchAction(args) {
    BaseAction.call(this, args);
    this.selfDo = function () {
        var url = args.url;
        var options = args;
        if (!checkParams(url, options)){
            return null;
        }

        var parsedUrl = URL.parse(url);
        var requestOptions = {host: null, port: -1, path: null, method: 'GET'};
        requestOptions.host = parsedUrl.host;
        requestOptions.port = parsedUrl.port;
        requestOptions.method = parsedUrl.method;
        requestOptions.path = parsedUrl.path;
        if (options && options.encoding) requestOptions.encoding = options.encoding;
        var protocol = getHttpModule(parsedUrl.protocol);

        var allData = null;
        var emitter = this.emiter;
        var req = protocol.request(requestOptions, function (res) {
            res.on('data', function (chunk) {
                allData += chunk;
                UTIL.log(`chunk size...${chunk.length}`);
            });

            res.on('end', () => {
                UTIL.log('RequestFetchAction end....')
                emitter.emit(ACTION_OVER_EVENT, {data : allData});
            });
        });

        req.on('error', function (error) {
            console.error(error);
        });
        req.end();
    }

    function checkParams(url, options) {
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

function FileSaveAction(args) {
    BaseAction.call(this, args);
    var fs = require('fs');
    this.selfDo = function () {
        UTIL.log('data length...'+args.data.length);
        var url = args.url;
        var options = args;
        if (! checkParams(url, options)){
            return false;
        }

        var data = options.data;
        // options.delete(options.data);
        delete options.data;
        fs.writeFile(url, data, options, (error) => {
            if (error) console.log(error);
            this.emiter.emit(ACTION_OVER_EVENT, null);
        });
    }

    function checkParams(url, options) {
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
exports.WorkNode = WorkNode;
