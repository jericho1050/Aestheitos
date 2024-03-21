import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, Paper, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import CorrectFormDialog from "../MUI-components/CorrectFormDialog";
import WrongFormDialog from "../MUI-components/WrongFormDialog";


let theme = createTheme()
theme = responsiveFontSizes(theme)

// mock data 
// temporary for now 
const user = {
    firstName: 'test user',
    lastName: 'isUser'
}
const course = {
    title: "test course test course test course test course test course test course test coursetest ",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac tortor sed risus pellentesque efficitur. Cras et nulla mauris. Nulla auctor vel nisl vitae iaculis. Suspendisse laoreet cursus elit. Curabitur maximus ultricies orci. Fusce consectetur sollicitudin purus, in dignissim neque condimentum in. Mauris mattis dapibus quam, at rhoncus sapien viverra in. Maecenas mollis erat risus, ac sagittis leo pharetra ultricies. In pellentesque rhoncus tortor, at tristique nisl consequat in. Praesent ipsum eros, egestas gravida efficitur sed, suscipit sed dui.

    Aliquam arcu arcu, pellentesque a nunc rhoncus, imperdiet interdum ipsum. Proin euismod risus ut velit dignissim ornare. Fusce eu nisi sit amet quam placerat egestas eu non urna. Sed at diam ut libero cursus blandit. Integer in lectus ac est laoreet ultrices. Nunc iaculis vel dolor placerat consectetur. Aliquam tellus enim, pretium eu ipsum sit amet, finibus mollis nibh. Donec et lacinia ligula. Sed feugiat nulla lectus, quis dictum neque hendrerit nec. In tempor congue malesuada. Nunc sodales nulla ut massa pellentesque, at lobortis quam pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Sed ullamcorper pharetra velit nec ullamcorper. Fusce pulvinar purus eu interdum viverra. Suspendisse aliquam tellus eget arcu dignissim, sed tempus ante consectetur.`,
    // thumbnail: 'https://i.imgur.com/B5wZm19.jpeg',
    thumbnail: 'https://i.imgur.com/e3mMEwA.gif',
    // thumbnail: 'https://i.imgur.com/K6NLbi4.gif',
    // thumbnail: 'https://i.imgur.com/bC5G14n.gif',
    courseCreated: '10/20/2024',
    created_by: 'testuser'
}
const courseContent = {
    // lecture: "https://youtube.com/embed/CXMZxgNnnv8",
    lecture: 'https://www.youtube.com/embed/LxKHX2fumJw',
    overview: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur ut tellus a sapien porttitor vulputate. Sed pulvinar tincidunt lacus. Praesent tincidunt leo id nibh fringilla, tempor interdum felis rhoncus. Duis vestibulum, mi eu porta sodales, magna mauris bibendum lacus, id tincidunt ipsum libero ac justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed lorem libero. Donec cursus dictum leo a feugiat. Mauris non felis vitae mi fermentum blandit. Sed placerat, nunc et accumsan gravida, leo ipsum venenatis nulla, non gravida nisl ex et felis. Proin quis gravida orci, at aliquam enim. Curabitur eget mi nisl. Donec mattis dui tellus, non congue lacus suscipit et. Nullam sit amet ultricies massa. Nullam rutrum ullamcorper lacus. Fusce dictum interdum ligula vel pellentesque.

    Phasellus luctus lorem sed sapien pharetra, ac laoreet arcu sollicitudin. Morbi viverra rhoncus bibendum. In tellus nisi, varius sed ligula sit amet, ultricies laoreet magna. Donec maximus a augue nec vestibulum. Donec accumsan odio at porta rutrum. Nulla a blandit mi. Sed tortor justo, imperdiet in maximus sed, sagittis at eros. Nunc id sagittis mauris, porta malesuada mi. Vivamus ut nisl mollis, egestas odio at, ornare massa. Proin dictum, augue vel fermentum egestas, arcu elit fermentum lorem, nec consectetur mi massa ac mauris. Sed sollicitudin eleifend ullamcorper. Duis commodo lorem eu finibus ultricies. Pellentesque cursus risus eget volutpat lacinia. Nulla vitae est at massa vehicula bibendum.`,
    weeks: 12,
}
const workouts1 = {
    intesity: "H",
    exercise: " quis, ",
    demo: "https://www.youtube.com/embed/IZMKe61144w",
    rest_time: 2,
    sets: 3,
    reps: 10,
    excertion: 8,
}

