import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import LandingPage from './pages/Landing.jsx';
import UserAuthPage from './pages/UserAuth.js';
import Dashboard from './layout/Dashboard.js';
import ProtectedRoute from './component/ProtectedRoute.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '../redux/store.js';

import Home from './pages/Home.jsx';
import Calendar from './pages/Calendar.js';
import Library from './pages/Library.jsx';

import { ThemeProvider } from './theme/ThemeProvider'; // ✅ no need to import useColorMode here
import ActionItems from './pages/actionItems.jsx';
import UserProfile from './pages/UserProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: 'user-auth',
        Component: UserAuthPage,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: 'calendar',
            Component: Calendar,
          },
          {
            path: 'library',
            Component: Library,
          },
          {
            path: 'actionitems',
            Component: ActionItems,
          },
          {
            path:'userprofile',
            Component: UserProfile,
          }
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
