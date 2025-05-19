// api/meetingAssistantApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// const API_BASE_URL = ''

export const meetingAssistantApi = createApi({
  reducerPath: 'meetingAssistantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_SERVER_HOST_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "69420")
      if (getState().auth.userData) {
        const token = getState().auth.userData.access_token;
        console.log(`token ${token}`)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    askMeetingQuestion: builder.mutation({
      query: ({ meeting_id, question }) => ({
        url: '/ai/meeting_qna',
        method: 'POST',
        body: { meeting_id, question },
      }),
    }),
  }),
});

export const { useAskMeetingQuestionMutation } = meetingAssistantApi;
