import React from "react";
import { Navigate, useLocation } from "react-router";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null | undefined>(undefined);
  const location = useLocation();

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
      },
    );
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return null;
  }

  if (!user) {
    const fullPath =
      location.pathname + (location.search || "") + (location.hash || "");
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(fullPath)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
