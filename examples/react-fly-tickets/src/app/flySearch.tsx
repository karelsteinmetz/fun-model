import * as React from 'react';
import * as mu from 'material-ui';
import colors from 'material-ui/lib/styles/colors';

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

const DestinationSelection = () => (
  <div>
    <mu.AutoComplete
      hintText="Destination:"
      dataSource={this.state.fromDataSource}
      onUpdateInput={this.handleUpdateInputFrom}
      />
    <mu.AutoComplete
      hintText="To:"
      dataSource={this.state.toDataSource}
      onUpdateInput={this.handleUpdateInputTo}
      />
  </div>
);

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

interface IProps {
  from?: string;
  froms?: string[];
  to?: string;
  tos?: string[];
}

const actions = {
  handleUpdateInputFrom(t) {
    console.log(t)
  },
  handleUpdateInputTo(t) {
    console.log(t)
  },
  handleTouchTapFind() {
    console.log('Searching...');
  }
}

class FlySearch extends React.Component<IProps, {}> {
  render() {
    const DestinationSelection = () => (
      <div>
        <mu.AutoComplete
          hintText="Destination:"
          dataSource={this.props.froms}
          searchText={this.props.from}
          onUpdateInput={actions.handleUpdateInputFrom}
          />
        <mu.AutoComplete
          hintText="To:"
          dataSource={this.props.tos}
          searchText={this.props.to}
          onUpdateInput={actions.handleUpdateInputTo}
          />
      </div>
    );

    return <div style={styles.container}>
      <DestinationSelection />
      <DateSelection />
      <mu.RaisedButton
        label="Find"
        primary={true}
        />
    </div>
  }
}

export default FlySearch;
