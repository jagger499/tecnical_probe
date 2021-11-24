import React      from "react"    ;
import { render } from "react-dom";
import App        from "./app"    ;
import "@rmwc/top-app-bar/styles";
import "@rmwc/textfield/styles";
import "@rmwc/card/styles";
import "@rmwc/button/styles";
import '@rmwc/typography/styles';
import '@rmwc/data-table/styles';

render(<App/>, document.getElementById('app'));