import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Divider,
    CircularProgress,
    Link
} from '@mui/material';
import dayjs from 'dayjs';

import {
    useGetMeetingSummaryQuery,
    useGetMeetingMinutesMutation,
    useGetMeetingTranscriptQuery,
} from '../api/library'; // Adjust path if needed

import MinutesOfMeeting from './MinutesOfMeeting';

export default function MeetingDetails({ meetingDetails, setSelectedMeetingId, onDeleteMeeting }) {
    const [activeTab, setActiveTab] = useState(0);
    const meetingId = meetingDetails.id;
    const [minutesData, setMinutesData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const TABS = ['Transcript', 'Summary', 'MoM', 'Stats'];

    useEffect(() => {
        if (!meetingDetails) return;

        const fetchTabData = async () => {
            setLoading(true);
            try {
                const tabName = TABS[activeTab].toLowerCase().replace(/ /g, '_'); // 'minutes_of_meeting'
                const res = await fetch(`/api/meeting/${meetingDetails.id}/${tabName}`);
                const data = await res.json();
                setTabData(data);
            } catch (err) {
                console.error('Failed to fetch tab content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTabData();
    }, [activeTab, meetingDetails]);


    //new code
    const {
        data: summaryData,
        isLoading: isSummaryLoading,
    } = useGetMeetingSummaryQuery(meetingId, {
        skip: activeTab !== 1,
    });

    const {
        data: transcriptData,
        isLoading: isTranscriptLoading,
    } = useGetMeetingTranscriptQuery(meetingId, {
        skip: activeTab !== 0,
    })

    const [getMeetingMinutes, { data: minutesResponse, isLoading: isMinutesLoading }] =
        useGetMeetingMinutesMutation();

    useEffect(() => {
        if (activeTab === 2) {
            getMeetingMinutes({ meeting_id: `${meetingId}`, language: 'English' })
                .unwrap()
                .then((res) => {
                    console.log("mom", res)
                    setMinutesData(res)
                })
                .catch((err) => console.error('Minutes API failed:', err));
        }
    }, [activeTab, meetingId]);


    return (
        <Box>
            {/* Title */}
            <Typography variant="h4" fontWeight="bold" mb={2}>
                {meetingDetails.meeting_name}
            </Typography>

            {/* Date & Time */}
            <Paper elevation={2} sx={{ padding: 2, marginBottom: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Typography variant="body1" color='text'>
                    {dayjs(meetingDetails.meeting_date).format('MMM D YYYY')} &nbsp;•&nbsp; {dayjs(meetingDetails.meeting_date).format('h:mm A')}

                </Typography>
                <Typography variant="body2" mt={1}>
                    {meetingDetails.meeting_description}
                </Typography>
                {/* </Paper> */}

                {/* Tabs */}
                {/* <Paper elevation={2} sx={{ padding: 2 }}> */}
                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        // textColor="primary"
                        // indicatorColor="primary"
                        // variant="scrollable"
                        scrollButtons="auto"
                        variant="fullWidth"
                        textColor="inherit" // <== prevent override
                        sx={{
                            borderRadius: 2,
                            bgcolor: 'background.default', // softer neutral background
                            p: 0.5,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: 15,
                                borderRadius: 2,
                                color: 'text.primary',
                                transition: 'all 0.25s ease-in-out',
                                mx: 0.5,
                                minHeight: 36,
                                minWidth: 100,
                                px: 2,
                                py: 1,
                                '&:hover': {
                                    bgcolor: 'background.hover',
                                },
                            },
                            '& .Mui-selected': {
                                bgcolor: 'action.active',
                                color: 'primary.contrastText',
                                borderRadius: 2,

                            },
                            '& .MuiTabs-indicator': {
                                display: 'none', // hide default indicator
                            },
                        }}

                    >
                        {TABS.map((label, index) => (
                            <Tab label={label} key={index} />
                        ))}
                    </Tabs>

                    <Divider sx={{ my: 2 }} />

                    {/* Tab Content */}
                    <Box sx={{
                        height: '60vh', // or use: `maxHeight: 300` if needed
                        overflowY: 'auto',
                        pr: 1,
                        scrollBehavior: 'smooth'
                    }}>
                        {activeTab === 0 && (

                            isTranscriptLoading ? (
                                <CircularProgress />
                            ) : (
                                <Typography variant="body2" whiteSpace="pre-line">
                                    {transcriptData?.transcript || 'No Transcript available.'}
                                </Typography>
                            )

                            // < Typography variant="body2">Transcript coming soon...</Typography>
                        )}

                        {activeTab === 1 && (
                            isSummaryLoading ? (
                                <CircularProgress />
                            ) : (
                                <Typography variant="body2" whiteSpace="pre-line">
                                    {summaryData?.summary || 'No summary available.'}
                                </Typography>
                            )
                        )}

                        {activeTab === 2 && (
                            isMinutesLoading ? (
                                <CircularProgress />
                            ) : (
                                <Typography variant="body2" whiteSpace="pre-line">
                                    {/* {minutesData?.minutes_of_meeting.summary || 'No MoM available.'} */}
                                    <MinutesOfMeeting data={minutesData} />
                                </Typography>
                            )
                        )}

                        {activeTab === 3 && (
                            <Typography variant="body2">Stats coming soon...</Typography>
                        )}
                    </Box>
                </Box>
                {/* </Paper> */}

                {/* Uploaded Files Section */}
                {/* <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}> */}
                <Typography variant="h6" gutterBottom>Uploaded Files</Typography>

                {
                    meetingDetails.library?.transcript_path && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Transcript:{" "}
                            <Link
                                href={`/${meetingDetails.library.transcript_path.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download Transcript
                            </Link>
                        </Typography>
                    )
                }

                {
                    meetingDetails.library?.audio_path && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Audio:{" "}
                            <Link href={`/${meetingDetails.library.audio_path}`} target="_blank" rel="noopener noreferrer">
                                Download Audio
                            </Link>
                        </Typography>
                    )
                }

                {
                    meetingDetails.library?.video_path && (
                        <Typography variant="body2">
                            Video:{" "}
                            <Link href={`/${meetingDetails.library.video_path}`} target="_blank" rel="noopener noreferrer">
                                Download Video
                            </Link>
                        </Typography>
                    )
                }

                {
                    !meetingDetails.library?.transcript_path &&
                        !meetingDetails.library?.audio_path &&
                        !meetingDetails.library?.video_path ? (
                        <Typography variant="body2" color="text.secondary">
                            No uploaded files.
                        </Typography>
                    ) : null
                }
            </Paper >
        </Box >
    );
}
