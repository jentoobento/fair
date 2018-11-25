import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Listing from "./components/Listing/Listing";
import "./App.css";

library.add(faStar, faQuestionCircle)

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={Listing} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
