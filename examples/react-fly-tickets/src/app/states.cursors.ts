import * as f from './flux';
import * as s from './states';

export const app: f.ICursor<s.IAppState> = f.rootCursor;
export const search: f.ICursor<s.ISearchState> = { key: 'search' };