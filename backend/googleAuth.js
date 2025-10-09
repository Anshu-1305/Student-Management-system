const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const createMeetEvent = async (accessToken, eventData) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const event = {
    summary: eventData.title,
    description: eventData.description,
    start: {
      dateTime: new Date(`${eventData.date}T${eventData.time}`).toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(new Date(`${eventData.date}T${eventData.time}`).getTime() + eventData.duration * 60000).toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    attendees: eventData.attendees || []
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });

  return {
    eventId: response.data.id,
    meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink
  };
};

module.exports = { createMeetEvent, oauth2Client };