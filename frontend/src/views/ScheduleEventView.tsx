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
import { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Dayjs } from "dayjs";
import {
  EventPresenter,
  type EventFormData,
} from "../presenters/ScheduleEventPresenter";
import { useNavigate } from "react-router";

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
  gap: 0.5rem;
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

export function ScheduleEventView() {
  const [places, setPlaces] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const [presenter] = useState(
    () =>
      new EventPresenter(
        () => {
          setSnackbar({
            open: true,
            message: "Event created successfully!",
            severity: "success",
          });
          setTitle("");
          setDescription("");
          setPlaces([]);
          setSelectedDates([]);
        },
        (error) => {
          setSnackbar({ open: true, message: error, severity: "error" });
        },
      ),
  );

  const handleAddPlace = () => {
    setPlaces([...places, ""]);
  };

  const handlePlaceChange = (index: number, value: string) => {
    const updatedPlaces = [...places];
    updatedPlaces[index] = value;
    setPlaces(updatedPlaces);
  };

  const handleRemovePlace = (index: number) => {
    const updatedPlaces = places.filter((_, i) => i !== index);
    setPlaces(updatedPlaces);
  };

  const handleDateClick = (date: Dayjs | null) => {
    if (!date) return;
    const isSelected = selectedDates.some((d) => d.isSame(date, "day"));

    if (isSelected) {
      setSelectedDates(selectedDates.filter((d) => !d.isSame(date, "day")));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData: EventFormData = {
        title,
        description,
        places,
        selectedDates: selectedDates.map((date) => date.toDate()),
      };

      // placeholder för tillfället
      const creatorId = "user123";

      await presenter.createEvent(formData, creatorId);
      navigate("/");
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
          onChange={(e) => setTitle(e.target.value)}
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
          onChange={(e) => setDescription(e.target.value)}
        />
        <Typography variant="h6" gutterBottom>
          Places
        </Typography>
        {places.map((place, index) => (
          <PlaceContainer key={index}>
            <TextField
              label={`Place ${index + 1}`}
              variant="outlined"
              fullWidth
              margin="normal"
              value={place}
              onChange={(e) => handlePlaceChange(index, e.target.value)}
            />
            <IconButton
              aria-label="remove place"
              onClick={() => handleRemovePlace(index)}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </PlaceContainer>
        ))}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleAddPlace}
          style={{ marginBottom: "1rem" }}
        >
          + Add Place
        </Button>
        <SubmitButton fullWidth onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Event..." : "Submit"}
        </SubmitButton>
      </Form>
      <CalendarWrapper>
        <Typography variant="h6" gutterBottom>
          Select Potential Dates
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={(date) => handleDateClick(date)}
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <LargeAlert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </LargeAlert>
      </Snackbar>
    </Container>
  );
}
