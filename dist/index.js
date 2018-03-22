"use strict";
const _ = require("lodash");
const os = require("./os");
const date = require("./date");
let utils = _;
Object.assign(utils, os);
Object.assign(utils, date);
module.exports = utils;
//# sourceMappingURL=index.js.map