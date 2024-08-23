import React, { useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function MeetingList({ meetings, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMeeting, setCurrentMeeting] = useState("");

  const handleMenuClick = (event, meeting) => {
    setAnchorEl(event.currentTarget);
    setCurrentMeeting(meeting);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMeeting(null);
  };

  const handleCopyUrl = () => {
    if (currentMeeting && currentMeeting.join_url) {
      navigator.clipboard.writeText(currentMeeting.join_url);
      handleMenuClose();
      alert("Meeting URL copied to clipboard!");
    }
  };

  return (
    <Grid container spacing={2}>
      {meetings.map((meeting, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Paper elevation={3} sx={{ padding: 2, position: "relative" }}>
            <IconButton
              aria-label="more"
              onClick={(event) => handleMenuClick(event, meeting)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" component="h5">
                {meeting.topic || "No Title"}
              </Typography>
              <Typography variant="body2" component="p">
                {new Date(meeting.start_time).toLocaleString()}
              </Typography>
              <Typography variant="body2" component="p">
                {meeting.agenda || "No Agenda"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 1,
                }}
              ></Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 1,
                }}
              >
                <Button
                  variant="contained"
                  href={meeting.join_url}
                  target="_blank"
                >
                  Join Meeting
                </Button>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(meeting.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCopyUrl}>Copy URL</MenuItem>
      </Menu>
    </Grid>
  );
}

export default MeetingList;