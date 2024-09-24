import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import React from "react";

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);

    if (token !== null) {
        return children;
    } else {
        return <Navigate to={"/login"} />;
    }
};

export default PrivateRoute;
