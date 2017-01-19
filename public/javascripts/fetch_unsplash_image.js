const flowAction = require('./flow_action.js');
console.log(flowAction);
var af = flowAction.ActionFactory;

var requestUrl = 'https://source.unsplash.com/random/50/50';
var action = af.getAction('rf', requestUrl, '', (allData) => {
    console.log(allData);
});
if (action){
    action.selfDo();
}



