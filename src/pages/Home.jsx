import { Box, Button, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import aiAnimation from '../assets/lottie/login.json'; // replace with any other if needed

const features = [
  {
    title: 'AI-Powered Summarization',
    desc: 'Instantly summarize meetings with precision using advanced AI algorithms.'
  },
  {
    title: 'Full Transcription',
    desc: 'Accurate, real-time transcription of your meetings with keyword highlighting.'
  },
  {
    title: 'Minutes of Meeting (MoM)',
    desc: 'Auto-generate professional and actionable MoM for every meeting.'
  },
  {
    title: 'AI Assistant Chat',
    desc: 'Interact with an AI chatbot to ask questions about your meetings.'
  },
  {
    title: 'Smart Calendar View',
    desc: 'Visualize, create, and track meetings easily in a calendar interface.'
  },
  {
    title: 'Secure Library & Archive',
    desc: 'All meeting data is securely stored and available anytime.'
  }
];

export default function Home() {
  const { userData } = useSelector((state) => state.auth);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Hero Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Welcome to SyncAgenda
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Your AI assistant for smart, streamlined meetings. Let SyncAgenda do the heavy lifting while you focus on what matters.
              </Typography>

            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Lottie animationData={aiAnimation} loop style={{ maxHeight: 300 }} />
            </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* <Typography variant="h4" fontWeight={600} textAlign="center" gutterBottom>
          What SyncAgenda Offers
        </Typography> */}
        <Grid container spacing={8} mt={2} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {features.map((feature, idx) => (
            <Grid item size={6} key={idx}>
              <Paper elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                  },
                  textAlign: 'center'
                }}>


                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Box flexGrow={1}>
                  <Typography color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
