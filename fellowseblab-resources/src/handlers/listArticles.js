"use strict";

const helper = require("../../src/handlers/handlersHelper");

module.exports = {
  handler: helper.getListHandler("article", "/articles"),
};
