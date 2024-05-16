import { Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Collapse, Container, Grid, Paper, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getCorrectExercises, getCourse, getCourseContent, getSectionItems, getSections, getWorkouts, getWrongExercises } from "../courses";
import { useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { AccordionSection } from "../components/Accordion";
import getEmbedUrl from "../helper/getEmbedUrl";

// import CorrectFormDialog from "../components/CorrectFormDialog";
// import WrongFormDialog from "../components/WrongFormDialog";


let theme = createTheme()
theme = responsiveFontSizes(theme)


export async function loader({ params }) {
    // if you notice the pattern
    // everytime we do a GET request, the server respond with it's properties of our instance including it's ID
    // now we chain this to retrieve other instances too.
    // const accordion = [];
    const course = await getCourse(params.courseId);
    if (!course) {
        throw new Response("", {
            status: course.status,
            statusText: course.message
        });
    }
    const courseContent = await getCourseContent(course.id);
    const sections = await getSections(courseContent.id); // list of Accordions in our component
    // data is kidna of deep here and it's not possible to flatten it.
    // so we have to do something krazy here i mean something like accordionAtom.See in accordionAtom file for reference.
    const accordion = await Promise.all(sections.map(async (section) => {
        const sectionItems = await getSectionItems(section.id); // This will retrieve a list of AccordionItems for an Accordion
        const itemWorkouts = await Promise.all(sectionItems.map(async (item) => {
            const workouts = await getWorkouts(item.id); // This will retrieve a list of workouts for an item 
            const workoutExercises = await Promise.all(workouts.map(async (workout) => {
                const correctExercises = await getCorrectExercises(workout.id); // This will retrieve a list of Correct Form Exercises for a workout
                const wrongExercises = await getWrongExercises(workout.id); // This will retrieve a list of Wrong Form Exercises for a workout.
                return {
                    ...workout,
                    correctForm: correctExercises,
                    wrongForm: wrongExercises
                };
            }));
            return { ...item, workout: workoutExercises };
        }));
        return { ...section, items: itemWorkouts };
    }));
    return { course, courseContent, accordion };
}

// responsible for the 'workout' demo card
function WorkoutMediaCard({ workout, correctForm, wrongForm, open }) {
    const [isOpenCorrect, setisOpenCorrect] = React.useState(false);
    const [isOpenWrong, setisOpenWrong] = React.useState(false);

    const handleClickOpen = (btn) => {
        if (btn === 'correct') {
            setisOpenCorrect(true);
        } else {
            setisOpenWrong(true);
        }
    };


    return (
        open &&
        <>
            <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: { xs: 700, md: 645 }, height: '100%' }}>
                <CardMedia
                    component="iframe"
                    sx={{ aspectRatio: 16 / 9 }}
                    src={workout.demo}
                    alt="workout demo"
                    allowFullScreen
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"

                />
                <CardContent sx={{ width: 320 }}>
                    <ThemeProvider theme={theme}>
                        <Typography maxHeight={{ xs: 200, sm: 250 }} height={{ xs: 200, sm: 250 }} overflow={'auto'} gutterBottom variant="h5" component="div">
                            {workout.exercise}
                        </Typography>
                    </ThemeProvider>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                    <Grid container justifyContent={'center'} columns={{ xs: 4, sm: 8 }} spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('correct')} startIcon={<CheckIcon color="success" />} color="success" fullWidth={true} variant="outlined" size="large">Form</Button>
                            {/* <CorrectFormDialog correctFormExercises={correctForm} open={isOpenCorrect} setOpen={setisOpenCorrect} /> */}
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('wrong')} startIcon={<ClearIcon color="error" />} color="error" fullWidth={true} variant="outlined" size="large">Form</Button>
                            {/* <WrongFormDialog wrongFormExercises={wrongForm} open={isOpenWrong} setOpen={setisOpenWrong} /> */}
                        </Grid>
                        <Grid item >
                            <Button startIcon={<EditIcon />}>Edit</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    );
}

