export type debugCallbackType = (message: string, params?: any) => void;

export let debug: debugCallbackType | undefined = undefined;

export const bootstrap = (debugCallback: debugCallbackType | undefined) => {
    debug = debugCallback;
};

export const log = (message: string, params?: any) => {
    debug && debug(message, params);
};
