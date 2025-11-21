import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import React from "react";
import { useToken } from "../../../context/TokenContext";

const PrivateRoute = ({ children }) => {
  // const { token } = useSelector((state) => state.auth);
  const { token } = useToken();
  console.log("In private route token: ", token);
  if (token !== null) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default PrivateRoute;
