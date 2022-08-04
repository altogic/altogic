"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.patchIncorrectLockfile = patchIncorrectLockfile;
var _fs = require("fs");
require("../server/node-polyfill-fetch");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
async function patchIncorrectLockfile(dir) {
    var ref;
    const lockfilePath = await (0, _findUp).default('package-lock.json', {
        cwd: dir
    });
    if (!lockfilePath) {
        // if no lockfile present there is no action to take
        return;
    }
    const content = await _fs.promises.readFile(lockfilePath, 'utf8');
    const lockfileParsed = JSON.parse(content);
    const foundSwcPkgs = new Set();
    const nextPkg = (ref = lockfileParsed.packages) === null || ref === void 0 ? void 0 : ref['node_modules/next'];
    // if we don't find next in the package-lock we can't continue
    if (!nextPkg) {
        return;
    }
    const nextVersion = nextPkg.version;
    const packageKeys = Object.keys(lockfileParsed.dependencies || {});
    const expectedSwcPkgs = Object.keys(nextPkg === null || nextPkg === void 0 ? void 0 : nextPkg.optionalDependencies).filter((pkg)=>pkg.startsWith('@next/swc-')
    );
    packageKeys.forEach((pkgKey)=>{
        const swcIndex = pkgKey.indexOf('@next/swc-');
        if (swcIndex > -1) {
            foundSwcPkgs.add(pkgKey.substring(swcIndex));
        }
    });
    // if swc package keys are missing manually populate them
    // so installs on different platforms can succeed
    // user will need to run npm i after to ensure it's corrected
    if (foundSwcPkgs.size !== expectedSwcPkgs.length) {
        Log.warn(`Found lockfile missing swc dependencies, patching..`);
        try {
            // populate fields for each missing swc pkg
            for (const pkg of expectedSwcPkgs){
                if (!foundSwcPkgs.has(pkg)) {
                    const res = await fetch(`https://registry.npmjs.org/${pkg}`);
                    if (!res.ok) {
                        throw new Error(`Failed to fetch registry info for ${pkg}, got status ${res.status}`);
                    }
                    const data = await res.json();
                    const version = data.versions[nextVersion];
                    if (!version) {
                        throw new Error(`Failed to find matching version for ${pkg} at ${nextVersion}`);
                    }
                    if (lockfileParsed.dependencies) {
                        lockfileParsed.dependencies[pkg] = {
                            version: nextVersion,
                            resolved: version.dist.tarball,
                            integrity: version.dist.integrity,
                            optional: true
                        };
                    }
                    lockfileParsed.packages[`node_modules/${pkg}`] = {
                        version: nextVersion,
                        resolved: version.dist.tarball,
                        integrity: version.dist.integrity,
                        cpu: version.cpu,
                        optional: true,
                        os: version.os,
                        engines: version.engines
                    };
                }
            }
            await _fs.promises.writeFile(lockfilePath, JSON.stringify(lockfileParsed, null, 2));
            Log.warn('Lockfile was successfully patched, please run "npm install" to ensure @next/swc dependencies are downloaded');
        } catch (err) {
            Log.error(`Failed to patch lockfile, please try uninstalling and reinstalling next in this workspace`);
            console.error(err);
        }
    }
}

//# sourceMappingURL=patch-incorrect-lockfile.js.map