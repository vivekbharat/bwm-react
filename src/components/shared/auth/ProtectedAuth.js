import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../../../services/auth-service";

const ProtectedAuth = props => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props =>
        authService.isAuthenticated() ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

export default ProtectedAuth;
