import { Box, Container, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";



// 
export function Home() {
    let theme = createTheme();
    theme = responsiveFontSizes(theme);
    const matches = useMediaQuery(theme => theme.breakpoints.up('md'))
    const springs = useSpring({
        from: { x: -1000, y: -window.innerHeight * 0.35 },
        to: async (next, cancel) => {
            await next({ x: 0, y: -window.innerHeight * 0.35 });
            await next({});
        }
    })
    return (<>
        <Box sx={{ margin: -1, padding: 0, position: 'relative' }}>
            <img src="src/static/images/bgH.jpg" alt="pair of rings" className="background-image" />
            <animated.div style={{ ...springs }}>
                <Container fixed={true} maxWidth={false} sx={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: { xs: '4%', sm: '6%' }, paddingLeft: { xs: '8%' }, paddingRight: { xs: '8%' }, width: { xs: '69%' } }} className="container-homepage">
                    <ThemeProvider theme={theme}>
                        <Typography variant={matches ? 'h3' : 'h4'} sx={{ color: '#5A5A5A', fontWeight: 600, fontFamily: '"Helvetica Neue"', textAlign: 'left' }}>
                            Challenge Yourself, Unleash Your Potential: Start Your Free Calisthenics Journey Today.
                        </Typography>
                    </ThemeProvider>
                </Container>
            </animated.div>
            <Grid container>
                <Grid item>
                    <div className="divider"></div>
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'}>
                <Grid item paddingTop={'10vh'}>
                    <ThemeProvider theme={theme}>
                        <Typography variant={'h3'} sx={{fontWeight: 'bold'}}>
                            Courses            
                        </Typography>
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Box>

    </>)
}