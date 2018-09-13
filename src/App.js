import React, { Component } from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import { init } from "reducers/index.js";

import Header from "shared/Header";
import RentalListing from "components/rental/rental-listing/RentalListing";
import RentalDetails from "components/rental/rental-detail/RentalDetails";

import "App.css";

class App extends Component {
  render() {
    return (
      <Provider store={init()}>
        <Router>
          <div className="App">
            <Header />
            <div className="container">
              <Route
                exact
                path="/"
                component={() => <Redirect to="/rentals" />}
              />
              <Route exact path="/rentals" component={RentalListing} />
              <Route exact path="/rentals/:id" component={RentalDetails} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
