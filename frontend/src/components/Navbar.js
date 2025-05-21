import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Learning Pulse
      </Typography>
      <Divider />
      <List>
        <ListItem component={RouterLink} to="/courses" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemText primary="Courses" />
        </ListItem>
        
        {currentUser ? (
          <>
            <ListItem component={RouterLink} to="/dashboard" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem component={RouterLink} to="/profile" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={logout} sx={{ color: 'inherit', cursor: 'pointer' }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={RouterLink} to="/login" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem component={RouterLink} to="/register" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                ☰
              </IconButton>
            )}

            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              Learning Pulse
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  component={RouterLink}
                  to="/courses"
                  sx={{ 
                    mx: 1, 
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 0, 224, 0.04)',
                    }
                  }}
                >
                  Courses
                </Button>

                {currentUser ? (
                  <>
                    <Button
                      component={RouterLink}
                      to="/dashboard"
                      sx={{ 
                        mx: 1, 
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 0, 224, 0.04)',
                        }
                      }}
                    >
                      Dashboard
                    </Button>
                    
                    <IconButton
                      onClick={handleMenu}
                      color="inherit"
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {currentUser.name?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{ mx: 1, color: 'text.primary' }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      sx={{ 
                        ml: 2,
                        borderRadius: '20px',
                        px: 2
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;