"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var React = require('react');
var mu = require('material-ui');
var styles = {
    container: {
        textAlign: 'center',
    },
};
var dataSource1 = [
    {
        text: 'text-value1',
        value: (React.createElement(mu.MenuItem, {primaryText: "text-value1", secondaryText: "&#9786;"})),
    },
    {
        text: 'text-value2',
        value: (React.createElement(mu.MenuItem, {primaryText: "text-value2", secondaryText: "&#9786;"})),
    },
];
var DestinationSelection = function () { return (React.createElement("div", null, React.createElement(mu.AutoComplete, {hintText: "Destination:", dataSource: _this.state.fromDataSource, onUpdateInput: _this.handleUpdateInputFrom}), React.createElement(mu.AutoComplete, {hintText: "To:", dataSource: _this.state.toDataSource, onUpdateInput: _this.handleUpdateInputTo}))); };
var DateSelection = function () { return (React.createElement("div", null, React.createElement(mu.DatePicker, {hintText: "Departure:", mode: "landscape"}), React.createElement(mu.DatePicker, {hintText: "Return:", mode: "landscape"}))); };
var AppBar = function () { return (React.createElement(AppBar, {title: "React and fun-model example", iconClassNameRight: "muidocs-icon-navigation-expand-more"})); };
var actions = {
    handleUpdateInputFrom: function (t) {
        console.log(t);
    },
    handleUpdateInputTo: function (t) {
        console.log(t);
    },
    handleTouchTapFind: function () {
        console.log('Searching...');
    }
};
var FlySearch = (function (_super) {
    __extends(FlySearch, _super);
    function FlySearch() {
        _super.apply(this, arguments);
    }
    FlySearch.prototype.render = function () {
        var _this = this;
        var DestinationSelection = function () { return (React.createElement("div", null, React.createElement(mu.AutoComplete, {hintText: "Destination:", dataSource: _this.props.froms, searchText: _this.props.from, onUpdateInput: actions.handleUpdateInputFrom}), React.createElement(mu.AutoComplete, {hintText: "To:", dataSource: _this.props.tos, searchText: _this.props.to, onUpdateInput: actions.handleUpdateInputTo}))); };
        return React.createElement("div", {style: styles.container}, React.createElement(DestinationSelection, null), React.createElement(DateSelection, null), React.createElement(mu.RaisedButton, {label: "Find", primary: true}));
    };
    return FlySearch;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FlySearch;
//# sourceMappingURL=flySearch.js.map