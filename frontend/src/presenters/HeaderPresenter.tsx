import { useNavigate, useLocation } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import { HeaderView } from "../views/Header";
import { observer } from "mobx-react-lite";
import type { EventModelType } from "../models/EventModel";

export const HeaderPresenter = observer(
  ({ model }: Readonly<{ model: EventModelType }>) => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const isAuthenticated = !!model.userId;

    const isSignInRoute = location.pathname === "/sign-in";
    const showAuthButton = !isSignInRoute;

    const handleTitleClick = () => navigate("/");

    const handleAuthButtonClick = async () => {
      if (isAuthenticated) {
        await signOut(auth);
      } else {
        navigate("/sign-in");
      }
    };

    const handleCreateEventClick = () => navigate("/create-event");

    return (
      <HeaderView
        isAuthenticated={isAuthenticated}
        onTitleClick={handleTitleClick}
        onAuthButtonClick={handleAuthButtonClick}
        onCreateEventClick={handleCreateEventClick}
        onAboutButtonClick={() => navigate("/about")}
        showAuthButton={showAuthButton}
      />
    );
  },
);
