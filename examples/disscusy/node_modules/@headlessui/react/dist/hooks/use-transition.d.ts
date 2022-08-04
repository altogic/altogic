import { MutableRefObject } from 'react';
interface TransitionArgs {
    container: MutableRefObject<HTMLElement | null>;
    classes: MutableRefObject<{
        enter: string[];
        enterFrom: string[];
        enterTo: string[];
        leave: string[];
        leaveFrom: string[];
        leaveTo: string[];
        entered: string[];
    }>;
    events: MutableRefObject<{
        beforeEnter: () => void;
        afterEnter: () => void;
        beforeLeave: () => void;
        afterLeave: () => void;
    }>;
    direction: 'enter' | 'leave' | 'idle';
    onStart: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
    onStop: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
}
export declare function useTransition({ container, direction, classes, events, onStart, onStop, }: TransitionArgs): void;
export {};
