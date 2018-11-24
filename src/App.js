import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Listing from "./components/Listing";

import "./App.css";

library.add(faStar, faQuestionCircle)


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Listing} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
