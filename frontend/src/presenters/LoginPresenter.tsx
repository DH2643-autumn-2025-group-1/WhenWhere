import { useLocation } from "react-router";
import { Login } from "../views/Login.tsx";

export function LoginPresenter() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const callbackUrl = params.get("callbackUrl") || "";

  const userArrivedViaLink =
    callbackUrl.includes("event-result") ||
    callbackUrl.includes("availability");

  return <Login userArrivedViaLink={userArrivedViaLink} />;
}
