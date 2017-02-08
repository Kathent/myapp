/**
 * Created by liangkj on 2017/2/8.
 */
var UTIL = rere('util');

function BTNode(){
    this.data = null;
    this.left = null;
    this.right = null,

    this.addLeft = function (node) {
        this.left = node;
    };
    this.addRight = function (node) {
        this.right = node;
    };
    this.removeLeft = function () {
        var before = this.left;
        this.left = null;
        return before;
    };
    this.removeRight = function () {
        var before = this.right;
        this.right = null;
        return before;
    };
    this.visit = function () {
        console.log('visit node now..data:'+ this.data);
    }
    this.isLeaf = function () {
        return this.left == null || this.right == null;
    }
};

function BTTree(root) {
    this.root = root;
    this.visitWithType = function (type) {
        var strategy = BTTreeVisitStrategyFactory.getStrategyByType(type);
        strategy.visit(this);
    };

    this.subTree = function (root) {
        return new BTTree(root);
    }
}

var BTTreeVisitStrategyFactory = function () {
    const VISIT_TYPE_0 = 0;
    const VISIT_TYPE_1 = 1;
    const VISIT_TYPE_2 = 2;

    var preOrderList = [0,1,2];
    var midOrderList = [1,0,2];
    var postOrderList = [1,2,0];

    const orderListArray = new Array(preOrderList, midOrderList, postOrderList);

    var preOrder = new PreOrderVisitStrategy(orderListArray[VISIT_TYPE_0]);
    var midOrder = new MidOrderVisitStrategy(orderListArray[VISIT_TYPE_1]);
    var postOrder = new PostOrderVisitStrategy(orderListArray[VISIT_TYPE_2]);
    const typeToStrategy = new Array(preOrder, midOrder, postOrder);

    function getStrategyByType(type) {
        if (type < VISIT_TYPE_0 || type > VISIT_TYPE_2){
            throw new RangeError('type out of range..type:'+type);
        }
        return typeToStrategy[type];
    }
}

var NodeVisitElementFactory = function () {
    const VISIT_MID_NODE = 0;
    const VISIT_LEFT_NODE = 1;
    const VISIT_RIGHT_NODE = 2;
    const array = new Array(new MidVisitElement(), new LeftVisitElement(), new RightVisitElement());

    this.getElementByType = function (type) {
        if (type < VISIT_MID_NODE || type > VISIT_RIGHT_NODE){
            throw new RangeError('type out of range..type:'+type);
        }
        return array[type];
    }
};

function NodeVisitElement() {
    this.getNode = function (tree) {

    };

    this.elementVisit = function (node, strategy) {
        if (node.isLeaf()){
            node.visit();
        }else if (node != null){
            strategy.visit(new BTTree(node));
            node.visit();
        }
    }
}
function LeftVisitElement() {
    NodeVisitElement.call(this);
    this.getNode = function (tree) {
        return tree.root.left;
    }
}
function MidVisitElement() {
    NodeVisitElement.call(this);
    this.getNode = function (tree) {
        return tree.root;
    }
}
function RightVisitElement() {
    NodeVisitElement.call(this);
    this.getNode = function (tree) {
        return tree.root.right;
    }
}
function VisitStrategy(visitList) {
    this.visitList = visitList;
    this.visit = function (tree) {
        for (var x in this.visitList){
            var ele = NodeVisitElementFactory.getElementByType(x);
            var node = ele.getNode(tree);
            ele.elementVisit(node, this);
        }
    }
}

function PreOrderVisitStrategy(visitList) {
    VisitStrategy.call(this, visitList);
}
function MidOrderVisitStrategy(visitList) {
    VisitStrategy.call(this, visitList);
}
function PostOrderVisitStrategy(visitList) {
    VisitStrategy.call(this, visitList);
}