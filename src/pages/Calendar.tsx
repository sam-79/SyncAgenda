import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetMeetingsByDateQuery } from '../api/calendar';
import CreateMeetingDialog from '../component/CreateMeetingDialog';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { userData } = useSelector((state) => state.auth);

  const {
    data: meetings = [],
    isLoading,
    isError,
    refetch
  } = useGetMeetingsByDateQuery(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    if (meetings?.length > 0) {
      const mapped = meetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.meeting_name,
        start: new Date(meeting.meeting_date),
        end: moment(meeting.meeting_date).add(1, 'hour').toDate(),
        allDay: false,
        description: meeting.meeting_description,
        participants: meeting.participants
      }));
      setEvents(mapped);
    }
  }, [meetings]);

  const handleDelete = () => {
    // Placeholder: Add actual delete logic here
    alert(`Delete meeting with ID: ${selectedEvent.id}`);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ p: 2, height: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Calendar</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Create Meeting
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: 'calc(100% - 64px)', p: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Failed to load events.</Typography>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView={view}
            view={view}
            onView={(newView) => setView(newView)}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <CreateMeetingDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={() => {
            setOpenDialog(false);
            refetch();
          }}
        />
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <Box>
                <Typography variant="h5" fontWeight={600}>{selectedEvent.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
                </Typography>
              </Box>
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" gutterBottom>
                {selectedEvent.description}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Participants:
              </Typography>
              {selectedEvent.participants?.map((p, idx) => (
                <Typography key={idx} variant="body2">
                  - {p.name} ({p.email})
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>


    </Box>
  );
}
