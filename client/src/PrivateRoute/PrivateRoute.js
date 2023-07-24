import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  let token = useSelector((state) => state.user.token);

  return token ? (
    <Outlet />
  ) : (
    (localStorage.clear(), sessionStorage.clear(), (<Navigate to="/" />))
  );
};

export default PrivateRoutes;
