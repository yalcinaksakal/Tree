"use strict";
import * as view from "./view.js";
import * as model from "./model.js";

const controlRenderTree = function () {
  return model.treeTemplate.createTreeToGraphPositionsAsNodesArray();
};

view.renderTreeHandler(controlRenderTree);
console.log(model.treeTemplate.print());
