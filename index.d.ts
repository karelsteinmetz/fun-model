import * as s from './src/store';
import * as d from './src/debug';
export * from './src/store';
export * from './src/actionFactory';
export * from './src/helpers';
export { debugCallbackType } from './src/debug';
export declare let bootstrap: (defaultState: s.IState, renderCallback: () => void, debugCallback?: d.debugCallbackType, subStateSeparator?: string) => void;
