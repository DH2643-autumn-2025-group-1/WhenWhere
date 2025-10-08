import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { HeaderView } from "../views/Header";

export function HeaderPresenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleTitleClick = () => navigate("/");

  const handleAuthButtonClick = async () => {
    if (user) {
      await signOut(auth);
    } else {
      navigate("/sign-in");
    }
  };

  const handleCreateEventClick = () => navigate("/create-event");

  return (
    <HeaderView
      user={user}
      onTitleClick={handleTitleClick}
      onAuthButtonClick={handleAuthButtonClick}
      onCreateEventClick={handleCreateEventClick}
    />
  );
}
