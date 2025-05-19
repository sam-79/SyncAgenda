import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Zoom
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MinutesOfMeeting({ data }) {
  const mom = data?.minutes_of_meeting || {};

  const renderMarkdownList = (text) => {
    return text?.split('\n')?.map((line, index) => (
      <Zoom in key={index} style={{ transitionDelay: `${index * 100}ms` }}>
        <ListItem alignItems="flex-start" >
          {/* <ListItemIcon>
            <TaskAltIcon color="success" />
          </ListItemIcon> */}
          <ListItemText primary={<Markdown remarkPlugins={[remarkGfm]}>{line}</Markdown>} />
        </ListItem>
      </Zoom>
    ));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Summary */}
      <Typography variant="h6" gutterBottom>
        📝 Summary
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <Markdown>{mom.summary || 'No summary available.'}</Markdown>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Decisions */}
      <Typography variant="h6" gutterBottom>
        📌 Decisions
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <Markdown>{mom.decisions || 'No decisions available.'}</Markdown>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Action Items */}
      <Typography variant="h6" gutterBottom>
        ✅ Action Items
      </Typography>
      <List dense>
        {renderMarkdownList(mom.action_items || '')}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Additional Notes */}
      <Typography variant="h6" gutterBottom>
        🗒 Additional Notes
      </Typography>
      <Typography variant="body1" component="div">
        <Markdown>{mom.additional_notes || 'No additional notes available.'}</Markdown>
      </Typography>
    </Paper>
  );
}
