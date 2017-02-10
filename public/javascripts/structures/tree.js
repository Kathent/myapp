/**
 * Created by liangkj on 2017/2/8.
 */
var StrategyFactory = new BTTreeVisitStrategyFactory();
var VisitFactory = new NodeVisitElementFactory();

function BTNode(){
    this.data = null;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 0;

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
    this.visit = function (call) {
        call(this);
    }
    this.isLeaf = function () {
        return this.left == null && this.right == null;
    }
    this.placeNode = function (parent) {
        this.parent = parent;
        this.height = parent.height + 1;
    }
};

function BTTree(r) {
    this.root = r;
    this.visitWithType = function (type) {
        var strategy = StrategyFactory.getStrategyByType(type);
        strategy.visit(this, null);
    };
    this.visitWithTypeCallable = function (type, call) {
        StrategyFactory.getStrategyByType(type).visit(this, call);
    }

    this.subTree = function (root) {
        return new this.constructor(root);
    }
    this.addedNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++){
            var node = nodes[i];
            this.addNode(node);
        }
    }
    this.addNode = function (node) {
        var isLeft = this.addToLeft(this.root, node);
        if (isLeft){
            if (this.root.left == null){
                this.root.left = node;
                node.placeNode(this.root);
            }else {
                this.subTree(this.root.left).addNode(node);
            }
        }else {
            if (this.root.right == null){
                this.root.right = node;
                node.placeNode(this.root);
            }else {
                this.subTree(this.root.right).addNode(node);
            }
        }
    }
    this.addDatas = function (datas) {
        for (var i = 0; i < datas.length; i++){
            var data = datas[i];
            var realNode = new BTNode();
            realNode.data = data;
            this.addNode(realNode);
        }
    }
    this.addToLeft = function (node1, node2) {
        return Math.random() * 2 < 1;
    }
}

function BTTreeVisitStrategyFactory() {
    this.VISIT_TYPE_0 = 0;
    this.VISIT_TYPE_1 = 1;
    this.VISIT_TYPE_2 = 2;

    var preOrderList = [0,1,2];
    var midOrderList = [1,0,2];
    var postOrderList = [1,2,0];

    const orderListArray = new Array(preOrderList, midOrderList, postOrderList);

    var preOrder = new PreOrderVisitStrategy(orderListArray[this.VISIT_TYPE_0]);
    var midOrder = new MidOrderVisitStrategy(orderListArray[this.VISIT_TYPE_1]);
    var postOrder = new PostOrderVisitStrategy(orderListArray[this.VISIT_TYPE_2]);
    const typeToStrategy = new Array(preOrder, midOrder, postOrder);

    this.getStrategyByType = function(type) {
        if (type < this.VISIT_TYPE_0 || type > this.VISIT_TYPE_2){
            throw new RangeError('type out of range..type:'+type);
        }
        return typeToStrategy[type];
    }
}

function NodeVisitElementFactory() {
    this.VISIT_MID_NODE = 0;
    this.VISIT_LEFT_NODE = 1;
    this.VISIT_RIGHT_NODE = 2;
    const array = new Array(new MidVisitElement(), new LeftVisitElement(), new RightVisitElement());

    this.getElementByVisitType = function (type) {
        if (type < this.VISIT_MID_NODE || type > this.VISIT_RIGHT_NODE){
            throw new RangeError('type out of range..type:'+type);
        }
        return array[type];
    }
};

function NodeVisitElement() {
    this.getNode = function (tree) {

    };

    this.elementVisit = function (node, strategy, call) {
        if (node.isLeaf()){
            node.visit(call);
        }else if (node != null){
            strategy.visit(new BTTree(node), call);
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
    this.elementVisit= function(node, strategy, call){
        node.visit(call);
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
    this.visit = function (tree, call) {
        for (var i = 0; i < this.visitList.length; i++){
            var ele = VisitFactory.getElementByVisitType(this.visitList[i]);
            var node = ele.getNode(tree);
            if (node != null){
                ele.elementVisit(node, this, call);
            }
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

function BSTree(root) {
    BTTree.call(this, root);
    this.addToLeft = function (node1, node2) {
        if (node2.data < node1.data){
            return true;
        }
        return false;
    }
}

var root = new BTNode();
root.data = 0;
var tree = new BSTree(root);
tree.addDatas([1,2,3,4,5,6,7]);
var printNode = function (node) {
    var parent = node.parent;
    var parentData = parent == null || parent == undefined ? -1 : parent.data;
    console.log('visit node..data:'+node.data+' height:'+node.height+ 'parent data:'+parentData);
}
tree.visitWithTypeCallable(StrategyFactory.VISIT_TYPE_0, printNode);
//tree.visitWithTypeCallable(StrategyFactory.VISIT_TYPE_1, printNode);
//tree.visitWithTypeCallable(StrategyFactory.VISIT_TYPE_2, printNode);
