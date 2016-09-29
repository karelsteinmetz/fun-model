export declare type debugCallbackType = (message: string, params?: any) => void;
export declare let bootstrap: (debugCallback: (message: string, params?: any) => void) => void;
export declare function log(message: string, params?: any): void;
