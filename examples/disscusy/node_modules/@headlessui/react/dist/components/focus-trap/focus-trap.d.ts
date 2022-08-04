import React, { MutableRefObject, Ref } from 'react';
import { Props } from '../../types';
declare enum Features {
    /** No features enabled for the focus trap. */
    None = 1,
    /** Ensure that we move focus initially into the container. */
    InitialFocus = 2,
    /** Ensure that pressing `Tab` and `Shift+Tab` is trapped within the container. */
    TabLock = 4,
    /** Ensure that programmatically moving focus outside of the container is disallowed. */
    FocusLock = 8,
    /** Ensure that we restore the focus when unmounting the focus trap. */
    RestoreFocus = 16,
    /** Enable all features. */
    All = 30
}
export declare let FocusTrap: (<TTag extends React.ElementType<any> = "div">(props: Omit<import("../../types").PropsOf<TTag>, "as" | "children" | "refName" | "className"> & {
    as?: TTag | undefined;
    children?: React.ReactNode | ((bag: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    refName?: string | undefined;
} & (import("../../types").PropsOf<TTag> extends {
    /** Ensure that programmatically moving focus outside of the container is disallowed. */
    className?: any;
} ? {
    className?: string | ((bag: any) => string) | undefined;
} : {}) & {
    initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
    features?: Features | undefined;
    containers?: React.MutableRefObject<Set<React.MutableRefObject<HTMLElement | null>>> | undefined;
}, ref: Ref<HTMLDivElement>) => JSX.Element) & {
    displayName: string;
} & {
    features: typeof Features;
};
export {};
