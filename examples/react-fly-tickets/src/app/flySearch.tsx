import * as React from 'react';
import * as mu from 'material-ui';
import colors from 'material-ui/lib/styles/colors';
import FromToComponent from './search/fromToComponent';
import DateSelection from './search/dateSelection';
import * as f from './flux';
import * as c from './states.cursors';
import * as s from './states';

const styles = {
  container: {
    textAlign: 'center',
  },
};

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
