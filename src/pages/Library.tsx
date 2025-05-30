import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  useGetMeetingsByDateQuery,
  useGetMeetingDetailsQuery,
  useCreateMeetingMutation,
  useDeleteMeetingMutation
} from '../api/calendar';
import {
  Box, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Snackbar,
  Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RefreshIcon from '@mui/icons-material/Refresh';
import MeetingDetails from '../component/MeetingDetails';
import CreateMeetingDialog from '../component/CreateMeetingDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQuery, useTheme } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import 'dayjs/locale/en-gb';
import MeetingChatBot from '../component/MeetingChatBot';
import MeetingPlaceholder from '../component/MeetingPlaceholder';

export default function Library() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const formattedDate = selectedDate.format('YYYY-MM-DD');

  // const [openDialog, setOpenDialog] = useState(false);// meeting dialog
  type AlertSeverity = 'error' | 'info' | 'success' | 'warning' | undefined;
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>(undefined);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const snackbarControls = {
    setAlertSeverity,
    setSnackbarMsg,
    setSnackbarOpen,
  };


  // Inside the component (before return)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    data: meetings = [],
    isLoading,
    isError,
    error,
    refetch
  } = useGetMeetingsByDateQuery(formattedDate);

  useEffect(() => {
    console.log("Meeting respon:", meetings)
    if (isError) console.error('API Error:', error);
    if (!isLoading && meetings.length === 0) {
      console.warn('No meetings returned for:', formattedDate);
    }
  }, [isLoading, isError, meetings]);

  const { data: meetingDetails, isLoading: meetingDetailsLoading } = useGetMeetingDetailsQuery(selectedMeetingId, {
    skip: !selectedMeetingId,
  });

  //handling create meeting
  const [createMeeting, { isLoading: isLoadingCreateMeeting, isSuccess, error: errorCreateMeeting }] = useCreateMeetingMutation();

  const handleCreateMeeting = async (meetingData) => {
    try {
      const response = await createMeeting(meetingData).unwrap(); // unwrap gives you the result or throws
      console.log('Meeting created:', response);
      // Optionally, refetch list or show success message here
    } catch (err) {
      console.error('Failed to create meeting:', err);
    }
  };

  // #meeting delete route
  const [deleteMeeting, { isLoading: isDeleting }] = useDeleteMeetingMutation();
  const handleMeetingDelete = async (params) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(params.meetingId).unwrap();
        setSelectedMeetingId(null);
        setAlertSeverity("success")
        setSnackbarMsg("Meeting deleted successfully")
        setSnackbarOpen(true)
        // if (onDeleted) onDeleted(); // callback to refresh list or navigate
      } catch (err) {
        console.error('Delete failed:', err);
        setAlertSeverity("error")
        setSnackbarMsg("Meeting deletion failed")
        setSnackbarOpen(true)
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <Box display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        height="100vh"
        padding={1}
        gap={2}>
        {/* Left Panel Start*/}
        <Box width={isSmallScreen ? '100%' : '20%'}
          display="flex"
          flexDirection="column"
          gap={2}>
          

          <Paper elevation={3} style={{ flexGrow: 1, overflowY: 'auto', padding: 16 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">

              <Typography variant="h6">Meetings </Typography>
              <IconButton
                // variant="outlined"
                // startIcon={<RefreshIcon />}
                onClick={() => refetch()}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : isError ? (
              <Typography color="error">Failed to load meetings</Typography>
            ) : (
              <List>
                {meetings.length === 0 && (
                  <Typography>No meetings scheduled.</Typography>
                )}
                {meetings.map((meeting) => (
                  <ListItem
                    // button
                    key={meeting.id}
                    onClick={() => {

                      setSelectedMeetingId(meeting.id)
                    }}
                    selected={selectedMeetingId === meeting.id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleMeetingDelete({ meetingId: meeting.id })}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: selectedMeetingId === meeting.id ? 'primary.main' : 'background.paper',
                      // backgroundColor: selectedMeetingId === meeting.id ? 'primary.light' : 'transparent',
                      // color: selectedMeetingId === meeting.id ? 'primary.contrastText' : 'inherit',
                      transition: 'all 0.2s ease-in-out',
                      // '&:hover': {
                      //   backgroundColor: selectedMeetingId === meeting.id ? 'primary.light' : 'action.hover'
                      // }
                    }}
                  >
                    <ListItemText primary={meeting.meeting_name} secondary={new Date(meeting.meeting_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />

                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
        {/* Left Panel End*/}

        {/* Right Panel Start*/}
        <Box flexGrow={1} width={'80%'}>


          {!selectedMeetingId ? (
            <MeetingPlaceholder />
          ) : meetingDetails ? (

            <Box flexGrow={1} display="flex"
              flexDirection={isSmallScreen ? 'column' : 'row'}
              padding={1} gap={2}>
              <Box width={isSmallScreen ? '100%' : '60%'}>
                <MeetingDetails meetingDetails={meetingDetails} setSelectedMeetingId={setSelectedMeetingId} onDeleteMeeting={handleMeetingDelete} {...snackbarControls} />
              </Box>
              <Box width={isSmallScreen ? '100%' : '40%'}>
                <MeetingChatBot meetingID={selectedMeetingId} {...snackbarControls} />
              </Box>
            </Box>
          ) : (
            // <Typography>Loading meeting details...</Typography>
            <CircularProgress />
          )}

        </Box>
        {/* Left Panel End*/}


      </Box>

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
    </LocalizationProvider>
  );
}
