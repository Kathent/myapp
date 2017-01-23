const flowAction = require('./flow_action.js');
console.log(flowAction);
var af = flowAction.ActionFactory;
var WorkNode = flowAction.WorkNode;

var requestUrl = 'https://unsplash.it/1920/1080/?random';
args = {url : requestUrl, encoding: 'binary'};
var firstFetch = af.getAction('rf', args);
var startNode = Object.create(WorkNode);
startNode.action = firstFetch;


// var secondFetch = af.getAction('rf', {encoding: 'binary'});
// var secondNode = Object.create(WorkNode);
// secondNode.action = secondFetch;
// secondNode.action.argsDeal = function (args) {
//     var reg = /href\s*=\s*"(.*)"/;
//     var match = args.data.match(reg);
//     if (match){
//         secondNode.action.args.url = match[1];
//     }
// };
// startNode.next = secondNode;
//
//
console.log(`Current directory: ${process.cwd()}`);
var thirdNode = Object.create(WorkNode);
var timestamp = new Date().valueOf();
var args = { url: 'public/images/'+timestamp+'.jpg', encoding: 'binary'};
console.log(args.url);
var writeAction = af.getAction('fs', args);
writeAction.argsDeal = function (args) {
    thirdNode.action.args.data = args.data;
};
thirdNode.action = writeAction;
//
startNode.next = thirdNode;
startNode.work();






