import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Snackbar,
  Alert,
  AlertPropsColorOverrides,
  AlertColor
} from '@mui/material';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetMeetingsByDateQuery, useDeleteMeetingMutation, useCreateMeetingMutation } from '../api/calendar';
import CreateMeetingDialog from '../component/CreateMeetingDialog';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EventDetails from '../component/EventDetails';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { userData } = useSelector((state) => state.auth);

  const onView = useCallback((newView) => setView(newView), [setView])

  const [alertSeverity, setAlertSeverity] = useState<AlertColor | AlertPropsColorOverrides | undefined>(undefined);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const snackbarControls = {
    setAlertSeverity,
    setSnackbarMsg,
    setSnackbarOpen,
  };


  const {
    data: meetings = [],
    isLoading: isGetMeetingByDateLoading,
    isError: isGetMeetingByDateError,
    refetch
  } = useGetMeetingsByDateQuery(moment().format('YYYY-MM-DD'));

  const [deleteMeeting] = useDeleteMeetingMutation();

  const [createMeeting] = useCreateMeetingMutation(); //function use to reate meetings

  useEffect(() => {
    // executes just after fetching all meeting details
    if (meetings?.length > 0) {
      const mapped = meetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.meeting_name,
        start: new Date(meeting.meeting_date),
        end: moment(meeting.meeting_date).add(1, 'hour').toDate(),
        allDay: false,
        meeting_data: meeting

      }));
      setEvents(mapped);
    }
  }, [meetings]);

  useEffect(() => {

    if (isGetMeetingByDateError) {
      setAlertSeverity('error')
      setSnackbarMsg('Failed to fetch events')
      setSnackbarOpen(true)
    }
  }, [isGetMeetingByDateLoading, isGetMeetingByDateError])



  const handleCreateMeeting = async (meetingData) => {
    try {
      console.log(meetingData)
      const payload = await createMeeting(meetingData).unwrap()
      refetch()
      setSnackbarMsg(payload.message)
      setAlertSeverity('success')
      setOpenDialog(false)
    } catch (error) {
      setSnackbarMsg("Fail to create meeting")
      setAlertSeverity("error")
    } finally {
      setSnackbarOpen(true);

    }
  }


  const handleDelete = async () => {
    // Placeholder: Add actual delete meeting logic here
    alert(`Delete meeting with ID: ${selectedEvent.id}`);
    try {
      const payload = await deleteMeeting(selectedEvent.id).unwrap();
      refetch()
      console.log("payload", payload)
      setSnackbarMsg(payload.detail)
      setSelectedEvent(null);
    } catch (error) {
      setSnackbarMsg(error?.data.detail)
    } finally {
      setSnackbarOpen(true);
    }

  };



  return (
    <Box sx={{ p: 2, height: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Left side: Title */}
        <Typography variant="h5">Calendar</Typography>

        {/* Right side: Buttons */}
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={refetch}>
            {isGetMeetingByDateLoading ? <CircularProgress color="primary.contrastText" size={20} /> : "Refresh"}
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            {isGetMeetingByDateLoading ? <CircularProgress color="primary.contrastText" size={20} /> : "Create Meeting"}
          </Button>
        </Box>
      </Box>


      <Paper elevation={3} sx={{ height: 'calc(100% - 64px)', p: 2 }}>
        {isGetMeetingByDateLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
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
            onView={onView}
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
          onSubmit={handleCreateMeeting}


        />
      </Dialog>

      {/* Event Detail Dialog */}
      {/* <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
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
      </Dialog> */}



      <EventDetails
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDelete}
        refetch={refetch}
        {...snackbarControls}
      />
      {/* NOTIFICATION */}
      {/* <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
      >
        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>



    </Box>
  );
}
