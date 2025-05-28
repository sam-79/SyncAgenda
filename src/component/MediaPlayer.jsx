
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
} from '@mui/material';
import { useGetMeetingMediaQuery } from '../api/library';

export default function MediaPlayer({ meetingId }) {
    const { data, isLoading, error } = useGetMeetingMediaQuery(meetingId);

    if (isLoading) return <CircularProgress />;
    if (error) {
        return <Alert severity="warning">Media not available</Alert>;
    }

    const mediaType = data?.type.startsWith('audio')
        ? 'audio'
        : data?.type.startsWith('video')
            ? 'video'
            : null;

    if (!mediaType) {
        return <Alert severity="info">Unsupported media type</Alert>;
    }

    return (
        <Box  sx={{ p: 2, mt: 3, borderRadius: 3 }}>
            {/* <Typography variant="h6" fontWeight={600} mb={2}>
                Meeting Media Playback
            </Typography> */}
            {mediaType === 'audio' ? (
                <audio src={data.url} controls style={{ width: '100%' }} />
            ) : (
                <video
                    src={data.url}
                    controls
                    style={{ width: '100%', maxHeight: 360, borderRadius: 8 }}
                />
            )}
        </Box>
    );
}
