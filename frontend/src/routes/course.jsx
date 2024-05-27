import { Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Collapse, Container, Divider, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Popover, Stack, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
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
import { createCourseComment, createCourseEnrollment, deleteCourse, deleteCourseComment, deleteCourseUnenrollment, getCorrectExercises, getCourse, getCourseComments, getCourseContent, getCourseEnrollees, getSectionItems, getSections, getUser, getWorkouts, getWrongExercises, updateCourseComment } from "../courses";
import { Link, redirect, useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import DOMPurify from "dompurify";
import { AccordionSection } from "../components/Accordion";
import getEmbedUrl from "../helper/getEmbedUrl";
import CorrectFormDialog from "../components/CorrectFormDialog";
import WrongFormDialog from "../components/WrongFormDialog";
import { Parser } from "html-to-react";
import { AccessTokenDecodedContext, AuthContext, useAuthToken } from "../contexts/authContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplyIcon from '@mui/icons-material/Reply';
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAtom } from "jotai";
import { snackbarReducerAtom } from "../atoms/snackbarAtom";

let theme = createTheme()
theme = responsiveFontSizes(theme)


export async function loader({ params }) {
    // if you notice the pattern
    // everytime we do a GET request, the server respond with it's properties of our instance including it's ID
    // then we chain this to retrieve other instances too.
    // now we have a nice classic example of "callback hell" or "pyramid of doom"
    const user = await getUser();
    const course = await getCourse(params.courseId);
    if (!course) {
        throw new Response("", {
            status: course.status,
            statusText: course.message
        });
    }
    const enrollees = await getCourseEnrollees(course.id);
    const courseContent = await getCourseContent(course.id);
    if (!courseContent) {
        throw new Response("", {
            status: courseContent.status,
            statusText: courseContent.message
        });
    }
    const comments = await getCourseComments(course.id);

    try {
        const sections = await getSections(courseContent.id);
        const accordion = await Promise.all(sections.map(async (section) => {
            try {
                const sectionItems = await getSectionItems(section.id);
                const itemWorkouts = await Promise.all(sectionItems.map(async (item) => {
                    try {
                        const workouts = await getWorkouts(item.id);
                        const workoutExercises = await Promise.all(workouts.map(async (workout) => {
                            try {
                                const correctFormExercises = await getCorrectExercises(workout.id);
                                const wrongFormExercises = await getWrongExercises(workout.id);
                                return {
                                    ...workout,
                                    correctForm: correctFormExercises,
                                    wrongForm: wrongFormExercises
                                };
                            } catch (error) {
                                console.error('Error getting exercises:', error);
                                return workout;
                            }
                        }));
                        return { ...item, workouts: workoutExercises };
                    } catch (error) {
                        console.error('Error getting workouts:', error);
                        return item;
                    }
                }));
                return { ...section, items: itemWorkouts };
            } catch (error) {
                console.error('Error getting section items:', error);
                return section;
            }
        }));

        return { user, course, courseContent, accordion, enrollees, comments };
    } catch (error) {
        console.error('Error getting sections:', error);
    }
}

export async function action({ request, params }) {
    const formData = await request.formData();
    let enrollment, unenrollment, comment;

    switch (formData.get('intent')) {
        case 'enroll':
            enrollment = await createCourseEnrollment(params.courseId);
            break;
        case 'unenroll':
            unenrollment = await deleteCourseUnenrollment(formData.get('enrollmentId'));
            break;
        case 'deleteCourse':
            await deleteCourse(params.courseId);
            return redirect('/');
        case 'editing':
            comment = await updateCourseComment(formData.get('commentId'), formData);
            break;
        case 'deleting':
            comment = await deleteCourseComment(formData.get('commentId'));
            break;
        default:
            comment = await createCourseComment(params.courseId, formData);


    }

    return { enrollment, unenrollment, comment };
}

function CommentReply({ reply, level }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [status, setStatus] = React.useState('');
    const fetcher = useFetcher();
    const { token } = useAuthToken();
    const isAuthenticated = token['access'] !== null;

    function handleClick(e) {
        setAnchorEl(e.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    function handleClickEdit() {
        setStatus('editing');
    }
    function handleClickDelete() {
        setStatus('deleting');
        fetcher.submit({ intent: 'deleting', commentId: reply.id }, { method: 'DELETE' });
    }
    const open = Boolean(anchorEl);

    return (
        <Box>
            <ListItem
                secondaryAction={
                    <>
                        {isAuthenticated && (
                            <IconButton id="ellipsis" edge="end" aria-label="ellipsis" sx={{ p: '0.3em 0.5em' }} onClick={handleClick}>
                                <FontAwesomeIcon icon={faEllipsisV} fontSize="medium" />
                            </IconButton>
                        )}

                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            onClose={handleClose}
                        >

                            <Stack alignItems={'flex-start'} p={'0.4em 0.2em'}>
                                <Button fullWidth sx={{ color: 'rgba(0, 0, 0, 0.6)', pr: 2 }} onClick={handleClickEdit}>
                                    <Box ml={-3} pl={2} pr={2}>
                                        <EditIcon fontSize="smaller" />
                                    </Box>
                                    Edit
                                </Button>
                                <Divider />
                                <Button fullWidth sx={{ color: 'rgba(0, 0, 0, 0.6)', pr: 2 }} onClick={handleClickDelete}>
                                    <Box pl={2} pr={2}>
                                        <DeleteIcon fontSize="smaller" />
                                    </Box>
                                    Delete
                                </Button>

                            </Stack>
                        </Popover>
                    </>
                }
                alignItems="flex-start">
                {status === 'editing' ?

                    <CommentTextField setStatus={setStatus} status={status} comment={reply} />
                    :
                    (<>
                        <ListItemAvatar>
                            <Avatar alt={reply.username} src={reply.profile_pic} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${reply.first_name || reply.username} ${reply.last_name || ''}`}
                            secondary={reply.comment}
                        />
                    </>)}
            </ListItem>
            <ListItemText inset={true} style={{ paddingLeft: `${(level + 1) * 20}px` }}>
                <IconButton onClick={() => setStatus('replying')} sx={{ borderRadius: 3, mt: -1 }}>
                    <ReplyIcon sx={{ fontSize: 19 }} /> <Typography variant="span" sx={{ fontSize: 14 }}>Reply</Typography>
                </IconButton>
            </ListItemText>
            {
                status === 'replying' &&
                (<Box pl={`${(level + 1) * 20}px`}>
                    <CommentTextField setStatus={setStatus} parentComment={reply.id} username={`@${reply.first_name || reply.username} ${reply.last_name || ''}`} />
                </Box>)

            }
            <CourseCommentReplies comment={reply} level={level + 1} />
        </Box>
    )
}

function CourseCommentReplies({ comment, level = 0 }) {
    const [open, setOpen] = React.useState(false);
    const totalReplies = comment.replies.length;

    return (
        <Grid container>
            {totalReplies !== 0 && level === 0 &&

                <Grid item xs={12} style={{ paddingLeft: `${level * 20}px` }}>
                    <Button startIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
                        {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
                    </Button>
                </Grid>
            }
            <Grid item xs>
                <Collapse in={open || level !== 0} timeout='auto' unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            comment.replies.map(reply => (
                                <CommentReply key={reply.id} reply={reply} level={level} />
                            ))}
                    </List>
                </Collapse>
            </Grid>
        </Grid>
    )
}

function Comment({ comment }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [status, setStatus] = React.useState('');
    const fetcher = useFetcher();
    const { token } = useAuthToken();
    const isAuthenticated = token['access'] !== null;

    function handleClick(e) {
        setAnchorEl(e.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    function handleClickEdit() {
        setStatus('editing');
    }
    function handleClickDelete() {
        setStatus('deleting');
        fetcher.submit({ intent: 'deleting', commentId: comment.id }, { method: 'DELETE' });
    }

    const open = Boolean(anchorEl);

    return (
        <Box>
            <ListItem
                secondaryAction={

                    <>
                        {isAuthenticated && (
                            <IconButton id="ellipsis" edge="end" aria-label="ellipsis" sx={{ p: '0.3em 0.5em' }} onClick={handleClick}>
                                <FontAwesomeIcon icon={faEllipsisV} fontSize="medium" />
                            </IconButton>
                        )}

                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            onClose={handleClose}
                        >

                            <Stack alignItems={'flex-start'} p={'0.4em 0.2em'}>
                                <Button fullWidth sx={{ color: 'rgba(0, 0, 0, 0.6)', pr: 2 }} onClick={handleClickEdit}>
                                    <Box ml={-3} pl={2} pr={2}>
                                        <EditIcon fontSize="smaller" />
                                    </Box>
                                    Edit
                                </Button>
                                <Divider />
                                <Button fullWidth sx={{ color: 'rgba(0, 0, 0, 0.6)', pr: 2 }} onClick={handleClickDelete}>
                                    <Box pl={2} pr={2}>
                                        <DeleteIcon fontSize="smaller" />
                                    </Box>
                                    Delete
                                </Button>

                            </Stack>
                        </Popover>
                    </>

                }
                alignItems="flex-start">

                {
                    status === 'editing' ?
                        <CommentTextField status={status} setStatus={setStatus} comment={comment} />
                        :
                        (<>
                            <ListItemAvatar>
                                <Avatar alt={comment.username} src={comment.profile_pic} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${comment.first_name || comment.username} ${comment.last_name || ''}`}
                                secondary={
                                    comment.comment
                                }
                            />
                        </>)

                }

            </ListItem>
            <ListItemText inset={true}>
                <IconButton onClick={() => setStatus('replying')} sx={{ borderRadius: 3, mt: -1 }}>
                    <ReplyIcon sx={{ fontSize: 19 }} /> <Typography variant="span" sx={{ fontSize: 14 }}>Reply</Typography>
                </IconButton>
            </ListItemText>
            {
                status === 'replying' &&
                <Box pl={'56px'}>
                    <CommentTextField status={status} setStatus={setStatus} parentComment={comment.id} />
                </Box>

            }
            <Box pl={'56px'}>
                <CourseCommentReplies comment={comment} />
            </Box>


            <Divider variant="inset" component="li" />
        </Box>
    )
}

function CourseComments() {
    const { comments } = useLoaderData();
    const [parent,] = useAutoAnimate();
    return (
        <List ref={parent} sx={{ width: '100%', maxWidth: 'inherit', bgcolor: 'background.paper' }}>
            <ListItem >
                <CommentTextField />
            </ListItem>
            {comments.map(comment =>

                <Comment key={comment.id} comment={comment} />

            )}

        </List>
    );
}

function CommentTextField({ status, setStatus, comment = '', parentComment, username }) {
    const [isTyping, setIsTyping] = React.useState(false);
    const [text, setText] = React.useState(username || '');
    const { user } = useLoaderData();
    const { token } = useAuthToken();
    const isAuthenticated = token['access'] !== null;
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const revalidator = useRevalidator();

    function handleFocus() {
        if (!isAuthenticated) {
            navigate('/signin');
        } else {
            setIsTyping(true);
        }
    }

    function handleChange(e) {
        setText(e.target.value);
    }
    React.useEffect(() => {
        if (fetcher.state === 'submitting') {
            setText('');
            setIsTyping(!isTyping);
            setStatus && setStatus('');
            revalidator.revalidate(); // this will & should cause a re-render so that the comment useLoaderData in CourseComments (parent component) is updated. 
        }
    }, [fetcher]);
    return (
        <>
            {
                fetcher.state === 'idle' ?
                    <Grid container justifyContent={'flex-start'}>
                        <ListItemAvatar>
                            <Avatar alt="myPP" src={`${import.meta.env.VITE_API_URL}${user.profile_pic}`} />
                        </ListItemAvatar>
                        <Grid item xs>
                            <TextField
                                id="standard-multiline-static"
                                multiline
                                placeholder="Add a comment.."
                                variant="standard"
                                fullWidth
                                onFocus={handleFocus}
                                onChange={handleChange}
                                value={text || comment.comment}
                            />
                        </Grid>
                        {(isTyping || status === 'editing') && (
                            <Grid item container justifyContent={'flex-end'}>

                                <Grid item>
                                    <Button sx={{ borderRadius: 3 }} onClick={() => {
                                        setIsTyping(!isTyping);
                                        setStatus && setStatus('');
                                    }}>Cancel</Button>
                                </Grid>
                                <fetcher.Form method="post">
                                    <Grid item>
                                        <Button variant="contained" sx={{ borderRadius: 3 }} name="comment" value={text} type='submit' disabled={!text}>{status === 'replying' ? 'Reply' : status === 'editing' ? 'Save' : 'Comment'}</Button>
                                    </Grid>
                                    {parentComment && <TextField type="hidden" name="parent_comment" value={parentComment} />} {/* if user is replying to a comment render this hidden Textfield */}
                                    {comment.id && (
                                        <>
                                            {/* if user is editing his own comment render this two hidden TextFields */}
                                            <TextField type="hidden" name="intent" value={status} />
                                            <TextField type="hidden" name="commentId" value={comment.id} />
                                        </>

                                    )}
                                </fetcher.Form>

                            </Grid>
                        )}
                    </Grid>
                    :

                    <Grid container justifyContent={'center'}>
                        <Grid item>
                            <CircularProgress />

                        </Grid>


                    </Grid>

            }
        </>
    )
}


// responsible for the 'workout' demo card
function WorkoutMediaCard({ workout, open }) {
    const [isOpenCorrect, setisOpenCorrect] = React.useState(false);
    const [isOpenWrong, setisOpenWrong] = React.useState(false);
    const myTheme = useTheme();
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
            <Card data-cy="Workout Card" sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: { xs: 700, md: 725 }, height: '100%', borderTop: `4px solid ${myTheme.palette.secondary.main}` }}>
                <CardMedia
                    component="img"
                    sx={{ aspectRatio: 16 / 9 }}
                    src={workout.demo}
                    alt="workout demo"

                />
                <CardContent sx={{ padding: '10px 0 10px 10px' }}>
                    <Container width="inherit" sx={{ height: { xs: 300, md: 350 }, overflow: 'auto' }} >
                        <Box className="html-content" component="div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(workout.exercise) }} />
                    </Container>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto', }}>
                    <Grid container justifyContent={'center'} columns={{ xs: 4, sm: 8 }} spacing={2} paddingBottom={2}>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('correct')} startIcon={<CheckIcon color="success" />} color="success" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <CorrectFormDialog correctFormExercises={workout.correctForm} open={isOpenCorrect} setOpen={setisOpenCorrect} />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('wrong')} startIcon={<ClearIcon color="error" />} color="error" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <WrongFormDialog wrongFormExercises={workout.wrongForm} open={isOpenWrong} setOpen={setisOpenWrong} />
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
    const htmlToReactParser = new Parser();
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
                                    {accordionItem.workouts.length > 0 ? accordionItem.workouts.map(workout => (
                                        <Grid key={workout.id} item sm={6}>
                                            <WorkoutMediaCard workout={workout} open={open}> </WorkoutMediaCard>
                                        </Grid>
                                    ))
                                        :
                                        <Grid item>
                                            <ThemeProvider theme={theme} >
                                                <Typography variant="body1" height={350}>
                                                    No Workouts To Show
                                                </Typography>
                                            </ThemeProvider>

                                        </Grid>
                                    }

                                </Grid>
                                :
                                <Grid justifyContent={{ xs: 'center', }} item container>
                                    <Grid item xs={10}>
                                        {getEmbedUrl(accordionItem.lecture) ?
                                            <Box mt={4} className="course-lecture-container" component={'div'}>
                                                <iframe className="course-video-lecture" src={getEmbedUrl(accordionItem.lecture)} title="vide-lecture here" allowFullScreen></iframe>
                                            </Box>
                                            :
                                            // <Box mt="5%" component="div" height={200} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ border: '2px dotted black' }}>
                                            //     <Typography variant="body">
                                            //         No video
                                            //     </Typography>
                                            // </Box>
                                            null
                                        }
                                    </Grid>
                                    <Grid item mt={4} container xs={10}>
                                        <Grid item >
                                            <ThemeProvider theme={theme}>
                                                <Typography variant="h4" fontWeight={'bold'}>
                                                    Description
                                                </Typography>
                                            </ThemeProvider>
                                        </Grid>
                                    </Grid>
                                    <Grid className="html-content" item mt={4} xs={10}>
                                        {htmlToReactParser.parse(accordionItem.description)}
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
    const { course, courseContent, enrollees } = useLoaderData();
    const htmlToReactParser = new Parser();
    const { token } = useAuthToken();
    const isAuthenticated = token['access'] !== null;
    const navigate = useNavigate();
    const accessTokenDecoded = React.useContext(AccessTokenDecodedContext);
    const isInstructor = accessTokenDecoded?.user_id === course.created_by;
    const enrollment = enrollees.find(enrollee => enrollee.user === accessTokenDecoded?.user_id && enrollee.course === course.id);
    const fetcher = useFetcher();
    const [, dispatch] = useAtom(snackbarReducerAtom);
    
    function handleClickEnroll() {
        if (!isAuthenticated) {
            navigate('/signin');
        }
        else {
            fetcher.submit({ intent: 'enroll' }, { method: 'post' });
        }
    }
    function handleClickUnenroll() {
        fetcher.submit({ intent: 'unenroll', enrollmentId: enrollment.id }, { method: 'delete' });
    }

    function handleClickSignUp() {
        navigate('/signup')
    }

    function handleClickEdit() {

    }

    function handleClickDelete() {
        dispatch({
            type: 'deleting',
            text: 'Course Deleted!'
        })
        fetcher.submit({ intent: 'deleteCourse', courseId: course.id }, { method: 'delete' });
    }
    return (
        <>
            <br></br>
            <Container component="main" maxWidth="lg">
                <Box sx={{ marginLeft: '4vw', marginRight: '4vw' }}>
                    {
                        isInstructor &&
                        (
                            <Box display="flex" position="fixed" bottom="20px" right="20px" flexDirection={'column'} gap={'0.69em'}>
                                <Fab color="primary" size={isSmallScreen ? 'medium' : 'large'} aria-label="edit">
                                    <EditIcon />
                                </Fab>
                                <Fab color="error" size={isSmallScreen ? 'medium' : 'large'} aria-label="delete" onClick={handleClickDelete}>
                                    <DeleteIcon />
                                </Fab>
                            </Box>
                        )
                    }

                    <Box className="clearfix" component={'div'}>
                        <Paper id="enroll" elevation={4} sx={{
                            padding: { xs: '7%', md: '3%' },
                            float: 'left',
                            margin: { xs: '0 0 40px 0', md: '0 30px 20px 0' }
                        }}>
                            <ThemeProvider theme={theme}>

                                <Container disableGutters sx={{ maxWidth: { xs: 700, md: 500 } }} component="div">
                                    <img src={course.thumbnail} className="course-thumbnail" />
                                </Container>



                                <Typography sx={{ maxWidth: { md: 250, xs: 300, sm: 400 }, mt: 2 }} noWrap>
                                    <b>Instructor:</b> {course.created_by_name} </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                    {course.price != 0 && <AttachMoneyIcon fontSize="large" />}
                                    <Typography fontWeight={800} sx={{ fontSize: '2em' }} className="price-tag">
                                        {course.price == 0 ? 'FREE' : course.price}
                                    </Typography>

                                </Box>
                                {

                                    accessTokenDecoded?.user_id === course.created_by && !enrollment ?
                                        null
                                        : accessTokenDecoded?.user_id !== course.created_by && !enrollment ?
                                            <Box display='flex' justifyContent={'center'} mt={2}>
                                                <Button size="large" fullWidth={isSmallScreen ? true : false} variant="contained" onClick={handleClickEnroll}>
                                                    Enroll now!
                                                </Button>
                                            </Box>
                                            :
                                            <Box display='flex' justifyContent={'center'} mt={2}>
                                                <Button size="large" fullWidth={isSmallScreen ? true : false} variant="contained" color="error" onClick={handleClickUnenroll}>
                                                    Unenroll
                                                </Button>
                                            </Box>
                                }

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
                        {/* <Box className="html-content" component={'div'} dangerouslySetInnerHTML={{ __html: DOMPurify(course.description) }} /> */}
                        <Box className="html-content">
                            {htmlToReactParser.parse(course.description)}
                        </Box>
                    </Box>
                    <br></br>
                    <Divider />
                    <Container className="course-container">
                        <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3}>
                            <Grid item alignSelf={'flex-start'}>
                                <ThemeProvider theme={theme} >
                                    <Typography variant="h4" fontWeight={'bold'}>
                                        Overview
                                    </Typography>
                                </ThemeProvider>
                            </Grid>
                            <Grid item alignSelf={'flex-start'}>
                                <Box className="html-content" component="div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(courseContent.overview) }} />
                            </Grid>
                            <Grid item>
                                <ThemeProvider theme={theme}>
                                    <Typography sx={{ textAlign: 'left' }} variant="h6" fontSize={'x-small'}>
                                        Preview this course
                                    </Typography>
                                </ThemeProvider>
                                <br />
                                {
                                    getEmbedUrl(courseContent.preview) ?


                                        (<Box sx={{ maxWidth: 'inherit' }} component={'div'}>
                                            <iframe className="course-preview" src={getEmbedUrl(courseContent.preview)} title="vide-lecture here" allowFullScreen></iframe>
                                        </Box>)
                                        :
                                        (<Box sx={{ maxWidth: 'inherit' }} component={'div'}>
                                            <iframe className="course-preview" src={''} title="vide-lecture here" allowFullScreen></iframe>
                                        </Box>)
                                }
                            </Grid>
                            <br />
                            {
                                !isAuthenticated ? // if anonymous user, don't show the course's content
                                    <>
                                        <Grid item container position={'relative'} justifyContent={'flex-start'}>
                                            <Grid item mb={2}>
                                                <ThemeProvider theme={theme}>
                                                    <Typography variant="h4" fontWeight={'bold'}>
                                                        Course content
                                                    </Typography>
                                                </ThemeProvider>
                                            </Grid>
                                            <Grid item xs={12} sx={{ pointerEvents: 'none' }}>
                                                <ControlledAccordions />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack className="non-modal-dialog">
                                                    <Grid item container justifyContent={'center'} spacing={3} mt={'auto'}>
                                                        <Grid item>
                                                            <ThemeProvider theme={theme}>
                                                                <Typography align="center" gutterBottom variant="h5">
                                                                    Create an account and enroll to view content
                                                                </Typography>
                                                            </ThemeProvider>
                                                        </Grid>

                                                        <Grid item xs={7}>
                                                            <Button variant="outlined" disableRipple sx={{ borderRadius: 10 }} fullWidth={true} onClick={handleClickSignUp}>Sign Up</Button>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            {/* <Button variant="outlined" disableRipple sx={{ borderRadius: 10 }} fullWidth={true}>Sign In</Button> */}
                                                            <ThemeProvider theme={theme}>
                                                                <Typography align="center" gutterBottom variant="body1">
                                                                    Already have an account? <Link to='/signin'>Sign In</Link>
                                                                </Typography>
                                                            </ThemeProvider>
                                                        </Grid>
                                                    </Grid>

                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        {!enrollment && !isInstructor ? // if user is not enrolled, don't show the course's content
                                            <>
                                                <Grid item container position={'relative'} justifyContent={'flex-start'}>
                                                    <Grid item mb={2}>
                                                        <ThemeProvider theme={theme}>
                                                            <Typography variant="h4" fontWeight={'bold'}>
                                                                Course content
                                                            </Typography>
                                                        </ThemeProvider>
                                                    </Grid>
                                                    <Grid item width={'100%'} sx={{ pointerEvents: 'none' }}>
                                                        <ControlledAccordions />
                                                    </Grid>
                                                    <Grid item width={'100%'}>
                                                        <Stack className="non-modal-dialog">
                                                            <Grid container justifyContent={'center'} spacing={3} mt={'auto'}>
                                                                <ThemeProvider theme={theme}>
                                                                    <Typography align="center" gutterBottom variant="h5">
                                                                        Enroll to view content
                                                                    </Typography>
                                                                </ThemeProvider>
                                                                <Grid item xs={12}>
                                                                    <Button variant="outlined" disableRipple sx={{ borderRadius: 10 }} onClick={() => document.getElementById("enroll").scrollIntoView({ behavior: 'smooth' })} fullWidth >Enroll now</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>

                                            </>
                                            :
                                            <>
                                                <Grid item container alignSelf={'flex-start'}>
                                                    <Grid item mb={2}>
                                                        <ThemeProvider theme={theme}>
                                                            <Typography variant="h4" fontWeight={'bold'}>
                                                                Course content
                                                            </Typography>
                                                        </ThemeProvider>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <ControlledAccordions />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    </>
                            }
                            <Grid item container alignSelf={'flex-start'} mt={!isAuthenticated || (!enrollment && !isInstructor) ? '30vh' : 'initial'}>
                                <Grid item xs={12}>
                                    <ThemeProvider theme={theme}>
                                        <Typography variant="h5" fontWeight={'bold'}>
                                            Comments
                                        </Typography>
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs>
                                    <CourseComments />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
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