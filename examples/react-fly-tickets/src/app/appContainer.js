"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var flySearch_1 = require("./flySearch");
var styles_1 = require('material-ui/lib/styles');
var muiTheme = styles_1.getMuiTheme({
    palette: {
        accent1Color: "#ff5722",
    },
});
var froms = ["f1", "f2"];
var tos = ["t1", "t2", "t3"];
var AppContainer = (function (_super) {
    __extends(AppContainer, _super);
    function AppContainer() {
        _super.apply(this, arguments);
    }
    AppContainer.prototype.render = function () {
        return React.createElement(flySearch_1.default, {froms: froms, tos: tos});
    };
    return AppContainer;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = styles_1.ThemeDecorator(muiTheme)(AppContainer);
//# sourceMappingURL=appContainer.js.map