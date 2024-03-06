/* eslint-disable no-unused-vars */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// eslint-disable-next-line no-unused-vars
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, AuthDispatchContext } from '../helper/authContext';
import getToken from '../helper/getToken';

const pages = ['Courses', 'Blog'];
const settings = ['Profile', 'Account', 'Enrolled', 'Logout'];


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const token = React.useContext(AuthContext);
  const dispatch = React.useContext(AuthDispatchContext);


  const settingsHandlers = {
    'Profile': handleProfile,
    'Account': handleAccount,
    'Enrolled': handleEnrolled,
    'Logout': () => handleLogout(dispatch)
  }

  // handle cookie when user refreshes page.
  // for PRESERVATION OF STATE
  React.useEffect(() => {
    (async () => {
      if(token['jwt']) {
        setIsAuthenticated(!isAuthenticated);
      } else if (!token['jwt'] && localStorage.getItem('jwt')) {
        // in case of refresh let user be authenticated
        setIsAuthenticated(!isAuthenticated);
      } else {
        setIsAuthenticated(false);
      }
    })();

  }, [token['jwt']]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Avatar alt="logo" src="src/static/images/aestheitoslogo.png" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: 40, width: 40 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="http://localhost:5173/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Aestheitos
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="http://localhost:5173/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Aestheitos
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {isAuthenticated ?
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={settingsHandlers[setting]}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            :
            <Box sx={{ flexGrow: 0 }}>
              <Link to={`signin`} id="sign-in">Sign in</Link>
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

function handleProfile() {

}

function handleAccount() {

}

function handleEnrolled() {

}

function handleLogout(dispatch) {
  signOutAPI();
  dispatch({
    type: 'removeToken',
  })
  localStorage.removeItem('jwt');
  
}

function signOutAPI() {
  const response = fetch(`${import.meta.env.VITE_API_URL}logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    credentials: 'include'
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.status_code)
    }
    return response.json()
  }).catch(err => console.error(err));

  return response

}