"use strict";
import * as treeView from "./view/treeView.js";
import * as treeModel from "./model/treeModel.js";
import * as pageFunctionality from "./view/pageFuncitonalityView.js";

const controlRenderTree = function () {
  return treeModel.treeArray.map(tree =>
    tree.createTreeToGraphPositionsAsNodesArray()
  );
};

const controlTreeOperations = function (
  operation,
  nodeId,
  newName = null,
  targetNodeId = null
) {
  let treeNode, targetNode;
  for (let tree of treeModel.treeArray) {
    treeNode = tree.findNodeByID(+nodeId);
    if (treeNode) break;
  }

  if (targetNodeId)
    for (let tree of treeModel.treeArray) {
      targetNode = tree.findNodeByID(+targetNodeId);
      if (targetNode) break;
    }
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
        treeModel.treeArray.push(child);
      });
      treeView.renderTreeHandler(controlRenderTree); //update DOM
      break;
    case "changeParent":
      try {
        treeNode.parentNode = targetNode;
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