const workouts2 = {
    intesity: "H",
    exercise: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur    description: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    demo: "https://youtube.com/embed/IODxDxX7oi4",
    rest_time: 2,
    sets: 3,
    reps: 10,
    excertion: 8,
}
const correctForm = {
    demo: 'https://www.youtube.com/embed/IODxDxX7oi4',
    description: "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
}
const wrongForm = {
    demo: 'https://www.youtube.com/embed/yQEx9OC2C3E',
    description: "scapula not moving"
}

const section1 = {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur ut tellus a sapien porttitor vulputate. Sed pulvinar tincidunt lacus. Praesent tincidunt leo id nibh fringilla, tempor interdum id tincidunt ipsum libero ac justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
}
const sectionItem1 = {
    lecture: "https://www.youtube.com/embed/ua2rJJwZ4nc",
    description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. "
}

const sectionItem2 = {
    lecture: "https://www.youtube.com/embed/ua2rJJwZ4nc",
    description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    title: "Workout Routine"
}


// responsible for the 'workout' demo card
function VideoMediaCard({ workout, correctForm, wrongForm, open }) {
    const [isOpenCorrect, setisOpenCorrect] = React.useState(false);
    const [isOpenWrong, setisOpenWrong] = React.useState(false);

    const handleClickOpen = (btn) => {
        if (btn === 'correct'){
            setisOpenCorrect(true);
        } else {
            setisOpenWrong(true);
        }
    };
    

    return (
        open &&
        <>
            <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth:{xs: 500, sm: 400}, maxHeight:{xs: 700, md: 645}, height: '100%' }}>
                <CardMedia
                    component="iframe"
                    sx={{ aspectRatio: 16 / 9}}
                    src={workout.demo}
                    alt="workout demo"
                    allowFullScreen
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
                    
                />
                <CardContent>
                    <ThemeProvider theme={theme}>
                        <Typography maxHeight={{xs:200, sm: 250}} height={{xs:200, sm: 250}} width={{xs: 420, sm: 'inherit'}} overflow={'auto'} gutterBottom variant="h5" component="div">
                            {workout.exercise}
                        </Typography>
                    </ThemeProvider>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                    <Grid container justifyContent={'center'} columns={{ xs: 4, sm: 8 }}spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={()=> handleClickOpen('correct')} startIcon={<CheckIcon color="success" />} color="success" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <CorrectFormDialog correctForm={correctForm} open={isOpenCorrect} setOpen={setisOpenCorrect} />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={()=> handleClickOpen('wrong')} startIcon={<ClearIcon color="error" />} color="error" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <WrongFormDialog wrongForm={wrongForm} open={isOpenWrong} setOpen={setisOpenWrong} />
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

function ResponsiveDialog({ children }) {
    const [open, setOpen] = React.useState(false);
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
                    <Grid item container justifyContent={'center'} marginLeft={{ md: 2}} marginRight={{ md: 2}}>
                        <DialogTitle id="responsive-dialog-title">
                            {"Workout Routine"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid  justifyContent={{xs:'center', sm:'flex-start'}} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                                <Grid item sm={6}>
                                    <VideoMediaCard workout={workouts1} correctForm={correctForm} wrongForm={wrongForm} open={open}> </VideoMediaCard>
                                </Grid>
                                <Grid item sm={6}>
                                    <VideoMediaCard workout={workouts2} correctForm={correctForm} wrongForm={wrongForm} open={open}>
                                    </VideoMediaCard>
                                </Grid>
                                <Grid item sm={6}>
                                    <VideoMediaCard workout={workouts1} correctForm={correctForm} wrongForm={wrongForm} open={open}>
                                    </VideoMediaCard>
                                </Grid>
                            </Grid>
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


function ControlledAccordions({ section, sectionItem }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }
    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button sx={{ paddingLeft: 2 }} startIcon={<EditIcon />} size="small" />
                        <ExpandMoreIcon />
                    </Box>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ padding: '3%' }}
                >

                    <Typography fontWeight="bold" align='justify' sx={{ maxWidth: '96%', flexShrink: 0 }}>
                        {section.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingLeft: '5%' }}
                >

                    <ResponsiveDialog>
                        {sectionItem.title}
                    </ResponsiveDialog>
                </AccordionDetails>
                <AccordionDetails sx={{ paddingLeft: '5%' }}
                >
                    <ResponsiveDialog>
                        {sectionItem.title}
                    </ResponsiveDialog>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button sx={{ paddingLeft: 2 }} startIcon={<EditIcon />} size="small" />
                        <ExpandMoreIcon />
                    </Box>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ padding: '3%' }}
                >
                    <Typography fontWeight="bold" align='justify' sx={{ maxWidth: '96%', flexShrink: 0 }}>
                        {section.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingLeft: '5%' }}>

                    <ResponsiveDialog>
                        {sectionItem.title}
                    </ResponsiveDialog>
                </AccordionDetails>
                <AccordionDetails sx={{ paddingLeft: '5%' }}
                >
                    <ResponsiveDialog>
                        {sectionItem.title}
                    </ResponsiveDialog>
                </AccordionDetails>
            </Accordion>
        </div>
    );


}

