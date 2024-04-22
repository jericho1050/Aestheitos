import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Fab, FormControl, Grid, Grow, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CorrectFormDialog from "../MUI-components/CorrectFormDialog";
import WrongFormDialog from "../MUI-components/WrongFormDialog";
import image from '../static/images/noimg.png'
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { useImmer } from "use-immer";
import DeleteIcon from '@mui/icons-material/Delete';
import getEmbedUrl from '../helper/getEmbedUrl';
import FormattedInputs from "../components/FormattedInput";
import AddAccordion from "../components/AddAccordion";
import InputFileUpload from "../components/InputFileUpload";
import Section from "../components/Section";
import AddIcon from '@mui/icons-material/Add';
import demoGif from "../static/images/chinupVecs.gif";
import demoGif2 from '../static/images/pushupVecs.gif';
import { Send, WidthWide } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import Collapse from '@mui/material/Collapse';
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ProgressMobileStepper from "../MUI-components/ProgressMobileStepper";
import { createCourse, createCourseContent, createSection, createSectionItem, deleteSection, getSection, getSectionItems, updateCourse, updateCourseContent, updateSection } from "../courses";
import { Form, useActionData, useFetcher } from "react-router-dom";
import determineIntent from "../helper/determineIntent";

let theme = createTheme()
theme = responsiveFontSizes(theme)


export async function action({ request }) {
    let formData = await request.formData();
    let course, courseContent, section, sectionItem;
    let sectionItems = []
    let error = {}
    let intent = formData.get('intent');

    switch (parseInt(formData.get('activeStep'))) {

        case 0:
            // create a course
            if (intent === 'create') {
                course = await createCourse(formData);
            }
            // update a course
            if (intent === 'update') {
                course = await updateCourse(formData.get('courseId'), formData);
            }
            // return error if there's an error
            if (course?.statusCode) {
                if (course.statusCode >= 400) {
                    error = { ...course };
                    return error;
                }
            }
            break;
        case 1:
            // create a course's overview (course content)
            let courseId = formData.get('courseId');
            if (intent === 'create') {
                courseContent = await createCourseContent(courseId, formData);
            }
            if (intent === 'update') {
                courseContent = await updateCourseContent(courseId, formData);
            }
            if (courseContent?.statusCode) {
                if (courseContent.statusCode >= 400) {
                    error = { ...courseContent };
                    return error;
                }
            }
            break;
        case 2:
            // create a section / accordion (course's content)
            let sectionId = formData.get('sectionId');
            let setionItemId = formData.get('sectionItemId');
            switch (intent) {
                case 'createAccordion':
                    let courseContentId = formData.get('courseContentId')
                    section = await createSection(courseContentId, formData);
                    sectionItems = await getSectionItems(section.id);
                    if (section?.statusCode) {
                        if (section.statusCode >= 400) {
                            error = { ...section };
                            return error;
                        }
                    }
                    break;
                case 'updateAccordion':
                    section = await updateSection(sectionId, formData);
                    sectionItems = await getSectionItems(section.id);
                    if (section?.statusCode) {
                        if (section.statusCode >= 400) {
                            error = { ...section };
                            return error
                        }
                    }
                    break;
                case 'deleteAccordion':
                    section = await deleteSection(sectionId);
                    if (section?.statusCode) {
                        if (section.statusCode >= 400) {
                            error = { ...section };
                            return error
                        }
                    }
                    break;
                case 'createAccordionItem':
                    section = await getSection(sectionId);
                    sectionItem = await createSectionItem(sectionId, formData);
                    if (sectionItem?.statusCode) {
                        if (sectionItem.statusCode >= 400) {
                            error = { ...sectionItem };
                            return error
                        }
                    } 
                    sectionItems.push(sectionItem);
                    break;
            }

            section = {
                ...section,
                intent: intent,
                items: sectionItems,
                ...(section ? {} : { id: sectionId }) // adds an id if were deleting an accordion, because response will be empty for DELETE HTTP methods
            }

    }

    return { course, courseContent, section }; // only one obj property will persist i.e one returns a value other's are undefined 
}

