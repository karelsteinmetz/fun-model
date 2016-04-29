import * as React from 'react';
import * as mu from 'material-ui';
import * as f from '../flux';
import * as c from '../states.cursors';
import * as a from './actions';

export default () => {
  let state = f.getState(c.search);
  return (<div>
    <mu.AutoComplete
      hintText="Destination:"
      dataSource = { state.froms }
      searchText = { state.from }
      onUpdateInput = { a.updateFrom }
      />
    <mu.AutoComplete
      hintText="To:"
      dataSource = { state.tos }
      searchText = { state.to }
      onUpdateInput = { a.updateTo }
      />
  </div>
  )
};