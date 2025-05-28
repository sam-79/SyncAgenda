import { Box, Button, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import aiAnimation from '../assets/lottie/login.json'; // replace with any other if needed


const features = [
  {
    title: 'AI-Powered Summarization',
    desc: 'Generate concise summaries of meeting discussions using LLM-powered summarization service.'
  },
  {
    title: 'Automatic Transcription',
    desc: 'Convert audio or video meetings into accurate text transcripts using ASR (Automatic Speech Recognition) microservice.'
  },
  {
    title: 'Automated Minutes of Meeting (MoM)',
    desc: 'Extract key discussion points and action items automatically from meeting content.'
  },
  {
    title: 'Semantic Q&A - AI Assistant',
    desc: 'Ask natural language questions about meeting content and retrieve precise answers instantly using semantic search.'
  },
  {
    title: 'Sentiment Analysis',
    desc: 'Analyze the tone and sentiment of each speaker throughout the meeting for deeper insight into the conversation dynamics.'
  },
  {
    title: 'Secure Library & Archive',
    desc: 'All meeting data is securely stored and available anytime.'
  }
];

export default function Home() {
  const { userData } = useSelector((state) => state.auth);

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary',
      // backgroundImage: `url(${lightBackground})`,
      // backgroundRepeat: 'no-repeat',
      // backgroundSize: 'cover', // or 'contain', or 'auto'
      // backgroundPosition: 'center',
    }}>
      {/* Hero Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper', opacity: 0.8 }}>
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
