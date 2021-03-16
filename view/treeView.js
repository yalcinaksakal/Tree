// export function addHandler(handler) {
//    XXXXXXX.addEventListener(Event, handler);
//   }
import { zoomTree } from "../view/pageFuncitonalityView.js";
import * as helperFunc from "../helperFunctions.js";

const treeEl = document.querySelector(".tree");
const treeItemEl = document.querySelector(".tree-item");
const scalableEl = document.querySelector(".scalable");
const nav = document.querySelector(".nav");
const navSearchEl = document.getElementById("tree-search");
const saveLoadEl = document.querySelector(".save-load");
const saveMsgEl = document.querySelector(".saved");

const nodeWidth = 4; //nodes are 4rem

export const remToPx = parseFloat(
  getComputedStyle(document.documentElement).fontSize
);

// -----------------------
//renaming nodes, adding child
let inputObject = {};

///dynamic input el
const inputEl = document.createElement("input");
inputEl.classList.add("input-el");
inputEl.style.zIndex = 10;

let isInputing = false;
let isSearchingParent = false;
let isAnimating = false;
let parentSearchingNode;

let animationArray = [];
const animationDuration = 250; //msec

function createNode(node, posOffset = 0) {
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
  nodeDiv.style.top = (node.x + posOffset) * nodeWidth * 1.7 + 2 + "rem";
  nodeDiv.style.left = node.y * nodeWidth * 1.5 + 2 + "rem";

  //append to tree
  treeEl.appendChild(nodeDiv);
  //create lines
  if (node.parentId)
    helperFunc.drawLine(document.getElementById(node.parentId), nodeDiv);
}

//create all nodes adn DOM them
export function renderTreeHandler(handler) {
  zoomTree(1);
  const treeArray = handler();
  //clear DOM
  let maxLevelOfTree = 0,
    treeOffset = 0;
  treeEl.textContent = "";
  treeArray.forEach(tree => {
    tree.forEach(node => {
      if (node.x > maxLevelOfTree) maxLevelOfTree = node.x;
      createNode(node, treeOffset);
    });
    //next tree^s DOM y offset=maxLevelofTree
    treeOffset += maxLevelOfTree + 1;
    maxLevelOfTree = 0;
  });
  zoomTree(0);
}
// -----------------------------------
const ifEnter = e => {
  if (e.key === "Enter") submitInput();
};

const showEl = elId => {
  const el = document.getElementById(elId);
  el.style.background = "red";
  setTimeout(() => (el.style.background = "rgb(45, 138, 196)"), 2000);
};
//scroll to a node
function scrollTo(id) {
  const { top, left } = document.getElementById(id).style;
  const { width, height } = scalableEl.getBoundingClientRect();

  //rem string to number and center new element
  scalableEl.scrollTo(
    +left.slice(0, -3) * remToPx - width / 2,
    +top.slice(0, -3) * remToPx - height / 2
  );
}
function showErr(msg) {
  inputEl.value = msg;
  inputEl.style.width = "21rem";
  inputEl.style.color = "red";
  startOperation(parentSearchingNode);
  //show err for 2secs
  setTimeout(() => normalizeNode(parentSearchingNode), 2000);
}

function showSaveMsg(msg) {
  saveMsgEl.hidden = false;
  saveMsgEl.textContent = msg;
  setTimeout(() => (saveMsgEl.hidden = true), 1000);
}
// --------------------------------------------------
///OPERATIONS
//renamenode
function renameNode(node) {
  //change node name
  inputObject.func(inputObject.operation, inputObject.node, inputEl.value);
  //update node info
  node.setAttribute("title", `Name: ${inputEl.value}, ID: ${inputObject.node}`);

  //p element of node holds name of node (4th element is p)
  node.childNodes[4].textContent = inputEl.value.slice(0, 7);
}

function addChild() {
  //create  child and get it
  const childNode = document.getElementById(
    inputObject.func(inputObject.operation, inputObject.node, inputEl.value)
  );
  showEl(childNode.id);
}

function setNewParent(func, parentNode) {
  isSearchingParent = false;
  //normalize parent searching node
  treeItemEl.style.cursor = "default";
  parentSearchingNode.style.background = "rgb(45, 138, 196)";
  //change parent
  if (parentNode)
    try {
      func("changeParent", parentSearchingNode.id, null, parentNode.id);
      showEl(parentSearchingNode.id);
    } catch (err) {
      showErr(err.message);
    }
}

function findNewParent() {
  isSearchingParent = true;
  parentSearchingNode.style.background = "#3DFEAE";
  treeItemEl.style.cursor = "copy";
}

// --------------------------------------------------
//return node to its normal state
function normalizeNode(node) {
  inputEl.removeEventListener("keypress", ifEnter);
  inputEl.parentElement?.removeChild(inputEl);
  inputEl.style.width = "7rem";
  inputEl.style.color = "white";
  inputEl.value = "";
  isInputing = false;
  if (node) node.style.background = "rgb(45, 138, 196)";
}

function newTree() {
  //create and show new tree
  showEl(inputObject.func(inputObject.operation, null, inputEl.value));
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
      case "newTree":
        newTree();
        break;
    }
  }
  //end operation return to normal state
  normalizeNode(nodeAtOperation);
}

