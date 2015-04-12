var Tree = function(){
	this.nodes = new Array();
}

Tree.prototype.addNode = function(node){
	this.nodes.push(node);
}

Tree.prototype.logNode = function(node){
	console.log(this.nodes);
}

var TreeNode = function (data) {
	this.index = data.index;
    this.parent = data.parent || null;
    this.children = data.children || [];
};
 
TreeNode.prototype.isLeaf = function () {
    return this.children.length == 0;
};
 
TreeNode.prototype.isRoot = function () {
    return this.parent == null;
};

function visitDfs( node, func) {
    if (func) {
        func(node);
    }
 	
 	if(!node.children) return;

    node.children.forEach( function (child) {
        visitDfs( child, func);
    });
}

var tree = new Tree();

var nodes = [];
nodes[0] = new TreeNode( {index: 0,children:[1,2,3]});
nodes[1] = new TreeNode( {index: 1,parent: 1, children:[4,5]});
nodes[2] = new TreeNode( {index: 2,parent: 1, children:[6]});
nodes[3] = new TreeNode( {index: 3,parent: 1, children:[7,8,9]});
for ( var i = 4; i<10; i++){
	nodes[i] = new TreeNode( {index: i, parent: i} );
}

for( var i = 0; i<10; i++){
	tree.addNode(nodes[i])
}

console.log(tree.nodes);

console.log(visitDfs(tree.nodes[0],tree.logNode));