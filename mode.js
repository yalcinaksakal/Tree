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
  get identfier() {
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
      if (this.#parent) this.#parent.removeChildNode(this);
      this.#parent = newParent;
      //if it has new parent we should append this as a child to new parent
      newParent.appendChildNode(this);
    }
  }
  get childrenCount() {
    return this.#children.size;
  }

  createChildNode(name) {
    const newNode = new Tree(name);
    this.#children.set(newNode.identfier, newNode);
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

  hasChildNode(needle) {
    if (needle instanceof Tree) return this.#children.has(needle.identfier);
    for (let child of this.children)
      if (child.name === needle || child.identfier === needle) return true;
    return false;
  }

  getChildNode(nameOrID) {
    for (let child of this.children)
      if (child.name === nameOrID || child.identfier === nameOrID) return child;
    return null;
  }

  removeChildNode(needle) {
    if (!this.hasChildNode(needle)) return;
    let removeNode;
    if (needle instanceof Tree) {
      this.#children.delete(needle.identfier);
      removeNode = needle;
    } else
      for (let child of this.children)
        if (child.name === needle || child.identfier === needle) {
          removeNode = child;
          return this.#children.delete(child.identfier);
        }
    //just in case there is a varibale holding that node
    if (removeNode) removeNode.parentNode = null;
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
    this.#children.set(node.identfier, node);
    node.parentNode = this;
  }

  print() {
    console.log(`\n${this.name}${this.#getTreeString(this, 2)}`);
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
    this.traverse(node => {
      if (node.name === name) {
        foundNode = node;
        return true;
      }
    });
    return foundNode;
  }
  //find all occurances
  findAllNodeByName(name) {
    const children = [];
    this.traverse(node => {
      if (node.name === name) {
        children.push(node);
      }
    });
    return children;
  }
}

const tree = new Tree("root");
tree.name = "firstTree";
// console.log(tree.name);
// console.log(tree.identfier);
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
