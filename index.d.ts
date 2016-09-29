import * as s from './src/store';
export * from './src/store';
export * from './src/actionFactory';
export * from './src/helpers';
export { debugCallbackType } from './src/debug';
export declare let bootstrap: (defaultState: s.IState, renderCallback: () => void, debugCallback?: (message: string, params?: any) => void, subStateSeparator?: string) => void;
