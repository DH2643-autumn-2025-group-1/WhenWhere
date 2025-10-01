import * as React from "react";
import { Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Link, useNavigate } from "react-router";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithAnonymous,
  signIn,
} from "../../firebase/firebaseAuth";
import {
  StyledTitle,
  StyledSubtitle,
  StyledButton,
} from "../../styles/authStyles";

function SignUpLink() {
  return (
    <Typography variant="subtitle2" color="text.primary">
      <Link to="/SignUp">Don't have an account? Sign up</Link>
    </Typography>
  );
}

function Title() {
  return <StyledTitle variant="h5">Sign In</StyledTitle>;
}

function Subtitle() {
  return <StyledSubtitle variant="body2">Sign in to continue</StyledSubtitle>;
}

function CustomButton() {
  return (
    <StyledButton type="submit" variant="outlined" color="inherit" fullWidth>
      Sign In With Credentials
    </StyledButton>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  return (
    <div style={{ position: "relative" }}>
      {loading && <LinearProgress />}
      <SignInPage
        providers={[
          { id: "google", name: "Google" },
          { id: "github", name: "Github" },
          { id: "credentials", name: "Credentials" },
          { id: "anonymous", name: "a Guest Account" },
        ]}
        signIn={async (provider, formData, callbackUrl) => {
          setLoading(true);
          try {
            let user = null;
            if (provider.id === "google") {
              user = await signInWithGoogle();
            }
            if (provider.id === "github") {
              user = await signInWithGithub();
            }
            if (provider.id === "anonymous") {
              user = await signInWithAnonymous();
            }
            if (provider.id === "credentials") {
              const email = formData?.get("email") as string;
              const password = formData?.get("password") as string;
              if (!email || !password) {
                return { error: "Email and password are required" };
              }
              user = await signIn(email, password);
            }

            if (user) {
              const token = await user.getIdToken();
              localStorage.setItem("token", token); // save token here ?????
              navigate(callbackUrl || "/", { replace: true });
              return {};
            }
            return { error: "Failed to sign in" };
          } catch (error) {
            return {
              error:
                error instanceof Error ? error.message : "An error occurred",
            };
          } finally {
            setLoading(false);
          }
        }}
        slots={{
          title: Title,
          subtitle: Subtitle,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
        }}
      />
    </div>
  );
}
