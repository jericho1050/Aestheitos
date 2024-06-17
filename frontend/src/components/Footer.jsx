import { Grid, Typography, styled } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <MyThemeFooter>
            <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                <Grid item>
                    <Typography variant="body2" fontSize={'large'}>
                        © Aestheitos
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        <Link to="/privacy" className="footer-link">
                            Privacy Policy
                        </Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        <Link to="/terms" className="footer-link">
                            Terms of Use
                        </Link>
                    </Typography>
                </Grid>
                <Grid item>
                    Contact
                </Grid>
                <Grid item>
                    About
                </Grid>
            </Grid>
        </MyThemeFooter>)
}


const MyThemeFooter = styled('footer')(({ theme }) =>
    theme.unstable_sx({
        color: 'primary.contrastText',
        backgroundColor: 'primary.main',
        padding: 2,
        textAlign: 'center',
        marginTop: 'auto'
    })
)
