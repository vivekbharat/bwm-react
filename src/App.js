import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { Provider } from "react-redux";

// import { init } from "reducers/index.js"

import Header from "./components/shared/Header";
import RentalListing from "components/rental/rental-listing/RentalListing";
import RentalDetails from "components/rental/rental-detail/RentalDetails";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ProtectedAuth from "./components/shared/auth/ProtectedAuth";
import LoggedinRoute from "./components/shared/auth/LoggedinRoute";
import RentalSearchListing from "./components/rental/rental-listing/RentalSearchListing";
import RentalCreate from "./components/rental/rental-create/RentalCreate";

import * as actions from "actions";

import "App.css";
const store = require("./reducers").init();

class App extends Component {
  componentWillMount() {
    this.checkAuthState();
  }

  checkAuthState = () => {
    // console.log("Check Auth State");
    store.dispatch(actions.checkAuthState());
  };

  logout = () => {
    store.dispatch(actions.logout());
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header logout={this.logout} />
            <div className="container">
              <Switch>
                <Route
                  exact
                  path="/"
                  component={() => <Redirect to="/rentals" />}
                />
                <Route exact path="/rentals" component={RentalListing} />
                <Route
                  exact
                  path="/rentals/:city/home"
                  component={RentalSearchListing}
                />
                <ProtectedAuth
                  exact
                  path="/rentals/new"
                  component={RentalCreate}
                />
                <ProtectedAuth
                  exact
                  path="/rentals/:id"
                  component={RentalDetails}
                />
                <Route exact path="/login" component={Login} />
                <LoggedinRoute exact path="/register" component={Register} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