export function ResponsiveDialog({ accordionItem, children }) {
    const [open, setOpen] = React.useState(false);
    const [isWorkoutRoutine, setIsWorkoutRoutine] = React.useState(accordionItem?.workouts?.length > 0)
    const theme2 = useTheme();
    const fullScreen = useMediaQuery(theme2.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                {/* <YouTubeIcon theme={theme2} sx={{ position: 'absolute', left: 10 }} fontSize="x-small"></YouTubeIcon> */}
                <DescriptionIcon theme={theme2} sx={{ position: 'sticky', marginRight: 2 }} fontSize="x-small"></DescriptionIcon>
                <Typography align='justify' variant="body" onClick={handleClickOpen} sx={{ cursor: 'pointer', '&:hover': { color: 'lightgray' } }}>
                    {children}
                </Typography>
            </ThemeProvider>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={true}
                maxWidth={'md'}

            >

                <Grid container>
                    <Grid item container justifyContent={'center'} marginLeft={{ md: 2 }} marginRight={{ md: 2 }}>
                        <DialogTitle id="responsive-dialog-title">
                            <ButtonGroup
                                disableElevation
                                aria-label="button group"
                            >
                                <Button onClick={() => setIsWorkoutRoutine(true)} variant={isWorkoutRoutine ? 'contained' : 'outlined'}>Workout Routine</Button>
                                <Button onClick={() => setIsWorkoutRoutine(false)} variant={isWorkoutRoutine ? 'outlined' : 'contained'}>Video Lecture / Readme</Button>
                            </ButtonGroup>
                        </DialogTitle>
                    </Grid>
                    <Grid item container justifyContent={'center'} marginLeft={{ md: 2 }} marginRight={{ md: 2 }}>
                        <DialogContent >
                            {isWorkoutRoutine ?
                                <Grid justifyContent={{ xs: 'center', sm: 'flex-start' }} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                                    {accordionItem.workouts(workout => {
                                        <Grid item sm={6}>
                                            <WorkoutMediaCard workout={workout} open={open}> </WorkoutMediaCard>
                                        </Grid>
                                    })

                                    }

                                </Grid>
                                :
                                <Grid justifyContent={{ xs: 'center', }} item container>
                                    <Grid item width={'81%'}>
                                        {getEmbedUrl(accordionItem.lecture) ?
                                            <Box mt={4} className="course-lecture-container" component={'div'}>
                                                <iframe className="course-lecture" src={getEmbedUrl(accordionItem.lecture)} title="vide-lecture here" allowFullScreen></iframe>                                    </Box>
                                            :
                                            <Box mt="5%" component="div" height={200} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ border: '2px dotted black' }}>
                                                <Typography variant="body" align={'center'}>
                                                    No video
                                                </Typography>
                                            </Box>
                                        }
                                    </Grid>
                                    <Grid item mt={4}>
                                        <ThemeProvider theme={theme}>
                                            <Typography variant="h4" textAlign={{ xs: 'center', sm: 'left' }}>
                                                Read me / Description
                                            </Typography>
                                        </ThemeProvider>
                                    </Grid>
                                    <Grid item xs={10} mt={4}>

                                    </Grid>
                                </Grid>
                            }
                        </DialogContent>
                    </Grid>
                </Grid>

                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button> */}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

function ControlledAccordions() {
    const [expanded, setExpanded] = React.useState(false);
    const { accordion } = useLoaderData();
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    return (
        <>
            {
                accordion.map((accordion) =>
                    <AccordionSection key={accordion.id} handleChange={handleChange} expanded={expanded} accordion={accordion} />
                )
            }
        </>
    );


}

