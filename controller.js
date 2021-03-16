"use strict";
import * as treeView from "./view/treeView.js";
import * as treeModel from "./model/treeModel.js";
import * as pageFunctionality from "./view/pageFuncitonalityView.js";

const controlRenderTree = function () {
  return Object.values(treeModel.treeArray).map(tree =>
    tree.createTreeToGraphPositionsAsNodesArray()
  );
};

function findNodeById(id) {
  let node;
  for (let tree of Object.values(treeModel.treeArray)) {
    node = tree.findNodeByID(+id);
    if (node) return node;
  }
  return false;
}

function search(id) {
  //check if user is searching by id
  let searchResult = findNodeById(+id);
  if (searchResult) return [searchResult];
  searchResult = [];
  // else search by name
  for (let tree of Object.values(treeModel.treeArray)) {
    searchResult.push(...tree.findAllNodeByName(id));
  }
  //normalize view (clear earlier search results)
  treeView.renderTreeHandler(controlRenderTree);
  return searchResult;
}

function deleteNode(treeNode) {
  if (!treeNode.parentNode) delete treeModel.treeArray[treeNode.identifier];
  else treeNode.parentNode.removeChildNode(treeNode); //treeModel handles removing node from gradnchilds parent

  treeNode.children.forEach(child => {
    child.removeParent();
    //each child will become an independent tree
    treeModel.treeArray[child.identifier] = child;
  });
  treeView.renderTreeHandler(controlRenderTree); //update DOM
}

function changeParent(treeNode, targetNodeId) {
  try {
    const targetNode = findNodeById(targetNodeId);
    treeNode.parentNode = targetNode;
    //if it was a tree, it is not now
    delete treeModel.treeArray[treeNode.identifier];
    treeView.renderTreeHandler(controlRenderTree); //update DOM
  } catch (err) {
    throw err;
  }
}

function startAnimation(operation) {
  //empty animation array
  treeModel.arrayDfsBfs.length = 0;
  //for each tree create animation arr
  for (let tree of Object.values(treeModel.treeArray))
    operation === "dfs" ? tree.dfsSequence() : tree.bfsSequence();
  return treeModel.arrayDfsBfs;
}

const controlTreeOperations = function (
  operation,
  nodeId,
  newName = null,
  targetNodeId = null
) {
  const treeNode = findNodeById(+nodeId);
  switch (operation) {
    case "dfs":
    case "bfs":
      return startAnimation(operation);
    case "search":
      return search(nodeId);
    case "rename":
      treeNode.name = newName;
      break;
    case "addChild":
      //create and scroll to child
      const childID = treeNode.createChildNode(newName).identifier;
      treeView.renderTreeHandler(controlRenderTree);
      return childID;
    case "delete":
      deleteNode(treeNode);
      break;
    case "changeParent":
      changeParent(treeNode, +targetNodeId);
      break;
  }
};

///init
treeModel.treeInit();

pageFunctionality.pageFunctionality();
treeView.renderTreeHandler(controlRenderTree);
treeView.treeOperationsHandler(controlTreeOperations);
