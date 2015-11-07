import * as s from './store';
import * as af from './actionFactory';
import * as d from './debug';

export * from './store';
export * from './actionFactory';
export * from './helpers';
export { debugCallbackType } from './debug';

export let bootstrap = (defaultState: s.IState, renderCallback: () => void, debugCallback: d.debugCallbackType = undefined, subStateSeparator: string = '.') => {
    debugCallback && d.bootstrap((m, p) => debugCallback(`fun-model -> ${m}`, p));
    s.bootstrap(defaultState, subStateSeparator);
    af.bootstrap(renderCallback);
};
