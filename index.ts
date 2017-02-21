import * as s from './src/store';
import * as af from './src/actionFactory';
import * as d from './src/debug';

export * from './src/store';
export * from './src/actionFactory';
export * from './src/helpers';
export { debugCallbackType } from './src/debug';

export interface IBootstrapParams {
    debugCallback?: d.debugCallbackType;
    withStateFreezing?: boolean | (() => boolean);
    withExceptionHandling?: boolean | (() => boolean);
    subStateSeparator?: string;
}

export const bootstrap = (defaultState: s.IState, onStateChanged: () => void, params: IBootstrapParams) => {
    params.debugCallback && d.bootstrap((m, p) => params.debugCallback && params.debugCallback(`fun-model -> ${m}`, p));
    s.bootstrap(defaultState, params.withStateFreezing, params.subStateSeparator);
    af.bootstrap(onStateChanged, params.withExceptionHandling);
};
