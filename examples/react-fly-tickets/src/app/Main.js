import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

const dataSource1 = [
  {
    text: 'text-value1',
    value: (
      <MenuItem
        primaryText="text-value1"
        secondaryText="&#9786;"
        />
    ),
  },
  {
    text: 'text-value2',
    value: (
      <MenuItem
        primaryText="text-value2"
        secondaryText="&#9786;"
        />
    ),
  },
];

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleUpdateInputFrom = this.handleUpdateInputFrom.bind(this);
    this.handleUpdateInputTo = this.handleUpdateInputTo.bind(this);
    this.handleTouchTapFind = this.handleTouchTapFind.bind(this);

    this.state = {
      fromDataSource: [],
      toDataSource: []
    };
  }

  handleUpdateInputFrom(t) {
    let oldState = this.state;
    this.setState({
      fromDataSource: [t, t + t, t + t + t]
    });
  };

  handleUpdateInputTo(t) {
    let oldState = this.state;
    this.setState({
      toDataSource: [t, t + t, t + t + t]
    });
  };

  handleTouchTapFind() {
    console.log('Searching...');
  }

  render() {
    const DestinationSelection = () => (
      <div>
        <AutoComplete
          hintText="Destination:"
          dataSource={this.state.fromDataSource}
          onUpdateInput={this.handleUpdateInputFrom}
          />
        <AutoComplete
          hintText="To:"
          dataSource={this.state.toDataSource}
          onUpdateInput={this.handleUpdateInputTo}
          />
      </div>
    );

    const DateSelection = () => (
      <div>
        <DatePicker hintText="Departure:" mode="landscape" />
        <DatePicker hintText="Return:" mode="landscape" />
      </div>
    );

    const AppBar = (
      <AppBar
        title="React and fun-model example"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <DestinationSelection />
          <DateSelection />
          <RaisedButton
            label="Find"
            primary={true}
            onTouchTap={this.handleTouchTapFind}
            />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
