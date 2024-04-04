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
import { useAuthToken } from '../helper/authContext';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Popover, Slide, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import validateJWTToken from '../helper/verifySignature';
import { jwtDecode } from 'jwt-decode';
import refreshAccessToken from '../helper/refreshAccessToken';
import logo from '../static/images/aestheitoslogo.png';
import persistToken from '../helper/persistToken';
import useRefreshToken from '../helper/useRefreshToken';

const pages = ['Courses', 'Blog', 'Create'];
const settings = ['Profile', 'Account', 'Enrolled', 'Logout'];


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  // returns the token state and it's dispatch function 
  const { token, dispatch } = useAuthToken();
  const isAuthenticated = token['access'] !== null;
  const navigate = useNavigate();



  // attach event listener to  each setting
  const settingsHandlers = {
    'Profile': handleProfile,
    'Account': handleAccount,
    'Enrolled': handleEnrolled,
    'Logout': () => handleLogout(dispatch)
  }

  // attach event listener to each page in navbar
  const pageHandlers = {
    'Courses': handleCourses,
    'Blogs': handleBlogs,
    'Create': handleCreate
  }



  persistToken();
  useRefreshToken();





  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleClickSearch = () => {
    setIsOpen(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // settings handlers
  function handleProfile() {

  }

  function handleAccount() {

  }

  function handleEnrolled() {
  }

  // pages handlers
  function handleCourses() {

  }

  function handleBlogs() {

  }

  function handleCreate() {
    navigate('/course/create')
  }


  async function handleLogout(dispatch) {
    await signOutAPI();
    await dispatch({
      type: 'removeToken',
    })
    window.location.reload()

  }

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar alt="logo" src={logo} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: 40, width: 40 }} />
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
                  <MenuItem key={page} onClick={pageHandlers[page]}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="http://localhost:5173/"
              sx={{
                ml: 4,
                mr: 0,
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
                  onClick={pageHandlers[page]}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {isAuthenticated ?
              <Box sx={{ flexGrow: 0 }}>
                <Grid direction="row-reverse" container alignItems={'center'} spacing={2}>
                  <Grid item xs>
                    <Tooltip data-cy="Tool tip" title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar data-cy="Avatar" alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  {isSmallScreen ?
                    <>
                      <Grid item xs md>
                        <IconButton onClick={handleClickSearch} size="large" aria-label="search" color="inherit">
                          <SearchIcon />
                        </IconButton>
                      </Grid>
                      <Dialog
                        fullWidth={true}
                        maxWidth="md"
                        open={isOpen}
                        onClose={handleClose}
                        PaperProps={{
                          component: 'form',
                          onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            // console.log(email);
                            handleClose();
                          },
                        }}
                      >
                        <DialogTitle>Search for Courses</DialogTitle>
                        <DialogContent>
                          {/* <DialogContentText>
                          Search Available Courses
                        </DialogContentText> */}
                          <Search>
                            <SearchIconWrapper>
                              <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                              placeholder="Search…"
                              inputProps={{ 'aria-label': 'search' }}
                            />
                          </Search>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button type="submit">Search</Button>
                        </DialogActions>
                      </Dialog>
                    </>
                    :
                    <Grid item xs md>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </Grid>
                  }
                </Grid>
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
                <Grid container spacing={{ xs: 0, sm: 1, md: 2 }} alignItems={'center'}>
                  {isSmallScreen ?
                    <>
                      <Grid item xs md>
                        <IconButton onClick={handleClickSearch} size="large" aria-label="search" color="inherit">
                          <SearchIcon />
                        </IconButton>
                      </Grid>
                      <Dialog
                        fullWidth={true}
                        maxWidth="md"
                        open={isOpen}
                        onClose={handleClose}
                        PaperProps={{
                          component: 'form',
                          onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            // console.log(email);
                            handleClose();
                          },
                        }}
                      >
                        <DialogTitle>Search for Courses</DialogTitle>
                        <DialogContent>
                          {/* <DialogContentText>
                          Search Available Courses
                        </DialogContentText> */}
                          <Search>
                            <SearchIconWrapper>
                              <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                              placeholder="Search…"
                              inputProps={{ 'aria-label': 'search' }}
                            />
                          </Search>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button type="submit">Search</Button>
                        </DialogActions>
                      </Dialog>
                    </>
                    :
                    <Grid item xs md>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </Grid>
                  }
                  <Grid item xs md>
                    <Link to={`/signin`} id="sign-in">Sign in</Link>
                  </Grid>
                </Grid>
              </Box>
            }
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />
    </>
  );
}
export default ResponsiveAppBar;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


function signOutAPI() {
  // ask the backend server to delete the httpOnly jwt cookie
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

