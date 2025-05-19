// components/CreateMeetingDialog.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Stack,
    Typography,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateMeetingDialog = ({ open, onClose, onSubmit }) => {

    const [meetingData, setMeetingData] = useState({
        meeting_name: '',
        meeting_date: '',
        meeting_description: '',
        participants: [{ name: '', email: '' }],
    });

    const handleInputChange = (e) => {
        setMeetingData({
            ...meetingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleParticipantChange = (index, field, value) => {
        const updated = [...meetingData.participants];
        updated[index][field] = value;
        setMeetingData({ ...meetingData, participants: updated });
    };

    const addParticipant = () => {
        setMeetingData({
            ...meetingData,
            participants: [...meetingData.participants, { name: '', email: '' }],
        });
    };

    const removeParticipant = (index) => {
        const updated = meetingData.participants.filter((_, i) => i !== index);
        setMeetingData({ ...meetingData, participants: updated });
    };

    const handleFormSubmit = () => {
        // Call the onSubmit function passed from parent
        onSubmit(meetingData);
        onClose(); // Close the dialog after submission
    };
    const handleOnFormClose = () => {
        setMeetingData({
            meeting_name: '',
            meeting_date: '',
            meeting_description: '',
            participants: [{ name: '', email: '' }],
        })
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Meeting</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <TextField
                        label="Meeting Name"
                        name="meeting_name"
                        fullWidth
                        value={meetingData.meeting_name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Meeting Date & Time"
                        type="datetime-local"
                        name="meeting_date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={meetingData.meeting_date}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        name="meeting_description"
                        multiline
                        rows={3}
                        fullWidth
                        value={meetingData.meeting_description}
                        onChange={handleInputChange}
                    />
                    <Divider />
                    <Typography variant="h6">Participants</Typography>
                    {meetingData.participants.map((participant, index) => (
                        <Stack direction="row" spacing={1} alignItems="center" key={index}>
                            <TextField
                                label="Name"
                                value={participant.name}
                                onChange={(e) =>
                                    handleParticipantChange(index, 'name', e.target.value)
                                }
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={participant.email}
                                onChange={(e) =>
                                    handleParticipantChange(index, 'email', e.target.value)
                                }
                                type='email'
                                fullWidth
                            />
                            <IconButton
                                color="error"
                                onClick={() => removeParticipant(index)}
                                disabled={meetingData.participants.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    ))}
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addParticipant}
                        variant="text"
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Add Participant
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnFormClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} variant="contained">
                    Create Meeting
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMeetingDialog;
