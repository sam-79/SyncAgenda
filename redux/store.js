// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import {
//     persistStore, persistReducer, FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER
// } from 'redux-persist';

// import storage from 'redux-persist/lib/storage'
// import { PersistGate } from 'redux-persist/integration/react'

// import authSlice from './features/authSlice';
// import { calendarApi } from '../src/api/calendar';
// import { libraryApi } from '../src/api/library';

// // 1. Configure persistence (only for auth)data
// const persistConfig = {
//     key: 'root',
//     storage: storage,
//     whitelist: ["auth"],

// };

// //combining all reducers where data needs to be persisted
// const rootReducer = combineReducers({
//     auth: authSlice,
//     [calendarApi.reducerPath]: calendarApi.reducer, // ❌ Don't persist this
// })
// const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: getDefaultMiddleware =>
//         getDefaultMiddleware({ serializableCheck: false }).concat(calendarApi.middleware),
// });

// //export persistor
// export const persistor = persistStore(store)

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './features/authSlice';
import { calendarApi } from '../src/api/calendar';
import { libraryApi } from '../src/api/library';
import { meetingAssistantApi } from '../src/api/meetingAssitant';
import { userApi } from '../src/api/user';

// 1. Configure persistence (only for auth data)
const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['auth'], // Only persist auth
};

// 2. Combine reducers (exclude API slices from persistence)
const rootReducer = combineReducers({
    auth: authSlice,
    [calendarApi.reducerPath]: calendarApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [meetingAssistantApi.reducerPath]:meetingAssistantApi.reducer,
    [userApi.reducerPath]:userApi.reducer
});

// 3. Wrap rootReducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(calendarApi.middleware, libraryApi.middleware, meetingAssistantApi.middleware, userApi.middleware),
});

// 5. Create and export the persistor
export const persistor = persistStore(store);
