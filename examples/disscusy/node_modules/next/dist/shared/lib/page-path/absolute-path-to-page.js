"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.absolutePathToPage = absolutePathToPage;
var _ensureLeadingSlash = require("./ensure-leading-slash");
var _normalizePathSep = require("./normalize-path-sep");
var _path = require("../isomorphic/path");
var _removePagePathTail = require("./remove-page-path-tail");
function absolutePathToPage(pagesDir, pagePath, extensions) {
    return (0, _removePagePathTail).removePagePathTail((0, _normalizePathSep).normalizePathSep((0, _ensureLeadingSlash).ensureLeadingSlash((0, _path).relative(pagesDir, pagePath))), extensions);
}

//# sourceMappingURL=absolute-path-to-page.js.map