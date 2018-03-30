"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports._ = _;
__export(require("./os"));
__export(require("./date"));
const nlog_1 = require("./nlog");
exports.nlog = nlog_1.default;
