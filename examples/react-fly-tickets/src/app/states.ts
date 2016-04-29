import * as f from 'fun-model';

export interface IAppState extends f.IState {
    search: ISearchState;
}

export function createDefaultAppState() {
    return {
        search: createDefaultSearchState()
    }
}

export interface ISearchState extends f.IState {
    from: string;
    froms: string[];
    to: string;
    tos: string[];
    departureDate: Date;
    returnDate: Date;
    oneWay: boolean;
}

export function createDefaultSearchState() {
    return {
        from: null,
        froms: [],
        to: null,
        tos: [],
        departureDate: null,
        returnDate: null,
        oneWay: false
    }
}