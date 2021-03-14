const uniqueId = (() => {
  function* uniqueIdGenerator() {
    let id = Date.now();
    while (true) {
      yield id++;
    }
  }

  const gen = uniqueIdGenerator();
  return () => gen.next().value;
})();

export let nodePosY = 0;
export let treeArray = []; //Al trees created on DOM by user

let nodesArray = [];

class Tree {
  #children = new Map();
  #parent = null;
  #id = uniqueId();
  #name;
  constructor(name) {
    if (!name || typeof name !== "string" || !name.trim().length)
      throw new Error("Name must be a non-empty String ");
    this.#name = name;
  }
  set name(newName) {
    if (!newName || typeof newName !== "string" || !newName.trim().length)
      throw new Error("Name must be a non-empty String ");
    this.#name = newName;
  }
  get name() {
    return this.#name;
  }
  get identifier() {
    return this.#id;
  }

  get children() {
    return Array.from(this.#children.values());
  }

  get parentNode() {
    return this.#parent;
  }

  set parentNode(newParent) {
    if (
      newParent !== this.parentNode &&
      (newParent || newParent instanceof Tree)
    ) {
      //if it has parent node, we should remove this from parents childnodes
      const oldParentNode = this.#parent;
      if (oldParentNode) oldParentNode.removeChildNode(this);
      this.#parent = newParent;
      //if it has new parent we should append this as a child to new parent
      try {
        newParent.appendChildNode(this);
      } catch (err) {
        if (oldParentNode) oldParentNode.appendChildNode(this);
        this.#parent = oldParentNode;
        throw err;
      }
    }
  }
  get childrenCount() {
    return this.#children.size;
  }

  createChildNode(name) {
    const newNode = new Tree(name);
    this.#children.set(newNode.identifier, newNode);
    newNode.parentNode = this;
    return newNode;
  }

  #getTreeString(node, spaceCount = 0) {
    let str = "\n";
    node.children.forEach(child => {
      str += `${" ".repeat(spaceCount)}${child.name}${this.#getTreeString(
        child,
        spaceCount + 2
      )}`;
    });
    return str;
  }

  #toGraphPos(node, x = 0) {
    node.children.forEach((child, i) => {
      nodesArray.push({
        nodeName: child.name,
        nodeId: child.identifier,
        parentId: child.#parent.identifier,
        x: x + 1,
        y: nodePosY,
      });

      this.#toGraphPos(child, x + 1);
      if (i < node.children.length - 1) nodePosY++;
    });
  }
  createTreeToGraphPositionsAsNodesArray() {
    nodePosY = 0;
    nodesArray = [];
    nodesArray.push({
      nodeName: this.name,
      nodeId: this.identifier,
      parentId: this.#parent?.identifier,
      x: 0,
      y: 0,
    });
    this.#toGraphPos(this);
    return nodesArray;
  }

  hasChildNode(needle) {
    if (needle instanceof Tree) return this.#children.has(needle.identifier);
    for (let child of this.children)
      if (child.name === needle || child.identifier === needle) return true;
    return false;
  }

  getChildNode(nameOrID) {
    for (let child of this.children)
      if (child.name === nameOrID || child.identifier === nameOrID)
        return child;
    return null;
  }

  //transformig a node to a new tree
  removeParent() {
    this.#parent = null;
  }

  removeChildNode(needle) {
    if (!this.hasChildNode(needle)) return;
    let removeNode;
    if (needle instanceof Tree) {
      this.#children.delete(needle.identifier);
      removeNode = needle;
    } else
      for (let child of this.children)
        if (child.name === needle || child.identifier === needle) {
          removeNode = child;
          //just in case there is a varibale holding that node
          removeNode.#parent = null;
          return this.#children.delete(child.identifier);
        }
  }

  appendChildNode(node) {
    //node is already a child of this parent
    if (!node instanceof Tree || this.hasChildNode(node)) return;

    ///search if node has parent equals to itself
    let searchParent = this;
    while (searchParent) {
      if (node === searchParent)
        throw new Error("Node cannot contain itself or one of its parents");
      else searchParent = searchParent.parentNode;
    }
    this.#children.set(node.identifier, node);
    node.parentNode = this;
  }

  print() {
    return `${this.name}${this.#getTreeString(this, 2)}`;
  }
  //traverse all leaves of "this" and run cb function, Depth first search
  traverse(callBackFunc) {
    for (let child of this.children)
      if (callBackFunc(child) || child.traverse(callBackFunc)) return true;
    return false;
  }
  //find first occurance
  findNodeByName(name) {
    let foundNode = null;
    if (this.name === name) return this;
    this.traverse(node => {
      if (node.name === name) {
        foundNode = node;
        return true;
      }
    });
    return foundNode;
  }

  //find by ID
  findNodeByID(ID) {
    let foundNode = null;
    if (this.identifier === ID) return this;
    this.traverse(node => {
      if (node.identifier === ID) {
        foundNode = node;
        return foundNode;
      }
    });
    return foundNode;
  }

  //find all occurances
  findAllNodeByName(name) {
    const children = [];
    if (this.name === name) children.push(this);
    this.traverse(node => {
      if (node.name === name) {
        children.push(node);
      }
    });
    return children;
  }
}

const getSampleTree = () => {
  const sampleTree = new Tree("Root");
  sampleTree
    .createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .createChildNode("Level 2")
    .createChildNode("Level 3")
    .parentNode.createChildNode("Level 3")
    .createChildNode("Level 4")
    .parentNode.parentNode.createChildNode("Level 3")
    .createChildNode("Level 4")
    .createChildNode("Level 5")
    .createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .createChildNode("Level 7")
    .parentNode.createChildNode("Level 7")
    .parentNode.parentNode.createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .parentNode.parentNode.parentNode.parentNode.parentNode.createChildNode(
      "Level 2"
    )
    .parentNode.createChildNode("Level 2")
    .createChildNode("Level 3")
    .parentNode.createChildNode("Level 3")
    .parentNode.createChildNode("Level 3");
  return sampleTree;
};

//demo tree
export const treeInit = () => {
  treeArray.push(getSampleTree());
};
// export default new Tree();
/*

const tree = new Tree("root");
tree.name = "firstTree";
// console.log(tree.name);
// console.log(tree.identifier);
// console.log(tree.children);
// console.log(tree.childrenCount);
// console.log(tree.parentNode);

tree
  .createChildNode("child1")
  .createChildNode("one")
  .createChildNode("one-1")
  .createChildNode("one-deeper")
  .parentNode.parentNode.createChildNode("two")
  .createChildNode("two-1")
  .createChildNode("two-1-deeper")
  .createChildNode("one-1");
const prev = tree.createChildNode("prev");

console.log("has prev", tree.hasChildNode("prev"));
console.log("has prev", tree.hasChildNode(prev));

////
console.log("parent of prev", prev.parentNode);
tree.removeChildNode(prev);
console.log("has prev", tree.hasChildNode(prev));
console.log("parent of prev after deletion", prev.parentNode);

//
tree.appendChildNode(prev);

tree.print();
//
prev.parentNode = tree.getChildNode("child1");
console.log(prev.parentNode.name);
tree.print();

tree.traverse(node => console.log(node.name));
//search for a node in tree
console.log(tree.traverse(node => node.name === "one-deeper"));
console.log(tree.findNodeByName("one-deeper"));
console.log(tree.findAllNodeByName("one-1"));
//handle below situations
prev.appendChildNode(tree); //infinite circular relation (parent contains child, child contains parent)
prev.appendChildNode(prev); //insert itself as a child, infinite loop
*/