function startOperation(node) {
  if (node === "newTree") {
    const { x, y } = saveLoadEl.getBoundingClientRect();
    inputEl.style.top = y + "px";
    inputEl.style.left = x + "px";
  } else {
    node.style.background = "#3DFEAE";
    inputEl.style.top = +node.style.top.slice(0, -3) + 5 + "rem"; //node height 4rem
    inputEl.style.left = node.style.left;
  }
  treeEl.appendChild(inputEl);
  inputEl.focus();
  inputEl.addEventListener("keypress", ifEnter);
  //scale page to 1:1
  zoomTree(1);
  if (node.id) scrollTo(node.id);
}

function preOperationSetup(handler, node, placeholder, opName) {
  if (placeholder) inputEl.setAttribute("placeholder", placeholder);
  isInputing = true;
  inputObject = {
    func: handler,
    node: node.id,
    operation: opName,
  };
  startOperation(node);
}
// --------------------------------------------------
// nav

function startSearch(searcherFunc) {
  if (isAnimating) {
    navSearchEl.value = "";
    navSearchEl.placeholder = "Animating, please wait";
    return;
  }
  const searchResult = searcherFunc("search", navSearchEl.value);
  navSearchEl.placeholder = `Found: (${searchResult.length}) ${navSearchEl.value}`;
  navSearchEl.value = "";
  //show all founds
  zoomTree(0);
  searchResult.forEach(nodeID => {
    const node = document.getElementById(nodeID);
    node.style.background = "red";
  });
}

function changeStyleOfNode(style) {
  const node = document.getElementById(style.id);
  if (style.type === "visit") {
    node.style.background = "yellow";
    node.style.transform = "scale(1.5)";
  } else {
    node.style.background = "black";
    node.style.transform = "scale(1)";
  }
}

function normalizeTree() {
  animationArray.forEach(style => {
    const node = document.getElementById(style.id);
    node.style.background = "rgb(45, 138, 196)";
  });
  document.querySelector(".dfs").classList.remove("selected");
  document.querySelector(".bfs").classList.remove("selected");
  isAnimating = false;
  treeItemEl.style.pointerEvents = "auto";
  if (navSearchEl.placeholder === "Animating, please wait")
    navSearchEl.placeholder = "Ready to search";
}
function animateAlgorithm(index = 0) {
  if (animationArray[index]) {
    changeStyleOfNode(animationArray[index]);
    setTimeout(() => animateAlgorithm(index + 1), animationDuration);
  } else {
    setTimeout(() => normalizeTree(), animationDuration);
  }
}

function preAnimationSetup(func, btn, animationName) {
  //guard clause
  if (isAnimating) return;
  btn.classList.add("selected");
  zoomTree(0);
  isAnimating = true;
  animationArray = func(animationName);
  treeItemEl.style.pointerEvents = "none";
  animateAlgorithm();
}
// --------------------------------------------------

//operations at nodes rename,delete,change,add and nav funcionality
export function treeOperationsHandler(handler) {
  //tree board functionality
  treeItemEl.addEventListener("click", function (e) {
    e.preventDefault();
    //load save clean new-tree
    const deleteAllNodes = e.target.closest(".fa-broom");

    if (deleteAllNodes) {
      handler("deleteAll");
      return;
    }
    const newTree = e.target.closest(".fa-plus-square");
    if (newTree) {
      preOperationSetup(handler, "newTree", "Tree name", "newTree");
      return;
    }
    const loadLocal = e.target.closest(".fa-upload");
    if (loadLocal) {
      showSaveMsg(handler("load") ? "Loaded" : "Err: No data");
      return;
    }
    const saveLocal = e.target.closest(".fa-download");
    if (saveLocal) {
      handler("save");
      showSaveMsg("Saved");
      return;
    }
    const node = e.target.closest(".node");
    //if inputting count this click as submit
    if (isInputing && !e.target.closest(".input-el")) submitInput();
    //if searching new parent
    if (isSearchingParent) {
      setNewParent(handler, node);
      return;
    }
    if (!node)
      //guard
      return;
    //rename
    const rename = e.target.closest(".fa-quote-left");
    if (rename) {
      preOperationSetup(handler, node, "New name", "rename");
      return;
    }
    //Add child
    const addChid = e.target.closest(".fa-plus");
    if (addChid) {
      preOperationSetup(handler, node, "Child name", "addChild");
      return;
    }
    //delete node
    const deleteNode = e.target.closest(".fa-trash");
    if (deleteNode) {
      handler("delete", node.id);
      return;
    }
    //change Parent;
    const changeParent = e.target.closest(".fa-exchange-alt");
    if (changeParent) {
      parentSearchingNode = node;
      findNewParent();
      return;
    }
  });

  //nav functionality
  navSearchEl.addEventListener("keypress", e => {
    if (e.key === "Enter") startSearch(handler);
  });
  nav.addEventListener("click", e => {
    const searchIcon = e.target.closest(".fa-search");
    if (searchIcon) {
      startSearch(handler);
      navSearchEl.focus();
      return;
    }
    const dfs = e.target.closest(".dfs");
    if (dfs) {
      preAnimationSetup(handler, dfs, "dfs");
      return;
    }
    const bfs = e.target.closest(".bfs");
    if (bfs) {
      preAnimationSetup(handler, bfs, "bfs");
    }
  });
}
