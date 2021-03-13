"use strict";
import * as view from "./view.js";
import * as model from "./treeModel.js";

const controlRenderTree = function () {
  
  return model.treeTemplate.createTreeToGraphPositionsAsNodesArray();
};

view.renderTreeHandler(controlRenderTree);
