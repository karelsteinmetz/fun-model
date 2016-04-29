import * as React from "react";
import Search from "./flySearch";
import { getMuiTheme, ThemeDecorator } from 'material-ui/lib/styles';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: "#ff5722",
    },
});

const froms = ["f1", "f2"];
const tos = ["t1", "t2", "t3"];

class AppContainer extends React.Component<{}, {}> {
    render() {
        return <Search froms={froms} tos={tos} />;
    }
}

export default ThemeDecorator(muiTheme)(AppContainer);
