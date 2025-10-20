import styled from "styled-components";
import EventIcon from "@mui/icons-material/Event";
import { Card, CardHeader, IconWrapper, Title } from "./StyledComponents";

const StyledEventCard = styled(Card)`
  width: 100%;
  gap: ${(props) => props.theme.spacing.small};
`;

const EventDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.medium};
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
`;

export function EventDetailsCard({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <StyledEventCard>
      <CardHeader>
        <IconWrapper>
          <EventIcon />
        </IconWrapper>
        <Title>{title}</Title>
      </CardHeader>
      {description && <EventDescription>{description}</EventDescription>}
    </StyledEventCard>
  );
}