function WorkoutMediaCard({ updateWorkouts, onChangeImage, onChangeDescription, onClick, workout, open }) {
    const [isOpenCorrect, setisOpenCorrect] = React.useState(false);
    const [isOpenWrong, setisOpenWrong] = React.useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    function handleImageUpload(event, workoutId, wrongFormId, correctFormId) {
        // update image for wrongForm and correctForm exercise demo
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            updateWorkouts(draft => {
                const workout = draft.find(w => w.id === workoutId);

                // check if it's from a wrongForm card
                if (wrongFormId != null) {
                    const wrongForm = workout.wrongForm.find(w => w.id === wrongFormId);
                    wrongForm.demo = reader.result;
                } else {
                    // then it's from a correctForm card
                    const correctForm = workout.correctForm.find(w => w.id === correctFormId);
                    correctForm.demo = reader.result;
                }

            })
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function handleDeleteCard(workoutId, wrongFormId, correctFormId) {
        updateWorkouts(draft => {
            const workout = draft.find(w => w.id === workoutId);

            // we check if this came from WorkoutMediaWrongFormCard
            if (wrongFormId != null) {
                workout.wrongForm = workout.wrongForm.filter(w => w.id !== wrongFormId);

                // if not, its from WorkoutMediaCorrectFormCard
            } else {
                workout.correctForm = workout.correctForm.filter(w => w.id !== correctFormId)
            }
        })
    }

    // handles the description change of correctFrom and wrongForm in their respective cards.
    function handleChangeDescription(e, card, workoutId, wrongFormId) {
        updateWorkouts(draft => {
            const workout = draft.find(w => w.id === workoutId);

            // we check if this came from WorkoutMediaWrongFormCard
            if (card === 'wrongForm') {
                const wrongForm = workout.wrongForm.find(w => w.id === wrongFormId)
                wrongForm.description = e.target.value
                // if not, its from WorkoutMediaCorrectFormCard
            } else {
                const correctForm = workout.correctForm.find(w => w.id === wrongFormId)
                correctForm.description = e.target.value
            }



        })
    }

    //handles the addition of correctForm and wrongForm cards in their respective dialogs.
    function handleAddCard(formDialog, workoutId) {
        updateWorkouts(draft => {
            const workout = draft.find(w => w.id === workoutId);

            // we check if this came from WrongFormDialog 
            if (formDialog === 'wrongForm') {
                workout.wrongForm.push({
                    id: nextWrongFormId++,
                    ...wrongForm
                })
                // if not, its from CorrectFormDialog
            } else {
                workout.correctForm.push({
                    id: nextCorrectFormId++,
                    ...correctForm
                })

            }


        })
    }


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
            <Card data-cy="Workout Card" sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: { xs: 700, md: 645 }, height: '100%', borderTop: `4px solid ${theme.palette.secondary.main}` }}>
                <CardMedia
                    component="img"
                    sx={{ aspectRatio: 16 / 9 }}
                    src={workout.demo}
                    alt="workout demo"
                />
                <InputFileUpload workoutId={workout.id} onChange={onChangeImage} name="demo" text="GIF File" />
                <CardContent>
                    <Box maxHeight={{ xs: 200, sm: 250 }} height={{ xs: 200, sm: 250 }} width={{ xs: 'inherit', sm: 'inherit' }} component={'div'}>
                        {/* workout description textarea input */}
                        <TextField
                            helperText=" "
                            id="demo-helper-text-aligned-no-helper"
                            label="Your Workout's Description"
                            fullWidth={true}
                            minRows={isSmallScreen ? 7 : 10}
                            maxRows={isSmallScreen ? 7 : 10}
                            multiline
                            required={true}
                            autoFocus
                            name="exercise"
                            value={workout.exercise}
                            onChange={event => {
                                onChangeDescription(event, workout.id);
                            }}

                        />
                    </Box>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                    <Grid container justifyContent={'center'} columns={{ xs: 4, sm: 8 }} spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('correct')} startIcon={<CheckIcon color="success" />} color="success" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <CorrectFormDialog handleImageUpload={handleImageUpload} handleDeleteCard={handleDeleteCard} handleChangeDescription={handleChangeDescription} onClick={handleAddCard} workoutId={workout.id} correctFormExercises={workout.correctForm} open={isOpenCorrect} setOpen={setisOpenCorrect} />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('wrong')} startIcon={<ClearIcon color="error" />} color="error" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <WrongFormDialog handleImageUpload={handleImageUpload} handleDeleteCard={handleDeleteCard} handleChangeDescription={handleChangeDescription} onClick={handleAddCard} workoutId={workout.id} wrongFormExercises={workout.wrongForm} open={isOpenWrong} setOpen={setisOpenWrong} />
                        </Grid>
                        <Grid item >
                            <Button onClick={() => onClick(workout.id)} startIcon={<DeleteIcon />}>Delete</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    );
}

