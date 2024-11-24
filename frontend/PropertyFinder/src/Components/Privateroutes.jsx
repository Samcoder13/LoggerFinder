import { Outlet, Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Privateroutes = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default Privateroutes;
