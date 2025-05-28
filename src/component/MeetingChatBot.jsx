// component/MeetingChatBot.jsx

import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import {
  useAskMeetingQuestionMutation,
  useGetChatMeetingHistoryQuery
} from '../api/meetingAssitant';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MeetingChatBot({ meetingID }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  

  const [askQuestion, { isLoading }] = useAskMeetingQuestionMutation();

  const {
    data: history,
    isLoading: isChatHistoryLoading,
    isSuccess: isChatHistorySuccess,
    isError,
    error,
    refetch
  } = useGetChatMeetingHistoryQuery(meetingID, {
    skip: !meetingID,
    refetchOnMountOrArgChange: true,
  });


  // Load chat history when meetingID changes
  useEffect(() => {
    console.log({ meetingID, history, isChatHistoryLoading, isError, error })
    if (history?.length > 0 && !isError && !isChatHistoryLoading) {
      const formattedHistory = history.map((entry) => [entry]).flat();
      setMessages(formattedHistory);
    } else if (isError && error.data?.detail) {
      setMessages([
        {
          sender_type: 'bot',
          message: '👋 Hi! I’m your meeting assistant. Ask me anything about your meetings.'
        }
      ])
    } else {
      setMessages([{
        sender_type: 'bot',
        message: '👋 Hi! I’m your meeting assistant. Ask me anything about your meetings.'
      }]);
    }
  }, [error, history]);



  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender_type: 'user', message: trimmed, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await askQuestion({ meeting_id: `${meetingID}`, question: trimmed }).unwrap();
      const botMessage = { sender_type: 'bot', message: res.answer };
      setMessages((prev) => [...prev, botMessage]);
      refetch(); // optional:  refresh history after new message
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender_type: 'bot', message: '❌ Sorry, something went wrong. Please try again.' }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        height: '75vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Meeting Assistant
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {
        isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {`${error.status}: ${error.data.detail}`}
          </Alert>
        )
      }

      {/* Chat Area */}
      <Box
        flex={1}
        overflow="auto"
        px={1}
        sx={{
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'red',
            borderRadius: '4px'
          }
        }}
      >
        {isChatHistoryLoading ? <CircularProgress /> :
          messages.map((msg, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent={msg.sender_type === 'user' ? 'flex-end' : 'flex-start'}
              mb={1.5}
            >
              <Box
                px={2}
                py={1.5}
                maxWidth="75%"
                borderRadius={2}
                bgcolor={msg.sender_type === 'user' ? 'primary.main' : 'background.default'}
                color={msg.sender_type === 'user' ? 'primary.contrastText' : 'text.primary'}
                boxShadow={1}
                fontSize="0.95rem"
              >
                <ReactMarkdown
                  children={msg.message}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <Typography component="span">{children}</Typography>,
                    code: ({ inline, children }) =>
                      inline ? (
                        <Box
                          component="code"
                          sx={{
                            bgcolor: 'grey.300',
                            px: 0.6,
                            borderRadius: 1,
                            fontSize: '0.85em',
                            fontFamily: 'monospace'
                          }}
                        >
                          {children}
                        </Box>
                      ) : (
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: 'background.default',
                            color: 'text.primary',
                            p: 2,
                            borderRadius: 2,
                            fontSize: '0.85em',
                            overflowX: 'auto'
                          }}
                        >
                          <code>{children}</code>
                        </Box>
                      ),
                    li: ({ children }) => (
                      <li>
                        <Typography component="span" variant="body2">
                          {children}
                        </Typography>
                      </li>
                    )
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}
                >
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </Typography>
              </Box>
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Input Box */}
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Ask Copilot anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Send'}
        </Button>
      </Box>
    </Paper>
  );
}
