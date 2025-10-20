import React from "react";
import { Navigate, useLocation } from "react-router";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

export function ProtectedRoute({
  children,
  fallback,
  signInPath = "/sign-in",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  signInPath?: string;
}) {
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
    return <>{fallback ?? null}</>;
  }

  if (!user) {
    if (location.pathname.startsWith(signInPath)) {
      return <>{children}</>;
    }
    const fullPath =
      location.pathname + (location.search || "") + (location.hash || "");
    const redirectTo = `${signInPath}?callbackUrl=${encodeURIComponent(fullPath)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
