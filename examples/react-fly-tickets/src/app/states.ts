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
        from: '',
        froms: ["f1", "f2"],
        to: '',
        tos: ["t1", "t2", "t3"],
        departureDate: '',
        returnDate: '',
        oneWay: false
    }
}