import { Box, Container, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";

export default function CourseList() {
    let theme = createTheme();
    theme = responsiveFontSizes(theme);
    const matches = useMediaQuery(theme => theme.breakpoints.up('md'))
    return (<>

        <Box sx={{ margin: -1, padding: 0, position: 'relative' }}>
            <img src="src/static/images/bgH.jpg" alt="pair of rings" className="background-image" />
            <Container fixed={true} maxWidth={false} sx={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: {xs: '4%', sm: '6%'}, paddingLeft: {xs: '8%'}, paddingRight: {xs: '8%'}, width: {xs: '69%'} }} className="container-homepage">
                <ThemeProvider theme={theme}>
                    <Typography variant={matches ? 'h3' : 'h5'} sx={{ color: '#5A5A5A', fontWeight: 600, fontFamily: '"Helvetica Neue"', textAlign: 'center' }}>
                        Challenge Yourself, Unleash Your Potential: Start Your Free Calisthenics Journey Today.
                    </Typography>
                </ThemeProvider>
            </Container>
        </Box>
        <div className="divider"></div>

    </>)
}