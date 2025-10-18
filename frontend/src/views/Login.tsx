import styled from "styled-components";
import AuthPage from "../components/utils/authPage";

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

const Title = styled.h1`
  all: unset;
  font-size: 42px;
  font-weight: bold;
`;

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

export function Login({ userArrivedViaLink }: { userArrivedViaLink: boolean }) {
  return (
    <Container>
      <TitleAndText>
        <Title>WhenWhere</Title>
        <Text>
          {userArrivedViaLink
            ? `You have been invited to an event. Login to mark your availability and vote for a location.`
            : `
          Welcome to WhenWhere! Please login to create events, mark your 
          availability, vote for event locations and share a link of the event to your friends or colleagues.`}
        </Text>
      </TitleAndText>
      <AuthPage />
    </Container>
  );
}
