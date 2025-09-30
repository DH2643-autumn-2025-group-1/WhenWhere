import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  gap: 48px;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    gap: 96px;
    padding: 96px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
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

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 80%;
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

const LoginComponent = styled.div`
  height: 400px;
  width: 100%;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 80%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    max-width: 100%;
  }
`;

export function Login() {
  return (
    <Container>
      <TitleAndText>
        <Title>WhenWhere</Title>
        <Text>
          You have been invited to a meeting. Login to mark your availibility to
          the meeting and vote for place of the meeting. Also, you can create
          your own events and send a link invite to your friends or colleagues.
        </Text>
      </TitleAndText>
      <LoginComponent>login component</LoginComponent>
    </Container>
  );
}
