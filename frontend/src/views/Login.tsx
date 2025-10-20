import styled from "styled-components";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Typography, Link } from "@mui/material";
import {
  StyledTitle,
  StyledSubtitle,
  StyledButton,
} from "../styles/authStyles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xlarge};
  gap: 48px;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    gap: 96px;
    padding: 96px;
    flex-direction: row;
    align-items: flex-start;
  }
`;

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

type AuthMode = "signin" | "signup";

const TitleAndText = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: ${(props) => props.theme.spacing.medium};
  padding: 0 16px;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 40%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    gap: ${(props) => props.theme.spacing.xlarge};
    max-width: 40%;
  }
`;

const Text = styled.p`
  all: unset;
  font-size: 18px;
`;

const Logo = styled.img`
  height: 48px;
  width: auto;
  object-fit: contain;
  max-width: 100%;
  align-self: flex-start;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
  margin-left: 4px;
  align-self: flex-start;
`;

export function Login({
  userArrivedViaLink,
  mode,
  setMode,
  providers,
  signIn,
}: {
  userArrivedViaLink: boolean;
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  providers: { id: string; name: string }[];
  signIn: (
    provider: { id: string },
    formData: FormData | null,
  ) => Promise<object | { error: string }>;
}) {
  const isSignUpMode = mode === "signup";

  return (
    <Container>
      <TitleAndText>
        <Logo
          src="/WhenWhere-logo-transparent-black-shaved.png"
          alt="WhenWhere"
        />
        <Text>
          {userArrivedViaLink
            ? `You have been invited to an event. Login to mark your availability and vote for a location.`
            : `
          Welcome to WhenWhere! Please login to create events, mark your 
          availability, vote for event locations and share a link of the event to your friends or colleagues.`}
        </Text>
      </TitleAndText>
      <div style={{ position: "relative" }}>
        <SignInPage
          sx={{ minHeight: 0 }}
          providers={providers}
          signIn={signIn}
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
    </Container>
  );
}
