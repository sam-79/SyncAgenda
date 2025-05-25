import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useGetUserProfileQuery } from '../api/user';

export default function UserProfile() {
  const { data, isLoading, isError } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error">Failed to load user profile</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ width: 72, height: 72 }}>
            {data.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>
            {data.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {data.email}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Joined: {new Date(data.date_created).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
