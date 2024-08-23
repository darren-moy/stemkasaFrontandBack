const express = require('express');
const router = express.Router();    
const axios = require('axios');
const tokenManager = require('../util/tokenmanager');

// Function to register an attendee to the meeting
async function registerAttendee(accessToken, meetingId, email, firstName, lastName) {
    const registrationUrl = `https://api.zoom.us/v2/meetings/${meetingId}/registrants`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const registrantData = {
      email: email,
      first_name: firstName || '',  
      last_name: lastName || '',   // either inputted or it comes out as guest #x
    };
  
    try {
      const response = await axios.post(registrationUrl, registrantData, { headers });
      return response.data;
    } catch (error) {
      console.error('Failed to register attendee:', error.response ? error.response.data : error.message);
      throw error;
    }
}

// API endpoint to create meetings
router.post('/createMeeting', async (req, res) => {
    const { topic, start_time, type, duration, timezone, agenda, registrants } = req.body;

    try {
        const token = await tokenManager.getToken();

        // Request to Zoom API to create a meeting
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic,
            type,
            start_time,
            duration,
            timezone,
            agenda,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                watermark: false,
                use_pmi: false,
                approval_type: 0,
                audio: 'both',
                auto_recording: 'cloud',
                registrants_confirmation_email: true,
                registrants_email_notification: true
            },
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const meeting = response.data;

        console.log('New Meeting Created:', meeting); // for code development 

        const registrantsResponses = [];
        let guestCounter = 1;

        for (const { email, firstName, lastName } of registrants) {
            try {
                const registrantFirstName = firstName || `Guest`;
                const registrantLastName = lastName || `#${guestCounter}`;
                const registrantResponse = await registerAttendee(token, meeting.id, email, registrantFirstName, registrantLastName);
                registrantsResponses.push(registrantResponse);
                console.log('Registrant added:', registrantResponse);
                guestCounter++;
            } catch (error) {
                console.error(`Failed to register ${email}:`, error.response ? error.response.data : error.message);
            }
        }

        res.json({ meeting, registrants: registrantsResponses });
    } catch (error) {
        console.error('Error creating meeting:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error creating meeting' });
    }
});

// API endpoint to fetch meetings 
router.get('/meetings', async (req, res) => {
    try {
        const token = await tokenManager.getToken();
        console.log('Fetching meetings with token:', token);  
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const meetings = response.data.meetings || [];
        console.log('Meetings response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching meetings', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching meetings' });
    }
});

// API endpoint to delete a meeting
router.delete('/meetings/:id', async (req, res) => {
    const meetingId = req.params.id;

    try {
        const token = await tokenManager.getToken();

        // Request to Zoom API to delete the meeting
        await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting meeting:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error deleting meeting' });
    }
});

module.exports = router;
