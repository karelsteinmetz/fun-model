import * as React from "react";
import Search from "./flySearch";
import { getMuiTheme, ThemeDecorator } from 'material-ui/lib/styles';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: "#ff5722",
    },
});

class AppContainer extends React.Component<{}, {}> {
    render() {
        return <Search />;
    }
}

export default ThemeDecorator(muiTheme)(AppContainer);
