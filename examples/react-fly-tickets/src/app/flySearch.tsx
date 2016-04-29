import * as React from 'react';
import * as mu from 'material-ui';
import colors from 'material-ui/lib/styles/colors';
import FromToComponent from './search/fromToComponent';
import * as f from './flux';
import * as c from './states.cursors';

const styles = {
  container: {
    textAlign: 'center',
  },
};

const dataSource1 = [
  {
    text: 'text-value1',
    value: (
      <mu.MenuItem
        primaryText="text-value1"
        secondaryText="&#9786;"
        />
    ),
  },
  {
    text: 'text-value2',
    value: (
      <mu.MenuItem
        primaryText="text-value2"
        secondaryText="&#9786;"
        />
    ),
  },
];

const DateSelection = () => (
  <div>
    <mu.DatePicker hintText="Departure:" mode="landscape" />
    <mu.DatePicker hintText="Return:" mode="landscape" />
  </div>
);


const AppBar = () => (
  <AppBar
    title="React and fun-model example"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
);



class FlySearch extends React.Component<{}, {}> {
  render() {
    return <div style={styles.container}>
      <FromToComponent />
      <DateSelection />
      <mu.RaisedButton
        label="Find"
        primary={true}
        />
    </div>
  }
}

export default FlySearch;
