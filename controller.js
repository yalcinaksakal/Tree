"use strict";
import * as treeView from "./view/treeView.js";
import * as treeModel from "./model/treeModel.js";
import * as pageFunctionality from "./view/pageFuncitonalityView.js";

const controlRenderTree = function () {
  return treeModel.treeTemplate.createTreeToGraphPositionsAsNodesArray();
};

const controlTreeOperations = function (
  operation,
  nodeId,
  newName = null,
  targetNodeId = null
) {
  const treeNode = treeModel.treeTemplate.findNodeByID(+nodeId);
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
      const relatedNodes = treeNode.children.map(
        child => treeNode.identifier + "" + child.identifier
      );
      relatedNodes.push(
        treeNode.parentNode.identifier + "" + treeNode.identifier
      );
      treeNode.parentNode.removeChildNode(treeNode);

      return relatedNodes;
  }
};

pageFunctionality.pageFunctionality();
treeView.renderTreeHandler(controlRenderTree);
treeView.treeOperationsHandler(controlTreeOperations);
