import * as React from "react";
import { Typography, Link } from "@mui/material";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate, useSearchParams } from "react-router";
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
  const [, /* loading */ setLoading] = React.useState(false);
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
    setLoading(true);
    try {
      let user = null;
      const email = formData?.get("email") as string;
      const password = formData?.get("password") as string;

      if (isSignUpMode) {
        if (!email || !password) {
          return { error: "Email and password are required" };
        }
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
            if (!email || !password) {
              return { error: "Email and password are required" };
            }
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
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setLoading(false);
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