export default function Course() {


    return (
        <>
            <br></br>
            <Box sx={{ marginLeft: '3vw', marginRight: '3vw' }}>
                <Grid container mb={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Grid item>
                        <Button>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </Button>
                    </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }} spacing={5}>
                    {/* Paper starts here */}
                    <Grid item xs md={'auto'}>
                        <Paper elevation={4}>
                            <Grid item container justifyContent={'center'}>
                                <Grid item>
                                    <Container sx={{ padding: '5%', maxWidth: { xs: 700, md: 500 } }} component="div">
                                        <img src={course.thumbnail} className="course-thumbnail" />
                                    </Container>
                                </Grid>
                            </Grid>
                            <Grid item container wrap="nowrap" mt={1} alignItems={'center'} direction="column" spacing={4}>
                                <Grid item xs>
                                    <Typography sx={{ maxWidth: { md: 250, xs: 300, sm: 400 } }} noWrap>Instructor: {user.firstName} {user.lastName} yawayadfadsfgadsgfadsfgdfagadgfadsfadsfadsfadsfadsfadsadsfadsfadsfads</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained">
                                        Enroll now!
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent={'flex-start'} alignItems={"flex-end"} mt={4}>
                                <Grid item padding={2}>
                                    <small>Created on: {course.courseCreated}</small>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* Paper ends here */}
                    {/* title  & description starts here */}
                    <Grid item xs={12} sm={12} md lg>
                        <Grid item container wrap="nowrap" direction="column">
                            <Grid item xs>
                                <ThemeProvider theme={theme}>
                                    <Typography fontWeight="bold" variant="h2">
                                        {course.title}
                                    </Typography>
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs>
                                <ThemeProvider theme={theme} >

                                    <Typography align="justify" variant="body1">
                                        {course.description}
                                    </Typography>

                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* title  & description ends here */}
                <br></br>
                <hr></hr>
                <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3}>
                    <Grid item>
                        <ThemeProvider theme={theme} >
                            <Typography variant="h3">
                                Overview
                            </Typography>
                        </ThemeProvider>
                    </Grid>
                    <Grid item>
                        <ThemeProvider theme={theme}>
                            <Typography align="justify" variant="body2">
                                {courseContent.overview}
                            </Typography>
                        </ThemeProvider>
                    </Grid>
                    <Grid item>
                        <ThemeProvider theme={theme}>
                            <Typography sx={{ textAlign: 'center' }} variant="h4">
                                lecture for the entire course
                            </Typography>
                        </ThemeProvider>
                        <br />
                        <Box className="course-lecture-container" component={'div'}>
                            <iframe className="course-lecture" src={courseContent.lecture} title="vide-lecture here" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;" allowfullscreen></iframe>
                        </Box>
                    </Grid>
                    <br />
                    <Grid item>
                        <ThemeProvider theme={theme}>
                            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                                Course content
                            </Typography>
                        </ThemeProvider>
                    </Grid>
                    <Grid item>
                        <ControlledAccordions section={section1} sectionItem={sectionItem1} ></ControlledAccordions>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}