export function ResponsiveDialog({ itemId, onClick, onChange, accordionId, accordionItem, children }) {
    const [open, setOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [workouts, updateWorkouts] = useImmer([initialWorkoutData]);
    const [parent, enableAnimations] = useAutoAnimate();
    const [isWorkoutRoutine, setIsWorkoutRoutine] = React.useState(true)

    const theme2 = useTheme();
    const fullScreen = useMediaQuery(theme2.breakpoints.down('sm'));
    let accordionItemHeadingContent;




    function handleImageUpload(event, workoutId) {
        // update image for workout demo
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            updateWorkouts(draft => {
                const workout = draft.find(w => w.id === workoutId);
                workout.demo = reader.result;
            })
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function handleChangeWorkoutDescription(e, workoutId) {
        updateWorkouts(draft => {
            const workout = draft.find(w => w.id === workoutId);
            workout.exercise = e.target.value;

        })

    }


    function handleAddWorkoutCard() {
        updateWorkouts(draft => {
            draft.push(
                {
                    id: nextWorkoutId++,
                    exercise: "Your Description here",
                    demo: demoGif,
                    correctForm: [

                    ],
                    wrongForm: [

                    ]
                }
            )

            const index = draft.length - 1;

            draft[index].correctForm.push(
                {
                    id: 0,
                    ...correctForm

                })

            draft[index].wrongForm.push(
                {
                    id: 0,
                    ...wrongForm
                })

        })
    }

    function handleDeleteWorkoutCard(workoutId) {
        updateWorkouts(draft => {
            const index = draft.findIndex(w => w.id === workoutId)
            draft.splice(index, 1);
        })
    }

    if (isEditing) {
        // show input form when edit btn is clicked
        accordionItemHeadingContent = (
            <>
                <Grid item xs={10} lg={11}>
                    {/* AccordtionDetail edit input form */}
                    <TextField
                        data-cy={`Accordion item edit-${itemId}`}
                        id="standard-multiline-flexible"
                        label="Accordiong Item Heading"
                        multiline
                        maxRows={4}
                        variant="standard"
                        value={accordionItem.heading}
                        fullWidth
                        onChange={e => onChange({
                            ...accordionItem,
                            heading: e.target.value
                        },
                            accordionId
                        )}
                    />
                </Grid>
                <Grid item xs={2} lg={1}>
                    <Button onClick={() => setIsEditing(false)}>
                        Save
                    </Button>
                </Grid>


            </>
        )
    } else {
        const handleClickOpen = () => {
            setOpen(true);
        };

        // show content when not in edit mode
        accordionItemHeadingContent = (
            <>
                <Grid item xs={10} lg={11}>
                    <ThemeProvider theme={theme} >
                        <DescriptionIcon theme={theme2} sx={{ position: 'sticky', marginRight: 2 }} fontSize="x-small"></DescriptionIcon>
                        <Typography data-cy={`Accordion item ${itemId}`} align='justify' variant="body" onClick={handleClickOpen} sx={{ cursor: 'pointer', '&:hover': { color: 'lightgray' } }}>
                            {children}
                        </Typography>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <Button onClick={() => setIsEditing(true)} size="small" endIcon={!isEditing ? <EditIcon /> : null}></Button>
                    <Button onClick={() => onClick(accordionId, accordionItem.id)} size="small" endIcon={!isEditing ? <DeleteIcon /> : null}></Button>
                </Grid>
            </>
        )
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Grid container alignItems={'center'}>
                {accordionItemHeadingContent}
            </Grid>


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
                        <DialogContent>
                            {
                                isWorkoutRoutine ?
                                    <Grid ref={parent} justifyContent={{ xs: 'center', sm: 'flex-start' }} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                                        {workouts.map(workout => (
                                            // Renders Workout instance
                                            <Grid key={workout.id} item sm={6}>
                                                <WorkoutMediaCard updateWorkouts={updateWorkouts} onChangeImage={handleImageUpload} onChangeDescription={handleChangeWorkoutDescription} onClick={handleDeleteWorkoutCard} workout={workout} open={open}> </WorkoutMediaCard>
                                            </Grid>
                                        ))}
                                        <Grid item sm={6}>
                                            {/* add WorkoutMediaCard / Workout button */}
                                            <Button data-cy={`Add icon`} onClick={handleAddWorkoutCard} sx={{ height: { xs: 250, sm: 622, md: 622 }, width: { xs: 340, sm: '100%', md: 391 } }}>
                                                <AddIcon fontSize="large" sx={{ height: 300, width: 300 }} />
                                            </Button>
                                        </Grid>
                                    </Grid> :

                                    <Grid justifyContent={{ xs: 'center' }} item container>
                                        <Grid item mb={2}>
                                            <ThemeProvider theme={theme}>
                                                <Typography variant="h4">
                                                    Your readme text here
                                                </Typography>
                                            </ThemeProvider>
                                        </Grid>
                                        <Box className="course-lecture-container" sx={{ width: '81%' }} component={'div'}>
                                            <TextField
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <YouTubeIcon />
                                                        </InputAdornment>

                                                    )
                                                }}
                                                fullWidth={true}
                                                id="lecture-url"
                                                label="e.g https://www.youtube.com/watch?v=SOMEID"
                                                type="url"
                                                name="lecture"
                                                value={accordionItem.lecture}
                                                onChange={e => {
                                                    onChange({
                                                        ...accordionItem,
                                                        lecture: e.target.value
                                                    },
                                                        accordionId)
                                                }}
                                            />
                                        </Box>
                                        <Grid item>
                                            {getEmbedUrl(accordionItem.lecture) ?
                                                <Box mt={4} className="course-lecture-container" component={'div'}>
                                                    <iframe className="course-lecture" src={getEmbedUrl(accordionItem.lecture)} title="vide-lecture here" allowFullScreen></iframe>                                    </Box>
                                                :
                                                <Box mt="5%" component="div" height={200} width={'50vw'} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ border: '2px dotted black' }}>
                                                    <Typography variant="body" align={'center'}>
                                                        Your video will show up here
                                                    </Typography>
                                                </Box>
                                            }
                                        </Grid>
                                        <Grid item xs={10} mt={4}>
                                            <TextField
                                                data-cy="lecture textfield"
                                                helperText=" "
                                                id="demo-helper-text-aligned-no-helper"
                                                label="Your lecture's description or Readme Text"
                                                fullWidth={true}
                                                minRows={10}
                                                maxRows={10}
                                                multiline
                                                required={true}
                                                name="overview"
                                                value={accordionItem.description}
                                                onChange={e => {
                                                    onChange({
                                                        ...accordionItem,
                                                        description: e.target.value
                                                    },
                                                        accordionId)
                                                }}
                                            />
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



