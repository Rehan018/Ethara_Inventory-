import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 232;

const navItems = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Products', to: '/products', icon: <InventoryIcon /> },
  { label: 'Customers', to: '/customers', icon: <PeopleIcon /> },
  { label: 'Orders', to: '/orders', icon: <ReceiptIcon /> },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Toolbar sx={{ px: 2.25, minHeight: 76 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: 700,
            }}
          >
            E
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 18, lineHeight: 1.15 }}
            >
              Ethara
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.full_name}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.25, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 1,
              mb: 0.25,
              minHeight: 42,
              color: 'text.secondary',
              '&.active': {
                color: 'text.primary',
                bgcolor: '#f0f0ed',
                fontWeight: 700,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 650 }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1, py: 1.5 }}>
        <ListItemButton
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(251, 251, 250, 0.94)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Tooltip title="Open navigation">
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 14 }}>
            Inventory operations
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: 1320,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 2, sm: 3 },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
