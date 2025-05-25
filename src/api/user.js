import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_SERVER_HOST_URL,
        prepareHeaders: (headers, { getState }) => {
            headers.set("ngrok-skip-browser-warning", "69420")
            const token = getState().auth.userData?.access_token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => '/auth/users/me',
        }),
    }),
});

export const { useGetUserProfileQuery } = userApi;
