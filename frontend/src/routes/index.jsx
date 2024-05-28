import { Box, Container, Grid, ThemeProvider, Typography, colors, createTheme, responsiveFontSizes, useMediaQuery, useTheme } from "@mui/material";
import { useSpring, animated, useSprings } from "@react-spring/web";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";

import { getCourses } from "../courses";
import { useLoaderData } from "react-router-dom";
import { transform } from "lodash";
import CustomizedSnackbar from "../components/Snackbar";
import { useAtom } from "jotai";
import { snackbarReducerAtom } from "../atoms/snackbarAtom";
import ScrollToHashElement from "../helper/scrollToHashElement";



// basis for this animation Mysterious Text 
// https://codesandbox.io/p/sandbox/mysterious-text-animation-with-react-spring-vhj66
// By imhuyqn

const images = [
    "src/static/images/firstBG.png",
    "src/static/images/secondBG copy.png",
    "src/static/images/thirdBG.png"
]
export async function loader() {
    const courses = await getCourses();
    return { courses };
}

const MysteriousText = ({ children, ...props }) => {
    const matches = useMediaQuery(theme => theme.breakpoints.up('lg'))
    const animation = i =>
        useSpring({ opacity: 1, from: { opacity: 0 }, delay: 2 * (Math.random() * 650) });
    const startIndex = 60;
    const endIndex = 71;
    const theme = useTheme();

    return (
        <Typography variant={matches ? 'h3' : 'h4'} className="mysterious-text" {...props}>
            {children.split("").map((item, index) => (
                <animated.span key={index} style={{
                    ...animation(index),
                    fontFamily: index >= startIndex && index <= endIndex ? 'Passion One' : 'Archivo Black',
                    fontSize: index >= startIndex && index <= endIndex ? '1.8em' : 'inherit',
                    color: index >= startIndex && index <= endIndex ? theme.palette.primary.main : 'inherit',
                    lineHeight: '1.3em'
                }}>
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
    const spring = useSpring({
        from: { x: -1000, y: -window.innerHeight * 0.35 },
        to: async (next, cancel) => {
            await next({ x: 0, y: -window.innerHeight * 0.35 });
            await next({});
        },
        onRest: () => setAnimationFinished(true)

    })
    const [springs, api] = useSprings(3, index => ({
        from: { x: index === 2 ? '-100%' : '100%' },
        to: { x: '0%' },
        delay: index * 200
    }));
    const [snackbar,] = useAtom(snackbarReducerAtom);


    return (<>
        <CustomizedSnackbar />
        <Box sx={{ margin: -1, padding: 0, position: 'relative' }}>
            <Box display={'flex'}>
                {/* staggering effect */}
                {springs.map((props, index) => {
                    let className = "background-image";
                    if (index === 0) className += " first-image";
                    else if (index === 1) className += " second-image";
                    else if (index === 2) className += " third-image";
                    return <animated.img key={index} style={props} src={images[index]} className={className} />
                })}
            </Box>


            <animated.div style={{ ...spring }}>
                <Container fixed={true} maxWidth={false} sx={{ display: 'flex', padding: { xs: '4%', sm: '6%' }, paddingLeft: { xs: '8%' }, paddingRight: { xs: '8%' }, width: { xs: '69%' } }} className="container-homepage">
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
            <Container maxWidth="xl" sx={{ ml: 'auto', mr: 'auto' }}>

                <Box sx={{ ml: { xs: 4, m: 3, l: 0 }, mr: { xs: 4, m: 3, l: 0 } }}>
                    <Grid container mb={4} mt={'10vh'}>
                        <Grid item>
                            <ThemeProvider theme={theme}>
                                <Typography variant={'h2'} sx={{ fontFamily: 'Play' }}>
                                    Explore Courses
                                </Typography>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                    <ScrollToHashElement />
                    <Grid id="courses" container rowSpacing={2} justifyContent={"flex-start"} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }} columnSpacing={{ xs: 2, md: 3 }}>
                        {/* Load lists of Courses that are approved only */}
                        {courses.map(course => {
                            return (
                                course.status === 'A' ?
                                    <Grid key={course.id} item xs={4} sm={4} md={4} lg={3}>
                                        <CourseCard  {...course} />
                                    </Grid>
                                    : null
                            )
                        }

                        )}
                    </Grid>
                </Box>
            </Container>
        </Box>

    </>)
}


