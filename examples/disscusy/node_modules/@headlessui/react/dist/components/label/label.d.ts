import React, { ReactNode, Ref } from 'react';
import { Props } from '../../types';
interface SharedData {
    slot?: {};
    name?: string;
    props?: {};
}
interface LabelProviderProps extends SharedData {
    children: ReactNode;
}
export declare function useLabels(): [string | undefined, (props: LabelProviderProps) => JSX.Element];
export declare let Label: (<TTag extends React.ElementType<any> = "label">(props: Omit<import("../../types").PropsOf<TTag>, ("as" | "children" | "refName" | "className") | "id"> & {
    as?: TTag | undefined;
    children?: React.ReactNode | ((bag: {}) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    refName?: string | undefined;
} & (import("../../types").PropsOf<TTag> extends {
    className?: any;
} ? {
    className?: string | ((bag: {}) => string) | undefined;
} : {}) & {
    passive?: boolean | undefined;
}, ref: Ref<HTMLLabelElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
    displayName: string;
};
export {};
