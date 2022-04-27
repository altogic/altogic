import React from "react";
import { Navigate } from "react-router-dom";
import altogic from "../../helpers/altogic";
const RequiresAuth = ({ children }) => {
  const auth = altogic.auth.getSession() && altogic.auth.getSession().token;
  return auth ? children : <Navigate to="/signin" />;
};

export default RequiresAuth;
