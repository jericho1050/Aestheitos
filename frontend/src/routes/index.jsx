import { Box, Container, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import pic from "../static/images/test.jpg"
import pic2 from "../static/images/what.jpg"
import { getCourses } from "../courses";
import { useLoaderData } from "react-router-dom";



// basis for this animation Mysterious Text 
// https://codesandbox.io/p/sandbox/mysterious-text-animation-with-react-spring-vhj66
// By imhuyqn
const text = {
    title: `Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica               Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica               Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica  TESTINGG AGAIN AGAIN IAGINAOIGASDF WTF WITSAOIFDSKLAFMLKSMLKAS HWTMWTWANTATATTSA WTHF SSRIESTWE SWWHERE TIS THIS AGAIN MA NAG NAWM IASNG AMT PO TA`
}

const text2 = {
    title: `              Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica `
}

const test3 = {
    description: `           Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica TANGI NA WTF            Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica TANGI NA WTF `
}

export async function loader() {
    const courses = await getCourses();
    return { courses };
}

const MysteriousText = ({ children, ...props }) => {
    const matches = useMediaQuery(theme => theme.breakpoints.up('md'))
    const animation = i =>
        useSpring({ opacity: 1, from: { opacity: 0 }, delay: Math.random() * 650 });
    return (
        <Typography variant={matches ? 'h3' : 'h4'} sx={{ color: '#5A5A5A', fontWeight: 600, fontFamily: '"Helvetica Neue"', textAlign: 'left' }} {...props}>
            {children.split("").map((item, index) => (
                <animated.span key={index} style={animation(index)}>
                    {item}
                </animated.span>
            ))}
        </Typography>
    );
};

export function Index() {
    const [animationFinished, setAnimationFinished] = useState(false);
    const { courses } = useLoaderData();
    let theme = createTheme();
    theme = responsiveFontSizes(theme);
    const springs = useSpring({
        from: { x: -1000, y: -window.innerHeight * 0.35 },
        to: async (next, cancel) => {
            await next({ x: 0, y: -window.innerHeight * 0.35 });
            await next({});
        },
        onRest: () => setAnimationFinished(true)


    })

    return (<>
        <Box sx={{ margin: -1, padding: 0, position: 'relative' }}>
            <img src="src/static/images/bgH.jpg" alt="pair of rings" className="background-image" />
            <animated.div style={{ ...springs }}>
                <Container fixed={true} maxWidth={false} sx={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: { xs: '4%', sm: '6%' }, paddingLeft: { xs: '8%' }, paddingRight: { xs: '8%' }, width: { xs: '69%' } }} className="container-homepage">
                    <ThemeProvider theme={theme}>
                        {/* <Typography variant={matches ? 'h3' : 'h4'} sx={{ color: '#5A5A5A', fontWeight: 600, fontFamily: '"Helvetica Neue"', textAlign: 'left' }}>
                        </Typography> */}
                        {animationFinished &&
                            <MysteriousText>
                                Challenge Yourself, Unleash Your Potential: Start Your Free Calisthenics Journey Today.
                            </MysteriousText>}
                    </ThemeProvider>
                </Container>
            </animated.div>
            <Grid container>
                <Grid item>
                    <div className="divider"></div>
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'} marginBottom={4}>
                <Grid item paddingTop={'10vh'}>
                    <ThemeProvider theme={theme}>
                        <Typography variant={'h3'} sx={{ fontWeight: 'bold' }}>
                            Courses
                        </Typography>
                    </ThemeProvider>
                </Grid>
            </Grid>
            <Box marginLeft={'3vw'} marginRight={'3vw'}>
                <Grid container rowSpacing={2} justifyContent={"flex-start"} columns={{ xs: 4, sm: 8, md: 12 }} columnSpacing={{ xs: 2, md: 3 }}>
                    {/* Load lists of Courses              */}
                    {courses.map(course => {
                        return (
                        <Grid key={course.id} item xs={4} sm={4} md={3}>
                            <CourseCard  {...course} />
                        </Grid>
                    )}

                    )}

                    {/* <Grid item xs={4} sm={4} md={3}>
                        <CourseCard thumbnail={pic2} title={text2.title} description={test3.description} />
                    </Grid>
                    <Grid item xs={4} sm={4} md={3}>
                        <CourseCard thumbnail={pic2} title={text2.title} description={test3.description} />
                    </Grid>
                    <Grid item xs={4} sm={4} md={3}>
                        <CourseCard thumbnail={pic2} title={text2.title} description={test3.description} />
                    </Grid> */}
                </Grid>
            </Box>
        </Box>

    </>)
}