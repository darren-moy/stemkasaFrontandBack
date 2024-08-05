import React, { useState } from "react";
import { Container, Paper, Typography } from "@mui/material";
import Appbar from "./Appbar";
import MeetingForm from "./MeetingForm";
import MeetingList from "./MeetingList";

function App() {
  const [meetings, setMeetings] = useState([]);

  const addMeeting = (meeting) => {
    setMeetings([...meetings, meeting]);
  };

  const deleteMeeting = (index) => {
    setMeetings(meetings.filter((_, i) => i !== index));
  };

  return (
    <>
      <Appbar />
      <Container>
        <Paper style={{ padding: 16, marginBottom: 16 }}>
          <MeetingForm onAddMeeting={addMeeting} />
        </Paper>
        <Typography variant="h6" gutterBottom>
          Scheduled Meetings
        </Typography>
        <MeetingList meetings={meetings} onDelete={deleteMeeting} />
      </Container>
    </>
  );
}

export default App;
