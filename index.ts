import * as s from './src/store';
import * as af from './src/actionFactory';
import * as d from './src/debug';

export * from './src/store';
export * from './src/actionFactory';
export * from './src/helpers';
export { debugCallbackType } from './src/debug';

export function bootstrap(
    defaultState: s.IState, renderCallback: () => void, debugCallback: d.debugCallbackType = undefined, subStateSeparator: string = '.') {

    debugCallback && d.bootstrap((m, p) => debugCallback(`fun-model -> ${m}`, p));
    s.bootstrap(defaultState, subStateSeparator);
    af.bootstrap(renderCallback);
};
