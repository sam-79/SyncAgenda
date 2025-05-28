// api/meetingAssistantApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meetingAssistantApi = createApi({
  reducerPath: 'meetingAssistantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_SERVER_HOST_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "69420");
      const token = getState().auth.userData?.access_token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // POST /ai/meeting_qna
    askMeetingQuestion: builder.mutation({
      query: ({ meeting_id, question }) => ({
        url: '/ai/meeting_qna',
        method: 'POST',
        body: { meeting_id, question },
      }),
    }),

    // GET /meetings/chathistory/:id
    getChatMeetingHistory: builder.query({
      query: (meetingId) => `/meetings/chathistory/${meetingId}`,
      providesTags: (result, error, id) => [{ type: `meetingchat_${id}`, id }],
    }),
  }),
});

export const {
  useAskMeetingQuestionMutation,
  useGetChatMeetingHistoryQuery,
} = meetingAssistantApi;
