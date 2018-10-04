import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import RentalSearchInput from "../rental/RentalSearchInput";

class Header extends Component {
  handleLogout = () => {
    this.props.logout();
    this.props.history.push("/login");
  };

  renderAuthButtons = isAuth => {
    // const { isAuth } = this.props.auth;

    if (isAuth) {
      return (
        <p className="nav-item nav-link clickable" onClick={this.handleLogout}>
          Logout
        </p>
      );
    }
    return (
      <React.Fragment>
        <Link className="nav-item nav-link active" to="/login">
          Login <span className="sr-only">(current)</span>
        </Link>
        <Link className="nav-item nav-link" to="/register">
          Register
        </Link>
      </React.Fragment>
    );
  };

  renderOwnerSection = isAuth => {
    // const { isAuth } = this.props.auth;

    if (isAuth) {
      return (
        <div className="nav-item dropdown">
          <a
            className="nav-link nav-item dropdown-toggle clickable"
            id="navbarDropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Owner Section
          </a>
          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdownMenuLink"
          >
            <Link className="dropdown-item" to="/Rentals/new">
              Create Rental
            </Link>
            <a className="dropdown-item" to="#">
              Manage Rentals
            </a>
            <a className="dropdown-item" to="#">
              Manage Bookings
            </a>
          </div>
        </div>
      );
    }
  };

  render() {
    const { username, isAuth } = this.props.auth;

    return (
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/rentals">
            BookWithMe
          </Link>
          <RentalSearchInput />
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ml-auto">
              {isAuth && <a className="nav-item nav-link">{username}</a>}
              {this.renderOwnerSection(isAuth)}
              {this.renderAuthButtons(isAuth)}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default withRouter(connect(mapStateToProps)(Header));