export default function Course() {
    const theme2 = useTheme();
    const isSmallScreen = useMediaQuery(theme2.breakpoints.down('sm'));
    const { course, courseContent } = useLoaderData();


    return (
        <>
            <br></br>
            <Container maxWidth="xl">
                <Box sx={{ marginLeft: '4vw', marginRight: '4vw' }}>
                    <Box mb={2} >
                        <Button fullWidth={isSmallScreen ? true : false}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </Button>
                    </Box>
                    <Box className="clearfix" component={'div'}>
                        <Paper elevation={4} sx={{ padding: { xs: '7%', md: '3%' }, float: 'left', margin: '0 20px 20px 0' }}>
                            <ThemeProvider theme={theme}>

                                        <Container sx={{ padding: '4%', maxWidth: { xs: 700, md: 500 } }} component="div">
                                            <img src={course.thumbnail} className="course-thumbnail" />
                                        </Container>
    
   

                                <Typography sx={{ maxWidth: { md: 250, xs: 300, sm: 400 }, mt: 2 }} noWrap>
                                    <b>Instructor:</b> {course.created_by_name} </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                    <AttachMoneyIcon fontSize="large" />
                                    <Typography fontWeight="bolder" sx={{ fontSize: '2em' }}>
                                        {course.price == 0 ? 'Free' : course.price}
                                    </Typography>

                                </Box>
                                <Box display='flex' justifyContent={'center'} mt={2}>
                                    <Button fullWidth variant="contained">
                                        Enroll now!
                                    </Button>
                                </Box>
                                <Grid container columns={{ xs: 6, md: 12 }} mt={2}>
                                    <Grid item xs={3} md={6}>
                                        <Typography fontSize="small" variant="small" color={'text.secondary'}>
                                            <b>Created on:</b> {course.course_created}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} md={6} >
                                        <Typography fontSize="small" variant="small" color={'text.secondary'}>
                                            <b>Last updated:</b> {course.course_updated}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} md={6}>
                                        <Typography fontSize="small" variant="small" color={'text.secondary'}>
                                            <b>Rating:</b> {course.average_rating}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} md={6}>
                                        <Typography fontSize="small" variant="small" color={'text.secondary'}>
                                            <b>Weeks:</b> {course.weeks}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ThemeProvider>
                        </Paper>
                        <Typography fontWeight="bold" variant="h3">
                            {course.title}
                        </Typography>
                        <Box className="html-content" component={'div'} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.description) }} />
                    </Box>
                    <br></br>
                    <hr></hr>
                    <Grid mt={'2%'} container direction={'column'} alignItems={'flex-start'} spacing={3}>
                        <Grid item>
                            <ThemeProvider theme={theme} >
                                <Typography variant="h3">
                                    Overview
                                </Typography>
                            </ThemeProvider>
                        </Grid>
                        <Grid item>
                            <Box component="div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(courseContent.overview) }} />
                        </Grid>
                        <Grid item width={'100%'}>
                            <ThemeProvider theme={theme}>
                                <Typography sx={{ textAlign: 'left' }} variant="h6">
                                    Preview this course
                                </Typography>
                            </ThemeProvider>
                            <br />
                            <Box className="course-lecture-container" component={'div'}>
                                <iframe className="course-lecture" src={courseContent.preview} title="vide-lecture here" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;" allowFullScreen></iframe>
                            </Box>
                        </Grid>
                        <br />
                        <Grid item>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h4">
                                    Course content
                                </Typography>
                            </ThemeProvider>
                        </Grid>
                        <Grid item width={{ xs: '100%', md: '69%' }}>
                            <ControlledAccordions />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}


// mock data 
// temporary for now 
// const user = {
//     firstName: 'test user',
//     lastName: 'isUser'
// }
// const course = {
//     title: "test course test course test course test course test course test course test coursetest ",
//     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac tortor sed risus pellentesque efficitur. Cras et nulla mauris. Nulla auctor vel nisl vitae iaculis. Suspendisse laoreet cursus elit. Curabitur maximus ultricies orci. Fusce consectetur sollicitudin purus, in dignissim neque condimentum in. Mauris mattis dapibus quam, at rhoncus sapien viverra in. Maecenas mollis erat risus, ac sagittis leo pharetra ultricies. In pellentesque rhoncus tortor, at tristique nisl consequat in. Praesent ipsum eros, egestas gravida efficitur sed, suscipit sed dui.

