import { ElementType, Ref } from 'react';
import { Props } from '../types';
export declare enum Features {
    None = 1,
    Focusable = 2,
    Hidden = 4
}
export declare let Hidden: (<TTag extends ElementType<any> = "div">(props: Omit<import("../types").PropsOf<TTag>, "as" | "children" | "refName" | "className"> & {
    as?: TTag | undefined;
    children?: import("react").ReactNode | ((bag: any) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>);
    refName?: string | undefined;
} & (import("../types").PropsOf<TTag> extends {
    className?: any;
} ? {
    className?: string | ((bag: any) => string) | undefined;
} : {}) & {
    features?: Features | undefined;
}, ref: Ref<HTMLElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | null) & {
    displayName: string;
};
