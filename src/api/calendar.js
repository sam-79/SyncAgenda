import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// const API_BASE_URL = ''

export const calendarApi = createApi({
    reducerPath: 'calendarApi',
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
    tagTypes: ['Meeting'],
    endpoints: (builder) => ({
        getMeetingsByDate: builder.query({
            query: (date) => ({
                url: `/meetings/list`,
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }), // Format: YYYY-MM-DD
            providesTags: (result, error, arg) => [{ type: 'Meeting', date: arg }],
            // transformResponse: (response) => {console.logresponse.data},
        }),
        getMeetingDetails: builder.query({
            query: (id) => `/meetings/details/${id}`,
            providesTags: (result, error, id) => [{ type: 'Meeting', id }],
        }),
        createMeeting: builder.mutation({
            query: (newMeeting) => ({
                url: '/meetings/create',
                method: 'POST',
                body: newMeeting,
            }),
            invalidatesTags: [{ type: 'Meeting' }],
        }),
        deleteMeeting: builder.mutation({
            query: (id) => ({
                url: `/meetings/delete/${id}`,
                method: 'DELETE',
            }),
        }),
        uploadMeetingArtifact: builder.mutation({
            query: ({ id, file }) => ({
                url: `/upload_meeting_file/${id}`,
                method: 'POST',
                body: file,
                formData: true
            }),
            invalidatesTags: [{ type: 'Meeting' }]
        }),
        deleteParticipant: builder.mutation({
            query: (id) => ({
                url: `/delete_participant/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Meeting' }],
        })
    }),
});

export const {
    useGetMeetingsByDateQuery,
    useGetMeetingDetailsQuery,
    useCreateMeetingMutation,
    useDeleteMeetingMutation,
    useUploadMeetingArtifactMutation,
    useDeleteParticipantMutation
} = calendarApi;

