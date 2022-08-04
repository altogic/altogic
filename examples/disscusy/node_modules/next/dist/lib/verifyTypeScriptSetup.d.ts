import { TypeCheckResult } from './typescript/runTypeCheck';
import { NextConfigComplete } from '../server/config-shared';
export declare function verifyTypeScriptSetup(dir: string, intentDirs: string[], typeCheckPreflight: boolean, config: NextConfigComplete, cacheDir?: string): Promise<{
    result?: TypeCheckResult;
    version: string | null;
}>;
