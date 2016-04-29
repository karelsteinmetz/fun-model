import * as f from "fun-model";
import * as s from "./states";

export * from 'fun-model';

console.log("Flux initialized...");

f.bootstrap(
    s.createDefaultAppState(),
    () => {
        console.log("Render new state pls...");
    },
    (m, p) => console.log(m, p)
);