import React, { Ref } from 'react';
import { Props } from '../../types';
import { PropsForFeatures } from '../../utils/render';
interface ComboboxRenderPropArg<T> {
    open: boolean;
    disabled: boolean;
    activeIndex: number | null;
    activeOption: T | null;
}
interface InputRenderPropArg {
    open: boolean;
    disabled: boolean;
}
declare type InputPropsWeControl = 'id' | 'role' | 'aria-labelledby' | 'aria-expanded' | 'aria-activedescendant' | 'onKeyDown' | 'onChange' | 'displayValue';
interface ButtonRenderPropArg {
    open: boolean;
    disabled: boolean;
}
declare type ButtonPropsWeControl = 'id' | 'type' | 'tabIndex' | 'aria-haspopup' | 'aria-controls' | 'aria-expanded' | 'aria-labelledby' | 'disabled' | 'onClick' | 'onKeyDown';
interface LabelRenderPropArg {
    open: boolean;
    disabled: boolean;
}
declare type LabelPropsWeControl = 'id' | 'ref' | 'onClick';
interface OptionsRenderPropArg {
    open: boolean;
}
declare type OptionsPropsWeControl = 'aria-activedescendant' | 'aria-labelledby' | 'hold' | 'id' | 'onKeyDown' | 'role' | 'tabIndex';
declare let OptionsRenderFeatures: number;
interface OptionRenderPropArg {
    active: boolean;
    selected: boolean;
    disabled: boolean;
}
declare type ComboboxOptionPropsWeControl = 'id' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-selected';
export declare let Combobox: (<TTag extends React.ElementType<any> = React.ExoticComponent<{
    children?: React.ReactNode;
}>, TType = string, TActualType = TType extends (infer U)[] ? U : TType>(props: Props<TTag, ComboboxRenderPropArg<TType>, "value" | "name" | "disabled" | "onChange" | "nullable" | "multiple"> & {
    value: TType;
    onChange(value: TType): void;
    disabled?: boolean | undefined;
    __demoMode?: boolean | undefined;
    name?: string | undefined;
    nullable?: boolean | undefined;
    multiple?: boolean | undefined;
}, ref: React.Ref<TTag>) => JSX.Element) & {
    displayName: string;
} & {
    Input: (<TTag_1 extends React.ElementType<any> = "input", TType_1 = unknown>(props: Props<TTag_1, InputRenderPropArg, InputPropsWeControl> & {
        displayValue?(item: TType_1): string;
        onChange(event: React.ChangeEvent<HTMLInputElement>): void;
    }, ref: Ref<HTMLInputElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Button: (<TTag_2 extends React.ElementType<any> = "button">(props: Props<TTag_2, ButtonRenderPropArg, ButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Label: (<TTag_3 extends React.ElementType<any> = "label">(props: Props<TTag_3, LabelRenderPropArg, LabelPropsWeControl>, ref: Ref<HTMLLabelElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Options: (<TTag_4 extends React.ElementType<any> = "ul">(props: Props<TTag_4, OptionsRenderPropArg, OptionsPropsWeControl> & (({
        static?: undefined;
    } & {
        unmount?: boolean | undefined;
    }) | ({
        unmount?: undefined;
    } & {
        static?: boolean | undefined;
    })) & {
        hold?: boolean | undefined;
    }, ref: Ref<HTMLUListElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Option: (<TTag_5 extends React.ElementType<any> = "li", TType_2 = unknown>(props: Props<TTag_5, OptionRenderPropArg, "value" | ComboboxOptionPropsWeControl> & {
        disabled?: boolean | undefined;
        value: TType_2;
    }, ref: Ref<HTMLLIElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
};
export {};
