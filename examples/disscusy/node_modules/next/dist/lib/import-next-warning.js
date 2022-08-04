"use strict";
var Log = _interopRequireWildcard(require("../build/output/log"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
var ref;
Log.warn(`"next" should not be imported directly, imported in ${(ref = module.parent) === null || ref === void 0 ? void 0 : ref.filename}\nSee more info here: https://nextjs.org/docs/messages/import-next`);

//# sourceMappingURL=import-next-warning.js.map