import { IState } from './store';
import { bootstrap as storeBootstrap } from './store';
import { bootstrap as actionFactoryBootstrap, debugCallbackType } from './actionFactory';

export * from './store';
export * from './actionFactory';
export * from './helpers';

export let bootstrap = (defaultState: IState, renderCallback: () => void, debugCallback: debugCallbackType = undefined, subStateSeparator: string = '.') => {
    storeBootstrap(defaultState, subStateSeparator);
    actionFactoryBootstrap(renderCallback, (message, params) => { debugCallback && debugCallback(`fun-model -> ${message}`, params) });
};
