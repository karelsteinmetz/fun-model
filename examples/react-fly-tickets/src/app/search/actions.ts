import * as f from "../flux";
import * as s from "../states";
import * as c from "../states.cursors";

export const updateFrom = f.createAction<s.ISearchState, string>(c.search, (state, value) => {
    return f.shallowCopy(state, ns => { ns.from = value });
})

export const updateTo = f.createAction<s.ISearchState, string>(c.search, (state, value) => {
    return f.shallowCopy(state, ns => { ns.to = value });
})

export const find = f.createAction(c.search, (state) => {
    return state;
})

export const updateDepartureDate = f.createAction<s.ISearchState, Date>(c.search, (state, value) => {
    return f.shallowCopy(state, ns => { ns.departureDate = value });
})

export const updateReturnDate = f.createAction<s.ISearchState, Date>(c.search, (state, value) => {
    return f.shallowCopy(state, ns => { ns.returnDate = value });
})