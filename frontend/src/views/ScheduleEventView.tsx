import { TextField, Button, Typography, IconButton } from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styled from "styled-components";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dayjs } from "dayjs";
import { Location } from "./Location";

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4rem;
  gap: 6rem;
`;

const Form = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const PlaceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const CalendarWrapper = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    background-color: #89cff0;
  }
`;

export function ScheduleEventView() {
  const [places, setPlaces] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

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
        />
        <TextField
          label="Event Description (Optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
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
                  ? handlePlaceChange(index, value?.toString())
                  : console.error("No place selected")
              }
            />
            <IconButton
              aria-label="remove place"
              onClick={() => handleRemovePlace(index)}
            >
              <CloseIcon />
            </IconButton>
          </PlaceContainer>
        ))}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleAddPlace}
          style={{ margin: "1rem 0" }}
        >
          + Add Place
        </Button>
        <SubmitButton fullWidth>Submit</SubmitButton>
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
    </Container>
  );
}
