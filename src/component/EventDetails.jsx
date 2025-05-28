import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Button,
    Box,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import moment from 'moment';
import { useRef, useState } from 'react';
import {
    useUploadMeetingArtifactMutation,
    useDeleteParticipantMutation
} from '../api/calendar';

export default function EventDetails({ open, event, onClose, onDelete, refetch, setAlertSeverity, setSnackbarMsg, setSnackbarOpen }) {
    const inputRef = useRef();
    const [uploadMeetingArtifact, { isSuccess: isUploadSuccess, error: uploadError }] = useUploadMeetingArtifactMutation();
    const [uploading, setUploading] = useState(false);

    const [deleteParticipant] = useDeleteParticipantMutation();
    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [snackbarMsg, setSnackbarMsg] = useState('');
    // const [alertSeverity, setAlertSeverity] = useState(null);


    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            setUploading(true);
            await uploadMeetingArtifact({ id: event.id, file: formData });
            setAlertSeverity('success')
            setSnackbarMsg("File uploaded")
            refetch();
        } catch (err) {
            console.error('Upload failed:', err);
            setAlertSeverity('error')
            setSnackbarMsg('Failed to upload artifact');
        } finally {
            setUploading(false);
            setSnackbarOpen(true);
        }
    };

    const handleParticipantDelete = async (participantId) => {
        try {
            const payload = await deleteParticipant(participantId).unwrap();
            refetch(); // update UI
            setSnackbarMsg(payload.message)
            setAlertSeverity('success')
        } catch (err) {
            console.error('Error deleting participant:', err);
            setAlertSeverity('error')
            setSnackbarMsg('Failed to delete participant');
        } finally {
            setSnackbarOpen(true);
        }
    };

    if (event === null) return <></>;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600}>{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {moment(event.start).format('MMMM Do YYYY, h:mm A')} - {moment(event.end).format('h:mm A')}
                        </Typography>
                    </Box>
                    <IconButton onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Typography variant="body1" gutterBottom>
                        {event.meeting_data?.meeting_description}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Participants:
                    </Typography>
                    {event.meeting_data?.participants?.map((p, idx) => (
                        <Box key={idx} display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2">
                                - {p.name} ({p.email})
                            </Typography>
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleParticipantDelete(p.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}

                    {(event.meeting_data?.library?.audio_path ||
                        event.meeting_data?.library?.video_path ||
                        event.meeting_data?.library?.transcript_path) ? (
                        <Box mt={2}>
                            <Typography variant="subtitle1" fontWeight={600}>Artifacts:</Typography>
                            <Stack direction="row" spacing={2} mt={1}>
                                {event.meeting_data?.library?.audio_path && (
                                    <AudiotrackIcon color="primary" titleAccess="Audio File Present" />
                                )}
                                {event.meeting_data?.library?.video_path && (
                                    <VideocamIcon color="primary" titleAccess="Video File Present" />
                                )}
                                {event.meeting_data?.library?.transcript_path && (
                                    <DescriptionIcon color="primary" titleAccess="Transcript File Present" />
                                )}
                            </Stack>
                        </Box>
                    ) : (
                        <Box mt={3}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                                disabled={uploading || isUploadSuccess }
                            >
                                {uploading ? 'Uploading...' : isUploadSuccess ? 'FIle Uploaded' : 'Upload Meeting Artifact'}
                                {!isUploadSuccess && <input
                                    type="file"
                                    hidden
                                    accept=".mp3,.wav,.mp4,.txt"
                                    ref={inputRef}
                                    onChange={handleUpload}
                                />}
                            </Button>
                            {uploadError && (
                                <Typography variant="body2" color="error">
                                    Error uploading file
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={alertSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar> */}
        </>
    );
}
