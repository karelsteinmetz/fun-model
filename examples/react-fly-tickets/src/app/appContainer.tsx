import * as React from "react";
import * as mu from 'material-ui';
import Search from "./flySearch";
import { getMuiTheme, ThemeDecorator } from 'material-ui/lib/styles';
import * as f from "./flux";
import * as c from "./states.cursors";

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: "#ff5722",
    },
});

const AppBar = () => (
    <mu.AppBar
        title="Fly ticket search through ReactJs and Fun-model"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
);

class AppContainer extends React.Component<{}, {}> {
    render() {
        return <div>
            <AppBar />
            <Search />
        </div>
    }
}

export default ThemeDecorator(muiTheme)(AppContainer);
