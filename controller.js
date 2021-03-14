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
  let treeNode;
  for (let tree of treeModel.treeArray) {
    treeNode = tree.findNodeByID(+nodeId);
    if (treeNode) break;
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
      // const relatedNodes = treeNode.children.map(child => {
      //   //each child will become an independent tree
      //   treeModel.treeArray.push(child);
      //   return treeNode.identifier + "" + child.identifier;
      // });
      // relatedNodes.push(
      //   treeNode.parentNode.identifier + "" + treeNode.identifier
      // );
      // treeNode.parentNode.removeChildNode(treeNode); //treeModel handles removing node from gradnchilds parent

      // return relatedNodes;
      treeNode.parentNode.removeChildNode(treeNode); //treeModel handles removing node from gradnchilds parent
      treeNode.children.forEach(child => {
        child.removeParent();
        //each child will become an independent tree
        treeModel.treeArray.push(child);
      });

      treeView.renderTreeHandler(controlRenderTree); //update DOM
      break;
  }
};

///init
treeModel.treeInit();

pageFunctionality.pageFunctionality();
treeView.renderTreeHandler(controlRenderTree);
treeView.treeOperationsHandler(controlTreeOperations);
