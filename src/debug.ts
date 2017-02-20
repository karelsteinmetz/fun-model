
export type debugCallbackType = (message: string, params?: any) => void

export let debug: debugCallbackType = undefined;

export const bootstrap = (debugCallback: debugCallbackType) => {
    debug = debugCallback;
};

export const isDebuggingEnabled = (): boolean => {
    return !!debug;
}

export const log = (message: string, params?: any) => {
    debug && debug(message, params);
}