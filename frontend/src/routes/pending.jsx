import { Container, Box, Grid, Typography, useTheme, ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";
import { getCourses } from "../courses";
import { useLoaderData } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CustomizedSnackbar from "../components/Snackbar";

export async function loader() {
    const courses = await getCourses();
    courses.sort((a, b) => new Date(b.course_updated) - new Date(a.course_updated));

    return { courses };
}

export function Pending() {
    const { courses } = useLoaderData();
    let theme = createTheme();
    theme = responsiveFontSizes(theme);



    return (
        <>
            <CustomizedSnackbar />
            <Container maxWidth="xl" sx={{ ml: 'auto', mr: 'auto' }}>
                <Box sx={{ ml: { xs: 4, m: 3, l: 0 }, mr: { xs: 4, m: 3, l: 0 } }}>
                    <Grid container mb={4} mt={'5vh'}>
                        <Grid item>
                            <ThemeProvider theme={theme} >
                                <Typography variant="h2" fontFamily={'Play'} fontWeight={'bolder'}>
                                    Pending Courses
                                </Typography>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                    <Grid id="courses" container rowSpacing={2} justifyContent={"flex-start"} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }} columnSpacing={{ xs: 2, md: 3 }}>
                        {/* Load lists of Courses that are approved only */}
                        {courses.map(course => {
                            return (
                                course.status === 'P' && !course.is_draft ?
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
        </>
    )

}