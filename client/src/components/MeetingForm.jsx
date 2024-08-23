import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Grid, IconButton } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

dayjs.extend(utc);
dayjs.extend(timezone);

function MeetingForm({ onAddMeeting }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60); // meeting defaulted to 60 minutes
  const [tz, setTz] = useState("UTC");
  const [registrants, setRegistrants] = useState([{ email: "", firstName: "", lastName: "" }]);

  const handleAddRegistrant = () => {
    setRegistrants([...registrants, { email: "", firstName: "", lastName: "" }]);
  };

  const handleRemoveRegistrant = (index) => {
    const newRegistrants = registrants.filter((_, i) => i !== index);
    setRegistrants(newRegistrants);
  };

  const handleRegistrantChange = (index, field, value) => {
    const newRegistrants = [...registrants];
    newRegistrants[index][field] = value;
    setRegistrants(newRegistrants);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title && date && time && tz && duration && registrants.length > 0) {
      // Combine date and time, then convert it to UTC based on the selected time zone
      const localDateTime = dayjs(`${date}T${time}`).tz(tz);
      const utcDateTime = localDateTime.utc().format();

      const response = await fetch('/api/createMeeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: title,
          start_time: utcDateTime,
          type: 2,
          duration: duration,
          timezone: tz,
          agenda: 'Meeting agenda',
          registrants: registrants.filter(registrant => registrant.email !== ""), // Pass the registrants list to the API
        }),
      });

      const newMeeting = await response.json();
      console.log('New Meeting: ', newMeeting);
      onAddMeeting(newMeeting);  // Add the new meeting to the list
      setTitle("");
      setDate("");
      setTime("");
      setDuration(60);
      setTz("UTC");
      setRegistrants([{ email: "", firstName: "", lastName: "" }]); // Clear the registrants input fields
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Meeting Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Date"
        type="date"
        variant="outlined"
        fullWidth
        margin="normal"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Time"
        type="time"
        variant="outlined"
        fullWidth
        margin="normal"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Time Zone</InputLabel>
            <Select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              label="Time Zone"
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">America/New York (Eastern)</MenuItem>
              <MenuItem value="America/Chicago">America/Chicago (Central)</MenuItem>
              <MenuItem value="America/Denver">America/Denver (Mountain)</MenuItem>
              <MenuItem value="America/Los_Angeles">America/Los Angeles (Pacific)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Duration (minutes)"
            type="number"
            variant="outlined"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box marginTop={2}>
        <h4>Registrants</h4>
        {registrants.map((registrant, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={4}>
              <TextField
                label={`Email ${index + 1}`}
                variant="outlined"
                fullWidth
                value={registrant.email}
                onChange={(e) => handleRegistrantChange(index, "email", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={registrant.firstName}
                onChange={(e) => handleRegistrantChange(index, "firstName", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={registrant.lastName}
                onChange={(e) => handleRegistrantChange(index, "lastName", e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleRemoveRegistrant(index)}>
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button onClick={handleAddRegistrant} variant="outlined" color="primary" startIcon={<AddIcon />}>
          Add Registrant
        </Button>
      </Box>
      <Box marginTop={2}>
        <Button type="submit" variant="contained" color="primary">
          Add Meeting
        </Button>
      </Box>
    </form>
  );
}

export default MeetingForm;
