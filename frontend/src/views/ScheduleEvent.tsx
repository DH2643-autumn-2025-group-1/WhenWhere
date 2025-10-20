import { TextField, Typography, IconButton, Switch } from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styled from "styled-components";
import type { ScheduleEventProps } from "../presenters/ScheduleEventPresenter.tsx";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ComputerIcon from "@mui/icons-material/Computer";
import { ButtonComponent } from "../components/Button.tsx";
import {
  PageWrapper,
  Container,
  Card,
  CardHeader,
  IconWrapper,
  Title,
  StyledRemoveIcon,
} from "../components/StyledComponents";

const FormCard = styled(Card)`
  gap: ${(props) => props.theme.spacing.medium};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 450px;
  }
`;

const FormCardHeader = styled(CardHeader)`
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
  margin-top: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.small};
  color: #2c3e50;
  font-weight: 600;
`;

const PlaceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.small};
  background: ${(props) => props.theme.colors.secondary};
  border-radius: 6px;
  margin-bottom: ${(props) => props.theme.spacing.medium};
  font-weight: 500;
  color: #2c3e50;
`;

const SwitchLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const StyledPickersDay = styled(PickersDay)<{ $isSelected: boolean }>`
  &&.MuiPickersDay-root {
    background-color: ${(props) =>
      props.$isSelected ? props.theme.colors.primary : "transparent"};
    color: ${(props) => (props.$isSelected ? "white" : "inherit")};

    &:hover {
      background-color: ${(props) =>
        props.$isSelected ? "#357abd" : "rgba(0, 0, 0, 0.04)"};
    }

    &.Mui-disabled {
      color: rgba(0, 0, 0, 0.38);
    }
  }
`;

export function ScheduleEvent({
  places,
  selectedDates,
  title,
  description,
  isSubmitting,
  onAddPlace,
  onRemovePlace,
  onDateClick,
  onPlaceChange,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  setShouldIncludeRemote,
  renderPlaceInput,
}: ScheduleEventProps) {
  return (
    <PageWrapper>
      <Container>
        <FormCard>
          <FormCardHeader>
            <IconWrapper>
              <EventIcon />
            </IconWrapper>
            <Title>Schedule an Event</Title>
          </FormCardHeader>

          <TextField
            label="Event Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
          <TextField
            label="Event Description (Optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />

          <SectionHeader>
            <LocationOnIcon fontSize="small" />
            <Typography variant="h6" style={{ margin: 0 }}>
              Places
            </Typography>
          </SectionHeader>

          <SwitchContainer>
            <SwitchLabel>
              <ComputerIcon fontSize="small" />
              <span>Include "Remote" as a location</span>
            </SwitchLabel>
            <Switch
              onChange={(_, checked) => {
                if (checked) {
                  setShouldIncludeRemote(true);
                } else {
                  setShouldIncludeRemote(false);
                }
              }}
            />
          </SwitchContainer>

          {places.map((place, index) => (
            <PlaceContainer key={index}>
              {renderPlaceInput(place, `Place ${index + 1}`, (value) =>
                value ? onPlaceChange(index, value) : undefined,
              )}
              <IconButton
                aria-label="remove place"
                onClick={() => onRemovePlace(index)}
              >
                <StyledRemoveIcon />
              </IconButton>
            </PlaceContainer>
          ))}

          <ButtonComponent
            onClickFunction={onAddPlace}
            text="+ Add Place"
            variant="outlined"
            disabled={places.length >= 5}
          />
          <ButtonComponent
            variant="primary"
            onClickFunction={onSubmit}
            disabled={isSubmitting}
            text={isSubmitting ? "Creating Event..." : "Submit"}
            fullwidth={true}
          />
        </FormCard>
        <Card>
          <CardHeader>
            <IconWrapper>
              <CalendarMonthIcon />
            </IconWrapper>
            <Title>Select Dates</Title>
          </CardHeader>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              onChange={(date) => {
                onDateClick(date);
              }}
              displayWeekNumber
              slots={{
                day: (props) => {
                  const date = props.day;
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const isPast = date.isBefore(now, "day");
                  const isSelected = selectedDates.some((d) =>
                    d.isSame(date, "day"),
                  );

                  return (
                    <StyledPickersDay
                      {...props}
                      selected={isSelected}
                      disabled={isPast}
                      $isSelected={isSelected}
                    />
                  );
                },
              }}
            />
          </LocalizationProvider>
        </Card>
      </Container>
    </PageWrapper>
  );
}
