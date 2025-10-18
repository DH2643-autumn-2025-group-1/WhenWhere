import * as React from "react";
import { Typography, Link } from "@mui/material";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate, useSearchParams } from "react-router";
import { FirebaseError } from "firebase/app";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithAnonymous,
  signIn,
  signUp,
} from "../../firebase/firebaseAuth";
import {
  StyledTitle,
  StyledSubtitle,
  StyledButton,
} from "../../styles/authStyles";

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

const Title = ({ mode }: { mode: AuthMode }) => (
  <StyledTitle variant="h5">
    {mode === "signup" ? "Create an Account" : "Sign In"}
  </StyledTitle>
);

const Subtitle = ({ mode }: { mode: AuthMode }) => (
  <StyledSubtitle variant="body2">
    {mode === "signup"
      ? "Sign up to access all features"
      : "Sign in to continue"}
  </StyledSubtitle>
);

const CustomButton = ({ mode }: { mode: AuthMode }) => (
  <StyledButton type="submit" variant="outlined" color="inherit" fullWidth>
    {mode === "signup"
      ? "Sign Up With Credentials"
      : "Sign In With Credentials"}
  </StyledButton>
);

const ToggleAuthModeLink = ({
  setMode,
}: {
  setMode: (mode: AuthMode) => void;
}) => (
  <Typography variant="subtitle2" color="text.primary" align="center">
    <Link
      component="button"
      variant="body2"
      onClick={() => setMode("signup")}
      underline="hover"
    >
      Don't have an account? Sign up
    </Link>
  </Typography>
);

const ToggleSignInLink = ({
  setMode,
}: {
  setMode: (mode: AuthMode) => void;
}) => (
  <Typography variant="subtitle2" color="text.primary" align="center">
    <Link
      component="button"
      variant="body2"
      onClick={() => setMode("signin")}
      underline="hover"
    >
      Already have an account? Sign in
    </Link>
  </Typography>
);

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [searchParams] = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl") || "/";

  const isSignUpMode = mode === "signup";

  const providers = isSignUpMode
    ? [{ id: "credentials", name: "Credentials" }]
    : [
        { id: "google", name: "Google" },
        { id: "github", name: "Github" },
        { id: "credentials", name: "Credentials" },
        //{ id: "anonymous", name: "a Guest Account" },
      ];

  const handleAuth = async (
    provider: { id: string },
    formData: FormData | null,
  ) => {
    try {
      let user = null;
      const email = formData?.get("email") as string;
      const password = formData?.get("password") as string;

      if (isSignUpMode) {
        user = await signUp(email, password);
      } else {
        switch (provider.id) {
          case "google":
            user = await signInWithGoogle();
            break;
          case "github":
            user = await signInWithGithub();
            break;
          case "anonymous":
            user = await signInWithAnonymous();
            break;
          case "credentials":
            user = await signIn(email, password);
            break;
          default:
            throw new Error("Unknown provider");
        }
      }

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
    <div style={{ position: "relative" }}>
      <SignInPage
        sx={{ minHeight: 0 }}
        providers={providers}
        signIn={handleAuth}
        slots={{
          title: () => <Title mode={mode} />,
          subtitle: () => <Subtitle mode={mode} />,
          submitButton: () => <CustomButton mode={mode} />,
          signUpLink: () =>
            isSignUpMode ? (
              <ToggleSignInLink setMode={setMode} />
            ) : (
              <ToggleAuthModeLink setMode={setMode} />
            ),
        }}
      />
    </div>
  );
}
