import styled from "styled-components";
import { Title } from "../components/StyledComponents";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xlarge};
  padding: ${(props) => props.theme.spacing.xlarge};
  width: 100%;
  align-items: center;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: ${(props) => props.theme.spacing.medium};
  max-width: 900px;
`;

const StepTitle = styled.h3`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.medium};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSizes.large};
`;

export function About() {
  return (
    <Container>
      <Title>About WhenWhere</Title>
      <StepsContainer>
        <StepTitle>How to create an event:</StepTitle>
        <span>
          Click on create event, either in the navbar or on the home page. Fill
          in the title and description of your event, then choose possible dates
          and locations. Your friends will vote on these options later. Finally,
          share the invite link with your friends! When submitting the event,
          you will see the result page of the event.
        </span>
        <StepTitle>The result page:</StepTitle>
        <span>
          On the result page, you will see the location with the most votes and
          the three most voted times. If mutliple time slots have the same
          number of votes, the earliest ones are chosen. You can also see the
          calender view of all votes, together with the location votes. You can
          access the invite link here as well.
        </span>
        <StepTitle>Have gotten an invite link?</StepTitle>
        <span>
          If you have received an invite link, click on it or copy/paste it in
          you browser to access the voting page. First you will have to login,
          if you have not already. Then you can vote on the proposed dates and
          locations.
        </span>
        <StepTitle>Access events:</StepTitle>
        <span>
          You can access all your created events and the events you are invited
          to from the homepage, accessible from the app logo in the navbar.
        </span>
      </StepsContainer>
    </Container>
  );
}
