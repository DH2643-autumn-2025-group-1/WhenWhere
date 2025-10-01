import * as React from "react";
import { Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Link, useNavigate } from "react-router";
import { signUp } from "../../firebase/firebaseAuth";
import {
  StyledTitle,
  StyledSubtitle,
  StyledButton,
} from "../../styles/authStyles";

function SignUpLink() {
  return (
    <Typography variant="subtitle2" color="text.primary">
      <Link to="/SignIn">Already have an account? Sign in</Link>
    </Typography>
  );
}

function Title() {
  return <StyledTitle variant="h5">Sign Up</StyledTitle>;
}

function Subtitle() {
  return (
    <StyledSubtitle variant="body2">
      Sign up to access all features
    </StyledSubtitle>
  );
}

function CustomButton() {
  return (
    <StyledButton type="submit" variant="outlined" color="inherit" fullWidth>
      Sign Up With Credentials
    </StyledButton>
  );
}

export default function SignUpView() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  return (
    <div style={{ position: "relative" }}>
      {loading && <LinearProgress />}
      <SignInPage
        providers={[{ id: "credentials", name: "Credentials" }]}
        signIn={async (provider, formData, callbackUrl) => {
          setLoading(true);
          try {
            if (provider.id === "credentials") {
              const email = formData?.get("email") as string;
              const password = formData?.get("password") as string;
              if (!email || !password) {
                return { error: "Email and password are required" };
              }

              const user = await signUp(email, password);

              if (user) {
                const token = await user.getIdToken();
                localStorage.setItem("token", token); // save token here ?????
                navigate(callbackUrl || "/", { replace: true });
                return {};
              }
            }
            return { error: "Failed to sign up" };
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
