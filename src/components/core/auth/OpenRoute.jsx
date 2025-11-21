import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useToken } from "../../../context/TokenContext";

function OpenRoute({ children }) {
  const { token } = useToken();

  if (token === null) {
    return children;
  } else {
    return <Navigate to={"/dashboard/my-profile"} />;
  }
}

export default OpenRoute;
