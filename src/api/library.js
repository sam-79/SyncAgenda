import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_BASE_URL = ''


export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_SERVER_HOST_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "69420");
      if (getState().auth.userData) {
        const token = getState().auth.userData.access_token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Library'],
  endpoints: (builder) => ({
    getMeetingSummary: builder.query({
      query: (meetingId) => `/ai/summary/${meetingId}`,
      providesTags: (result, error, id) => [{ type: 'Library', id }],
    }),
    getMeetingTranscript: builder.query({
      query: (meetingId) => `/ai/transcript/${meetingId}`,
      providesTags: (result, error, id) => [{ type: 'Library', id }],
    }),
    getMeetingMinutes: builder.mutation({
      query: ({ meeting_id, language }) => ({
        url: `/ai/meeting_minutes`,
        method: 'POST',
        body: { meeting_id, language },
      }),
    }),
    uploadMeetingFile: builder.mutation({
      query: ({ meetingId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/upload_meeting_file/${meetingId}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getMeetingSentiment: builder.query({
      query: (meetingId) => `/meetings/get_sentiment/${meetingId}`,
      providesTags: (result, error, id) => [{ type: 'Library', id }],
    }),
    resetAIResponse: builder.mutation({
      query: (meetingId) => ({
        url: `/meeting/reset_ai_response/${meetingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Library' }],
    }),

    getMeetingMedia: builder.query({
      query: (meetingId) => ({
        url: `/meetings/media_stream/${meetingId}`,
        method: 'GET',
        responseHandler: async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Media not found');
          }
          const blob = await response.blob();
          const type = blob.type;
          const url = URL.createObjectURL(blob);
          return { url, type };
        },
        // this disables default JSON parsing
        fetchFn: fetch
      }),
    }),

  }),
});

export const {
  useGetMeetingSummaryQuery,
  useGetMeetingTranscriptQuery,
  useGetMeetingMinutesMutation,
  useUploadMeetingFileMutation,
  useGetMeetingSentimentQuery,
  useResetAIResponseMutation,
  useGetMeetingMediaQuery,
} = libraryApi;