function ControlledAccordions({ accordions, updateAccordions, activeStep, courseContentId }) {
    const [expanded, setExpanded] = React.useState(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data; // returns the response from previous action 
    const [isError, setIsError] = React.useState(false);


    React.useEffect(() => {
        // initially the accordion's IDs is not up to date with the database server,
        // so we continuously update our real 'IDs' and values of our state variables
        // that's why we use a useEffect for this matter.
        if (actionData?.message) {
            setIsError(true);
        }
        else if (actionData?.section && actionData?.section?.intent) {
            if (actionData.section.intent === 'createAccordion') {
                const { intent, ...rest } = actionData.section;
                updateAccordions(draft => {
                    draft.push(rest)
                })
            }
            else if (actionData.section.intent === 'updateAccordion') {
                updateAccordions(draft => {
                    const accordionIndex = draft.findIndex(accordion => accordion.id === actionData.section.id);
                    const { intent, ...rest } = actionData.section;
                    draft[accordionIndex] = rest;
                })
            }
            else if (actionData.section.intent === 'createAccordionItem') {
                updateAccordions(draft => {
                    const accordion = draft.find(accordion => accordion.id === actionData.section.id);
                    accordion.items.push(actionData.section);
                });
            }
            else if (actionData.section.intent === 'updateAccordionItem') {
                updateAccordions(draft => {
                    const accordion = draft.find(accordion => accordion.id === actionData.section.id);
                    const accordionItemIndex = accordion.items.findIndex(item => item.id === accordion.item[item.length - 1].id);
                    const nextAccordionitem = actionData.section.items
                    accordion.items[accordionItemIndex] = nextAccordionItem;
                });
            }

        }
    }, [actionData])


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    function handleAddAccordionItem(heading, accordionId) {
        // adds a new accordion item (sectionItem)
        fetcher.submit({ heading: heading, activeStep: activeStep, sectionId: accordionId, intent: 'createAccordionItem' }, {
            method: 'post'
        })

    }

    function handleEditAccordionItem(nextAccordionItem, accordionId) {
        // edits an accordion item's heading / content (sectionItem)

    }

    function handleDeleteAccordionItem(accordionId, accordionItemId) {
        updateAccordions(draft => {
            const accordionIndex = draft.findIndex(accordion => accordion.id === accordionId)
            const accordionItemIndex = draft[accordionIndex].items.findIndex(a => a.id === accordionItemId); // find the item's index to remove
            draft[accordionIndex].items.splice(accordionItemIndex, 1)
        })
    }
    function handleAddAccordion(heading) {
        // adds  a new accordion  (section)
        // imperatively submit the key/value pairs needed in action route

        fetcher.submit({ heading: heading, activeStep: activeStep, courseContentId: courseContentId, intent: 'createAccordion' }, {
            method: 'post',
        })
    }

    function handleEditAccordion(nextAccordion) {
        // edits accordion's heading
        // imperatively submit the key/value pairs needed in action route
        fetcher.submit({ heading: nextAccordion.heading, activeStep: activeStep, sectionId: nextAccordion.id, intent: 'updateAccordion' }, {
            method: 'post',
        })

    }

    function handleDeleteAccordion(accordionId) {
        // deletes accordion
        // imperatively submit the key/value pairs needed in action route
        fetcher.submit({ activeStep: activeStep, sectionId: accordionId, intent: 'deleteAccordion' }, {
            method: 'post',
        })
        updateAccordions(
            accordions.filter(a => a.id !== accordionId)
        )
    }
    return (
        <>
            {/* Adds a new Accordion / Section  */}
            <AddAccordion actionData={actionData} setIsError={setIsError} isError={isError} onClick={handleAddAccordion} />
            <Box sx={{ display: 'block', ml: 'auto', mr: 'auto' }}>
                <ThemeProvider theme={theme}>
                    <Typography variant="small">Note: The examples here are not part of your content.Please delete them to avoid confusion.</Typography>
                </ThemeProvider>
            </Box>
            <TransitionGroup>

                {
                    accordions.map(accordion => (
                        <Collapse key={accordion.id}>
                            <Section setIsError={setIsError} isError={isError} onClickDeleteItem={handleDeleteAccordionItem} onChangeItem={handleEditAccordionItem} onClickDelete={handleDeleteAccordion} onChange={handleEditAccordion} handleChange={handleChange} expanded={expanded} accordion={accordion} handleAddAccordionItem={handleAddAccordionItem} />
                        </Collapse>

                    ))
                }
            </TransitionGroup>
        </>
    );

}


export default function CreateCourse() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [previewImage, setPreviewImage] = React.useState(null);
    const [course, setCourse] = React.useState({
        id: 0,
        title: '',
        difficulty: '',
        description: '',
        thumbnail: image,
        price: 0,
        weeks: '',
        isFirstView: true

    });
    const [courseContent, setCourseContent] = React.useState({
        id: 0,
        preview: '',
        overview: '',
        isFirstView: true

    })
    const theme2 = useTheme();
    const isSmallScreen = useMediaQuery(theme2.breakpoints.down('sm'));
    const isXsmallScreen = useMediaQuery(theme2.breakpoints.only('xs'));
    const fetcher = useFetcher();
    const actionData = fetcher.data; // The returned data from the loader or action is stored here. Once the data is set, it persists on the fetcher even through reloads and resubmissions. - ReactRouter
    const [isError, setIsError] = React.useState(false);
    const [intent, setIntent] = React.useState('create');
    const [accordions, updateAccordions] = useImmer(initialSectionData) // accordion is basically a Section ,and accordionItem is a Section item (in the Backend code)

    React.useEffect(() => {
        // continuously update real time 'IDs' of our state variables
        // !resonse.ok then there's a message
        // optional chaining
        if (actionData?.message) {
            setIsError(true);
        }
        // persist the IDs state so that we can use it to sent to our api (/course/courseId/course-content, note: this rest endpoint requires courseId)
        else if (actionData?.course?.title && actionData?.course?.description && activeStep === 0) {  // returned value of previous action.
            setCourse({
                ...course,
                id: actionData.course.id,
                isFirstView: false
            })
            // im assuming this is somewhere 200 status code so we move on to the next step
            const nextActiveStep = activeStep + 1;
            setActiveStep(nextActiveStep); //  mew activeStep is queued for next rerender that's why we use a variable 'nextActiveStep'
            // determineItent wether to update or create in which active step currently on and is first view for next render
            setIntent(determineIntent(courseContent.isFirstView, nextActiveStep));
        }
        else if (actionData?.courseContent?.preview && actionData?.courseContent?.overview && activeStep === 1) {  // returned value of previous action.
            setCourseContent({
                ...courseContent,
                id: actionData.courseContent.id,
                isFirstView: false
            })
            // im assuming this is somewhere 200 status code so we move on to the next step
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIntent('create');
        }

    }, [actionData])

    React.useEffect(() => {
        // checks if all fields are filled by the user
        function checkFields() {
            if (activeStep === 0) {
                for (let key in course) {
                    if (key != 'price' && (course[key] === '' || course[key] === null)) {
                        return false;
                    }
                }
            }
            else if (activeStep === 1) {
                for (let key in courseContent) {
                    if (courseContent[key] === '') {
                        return false;
                    }
                }
            }

            return true;
        }
        if (checkFields()) {
            setIsError(false);
        }
    }, [course, courseContent]);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        setCourse({
            ...course,
            thumbnail: file
        })


        // read file for preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result)
        };

        if (file) {
            reader.readAsDataURL(file);

        }

    }



    return (
        <>
            <br></br>
            {
                activeStep === 0 ? (
                    <fetcher.Form method="post" encType="multipart/form-data" noValidate >
                        <input type="hidden" value={activeStep} name="activeStep" />
                        <input type="hidden" value={course.id} name="courseId" />
                        <Box sx={{ m: '3vw' }}>
                            <Box sx={{ m: 4, display: 'flex', justifyContent: 'center' }}>
                                <ProgressMobileStepper intent={intent} setIntent={setIntent} isError={isError} activeStep={activeStep} setActiveStep={setActiveStep} />
                            </Box>
                            <Grid container sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }} spacing={5}>
                                {/* Paper starts here */}
                                <Grid item xs md={'auto'}>
                                    <Paper elevation={4} sx={{ height: { xs: 'auto', m: 700 } }}>
                                        <Grid item container justifyContent={'center'}>
                                            <Grid item>
                                                <Container sx={{ padding: '4%', maxWidth: { xs: 700, md: 500 } }} component="div">
                                                    <img src={previewImage ? previewImage : image} className="course-thumbnail" style={{ objectFit: course.image == image ? 'fill' : 'cover', border: '1px dashed black' }} />
                                                </Container>
                                            </Grid>
                                        </Grid>
                                        <Grid item container wrap="nowrap" alignItems={'center'} direction="column" spacing={2}>
                                            <Grid item>
                                                {/* Uploading  image file button  here */}
                                                <InputFileUpload thumbnail={course.thumbnail} name="thumbnail" text="Image" setIsError={setIsError} onChange={handleImageUpload} />
                                            </Grid>
                                            <Grid item>
                                                {isError &&
                                                    actionData?.message && ( // this is equivalent to saying if there's an error and actionData returns an error message
                                                        <>
                                                            {Object.entries(JSON.parse(actionData.message)).map(([key, value]) => (
                                                                <Box key={key} component="div">
                                                                    <Typography key={key} variant='small' sx={{ color: 'red', textAlign: 'left' }}>
                                                                        {key === 'difficulty' || key === 'price' || key === 'weeks' ? `${key}: ${value[0]}` : null}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </>
                                                    )}
                                            </Grid>
                                            <Grid item>
                                                <FormattedInputs setIsError={setIsError} error={isError} course={course} setCourse={setCourse} />
                                            </Grid>
                                            <Grid item xs paddingBottom={4}>
                                                {/* Select menu form */}
                                                <FormControl required={true} sx={{ width: 200 }} error={isError}>
                                                    <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
                                                    <Select
                                                        data-cy="Select Difficulty"
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={course.difficulty}
                                                        label="Difficulty"
                                                        onChange={e => {
                                                            setCourse({
                                                                ...course,
                                                                difficulty: e.target.value
                                                            });
                                                            setIsError(false);
                                                        }}
                                                        inputProps={{ name: "difficulty" }}
                                                        autoWidth
                                                    >
                                                        <MenuItem value={'BG'} >Beginner</MenuItem>
                                                        <MenuItem value={'IN'} >Intermediate</MenuItem>
                                                        <MenuItem value={'AD'} >Advanced</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    name="weeks"
                                                    id="outlined-number"
                                                    label="Weeks"
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 100 }}
                                                    inputProps={{
                                                        min: "0",
                                                    }}
                                                    value={course.weeks}
                                                    onChange={e => {
                                                        setCourse(
                                                            {
                                                                ...course,
                                                                weeks: e.target.value
                                                            }
                                                        );
                                                        setIsError(false);
                                                    }}
                                                    error={isError}

                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                {/* Paper ends here */}
                                {/* title  & description starts here */}

                                <Grid item xs={12} sm={12} md lg>
                                    <Grid item container wrap="nowrap" direction="column">
                                        <Grid item xs>
                                            {/* Course title textarea input */}
                                            <TextField
                                                helperText=" "
                                                id="demo-helper-text-aligned-no-helper"
                                                label={isError && actionData?.message ?

                                                    Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                                                        if (key === 'title') {
                                                            return `${key}: ${value}`;
                                                        } else {
                                                            return null;
                                                        }
                                                    })

                                                    : "Your Course's Title"
                                                }
                                                fullWidth={true}
                                                minRows={5}
                                                maxRows={5}
                                                multiline
                                                required={true}
                                                inputProps={{ maxLength: 200 }}
                                                autoFocus
                                                name="title"
                                                value={course.title}
                                                onChange={e => {
                                                    setCourse({
                                                        ...course,
                                                        title: e.target.value
                                                    });
                                                    setIsError(false);
                                                }}
                                                error={isError}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            {/* course description textarea input */}
                                            <TextField
                                                data-cy="Course Description"
                                                helperText=" "
                                                id="demo-helper-text-aligned-no-helper"
                                                label={isError && actionData?.message ?

                                                    Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                                                        if (key === 'description') {
                                                            return `${key}: ${value}`;
                                                        } else {
                                                            return null;
                                                        }
                                                    })

                                                    : "Your Course's Description"
                                                }
                                                fullWidth={true}
                                                minRows={isSmallScreen ? 10 : 20}
                                                maxRows={isSmallScreen ? 10 : 20}
                                                multiline
                                                required={true}
                                                autoFocus
                                                name="description"
                                                value={course.description}
                                                onChange={e => {
                                                    setCourse({
                                                        ...course,
                                                        description: e.target.value
                                                    });
                                                    setIsError(false);
                                                }}
                                                error={isError}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Box>
                    </fetcher.Form>
                    /* title  & description ends here */
                )
                    : activeStep === 1 ? (
                        <fetcher.Form method="post" encType="multipart/form-data" noValidate >
                            <input type="hidden" value={activeStep} name="activeStep" />
                            <input type="hidden" value={course.id} name="courseId" />
                            <Box sx={{ m: '3vw' }}>
                                <Box sx={{ m: 4, display: 'flex', justifyContent: 'center' }}>
                                    <ProgressMobileStepper intent={intent} setIntent={setIntent} isError={isError} activeStep={activeStep} setActiveStep={setActiveStep} />
                                </Box>
                            </Box>
                            <Box sx={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                {/* title  & description ends here */}
                                <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3}>
                                    <Grid item>
                                        <ThemeProvider theme={theme} >
                                            <Typography variant="h3">
                                                Overview
                                            </Typography>
                                        </ThemeProvider>
                                    </Grid>
                                    <Grid item container>
                                        {/* course overview textarea input */}
                                        <TextField

                                            data-cy="Course Overview"
                                            helperText=" "
                                            id="demo-helper-text-aligned-no-helper"
                                            label={isError && actionData?.message ?

                                                Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                                                    if (key === 'overview') {
                                                        return `${key}: ${value}`;
                                                    } else {
                                                        return null;
                                                    }
                                                })

                                                : `Your Course's Overview`
                                            }
                                            fullWidth={true}
                                            minRows={10}
                                            maxRows={10}
                                            multiline
                                            required={true}
                                            name="overview"
                                            value={courseContent.overview}
                                            onChange={e => {
                                                setCourseContent({
                                                    ...courseContent,
                                                    overview: e.target.value
                                                })
                                                setIsError(false);
                                            }}
                                            error={isError}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <ThemeProvider theme={theme}>
                                            <Typography sx={{ textAlign: 'center' }} variant="h4">
                                                Preview this course
                                            </Typography>
                                            <Typography sx={{ display: 'block', textAlign: 'center' }} variant="small">
                                                Put your youtube video link here
                                            </Typography>
                                        </ThemeProvider>
                                    </Grid>
                                    <br />
                                    <Grid item container justifyContent={'center'} width="100%">
                                        <Box className="course-lecture-container" sx={{ width: '100%' }} component={'div'}>
                                            {/* course preview textarea input */}
                                            <TextField
                                                value={courseContent.preview}
                                                onChange={e => {
                                                    setIsError(false);
                                                    setCourseContent({
                                                        ...courseContent,
                                                        preview: e.target.value
                                                    })
                                                }


                                                }
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <YouTubeIcon />
                                                        </InputAdornment>

                                                    )
                                                }}
                                                fullWidth={true}
                                                id="lecture-url"
                                                label={isError && actionData?.message ?

                                                    Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                                                        if (key === 'preview') {
                                                            return `${key}: ${value}`;
                                                        } else {
                                                            return null;
                                                        }
                                                    })
                                                    : 'e.g https://www.youtube.com/watch?v=SOMEID'
                                                }
                                                type="url"
                                                name="preview"
                                                error={isError}
                                            />
                                        </Box>
                                        <Grid item>
                                            {getEmbedUrl(courseContent.preview) ?
                                                <Box mt={4} className="course-lecture-container" component={'div'}>
                                                    <iframe className="course-lecture" src={getEmbedUrl(courseContent.preview)} title="vide-lecture here" allowFullScreen></iframe>
                                                </Box>
                                                :
                                                <Box mb="5%" mt="5%" component="div" height={200} width={'50vw'} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ border: '2px dotted black' }}>
                                                    <Typography variant="body" align={'center'}>
                                                        Your video will show up here
                                                    </Typography>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </fetcher.Form>
                    ) : (
                        <>
                            <fetcher.Form method="post" encType="multipart/form-data" noValidate>
                                <Box sx={{ m: '3vw' }}>
                                    <Box sx={{ m: 4, display: 'flex', justifyContent: 'center' }}>
                                        <ProgressMobileStepper intent={intent} setIntent={setIntent} activeStep={activeStep} setActiveStep={setActiveStep} />
                                    </Box>
                                </Box>
                                <Box sx={{ marginLeft: '3vw', marginRight: '3vw' }}>

                                    <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3}>
                                        <Grid item>
                                            <ThemeProvider theme={theme}>
                                                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                                                    Course content
                                                </Typography>
                                            </ThemeProvider>
                                        </Grid>
                                        <Grid item width={{ xs: '100%', md: '69%' }}>
                                            <ControlledAccordions accordions={accordions} updateAccordions={updateAccordions} activeStep={activeStep} courseContentId={courseContent.id}></ControlledAccordions>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: "flex", justifyContent: 'flex-end' }}>
                                            <Button sx={{ mt: 3 }} fullWidth={isXsmallScreen ? true : false} startIcon={<SendIcon />} variant="contained" color="primary">
                                                Submit
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </fetcher.Form>

                        </>
                    )}

        </>
    )
}




















