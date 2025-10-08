import { useLocation, useNavigate } from "react-router";
import { HeaderView } from "../views/Header";

export function HeaderPresenter() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTitleClick = () => navigate("/");
  const handleLoginClick = () => navigate("/login");

  return (
    <HeaderView
      onTitleClick={handleTitleClick}
      onLoginClick={handleLoginClick}
      isLoginActive={location.pathname === "/login"}
    />
  );
}
