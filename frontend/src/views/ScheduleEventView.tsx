import {
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styled from "styled-components";
import type { ScheduleEventViewProps } from "../presenters/EventPresenter.tsx";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Location } from "./Location.tsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.xlarge};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Form = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 400px;
  }
`;

const PlaceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const CalendarWrapper = styled.div`
  background-color: white;
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    background-color: #89cff0;
  }
`;

const LargeAlert = styled(Alert)`
  min-width: 450px !important;
  font-size: 16px;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  .MuiAlert-message {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
  }

  .MuiAlert-icon {
    font-size: 24px;
  }

  .MuiAlert-action {
    padding-left: 16px;
  }
`;

export function ScheduleEventView({
  places,
  selectedDates,
  title,
  description,
  isSubmitting,
  snackbar,
  onAddPlace,
  onRemovePlace,
  onDateClick,
  onPlaceChange,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onCloseSnackbar,
}: ScheduleEventViewProps) {
  return (
    <Container>
      <Form>
        <Typography variant="h4" gutterBottom>
          Schedule an Event
        </Typography>
        <TextField
          label="Event Title"
          variant="outlined"
          fullWidth
          margin="normal"
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
          margin="normal"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <Typography variant="h6" gutterBottom>
          Places
        </Typography>
        {places.map((place, index) => (
          <PlaceContainer key={index}>
            <Location
              value={place}
              label={`Place ${index + 1}`}
              onSelectFuntion={(value) =>
                value
                  ? onPlaceChange(index, value?.toString())
                  : console.error("No place selected")
              }
            />
            <IconButton
              aria-label="remove place"
              onClick={() => onRemovePlace(index)}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </PlaceContainer>
        ))}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onAddPlace}
          style={{ marginBottom: "1rem" }}
        >
          + Add Place
        </Button>
        <SubmitButton fullWidth onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Event..." : "Submit"}
        </SubmitButton>
      </Form>
      <CalendarWrapper>
        <Typography variant="h6" gutterBottom>
          Select Potential Dates
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={(date) => onDateClick(date)}
            displayWeekNumber
            slots={{
              day: (props) => {
                const date = props.day;
                const isSelected = selectedDates.some((d) =>
                  d.isSame(date, "day"),
                );

                return (
                  <PickersDay
                    {...props}
                    selected={isSelected}
                    sx={{
                      bgcolor: isSelected ? "primary.main" : undefined,
                      color: isSelected ? "white" : undefined,
                      "&:hover": {
                        bgcolor: isSelected ? "primary.dark" : "action.hover",
                      },
                    }}
                  />
                );
              },
            }}
          />
        </LocalizationProvider>
      </CalendarWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={onCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <LargeAlert onClose={onCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </LargeAlert>
      </Snackbar>
    </Container>
  );
}
