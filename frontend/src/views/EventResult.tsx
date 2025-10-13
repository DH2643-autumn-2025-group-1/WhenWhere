import styled from "styled-components";
import TextBoxWithActions from "../components/TextBoxWithActions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Panel = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;
  max-width: 600px;
  gap: ${(props) => props.theme.spacing.medium};
`;

export interface EventResultViewProps {
  eventTitle: string;
  shareUrl?: string;
}

export function EventResultView({
  eventTitle,
  shareUrl,
}: EventResultViewProps) {
  return (
    <Container>
      <Panel>
        <h2 style={{ margin: 0 }}>Results for: {eventTitle}</h2>
        {shareUrl && (
          <div style={{ maxWidth: 600 }}>
            <TextBoxWithActions
              title="Shareable voting link"
              value={shareUrl}
            />
          </div>
        )}
        {/* TODO: Add detailed results UI here */}
      </Panel>
    </Container>
  );
}
