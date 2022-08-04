import React, { MutableRefObject, Ref } from 'react';
import { Props } from '../../types';
interface PortalRenderPropArg {
}
interface GroupRenderPropArg {
}
export declare let Portal: (<TTag extends React.ElementType<any> = React.ExoticComponent<{
    children?: React.ReactNode;
}>>(props: Props<TTag, PortalRenderPropArg, "1D45E01E-AF44-47C4-988A-19A94EBAF55C">, ref: Ref<HTMLElement>) => React.ReactPortal | null) & {
    displayName: string;
} & {
    Group: (<TTag_1 extends React.ElementType<any> = React.ExoticComponent<{
        children?: React.ReactNode;
    }>>(props: Omit<import("../../types").PropsOf<TTag_1>, "as" | "children" | "refName" | "className"> & {
        as?: TTag_1 | undefined;
        children?: React.ReactNode | ((bag: GroupRenderPropArg) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
        refName?: string | undefined;
    } & (import("../../types").PropsOf<TTag_1> extends {
        className?: any;
    } ? {
        className?: string | ((bag: GroupRenderPropArg) => string) | undefined;
    } : {}) & {
        target: MutableRefObject<HTMLElement | null>;
    }, ref: Ref<HTMLElement>) => JSX.Element) & {
        displayName: string;
    };
};
export {};
