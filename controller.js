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
  console.log(nodeId);
  if (operation === "rename")
    treeModel.treeTemplate.findNodeByID(+nodeId).name = newName;
  console.log(treeModel.treeTemplate.print());
};

pageFunctionality.pageFunctionality();
treeView.renderTreeHandler(controlRenderTree);
treeView.treeOperationsHandler(controlTreeOperations);
