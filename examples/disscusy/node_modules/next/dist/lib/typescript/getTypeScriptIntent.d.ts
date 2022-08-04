import { NextConfigComplete } from '../../server/config-shared';
export declare type TypeScriptIntent = {
    firstTimeSetup: boolean;
};
export declare function getTypeScriptIntent(baseDir: string, intentDirs: string[], config: NextConfigComplete): Promise<TypeScriptIntent | false>;
