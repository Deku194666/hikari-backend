



import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;