// export function addHandler(handler) {
//    XXXXXXX.addEventListener(Event, handler);
//   }

import drawLine from "../helperFunctions.js";

const treeEl = document.querySelector(".tree");
const treeItemEl = document.querySelector(".tree-item");
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
const inputEl = document.createElement("input");
inputEl.classList.add("input-el");
inputEl.setAttribute("placeholder", "Node name");
inputEl.style.zIndex = 10;

let isInputing = false;

const ifEnter = e => {
  if (e.key === "Enter") submitInput();
};
function submitInput() {
  if (inputObject.operation === "rename" && inputEl.value) {
    inputObject.func(inputObject.operation, inputObject.node, inputEl.value);
  }
  inputEl.removeEventListener("keypress", ifEnter);
  treeEl.removeChild(inputEl);
  inputEl.value = "";
  isInputing = false;
  document.getElementById(inputObject.node).style.background =
    "rgb(45, 138, 196)";
}

function renameNode() {
  document.getElementById(inputObject.node).style.background = "#3DFEAE";
  inputEl.style.top = inputObject.y - 170 + "px"; //tree offset x=170
  inputEl.style.left = inputObject.x + "px";
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
      isInputing = true;
      inputObject = {
        func: handler,
        node: node.id,
        x: e.pageX,
        y: e.pageY,
        operation: "rename",
      };
      renameNode();
    }
  });
}
