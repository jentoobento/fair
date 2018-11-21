import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Listing from "./components/Listing";
import "./App.css";

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
