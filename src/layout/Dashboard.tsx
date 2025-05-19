import * as React from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  IconButton,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Avatar,
  useTheme,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarMonthIcon,
  Subscriptions as SubscriptionsIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
} from '@mui/icons-material';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Logout, Person } from '@mui/icons-material';


import { Outlet, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { useColorMode } from '../theme/ColorModeContext';
import { logout } from '../../redux/features/authSlice';

const drawerWidth = 240;

const DRAWER_ITEMS = [
  { title: 'Home', icon: <HomeIcon />, path: '', key: 'home' },
  { title: 'Calendar', icon: <CalendarMonthIcon />, path: 'calendar', key: 'calendar' },
  { title: 'Library', icon: <SubscriptionsIcon />, path: 'library', key: 'library' },
  { title: 'Action Items', icon: <AssignmentTurnedInIcon />, path: 'actionitems', key: 'actionitems' }
];

// Drawer styling
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(10)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to right, #232526, #414345)'
    : 'linear-gradient(to right, #e0eafc, #cfdef3)',
  color: theme.palette.text.primary,
  // boxShadow:
  //   theme.palette.mode === 'dark'
  //     ? '0 2px 10px rgba(0,0,0,0.6)'
  //     : '0 2px 10px rgba(0,0,0,0.1)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: open ? drawerWidth : `calc(${theme.spacing(9)} + 1px)`,
  // [theme.breakpoints.up('sm')]: {
  //   width: `calc(${theme.spacing(10)} + 1px)`
  // },
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    backdropFilter: 'blur(12px)',
    color: theme.palette.text.primary,
    ...(open ? openedMixin(theme) : closedMixin(theme))
  }
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  // const [darkMode, setDarkMode] = React.useState(theme.palette.mode === 'dark');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);
  const { toggleColorMode, mode } = useColorMode();

  const dispath = useDispatch();

  // const handleToggleTheme = () => {
  //   setDarkMode(!darkMode);
  //   const newMode = darkMode ? 'light' : 'dark';
  //   document.documentElement.setAttribute('data-theme', newMode);
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={() => setOpen((prev) => !prev)} edge="start">
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ ml: 2 }}>
              SyncAgenda
            </Typography>
          </Box>
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'rotate(360deg)',
              },
            }}
          >
            {mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer variant="permanent" open={open}>
        {/* \Drawer Header */}
        <DrawerHeader>
          {open && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1} my={1}>
              <Avatar
                src="https://a0.anyrgb.com/pngimg/1772/1960/material-design-icon-user-profile-avatar-ico-flat-facebook-icon-design-conversation-forehead.png"
                alt={userData.name}
                sx={{ width: 64, height: 64 }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.username}
              </Typography>
            </Box>
          )}
        </DrawerHeader>
        
        <Divider />
        {/* drawer list items */}
        <List>
          {DRAWER_ITEMS.map((item) => {
            const isActive = pathname.split('/')[2] === item.path;
            return (
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(`./${item.path}`)}
                  sx={{
                    minHeight: 60,
                    px: 2,
                    py: 1.5,
                    margin: 1,
                    flexDirection: open ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-start' : 'center',
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? theme.palette.background.default : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.main' : theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isActive ? theme.palette.background.default : theme.palette.text.secondary,
                      justifyContent: 'center',
                      mb: open ? 0 : 0.5
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open ? (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        ml: 2,
                        color: isActive
                          ? theme.palette.background.default
                          : theme.palette.text.primary
                      }}
                    />
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive
                          ? theme.palette.background.default
                          : theme.palette.text.primary
                      }}
                    >
                      {item.title}
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* Bottom section with Profile and Logout */}
    <Box mt="auto">
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => navigate('./profile')}
            sx={{
              minHeight: 60,
              px: 2,
              py: 1.5,
              margin: 1,
              flexDirection: open ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: open ? 'flex-start' : 'center',
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mb: open ? 0 : 0.5 }}>
              <Person />
            </ListItemIcon>
            {open ? <ListItemText primary="Profile" sx={{ ml: 2 }} /> : <Typography variant="caption">Profile</Typography>}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (window.confirm("Are you sure to logout?")){
                dispath(logout());
              }
            }}
            sx={{
              minHeight: 60,
              px: 2,
              py: 1.5,
              margin: 1,
              flexDirection: open ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: open ? 'flex-start' : 'center',
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mb: open ? 0 : 0.5 }}>
              <Logout />
            </ListItemIcon>
            {open ? <ListItemText primary="Logout" sx={{ ml: 2 }} /> : <Typography variant="caption">Logout</Typography>}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>

      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{

          flexGrow: 1,
          transition: theme.transitions.create(['margin', 'width'], {

            easing: theme.transitions.easing.sharp,

            duration: theme.transitions.duration.enteringScreen

          }),

          // ml: `${open ? drawerWidth : `calc(${theme.spacing(9)} + 1px)`} `,

        }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
