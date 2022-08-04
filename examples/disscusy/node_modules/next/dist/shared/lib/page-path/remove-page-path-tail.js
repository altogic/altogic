"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removePagePathTail = removePagePathTail;
var _normalizePathSep = require("./normalize-path-sep");
function removePagePathTail(pagePath, extensions) {
    return (0, _normalizePathSep).normalizePathSep(pagePath).replace(new RegExp(`\\.+(?:${extensions.join('|')})$`), '').replace(/\/index$/, '') || '/';
}

//# sourceMappingURL=remove-page-path-tail.js.map