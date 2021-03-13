// export function addHandler(handler) {
//    XXXXXXX.addEventListener(Event, handler);
//   }

import drawLine from "./helperFunctions.js";

let scale = 1;
const tree = document.querySelector(".tree");
const nav = document.querySelector(".nav");
const treeEl = document.querySelector(".tree");
const nodeWidth = 4; //nodes are 4rem

function createNode(node) {
  //create Node
  const nodeDiv = document.createElement("div");
  nodeDiv.classList.add("node");
  nodeDiv.setAttribute("id", node.nodeId);
  nodeDiv.setAttribute("title", node.nodeName);
  const addChild = document.createElement("i");
  addChild.classList.add("fas", "fa-plus");
  addChild.setAttribute("title", "Add new child");
  const deleteNode = document.createElement("i");
  deleteNode.classList.add("fas", "fa-trash");
  deleteNode.setAttribute("title", "Delete node");
  const changeParent = document.createElement("i");
  changeParent.classList.add("fas", "fa-exchange-alt");
  changeParent.setAttribute("title", "Change parent");
  const name = document.createElement("p");
  name.textContent = node.nodeName.slice(0, 7);

  nodeDiv.append(addChild, deleteNode, changeParent, name);
  nodeDiv.style.top = node.y * nodeWidth * 1.5 + 0.5 + "rem";
  nodeDiv.style.left = node.x * nodeWidth * 1.5 + 0.5 + "rem";
  //append to tree
  treeEl.appendChild(nodeDiv);
  //create lines
  if (node.parentId) drawLine(document.getElementById(node.parentId), nodeDiv);
}

export function renderTreeHandler(handler) {
  const nodes = handler();

  nodes.forEach(node => createNode(node));
}

function zoomTree(zoomValue) {
  if (scale < 0.12 || scale > 2 || !zoomValue) scale = 1;
  else scale += zoomValue;
  tree.style.transform = `scale(${scale})`;
}

function navFunctionality(e) {
  e.preventDefault();
  const zoomIn = e.target.closest(".fa-search-plus");
  if (zoomIn) {
    zoomTree(0.1);
    return;
  }
  const zoomOut = e.target.closest(".fa-search-minus");
  if (zoomOut) {
    zoomTree(-0.1);
    return;
  }
  const zoomNormal = e.target.closest(".scale-normal");
  if (zoomNormal) {
    zoomTree(0);
    return;
  }
}

nav.addEventListener("click", navFunctionality);
