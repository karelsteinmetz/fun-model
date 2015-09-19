export * from './store';
export * from './actionFactory';

import { IState } from './store';
import { bootstrap as storeBootstrap } from './store';
import { bootstrap as actionFactoryBootstrap } from './actionFactory';

export let bootstrap = (defaultState: IState, renderCallback: () => void, subStateSeparator: string = '.') => {
    storeBootstrap(defaultState, subStateSeparator);
	actionFactoryBootstrap(renderCallback);
};
