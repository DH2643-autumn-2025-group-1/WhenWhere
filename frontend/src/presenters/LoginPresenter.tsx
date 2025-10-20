import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { Login } from "../views/Login.tsx";
import { FirebaseError } from "firebase/app";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithAnonymous,
  signIn,
  signUp,
} from "../firebase/firebaseAuth";

type AuthMode = "signin" | "signup";

// Map Firebase auth error codes to messages
function getFriendlyAuthError(error: unknown, isSignUp: boolean): string {
  const fallback = isSignUp
    ? "Failed to sign up. Please try again."
    : "Failed to sign in. Please try again.";

  const code = error instanceof FirebaseError ? error.code : null;

  const messages: Record<string, string> = {
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/popup-blocked": "Popup was blocked by the browser.",
    "auth/cancelled-popup-request": "Sign-in popup was cancelled.",
    "auth/email-already-in-use": "That email is already in use.",
    "auth/weak-password": "Password is too weak.",
    "auth/invalid-email": "Invalid email address.",
  };

  return code && messages[code] ? messages[code] : fallback;
}

export function LoginPresenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const callbackUrl = params.get("callbackUrl") || "";
  const callbackUrlParam = callbackUrl || "/";

  const userArrivedViaLink =
    callbackUrl.includes("event-result") ||
    callbackUrl.includes("availability");

  const [mode, setMode] = React.useState<AuthMode>("signin");
  const isSignUpMode = mode === "signup";

  const providers = isSignUpMode
    ? [{ id: "credentials", name: "Credentials" }]
    : [
        { id: "google", name: "Google" },
        { id: "github", name: "Github" },
        { id: "credentials", name: "Credentials" },
        // { id: "anonymous", name: "a Guest Account" },
      ];

  const handleAuth = async (
    provider: { id: string },
    formData: FormData | null,
  ) => {
    try {
      const email = formData?.get("email") as string;
      const password = formData?.get("password") as string;

      const user = isSignUpMode
        ? await signUp(email, password)
        : await (async () => {
            switch (provider.id) {
              case "google":
                return signInWithGoogle();
              case "github":
                return signInWithGithub();
              case "anonymous":
                return signInWithAnonymous();
              case "credentials":
                return signIn(email, password);
              default:
                throw new Error("Unknown provider");
            }
          })();

      if (user) {
        navigate(callbackUrlParam, { replace: true });
        return {};
      }
      return {
        error: isSignUpMode ? "Failed to sign up" : "Failed to sign in",
      };
    } catch (error: unknown) {
      return {
        error: getFriendlyAuthError(error, isSignUpMode),
      };
    }
  };

  return (
    <Login
      userArrivedViaLink={userArrivedViaLink}
      mode={mode}
      setMode={setMode}
      providers={providers}
      signIn={handleAuth}
    />
  );
}
