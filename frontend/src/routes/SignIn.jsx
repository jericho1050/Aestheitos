import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useContext, useState } from 'react';
import { AuthDispatchContext } from '../helper/authContext';
import { useNavigate, Link } from 'react-router-dom';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to={`/home`}>
                Aestheitos
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignIn() {
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(0);
    const dispatch = useContext(AuthDispatchContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        // when sign in button is click. handles authentication, if valid redirect and set cookie
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const token = await signInAPI(data);
        console.log(token)
        if (token['invalid']) {
            setIsInvalidCredentials(1);
        } else {
            dispatch({
                type: 'setToken',
                access: token['access'],
                refresh: token['refresh']
            })
            navigate("/home");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        onChange={() => setIsInvalidCredentials(0)}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        onChange={() => setIsInvalidCredentials(0)}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    {isInvalidCredentials === 1 ?
                        <Typography sx={{
                            color: 'red', fontSize: 'medium'

                        }}>
                            Invalid Username and Password!
                        </Typography> :

                        null
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        {/* <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid> */}
                        <Grid item>
                            <Link to={"/signup"} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}

// sends a POST request to /signin route
function signInAPI(data) {
    // User login API authentication

    // route "/login"
    const response = fetch(`${import.meta.env.VITE_API_URL}login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: data.get('username'),
            password: data.get('password'),
        })
    }).then(response => {
        if (!response.ok) {
            if (response.status === 400 || response.status === 401) {
                return { "invalid": "incorrect username and password" };
            }
            throw new Error(response);
        }
        return response.json();
    }).catch(err => console.error(err));

    return response;
}