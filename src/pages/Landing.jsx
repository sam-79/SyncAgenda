import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
// import Logo from '../assets/logo.png';
import heroAnimation from '../assets/lottie/login.json';
import ScreenRecorder from '../component/ScreenRecorder';
import HomeLayers from '../component/HomeLayers';
import Header from '../component/RoundedHeader';
import backgroundPattern from '../assets/homebg.svg';

export default function LandingPage() {
  const { userData } = useSelector((state) => state.auth);
  const theme = useTheme();

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

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', backgroundImage: `url(${backgroundPattern})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover', // or 'contain', or 'auto'
      backgroundPosition: 'center',
    }}>
      {/* <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -100 }}>
        <HomeLayers style={{ width: '100%', height: '100%' }} />
      </Box> */}
      {/* Header */}
      <Header />
      {/* <Box sx={{ p: 2, position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Box display="flex" alignItems="center" gap={2} component={Link} to="/" >
          <Avatar src={'syncagenda.png'} alt="App Logo" sx={{ width: 250 }} />
        </Box>
      </Box> */}
      {/* <Typography variant="h5" fontWeight={600}>
            SyncAgenda
          </Typography> */}
      {/* <Button
          variant="contained"
          component={Link}
          to={userData ? '/dashboard' : '/user-auth'}
          size="large"
        >
          {userData ? 'Go to Dashboard' : 'Get Started'}
        </Button> */}

      {/* Hero Section */}
      <Container maxWidth="lg" >
        <Grid container spacing={4} alignItems="center" sx={{ pt: 10 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Empower Your Meetings with AI
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Automate everything from transcripts to action items in seconds.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to={userData ? '/dashboard' : '/user-auth'}
            >
              {userData ? 'Open Dashboard' : 'Try it Free'}
            </Button>
          </Grid>
          <Grid item xs={12} md={6} height={320}>
            {/* <Lottie animationData={heroAnimation} loop style={{ height: 320 }} /> */}
            
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h4" fontWeight={600} align="center" gutterBottom>
          Core Features
        </Typography>
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
        {/* <ScreenRecorder/> */}

      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 12,
          py: 4,
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Created by
          </Typography>
          <Box display="flex" justifyContent="center" gap={6} mt={2}>
            {/* Sameer */}
            <Box>
              <Typography fontWeight={600}>Sameer</Typography>
              <Box display="flex" justifyContent="center" gap={1}>
                <IconButton
                  component="a"
                  href="https://github.com/sameerxyz"
                  target="_blank"
                >
                  <GitHub />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://linkedin.com/in/sameerxyz"
                  target="_blank"
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>

            {/* Shantanu */}
            <Box>
              <Typography fontWeight={600}>Shantanu</Typography>
              <Box display="flex" justifyContent="center" gap={1}>
                <IconButton
                  component="a"
                  href="https://github.com/shantanuxyz"
                  target="_blank"
                >
                  <GitHub />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://linkedin.com/in/shantanuxyz"
                  target="_blank"
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" mt={4}>
            &copy; {new Date().getFullYear()} SyncAgenda. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}