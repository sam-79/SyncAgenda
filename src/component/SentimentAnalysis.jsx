import React from 'react';
import {
    Box,
    Typography,
    Paper,
    LinearProgress,
    Tooltip,
    useTheme
} from '@mui/material';
import { useGetMeetingSentimentQuery } from '../api/library'; // update path

function getColorByScore(score, theme) {
    const red = Math.floor(255 - score * 255);
    const green = Math.floor(score * 255);
    return `rgb(${red}, ${green}, 100)`;
}

function getColorByLabel(label, theme) {
    const colorMap = {
        'Very Negative': "#f95454",     // dark red
        'Negative': '#f95454c2',          // red
        'Neutral': theme.palette.grey[400],            // gray
        'Positive': '#56fd5f96',       // light green
        'Very Positive': '#5ccb62c2'    // green
    };
    return colorMap[label] || theme.palette.grey[300]; // fallback color
}


export default function SentimentAnalysis({ meetingId }) {
    const { data, isLoading, isError } = useGetMeetingSentimentQuery(meetingId);
    const theme = useTheme();

    if (isLoading) return <Typography>Loading Sentiment...</Typography>;
    if (isError || !data) return <Typography color="error">Failed to load sentiment data.</Typography>;

    return (
        <Box mt={4}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Sentiment Analysis
            </Typography>
            {data.sentiments.map((item, idx) => (
                <Tooltip
                    key={idx}
                    title={`Sentiment: ${item.label} | Score: ${item.score.toFixed(2)}`}
                    arrow
                    followCursor
                >
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            my: 2,
                            backgroundColor: getColorByLabel(item.label, theme),
                            transition: '0.3s ease',
                            '&:hover': {
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Typography sx={{ fontFamily: "'Fira Code', monospace" }}>
                            {item.line}
                        </Typography>
                        <Box mt={1}>
                            <LinearProgress
                                variant="determinate"
                                value={item.score * 100}
                                sx={{
                                    height: 6,
                                    borderRadius: 4,
                                    backgroundColor: theme.palette.grey[300],
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? getColorByLabel(item.score, theme)
                                            : 'rgba(0,0,0,0.4)'
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {item.label} ({(item.score * 100).toFixed(1)}%)
                            </Typography>
                        </Box>
                    </Paper>
                </Tooltip>
            ))}
        </Box>
    );
}
