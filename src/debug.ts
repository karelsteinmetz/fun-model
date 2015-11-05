
export type debugCallbackType = (message: string, params?: any) => void

let debug: debugCallbackType = undefined;

export let bootstrap = (debugCallback: debugCallbackType) => {
    debug = debugCallback;
};

export function log(message: string, params?: any) {
    debug && debug(message, params);
}