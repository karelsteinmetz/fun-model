import * as f from "fun-model";
import * as s from "./states";

console.log("Flux initialized...");

f.bootstrap(s.createDefaultAppState(), () => {
    console.log("Render new state pls...");
})