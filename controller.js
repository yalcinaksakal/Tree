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

const controlTreeOperations = function (
  operation,
  nodeId,
  newName = null,
  targetNodeId = null
) {
  if (operation === "search") {
    //check if user is searching by id
    let searchResult = findNodeById(+nodeId);
    if (searchResult) return [searchResult];
    searchResult = [];
    // else search by name
    for (let tree of Object.values(treeModel.treeArray)) {
      searchResult.push(...tree.findAllNodeByName(nodeId));
    }

    return searchResult;
  }
  const treeNode = findNodeById(+nodeId);
  const targetNode = findNodeById(+targetNodeId);
  switch (operation) {
    case "rename":
      treeNode.name = newName;
      break;
    case "addChild":
      //create and scroll to child
      const childID = treeNode.createChildNode(newName).identifier;
      treeView.renderTreeHandler(controlRenderTree);
      return childID;
    case "delete":
      treeNode.parentNode.removeChildNode(treeNode); //treeModel handles removing node from gradnchilds parent
      treeNode.children.forEach(child => {
        child.removeParent();
        //each child will become an independent tree
        treeModel.treeArray[child.identifier] = child;
      });
      treeView.renderTreeHandler(controlRenderTree); //update DOM
      break;
    case "changeParent":
      try {
        treeNode.parentNode = targetNode;
        //if it was a treen, it is not now
        delete treeModel.treeArray[treeNode.identifier];
        treeView.renderTreeHandler(controlRenderTree); //update DOM
      } catch (err) {
        throw err;
      }
      break;
  }
};

///init
treeModel.treeInit();

pageFunctionality.pageFunctionality();
treeView.renderTreeHandler(controlRenderTree);
treeView.treeOperationsHandler(controlTreeOperations);
