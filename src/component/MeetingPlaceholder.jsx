// component/MeetingPlaceholder.jsx
import { Box, Typography } from '@mui/material';

export default function MeetingPlaceholder() {
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
    >
      <img
        src="/syncagenda.png" // Replace with your actual image path
        alt="No Meeting Selected"
        style={{ width: '60%', maxWidth: 300, marginBottom: 24 }}
      />
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          fontFamily: 'Raleway, sans-serif',
          background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        SyncAgenda: Your AI Assistant for All Your Meetings
      </Typography>
    </Box>
  );
}
