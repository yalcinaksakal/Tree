// export function addHandler(handler) {
//    XXXXXXX.addEventListener(Event, handler);
//   }

import drawLine from "../helperFunctions.js";

const treeEl = document.querySelector(".tree");
const treeItemEl = document.querySelector(".tree-item");
const scalableEl = document.querySelector(".scalable");
const frameEl = document.querySelector(".square");
const nodeWidth = 4; //nodes are 4rem

function createNode(node) {
  //create Node
  const nodeDiv = document.createElement("div");
  nodeDiv.classList.add("node");
  nodeDiv.setAttribute("id", node.nodeId);
  nodeDiv.setAttribute("title", `Name: ${node.nodeName}, ID: ${node.nodeId}`);
  const addChild = document.createElement("i");
  addChild.classList.add("fas", "fa-plus");
  addChild.setAttribute("title", "Add new child");
  const deleteNode = document.createElement("i");
  deleteNode.classList.add("fas", "fa-trash");
  deleteNode.setAttribute("title", "Delete node");
  const changeParent = document.createElement("i");
  changeParent.classList.add("fas", "fa-exchange-alt");
  changeParent.setAttribute("title", "Change parent");
  const rename = document.createElement("i");
  rename.classList.add("fas", "fa-quote-left");
  rename.setAttribute("title", "Rename");

  const name = document.createElement("p");
  name.textContent = node.nodeName.slice(0, 7);
  nodeDiv.append(addChild, deleteNode, changeParent, rename, name);

  // nodeDiv.style.left = node.y * nodeWidth * 1.5 + 0.5 + "rem";

  nodeDiv.style.top = node.x * nodeWidth * 1.5 + 0.5 + "rem";
  nodeDiv.style.left = node.y * nodeWidth * 1.5 + 0.5 + "rem";
  //append to tree
  treeEl.appendChild(nodeDiv);
  //create lines
  if (node.parentId) drawLine(document.getElementById(node.parentId), nodeDiv);
}
// -----------------------
//renaming nodes, adding child
let inputObject = {};

///dynamic input el
const inputEl = document.createElement("input");
inputEl.classList.add("input-el");
inputEl.style.zIndex = 10;

let isInputing = false;

const ifEnter = e => {
  if (e.key === "Enter") submitInput();
};

const showFrame = (top, left) => {
  frameEl.style.top = top.slice(0, -3) - 1 + "rem";
  frameEl.style.left = left.slice(0, -3) - 1 + "rem";
  frameEl.hidden = false;
  setTimeout(() => (frameEl.hidden = true), 2000);
};
//scroll to a node
function scrollTo(id) {
  const { top, left } = document.getElementById(id).style;
  const { width, height } = scalableEl.getBoundingClientRect();
  const remToPx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  //rem string to number and center new element
  scalableEl.scrollTo(
    +left.slice(0, -3) * remToPx - width / 2,
    +top.slice(0, -3) * remToPx - height / 2
  );

  //show frame to explixitly show child
  showFrame(top, left);
}

///OPERATIONS
//renamenode
function renameNode(node) {
  //change node name
  inputObject.func(inputObject.operation, inputObject.node, inputEl.value);
  //update node info
  node.setAttribute("title", `Name: ${inputEl.value}, ID: ${inputObject.node}`);

  //p element of node holds name of node
  node.childNodes[4].textContent = inputEl.value.slice(0, 7);
}

function addChild() {
  //create  child and scroll to it
  scrollTo(
    inputObject.func(inputObject.operation, inputObject.node, inputEl.value)
  );
}

function deleteNodeFunc(...relatedIDs) {
  relatedIDs.forEach(id => treeEl.removeChild(document.getElementById(id)));
}

//return node to its normal state
function normalizeNode(node) {
  inputEl.removeEventListener("keypress", ifEnter);
  inputEl.parentElement?.removeChild(inputEl);
  inputEl.value = "";
  isInputing = false;
  node.style.background = "rgb(45, 138, 196)";
}

///submit input
function submitInput() {
  const nodeAtOperation = document.getElementById(inputObject.node);
  //renaming
  if (inputEl.value) {
    switch (inputObject.operation) {
      case "rename":
        renameNode(nodeAtOperation);
        break;
      case "addChild":
        addChild();
        break;
    }
    // if (inputObject.operation === "rename") renameNode(nodeAtOperation);
  }
  //end operation return to normal state
  normalizeNode(nodeAtOperation);
}

function startOperation(node) {
  node.style.background = "#3DFEAE";
  inputEl.style.top = +node.style.top.slice(0, -3) + 5 + "rem"; //node height 4rem
  inputEl.style.left = node.style.left;
  treeEl.appendChild(inputEl);
  inputEl.focus();
  inputEl.addEventListener("keypress", ifEnter);
}

//create all nodes adn DOM them
export function renderTreeHandler(handler) {
  const nodes = handler();
  treeEl.textContent = "";
  nodes.forEach(node => createNode(node));
}

//operations at nodes rename,delete,change,add
export function treeOperationsHandler(handler) {
  treeItemEl.addEventListener("click", function (e) {
    e.preventDefault();
    const node = e.target.closest(".node");

    //if inputting count this click as submit
    if (isInputing && !e.target.closest(".input-el")) submitInput();

    //guard
    if (!node) return;
    //rename
    const rename = e.target.closest(".fa-quote-left");
    if (rename) {
      inputEl.setAttribute("placeholder", "New name");
      isInputing = true;
      inputObject = {
        func: handler,
        node: node.id,
        operation: "rename",
      };
      startOperation(node);
      return;
    }

    //Add child
    const addChid = e.target.closest(".fa-plus");
    if (addChid) {
      inputEl.setAttribute("placeholder", "Child name");
      isInputing = true;
      inputObject = {
        func: handler,
        node: node.id,
        operation: "addChild",
      };
      startOperation(node);
      return;
    }

    //delete node
    const deleteNode = e.target.closest(".fa-trash");
    if (deleteNode) {
      deleteNodeFunc(...handler("delete", node.id), node.id);
      return;
    }
  });
}
