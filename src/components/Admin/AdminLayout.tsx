import React, { useState, ReactNode } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import RedeemIcon from '@mui/icons-material/Redeem';
import { useAuth } from '../../contexts/AuthContext';
import AdminButton from '../../components/common/AdminButton';

const sidebarWidth = 220;
const sidebarBg = '#f8fafd';
const sidebarText = '#222';
const sidebarIcon = '#8b8b8b';
const sidebarActive = '#e6f0ff';
const sidebarActiveIcon = '#1976d2';

const Sidebar = styled(Box)({
  width: sidebarWidth,
  background: sidebarBg,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #f0f0f0',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1200,
  padding: '1.5rem 0 1rem 0',
  overflow: 'hidden',
  borderTopRightRadius: 24,
  borderBottomRightRadius: 24,
  boxShadow: '2px 0 16px 0 rgba(44, 62, 80, 0.04)',
});

const SidebarHeader = styled(Box)({
  padding: '0 2rem 2rem 2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
});

const SidebarLogo = styled('div')({
  fontWeight: 900,
  fontSize: '1.3rem',
  color: '#1976d2',
  letterSpacing: 1,
  fontFamily: 'Inter, Montserrat, sans-serif',
});

const SidebarList = styled(List)({
  flexGrow: 1,
  padding: 0,
});

const MainArea = styled(Box)(({ theme }) => ({
  marginLeft: sidebarWidth,
  minHeight: '100vh',
  background: '#f8fafd',
  width: `calc(100% - ${sidebarWidth}px)`,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: '#fff',
  color: '#222',
  boxShadow: '0 2px 10px rgba(44,62,80,0.04)',
  zIndex: 1300,
  left: sidebarWidth,
  width: `calc(100% - ${sidebarWidth}px)`,
  [theme.breakpoints.down('md')]: {
    left: 0,
    width: '100%',
  },
}));

const ModernToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: 64,
});

const SidebarLogout = styled(Box)({
  padding: '1.5rem 2rem',
  borderTop: '1px solid #f0f0f0',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: '#f8fafd',
});

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Convidados',
    path: '/admin/guests',
    icon: <PeopleIcon />,
  },
  {
    label: 'Presentes',
    path: '/admin/gifts',
    icon: <CardGiftcardIcon />,
  },
  {
    label: 'Presentes Comprados',
    path: '/admin/purchased-gifts',
    icon: <RedeemIcon />,
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const sidebarContent = (
    <Sidebar>
      <SidebarHeader>
        <SidebarLogo>T&G</SidebarLogo>
      </SidebarHeader>
      <SidebarList>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: '8px',
              margin: '0.2rem 0.7rem',
              background: isActiveRoute(item.path) ? sidebarActive : 'transparent',
              color: isActiveRoute(item.path) ? sidebarActiveIcon : sidebarText,
              '&:hover, &:focus': {
                background: sidebarActive,
                outline: '2px solid #1976d2',
                outlineOffset: '-2px',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActiveRoute(item.path) ? sidebarActiveIcon : sidebarIcon, minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActiveRoute(item.path) ? 700 : 500,
                color: isActiveRoute(item.path) ? sidebarActiveIcon : sidebarText,
                fontFamily: 'Inter, Montserrat, sans-serif',
                fontSize: '1.05rem',
              }}
            />
          </ListItem>
        ))}
      </SidebarList>
      <SidebarLogout>
        <AdminButton
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          variant="outlined"
          color="error"
          fullWidth
        >
          Logout
        </AdminButton>
      </SidebarLogout>
    </Sidebar>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafd' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: sidebarWidth, boxSizing: 'border-box' },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        sidebarContent
      )}

      {/* Main Area */}
      <MainArea>
        {/* Header */}
        <ModernAppBar position="fixed" elevation={0}>
          <ModernToolbar>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 0.5, fontFamily: 'Inter, Montserrat, sans-serif' }}>
              Casório T&G
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <LogoutIcon />
              </IconButton>
            </Box>
          </ModernToolbar>
        </ModernAppBar>
        {/* Main Content */}
        <Box sx={{ 
          pt: 9, 
          pb: 4, 
          px: 3,
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {children}
        </Box>
      </MainArea>
    </Box>
  );
};

export default AdminLayout; 