// Initial data for workouts state in ResponsiveDialog
const correctForm = {
    demo: demoGif2,
    description: "Correct exercise form description: e.g., Shoulder blades are depressed downwards"
}
const wrongForm = {
    demo: demoGif2,
    description: "Wrong exercise form description: e.g., Shoulder blades not retracting"
}
let nextWorkoutId = 1;
let nextCorrectFormId = 1;
let nextWrongFormId = 1;

const initialWorkoutData = {
    id: 0,
    exercise: "Your Description here ",
    demo: demoGif,
    correctForm: [{
        id: 0,
        ...correctForm
    }],
    wrongForm: [{
        id: 0,
        ...wrongForm
    }]
}

// For initial Data below this line
const section1 = {
    heading: "Your Own Heading Here: e.g., Phase 1 (Preparation)."
}
const sectionItem1 = {
    lecture: '',
    description: " Your Description here: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor.",
    heading: "Your own item header here: e.g., ReadMe or Lecture"
}
const sectionItem2 = {
    lecture: '',
    description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    heading: "Workout Routine"
}

let nextAccordionId = 1;
let nextItemId = 2;
// workout routine or the video lecture
const initialSectionData = [{
    id: 0,
    heading: section1.heading,
    items: [{
        id: 0,
        ...sectionItem1
    }, {
        id: 1,
        ...sectionItem2
    }]
}]


// const workouts2 = {
//     intesity: "H",
//     exercise: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur    description: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
//     demo: "https://youtube.com/embed/IODxDxX7oi4",
//     rest_time: 2,
//     sets: 3,
//     reps: 10,
//     excertion: 8,
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