//     Aliquam arcu arcu, pellentesque a nunc rhoncus, imperdiet interdum ipsum. Proin euismod risus ut velit dignissim ornare. Fusce eu nisi sit amet quam placerat egestas eu non urna. Sed at diam ut libero cursus blandit. Integer in lectus ac est laoreet ultrices. Nunc iaculis vel dolor placerat consectetur. Aliquam tellus enim, pretium eu ipsum sit amet, finibus mollis nibh. Donec et lacinia ligula. Sed feugiat nulla lectus, quis dictum neque hendrerit nec. In tempor congue malesuada. Nunc sodales nulla ut massa pellentesque, at lobortis quam pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Sed ullamcorper pharetra velit nec ullamcorper. Fusce pulvinar purus eu interdum viverra. Suspendisse aliquam tellus eget arcu dignissim, sed tempus ante consectetur.`,
//     // thumbnail: 'https://i.imgur.com/B5wZm19.jpeg',
//     thumbnail: 'https://i.imgur.com/e3mMEwA.gif',
//     // thumbnail: 'https://i.imgur.com/K6NLbi4.gif',
//     // thumbnail: 'https://i.imgur.com/bC5G14n.gif',
//     courseCreated: '10/20/2024',
//     courseUpdated: '10/25/2024',
//     created_by: 'testuser'
// }
// const courseContent = {
//     // lecture: "https://youtube.com/embed/CXMZxgNnnv8",
//     lecture: 'https://www.youtube.com/embed/LxKHX2fumJw',
//     overview: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur ut tellus a sapien porttitor vulputate. Sed pulvinar tincidunt lacus. Praesent tincidunt leo id nibh fringilla, tempor interdum felis rhoncus. Duis vestibulum, mi eu porta sodales, magna mauris bibendum lacus, id tincidunt ipsum libero ac justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed lorem libero. Donec cursus dictum leo a feugiat. Mauris non felis vitae mi fermentum blandit. Sed placerat, nunc et accumsan gravida, leo ipsum venenatis nulla, non gravida nisl ex et felis. Proin quis gravida orci, at aliquam enim. Curabitur eget mi nisl. Donec mattis dui tellus, non congue lacus suscipit et. Nullam sit amet ultricies massa. Nullam rutrum ullamcorper lacus. Fusce dictum interdum ligula vel pellentesque.

//     Phasellus luctus lorem sed sapien pharetra, ac laoreet arcu sollicitudin. Morbi viverra rhoncus bibendum. In tellus nisi, varius sed ligula sit amet, ultricies laoreet magna. Donec maximus a augue nec vestibulum. Donec accumsan odio at porta rutrum. Nulla a blandit mi. Sed tortor justo, imperdiet in maximus sed, sagittis at eros. Nunc id sagittis mauris, porta malesuada mi. Vivamus ut nisl mollis, egestas odio at, ornare massa. Proin dictum, augue vel fermentum egestas, arcu elit fermentum lorem, nec consectetur mi massa ac mauris. Sed sollicitudin eleifend ullamcorper. Duis commodo lorem eu finibus ultricies. Pellentesque cursus risus eget volutpat lacinia. Nulla vitae est at massa vehicula bibendum.`,
//     weeks: 12,
// }
// const workouts1 = {
//     intesity: "H",
//     exercise: " quis, ",
//     demo: "https://www.youtube.com/embed/IZMKe61144w",
//     rest_time: 2,
//     sets: 3,
//     reps: 10,
//     excertion: 8,
// }

// const workouts2 = {
//     intesity: "H",
//     exercise: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur    description: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
//     demo: "https://youtube.com/embed/IODxDxX7oi4",
//     rest_time: 2,
//     sets: 3,
//     reps: 10,
//     excertion: 8,
// }
// const correctForm = [{
//     demo: 'https://www.youtube.com/embed/IODxDxX7oi4',
//     description: "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
// }]
// const wrongForm = [{
//     demo: 'https://www.youtube.com/embed/yQEx9OC2C3E',
//     description: "scapula not moving"
// }]

// const section1 = {
//     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur ut tellus a sapien porttitor vulputate. Sed pulvinar tincidunt lacus. Praesent tincidunt leo id nibh fringilla, tempor interdum id tincidunt ipsum libero ac justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
// }
// const sectionItem1 = {
//     lecture: "https://www.youtube.com/embed/ua2rJJwZ4nc",
//     description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
//     title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. "
// }

// const sectionItem2 = {
//     lecture: "https://www.youtube.com/embed/ua2rJJwZ4nc",
//     description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
//     title: "Workout Routine"
// }