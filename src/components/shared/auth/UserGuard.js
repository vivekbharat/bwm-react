import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class UserGuard extends Component {
  render() {
    const { isAllowed, isFetching } = this.props;

    if (isAllowed && !isFetching) {
      return this.props.children;
    } else if (!isAllowed && !isFetching) {
      return <Redirect to={{ pathname: "/rentals" }} />;
    } else {
      return <p>loading...</p>;
    }
  }
}

export default UserGuard;
