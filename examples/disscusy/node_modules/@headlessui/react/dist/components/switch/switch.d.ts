import React, { ElementType, Ref } from 'react';
import { Props } from '../../types';
declare let DEFAULT_GROUP_TAG: React.ExoticComponent<{
    children?: React.ReactNode;
}>;
declare function Group<TTag extends ElementType = typeof DEFAULT_GROUP_TAG>(props: Props<TTag>): JSX.Element;
interface SwitchRenderPropArg {
    checked: boolean;
}
declare type SwitchPropsWeControl = 'id' | 'role' | 'tabIndex' | 'aria-checked' | 'aria-labelledby' | 'aria-describedby' | 'onClick' | 'onKeyUp' | 'onKeyPress';
export declare let Switch: (<TTag extends React.ElementType<any> = "button">(props: Props<TTag, SwitchRenderPropArg, "value" | "name" | "onChange" | "checked" | SwitchPropsWeControl> & {
    checked: boolean;
    onChange(checked: boolean): void;
    name?: string | undefined;
    value?: string | undefined;
}, ref: Ref<HTMLElement>) => JSX.Element) & {
    displayName: string;
} & {
    Group: typeof Group;
    Label: (<TTag_1 extends React.ElementType<any> = "label">(props: Omit<import("../../types").PropsOf<TTag_1>, ("as" | "children" | "refName" | "className") | "id"> & {
        as?: TTag_1 | undefined;
        children?: React.ReactNode | ((bag: {}) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
        refName?: string | undefined;
    } & (import("../../types").PropsOf<TTag_1> extends {
        className?: any;
    } ? {
        className?: string | ((bag: {}) => string) | undefined;
    } : {}) & {
        passive?: boolean | undefined;
    }, ref: React.Ref<HTMLLabelElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Description: (<TTag_2 extends React.ElementType<any> = "p">(props: Props<TTag_2, {}, "id">, ref: React.Ref<HTMLParagraphElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
};
export {};
