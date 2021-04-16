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

// const myIdGen = (function* () {
//   let id = Date.now();
//   while (true) yield id++;
// })();
// console.log(myIdGen.next(), myIdGen.next());

export let nodePosY = 0;
export let treeArray = {}; //Al trees created on DOM by user
export let arrayDfsBfs = [];
let arrayBfs = [];
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
  set identifier(newId) {
    if (newId) this.#id = newId;
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
          return this.#children.delete(child.identifier);
        }
    //just in case there is a varibale holding that node
    removeNode.#parent = null;
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
  //DFS---------------------
  #dfsPush(node) {
    arrayDfsBfs.push({ id: node.identifier, type: "visit" });
    this.#getDfsSeq(node);
    arrayDfsBfs.push({ id: node.identifier, type: "leave" });
  }
  #getDfsSeq(node) {
    node.children.forEach(child => this.#dfsPush(child));
  }
  dfsSequence() {
    this.#dfsPush(this);
  }
  //BFS-------------------
  #getBfsSeq(index = 0) {
    if (!arrayBfs[index]) return;
    arrayBfs[index].children.forEach(child => arrayBfs.push(child));
    this.#getBfsSeq(index + 1);
  }
  bfsSequence() {
    arrayBfs.push(this);
    this.#getBfsSeq();

    arrayBfs.forEach(node =>
      arrayDfsBfs.push(
        { id: node.identifier, type: "visit" },
        { id: node.identifier, type: "leave" }
      )
    );
    arrayBfs = [];
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
    if (this.name === name) children.push(this.identifier);
    this.traverse(node => {
      if (node.name === name) {
        children.push(node.identifier);
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

export const claenTreeArray = () => (treeArray = []);
export const claenArrayDfsBfs = () => (arrayDfsBfs = []);
//demo tree
export const treeInit = () => {
  const sampleTree = getSampleTree();
  treeArray[sampleTree.identifier] = sampleTree;
};

export const newTree = name => new Tree(name);
