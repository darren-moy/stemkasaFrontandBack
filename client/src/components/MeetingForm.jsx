// MeetingForm.jsx
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { formatTimeTo12Hour } from "./helpers";

function MeetingForm({ onAddMeeting }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title && date && time) {
      const response = await fetch('/api/createMeeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: title,
          start_time: `${date}T${time}`,
          type: 2,
          duration: 60, // Example duration
          timezone: 'UTC',
          agenda: 'Meeting agenda',
          attendees: [{ email: 'example@example.com' }] // Example attendee
        }),
      });

      const newMeeting = await response.json();
      console.log('New Meeting: ', newMeeting);
      onAddMeeting(newMeeting);  // Add the new meeting to the list
      setTitle("");
      setDate("");
      setTime("");
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
      <Button type="submit" variant="contained" color="primary">
        Add Meeting
      </Button>
    </form>
  );
}

export default MeetingForm;
