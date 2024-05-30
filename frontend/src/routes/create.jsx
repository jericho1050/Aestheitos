import { Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Fab, FormControl, Grid, Grow, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CorrectFormDialog from "../components/CreateCorrectFormDialog";
import WrongFormDialog from "../components/CreateWrongFormDialog";
import image from '../static/images/noimg.png'
import { styled } from '@mui/material/styles';
import { useImmer } from "use-immer";
import DeleteIcon from '@mui/icons-material/Delete';
import getEmbedUrl from '../helper/getEmbedUrl';
import FormattedInputs from "../components/FormattedInput";
import AddAccordion from "../components/AddAccordion";
import InputFileUpload from "../components/InputFileUpload";
import { AccordionSectionCreate } from "../components/Accordion";
import AddIcon from '@mui/icons-material/Add';
import demoGif from "../static/images/chinupVecs.gif";
import demoGif2 from '../static/images/pushupVecs.gif';
import { TransitionGroup } from "react-transition-group";
import Collapse from '@mui/material/Collapse';
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ProgressMobileStepper from "../components/ProgressMobileStepper";
import { createCorrectExerciseForm, createCourse, createCourseContent, createSection, createSectionItem, createWorkout, createWrongExerciseForm, deleteCorrectExerciseForm, deleteSection, deleteSectionItem, deleteWorkout, deleteWrongExerciseForm, getSection, getSectionItems, getWorkouts, updateCorrectExerciseForm, updateCourse, updateCourseContent, updateSection, updateSectionItem, updateWorkout, updateWrongExerciseForm } from "../courses";
import { Form, redirect, useActionData, useFetcher, useNavigation, useSubmit } from "react-router-dom";
import determineIntent from "../helper/determineIntent";
import { Provider, atom, useAtom } from "jotai";
import { YoutubeInput, DescriptionInput } from "../components/LectureReadMeTextFields";
import { useImmerAtom } from "jotai-immer";
import { accordionsAtom } from "../atoms/accordionsAtom";
import { isErrorAtom } from "../atoms/isErrorAtom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, modulesCard } from "../helper/quillModule";
import { snackbarReducerAtom } from "../atoms/snackbarAtom";
import AlertDialog from "../components/AreYouSureDialog";
import OverviewTextField from "../components/OverviewTextField";
import PreviewCourseTextField from "../components/PreviewCourseTextField";
import DifficultySelectForm from "../components/DifficultySelectForm";
import WeeksTextField from "../components/WeeksTextField";
import CourseTitleTextField from "../components/CourseTitleTextField";
import DescriptionTextField from "../components/DescriptionTextField";

let theme = createTheme()
theme = responsiveFontSizes(theme)

// There's only Four CORE COMPONENTS here. one is in a file called Accordion. so there's actually FIVE CORE components for this route.
export async function action({ request }) {
    let formData = await request.formData();
    let course, courseContent, section, sectionItem, workouts;
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
            // create a course's overview
            let courseId = formData.get('courseId');
            if (intent === 'create') {
                courseContent = await createCourseContent(courseId, formData);
            }
            // update a course's overview
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
            // create/update a section / accordion (course's content)
            let sectionId = formData.get('sectionId');
            let sectionItemId = formData.get('sectionItemId');
            switch (intent) {
                case 'createAccordion':
                    let courseContentId = formData.get('courseContentId')
                    section = await createSection(courseContentId, formData);
                    sectionItems = await getSectionItems(section.id);
                    if (section?.statusCode) {
                        if (section.statusCode >= 400) {
                            error = { ...section };
                            error.accordion = true;
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
                            return error;
                        }
                    }
                    break;
                case 'deleteAccordion':
                    section = await deleteSection(sectionId);
                    if (section?.statusCode) {
                        if (section.statusCode >= 400) {
                            error = { ...section };
                            return error;
                        }
                    }
                    break;
                case 'createAccordionItem':
                    section = await getSection(sectionId);
                    sectionItem = await createSectionItem(sectionId, formData);
                    workouts = await getWorkouts(sectionItem.id);
                    if (sectionItem?.statusCode) {
                        if (sectionItem.statusCode >= 400) {
                            error = { ...sectionItem };
                            error.accordionItem = true;
                            return error;
                        }
                    }
                    sectionItem.workouts = workouts;
                    sectionItems.push(sectionItem);
                    break;
                case 'updateAccordionItem':
                    section = await getSection(sectionId);
                    sectionItem = await updateSectionItem(sectionItemId, formData);
                    workouts = await getWorkouts(sectionItemId);
                    if (sectionItem?.statusCode) {
                        if (sectionItem.statusCode >= 400) {
                            error = { ...sectionItem };
                            return error;
                        }
                    }
                    sectionItem.workouts = workouts;
                    sectionItems.push(sectionItem);
                    break;
                case 'deleteAccordionItem':
                    sectionItem = await deleteSectionItem(sectionItemId);
                    if (sectionItem?.statusCode) {
                        if (sectionItem.statusCode >= 400) {
                            error = { ...sectionItem };
                            return error;
                        }
                    }
                    break;
                case 'submit':
                    let courseId = formData.get('courseId');
                    formData.append('is_draft', false);
                    course = await updateCourse(courseId, formData);
                    if (course?.statusCode >= 400) {
                        error = { ...course };
                        return error;
                    }
                    return redirect('/');


            }
            section = {
                ...section,
                intent: intent,
                items: sectionItems, // Items will contain only '1' if it's either creating or updating an accordion item; if not, then it has more than 1.
                ...(section ? {} : { id: sectionId }) // adds an ID if we are deleting an accordion because the response will be empty for DELETE HTTP methods, i.e., 204 status code. And some of our logic depends on the section ID. so ActionData will only return an ID when an accordion is deleted.

            }
    }

    return { course, courseContent, section }; // only one obj property will persist i.e one returns a value other's are undefined 
}

function WorkoutMediaCard({ ids, immerAtom, onChangeImage, onChangeDescription, onClick, workout, open }) {
    const { accordionId, itemId } = ids;
    const [isOpenCorrect, setisOpenCorrect] = React.useState(false);
    const [isOpenWrong, setisOpenWrong] = React.useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isError, setIsError] = React.useState(false);
    const [, updateAccordions] = immerAtom
    // The `workoutDescription` state variable is similar to `lecture` and `description` in ResponsiveDialog
    // it's main purpose is for debouncing
    const [workoutDescription, setWorkoutDescription] = React.useState(workout.exercise)
    const isFirstRender = React.useRef(true); const initialWorkoutDescription = React.useRef(workoutDescription);
    // Handles HTTP request for updating workout's description for this component
    React.useEffect(() => {
        if (isFirstRender.current || workoutDescription === initialWorkoutDescription.current) {
            isFirstRender.current = false;
            return;
        }
        // debounce event handler
        const handler = setTimeout(() => {
            onChangeDescription(workoutDescription, workout.id);
        }, 300)
        return () => {
            clearTimeout(handler);
        }
    }, [workoutDescription])

    function handleImageUpload(event, workoutId, wrongFormId, correctFormId) {
        // update image for wrongForm and correctForm exercise demo
        const file = event.target.files[0];
        const reader = new FileReader();
        const formData = new FormData();
        let response;
        reader.onloadend = async () => {
            formData.append('demo', file);
            try {
                if (wrongFormId != null) {
                    response = await updateWrongExerciseForm(wrongFormId, formData);
                } else {
                    response = await updateCorrectExerciseForm(correctFormId, formData);
                }
                if (response.statusCode >= 400) {
                    throw new Error(response);
                }
            }
            catch (error) {
                console.error('An error occured', error);
                setIsError(true);
            }
            updateAccordions(draft => {
                const accordion = draft.find(a => a.id === accordionId);
                const accordionItem = accordion.items.find(i => i.id === itemId);
                const workout = accordionItem.workouts.find(w => w.id === workoutId);
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

    async function handleDeleteCard(workoutId, wrongFormId, correctFormId) {
        let response;
        try {
            if (wrongFormId != null) {
                response = await deleteWrongExerciseForm(wrongFormId);
            } else {
                response = await deleteCorrectExerciseForm(correctFormId);
            }

            if (response.statusCode >= 400) {
                throw new Error(response);
            }
        }
        catch (error) {
            console.error(error);
            setIsError(true);
        }
        updateAccordions(draft => {
            const accordion = draft.find(a => a.id === accordionId);
            const accordionItem = accordion.items.find(i => i.id === itemId);
            const workout = accordionItem.workouts.find(w => w.id === workoutId);

            if (wrongFormId != null) {
                workout.wrongForm = workout.wrongForm.filter(w => w.id !== wrongFormId);
            } else {
                workout.correctForm = workout.correctForm.filter(w => w.id !== correctFormId);
            }
        })
    }

    // handles the description change of correctFrom and wrongForm in their respective cards.
    async function handleChangeDescription(description, card, workoutId, id) {
        let response;
        try {
            const formData = new FormData();
            formData.append('description', description);
            // if it comes from wrongFormMediaCard
            if (card === 'wrongForm') {
                response = await updateWrongExerciseForm(id, formData);
                // if it comes from correctFormMediaCard
            } else {
                response = await updateCorrectExerciseForm(id, formData);
            }
            if (response.statusCode >= 400) {
                throw new Error(response);
            }
        }
        catch (error) {
            console.error('An error occured', error);
            setIsError(true);
        }
        updateAccordions(draft => {
            const accordion = draft.find(a => a.id === accordionId);
            const accordionItem = accordion.items.find(i => i.id === itemId);
            const workout = accordionItem.workouts.find(w => w.id === workoutId);

            // we check if this came from WorkoutMediaWrongFormCard
            if (card === 'wrongForm') {
                const wrongForm = workout.wrongForm.find(w => w.id === id);
                wrongForm.description = description;
                // if not, its from WorkoutMediaCorrectFormCard
            } else {
                const correctForm = workout.correctForm.find(w => w.id === id);
                correctForm.description = description;
            }

        })
    }

    //handles the addition of correctForm and wrongForm cards in their respective dialogs.
    function handleAddCard(formDialog, workoutId) {
        const formData = new FormData();
        let response;
        // append also a default example image
        fetch(demoGif2)
            .then(res => res.blob())
            .then(async (blob) => {

                const file = new File([blob], "chinUp.gif", {
                    type: 'image/png'
                });
                formData.append('demo', file);
                if (formDialog === 'wrongForm') {
                    formData.append('description', "Wrong exercise form description: e.g., Shoulder blades not retracting")
                    response = await createWrongExerciseForm(workoutId, formData)
                } else {
                    formData.append('description', "Correct exercise form description: e.g., Shoulder blades are depressed downwards")
                    response = await createCorrectExerciseForm(workoutId, formData);
                }


                if (response.statusCode >= 400) {
                    throw new Error(workout);
                }
                return response;
            })
            .then(response => {
                updateAccordions(draft => {
                    const accordion = draft.find(a => a.id === accordionId);
                    const accordionItem = accordion.items.find(i => i.id === itemId);
                    const workout = accordionItem.workouts.find(w => w.id === workoutId);

                    // we check if this came from WrongformDialog
                    if (formDialog === 'wrongForm') {
                        workout.wrongForm.push(response);
                        // if not, its from CorrectFormDialog
                    } else {
                        workout.correctForm.push(response);
                    }
                })
            })
            .catch(err => {
                console.error(`An error occured`, err);
                setIsError(true);
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
            <Card data-cy="Workout Card" sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: { xs: 700, md: 725 }, height: '100%', borderTop: `4px solid ${theme.palette.secondary.main}` }}>
                <CardMedia
                    component="img"
                    sx={{ aspectRatio: 16 / 9 }}
                    src={workout.demo}
                    alt="workout demo"
                />
                <InputFileUpload workoutId={workout.id} onChange={onChangeImage} name="demo" text="GIF File" />
                {isError && <Typography variant="small" sx={{ color: 'red', textAlign: 'center', mt: 1 }}>Something Happend.Please try again</Typography>}
                <CardContent>
                    <Box width='inherit' component={'div'}>
                        {/* workout description editor */}
                        <ReactQuill
                            modules={modulesCard}
                            onChange={value => {
                                setWorkoutDescription(value);
                                setIsError(false);
                            }}
                            value={workoutDescription}
                            className={isError ? "ql-workout ql-error" : "ql-workout"}
                        />

                    </Box>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                    <Grid container justifyContent={'center'} columns={{ xs: 4, sm: 8 }} spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('correct')} startIcon={<CheckIcon color="success" />} color="success" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <CorrectFormDialog
                                errorState={{ isError, setIsError }}
                                eventHandlers={{ handleImageUpload, handleDeleteCard, handleChangeDescription, handleAddCard }}
                                workoutId={workout.id} correctFormExercises={workout.correctForm} open={isOpenCorrect} setOpen={setisOpenCorrect} />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Button onClick={() => handleClickOpen('wrong')} startIcon={<ClearIcon color="error" />} color="error" fullWidth={true} variant="outlined" size="large">Form</Button>
                            <WrongFormDialog
                                errorState={{ isError, setIsError }}
                                eventHandlers={{ handleImageUpload, handleDeleteCard, handleChangeDescription, handleAddCard }}
                                workoutId={workout.id} wrongFormExercises={workout.wrongForm} open={isOpenWrong} setOpen={setisOpenWrong} />
                        </Grid>
                        <Grid item sm={8}>
                            <Button fullWidth={true} onClick={() => onClick(workout.id)} startIcon={<DeleteIcon />}>Delete</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    );
}

// Event handlers in RepsonsiveDialog don't use the Submit hook anymore (because I am lazy about refactoring the logic, and it's added complexity to revise and use the Effect hook for it) to send it to our action server. Instead, it just now calls the function that makes the HTTP request inside the event handler.
export function ResponsiveDialog({ actionData, immerAtom, itemId, onClick, onChange, accordionId, accordionItem, children }) { // This compponent (ResponsiveDialog) is actually an Accordion item or detail of an accordion
    const [isError, setIsError] = React.useState(false);
    const [, updateAccordions] = immerAtom; // lol this is just a prop from the parent component (AccordionSection) 
    const [open, setOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [parent, enableAnimations] = useAutoAnimate();
    const [isWorkoutRoutine, setIsWorkoutRoutine] = React.useState(accordionItem?.workouts?.length > 0);
    const [heading, setHeading] = React.useState(children);
    // The `lecture` and `description` state variable holds the *first* value of `accordionItem.lecture` for lecture and `accordItem.description` for description.
    // Further changes to both `accordionItem` prop are ignored.
    const [lecture, setLecture] = React.useState(accordionItem.lecture || '');
    const [description, setDescription] = React.useState(accordionItem.description || '');
    const theme2 = useTheme();
    const fullScreen = useMediaQuery(theme2.breakpoints.down('sm'));
    let accordionItemHeadingContent;
    const isFirstRender = React.useRef(true); const initialDescription = React.useRef(description); const initialLecture = React.useRef(lecture); // necessary variables to avoid this side effect from running on the first render

    React.useEffect(() => {
        if (actionData?.message) { // if there's a message from action server. then there's an error
            setIsError(true);
        }
    }, [actionData])

    React.useEffect(() => {
        if (isEditing) {

            // debounce event handler
            const handler = setTimeout(() => {
                onChange({
                    ...accordionItem,
                    heading: heading
                }, accordionId);
                setIsError(false);
            }, 300);
            return () => {
                clearTimeout(handler);
            }
        }
        if (!isWorkoutRoutine) {
            if (isFirstRender.current || (description === initialDescription.current && lecture === initialLecture.current)) {
                isFirstRender.current = false;
                return;
            }
            // debounce event handler
            const handler = setTimeout(() => {
                onChange({
                    ...accordionItem,
                    description: description,
                    lecture: lecture,
                }, accordionId);
                setIsError(false);

            }, 300);
            return () => {
                clearTimeout(handler);
            }

        }
    }, [heading, lecture, description]);




    function handleImageUpload(event, workoutId) {
        // update image for workout demo
        const file = event.target.files[0];
        const reader = new FileReader();
        const formData = new FormData()
        reader.onloadend = async () => {
            try {
                formData.append('demo', file);
                const workoutRes = await updateWorkout(workoutId, formData);
                // throw an error if !response.ok
                if (workoutRes.statusCode >= 400) {
                    throw new Error(workoutRes);
                }
                setIsError(false)
            }
            catch (err) {
                console.error('An error occured', err);
                setIsError(true);
            }
            updateAccordions(draft => {
                const accordion = draft.find(a => a.id === accordionId);
                const accordionItem = accordion.items.find(i => i.id === itemId);
                const workout = accordionItem.workouts.find(w => w.id === workoutId);
                workout.demo = reader.result;
            })
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    async function handleChangeWorkoutDescription(workoutDescription, workoutId) {

        const formData = new FormData();
        formData.append('exercise', workoutDescription);
        try {
            const w = await updateWorkout(workoutId, formData);
            if (w.statusCode >= 400) {
                throw new Error(w);
            }
        }
        catch (error) {
            console.error('An Error Occured', error);
        }
        updateAccordions(draft => {
            const accordion = draft.find(a => a.id === accordionId);
            const accordionItem = accordion.items.find(i => i.id === itemId);
            const workout = accordionItem.workouts.find(w => w.id === workoutId);
            workout.exercise = workoutDescription;
        })

    }

    function handleAddWorkoutCard() {
        setIsError(false);
        const workoutFormData = new FormData();
        workoutFormData.append('exercise', "Your description here");
        // append also a default example image
        fetch(demoGif)
            .then(res => res.blob())
            .then(async (blob) => {

                const file = new File([blob], "chinUp.gif", {
                    type: 'image/png'
                });
                workoutFormData.append('demo', file);
                const workout = await createWorkout(itemId, workoutFormData);
                if (workout.statusCode >= 400) {
                    throw new Error(workout);
                }
                return workout
            })
            .then(workout => {
                updateAccordions(draft => {
                    const accordion = draft.find(a => a.id === accordionId);
                    const accordionItem = accordion.items.find(item => item.id === itemId);
                    accordionItem.workouts.push({
                        id: workout.id,
                        exercise: `
                        <h3> Your description here e.g., </h3><br>
                        <p> Chin Ups setsXreps: 3x8 </p> <br>
                        <p> Rest: 2 minutes </p> <br>
                        <p> tempo: 1 sec concentric (upward movement)</p> <br>
                        <p> 2 sec eccentric (downward movement) </p>
                        <p> exertion: 8 </p> etc`,
                        demo: demoGif,
                        correctForm: [

                        ],
                        wrongForm: [

                        ]
                    })
                })
            })
            .catch(err => {
                console.error(`An error occured`, err);
                setIsError(true);
            })

    }


    async function handleDeleteWorkoutCard(workoutId) {
        try {
            const workout = await deleteWorkout(workoutId);
            if (workout.statusCode >= 400) {
                throw new Error(workout);
            }
        } catch (error) {
            console.error(error);
        }
        updateAccordions(draft => {
            const accordion = draft.find(a => a.id === accordionId);
            const accordionItem = accordion.items.find(i => i.id === itemId);
            accordionItem.workouts = accordionItem.workouts.filter(w => w.id !== workoutId);
        })
    }



    if (isEditing) {
        // show input form when edit btn is clicked
        accordionItemHeadingContent = (
            <>
                <Grid item xs={10} lg={11}>
                    {/* AccordtionDetail edit input form */}
                    <TextField
                        error={isError}
                        data-cy={`Accordion item edit-${itemId}`}
                        id="standard-multiline-flexible"
                        label="Accordiong Item Heading"
                        multiline
                        maxRows={4}
                        variant="standard"
                        value={heading}
                        fullWidth
                        onChange={e => {
                            setHeading(e.target.value);
                        }
                        }
                    />
                </Grid>
                <Grid item xs={2} lg={1}>
                    <Button onClick={() => setIsEditing(false)} disabled={isError}>
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
                <Grid item xs={10} lg={11} className="heading">
                    <ThemeProvider theme={theme}>
                        <DescriptionIcon theme={theme2} sx={{ position: 'sticky', marginRight: 2 }} fontSize="x-small"></DescriptionIcon>
                        <Typography data-cy={`Accordion item ${itemId}`} align='justify' variant="body" onClick={handleClickOpen} sx={{ cursor: 'pointer', '&:hover': { color: 'lightgray' }, }} >
                            {children}
                        </Typography>
                    </ThemeProvider>
                </Grid>
                {(itemId !== 1 && itemId !== 2) && (
                    <Grid item xs={2} lg={1}>
                        <Button data-cy={`accordionItem edit-${itemId}`} onClick={() => setIsEditing(true)} size="small" endIcon={!isEditing ? <EditIcon /> : null}></Button>
                        <Button onClick={() => onClick(accordionId, itemId)} size="small" endIcon={!isEditing ? <DeleteIcon /> : null}></Button>
                    </Grid>
                )}
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

            {/* don't render the first accordion items (they are just examples) */}

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
                                    <>


                                        <Grid ref={parent} justifyContent={{ xs: 'center', sm: 'flex-start' }} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                                            {accordionItem.workouts?.map(workout => (
                                                // Renders Workout instance
                                                <Grid key={workout.id} item sm={6}>
                                                    {/* Provider will provide context in which WorkoutMediaCard, can access an independent atom that it can be use */}
                                                    <WorkoutMediaCard ids={{ accordionId, itemId }} immerAtom={immerAtom} onChangeImage={handleImageUpload} onChangeDescription={handleChangeWorkoutDescription} onClick={handleDeleteWorkoutCard} workout={workout} open={open}> </WorkoutMediaCard>
                                                </Grid>
                                            ))}
                                            <Grid item sm={6}>
                                                {/* add WorkoutMediaCard / Workout button */}
                                                <Button disabled={itemId === 1 || itemId === 2} data-cy={`Add icon`} onClick={() => handleAddWorkoutCard()} sx={{ height: { xs: 250, sm: 622, md: 700 }, width: { xs: 340, sm: '100%', md: 391 } }}>
                                                    <AddIcon fontSize="large" sx={{ height: 300, width: 300 }} />
                                                </Button>
                                            </Grid>
                                            {/* {isError &&
                                                <Grid item sm={6} alignSelf={'center'}>
                                                    <Typography sx={{ color: 'red', textAlign: 'center', mb: 3, mt: 3 }}>Something Happend.Please try again</Typography>
                                                </Grid>
                                            } */}
                                        </Grid>
                                    </>
                                    :
                                    <Grid justifyContent={'center'} item container>
                                        <YoutubeInput isError={isError} actionData={actionData} lecture={lecture} onChange={setLecture} itemId={itemId} />
                                        <Grid item xs={10}>
                                            {getEmbedUrl(accordionItem.lecture) ?
                                                <Box mt={4} className="course-lecture-container" component={'div'}>
                                                    <iframe className="course-video-lecture" src={getEmbedUrl(accordionItem.lecture)} title="vide-lecture here" allowFullScreen></iframe>
                                                </Box>
                                                :
                                                <Box mt="5%" component="div" height={200} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ border: '2px dotted black' }}>
                                                    <Typography variant="body" align={'center'}>
                                                        Your video will show up here
                                                    </Typography>
                                                </Box>
                                            }
                                        </Grid>
                                        <Grid item mt={4} xs={10} justifySelf={'flex-start'}>
                                            <ThemeProvider theme={theme}>
                                                <Typography variant="h4" fontWeight={'bold'}>
                                                    Description
                                                </Typography>
                                            </ThemeProvider>
                                        </Grid>
                                        <Grid item xs={10} mt={4}>
                                            <DescriptionInput isError={isError} actionData={actionData} description={description} onChange={setDescription} itemId={itemId} />
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



function ControlledAccordions({ activeStep, courseContentId }) {
    const [expanded, setExpanded] = React.useState(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data; // returns the response from previous action 
    // actionData will be pass to this component's childrens. because we are using fetcher here but for components up they don't
    const [accordions, updateAccordions] = useImmerAtom(accordionsAtom);

    React.useEffect(() => {
        // initially the accordion's IDs is not up to date with the database server,
        // so we continuously update our real 'IDs' and values of our state variables
        // that's why we use a useEffect for this matter.

        if (actionData?.section && actionData?.section?.intent) {
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
                    accordion.items.push(actionData.section.items[0]);
                });
            }
            else if (actionData.section.intent === 'updateAccordionItem') {
                updateAccordions(draft => {
                    const accordion = draft.find(accordion => accordion.id === actionData.section.id);
                    const accordionItemIndex = accordion.items.findIndex(item => item.id === actionData.section.items[0].id);
                    const nextAccordionItem = actionData.section.items[0];
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
        fetcher.submit({
            heading: heading, activeStep: activeStep, sectionId: accordionId,
            intent: 'createAccordionItem'
        }, {
            method: 'post'
        })

    }

    function handleEditAccordionItem(nextAccordionItem, accordionId) {
        // edits an accordion item's heading / content (sectionItem)

        const data = {
            heading: nextAccordionItem.heading,
            description: nextAccordionItem.description, activeStep: activeStep, sectionItemId: nextAccordionItem.id,
            sectionId: accordionId, intent: 'updateAccordionItem'
        }

        if (nextAccordionItem.lecture) {
            data.lecture = nextAccordionItem.lecture;
        } else {
            data.lecture = '';

        }



        fetcher.submit(data, {
            method: 'post'
        })

    }

    function handleDeleteAccordionItem(accordionId, accordionItemId) {
        // deletes accordion item
        // imperatively submit the key/value pairs needed in action route
        fetcher.submit({ activeStep: activeStep, sectionItemId: accordionItemId, intent: 'deleteAccordionItem' }, {
            method: 'post',
        })
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
        updateAccordions(draft => draft.filter(a => a.id !== accordionId));
    }
    return (
        <>
            {/* Adds a new Accordion / Section  */}
            <AddAccordion actionData={actionData} onClick={handleAddAccordion} />
            <Box sx={{ display: 'block', ml: 'auto', mr: 'auto' }}>
                <ThemeProvider theme={theme}>
                    <Typography variant="small">Note: The examples here are not part of your content.Please ignore them to avoid confusion.</Typography>
                </ThemeProvider>
            </Box>
            <TransitionGroup>
                {
                    accordions.map(accordion =>
                        <Collapse key={accordion.id}>{/* The collapse component's purpose is to transitionally remove the accordion. */}
                            <AccordionSectionCreate actionData={actionData} eventHandlers={{ handleDeleteAccordionItem, handleEditAccordionItem, handleAddAccordionItem }} onClickDelete={handleDeleteAccordion} onChange={handleEditAccordion} handleChange={handleChange} expanded={expanded} accordion={accordion} />
                        </Collapse>

                    )
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

    const fetcher = useFetcher();
    const actionData = fetcher.data; // The returned data (Obj properties) from the loader or action is stored here. Once the data is set, it persists on the fetcher even through reloads and resubmissions. - ReactRouter
    const [isError, setIsError] = useAtom(isErrorAtom)
    const [intent, setIntent] = React.useState('create');
    const navigation = useNavigation();
    const [, dispatch] = useAtom(snackbarReducerAtom);
    const submit = useSubmit(); 
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

    function handleSubmit() {
        submit({
            intent: 'submit',
            courseId: course.id,
            activeStep: activeStep
        }, { method: 'post' })
        dispatch({
            type: 'submitted',
            text: `Course submitted! It's now under review (3-7 days). Thanks for your patience!`
        })
    }



    return (
        <>
            <br></br>
            {
                activeStep === 0 ? (
                    <fetcher.Form method="post" encType="multipart/form-data" noValidate >
                        <input type="hidden" value={activeStep} name="activeStep" />
                        <input type="hidden" value={course.id} name="courseId" />
                        <Box m="3vw">
                            <Container>
                                <Grid container mb={4}>
                                    <Grid item xs>
                                        <ProgressMobileStepper intent={intent} setIntent={setIntent} activeStep={activeStep} setActiveStep={setActiveStep} />
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }} spacing={2}>
                                    {/* Paper starts here */}
                                    <Grid item xs sm md={5}>
                                        <Paper elevation={4} sx={{ height: { xs: 'auto', md: isError ? 630 : 600, }, width: 'auto', maxWidth: { md: 450 }, mb: '5%' }}  >
                                            <Grid item justifySelf={'center'}>
                                                <Container sx={{ padding: '4%', maxWidth: { xs: 700, md: 400 } }} component="div">
                                                    <img src={previewImage ? previewImage : image} className="course-thumbnail" style={{ objectFit: course.image == image ? 'fill' : 'cover', border: '1px dashed black' }} />
                                                </Container>
                                            </Grid>
                                            <Grid item container wrap="nowrap" alignItems={'center'} direction="column" spacing={2}>
                                                <Grid item xs>
                                                    {/* Uploading  image file button  here */}
                                                    <InputFileUpload thumbnail={course.thumbnail} name="thumbnail" text="Image" onChange={handleImageUpload} />
                                                </Grid>
                                                <Grid item xs lineHeight={'1.3em'}>
                                                    {isError &&
                                                        actionData?.message && ( // this is equivalent to saying if there's an error and actionData returns an error message
                                                            <>
                                                                {Object.entries(JSON.parse(actionData.message)).map(([key, value]) => (
                                                                    <Box key={key} component="div" p={'0 1.5em'}>
                                                                        <Typography key={key} variant='small' sx={{ color: 'red', textAlign: 'left' }}>
                                                                            {key === 'thumbnail' || key === 'difficulty' || key === 'price' || key === 'weeks' ? `${key}: ${value[0]}` : key === 'detail' ? `${value}` : null}
                                                                        </Typography>
                                                                    </Box>
                                                                ))}
                                                            </>
                                                        )}
                                                </Grid>
                                                <Grid item>
                                                    <FormattedInputs error={isError} course={course} setCourse={setCourse} />
                                                </Grid>
                                                <Grid item xs pb={4}>
                                                    {/* Select menu form */}
                                                    <DifficultySelectForm isError={isError} setIsError={setIsError} course={course} setCourse={setCourse} />
                                                    <WeeksTextField isError={isError} setIsError={setIsError} course={course} setCourse={setCourse} />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    {/* Paper ends here */}
                                    {/* title  & description starts here */}

                                    {/* <Grid item xs={12} sm={12} md lg> */}
                                    <Grid item xs={12} sm={12} md container wrap="nowrap" direction="column">
                                        <Grid item xs>
                                            {/* Course title textarea input */}
                                            <CourseTitleTextField isError={isError} setIsError={setIsError} course={course} setCourse={setCourse} actionData={actionData} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* Course Description input here */}
                                            <DescriptionTextField isError={isError} setIsError={setIsError} course={course} setCourse={setCourse} actionData={actionData} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* </Grid> */}
                            </Container>
                        </Box>
                    </fetcher.Form>
                    /* title  & description ends here */
                )
                    : activeStep === 1 ? (
                        <fetcher.Form method="post" encType="multipart/form-data" noValidate >
                            <TextField type="hidden" value={activeStep} name="activeStep" />
                            <TextField type="hidden" value={course.id} name="courseId" />
                            <Box m="3vw">
                                <Container>
                                    <Grid container mb={4}>
                                        <Grid item xs>
                                            <ProgressMobileStepper intent={intent} setIntent={setIntent} activeStep={activeStep} setActiveStep={setActiveStep} />
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                            <Box sx={{ marginLeft: 'auto', marginRight: 'auto' }} maxWidth={{ xs: '85vw', md: '69vw' }}>
                                {/* title  & description ends here */}
                                <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3}>

                                    {/* course overview textarea input */}
                                    <OverviewTextField isError={isError} setIsError={setIsError} courseContent={courseContent} setCourseContent={setCourseContent} actionData={actionData} />
                                    <PreviewCourseTextField isError={isError} setIsError={setIsError} courseContent={courseContent} setCourseContent={setCourseContent} actionData={actionData} />
                                </Grid>
                            </Box>
                        </fetcher.Form>
                    ) : (
                        <>

                            <Box m="3vw">
                                <Container>
                                    <Grid container>
                                        <Grid item xs>
                                            <ProgressMobileStepper intent={intent} setIntent={setIntent} activeStep={activeStep} setActiveStep={setActiveStep} />
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                            <Box sx={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                <Grid mt={'2%'} container direction={'column'} alignItems={'center'} spacing={3} >
                                    <Grid item width={{ xs: '100%', md: '69%' }}>
                                        <ThemeProvider theme={theme} >
                                            <Typography variant="h3" fontWeight={'bold'}>
                                                Course content
                                            </Typography>
                                        </ThemeProvider>
                                    </Grid>
                                    <Grid item width={{ xs: '100%', md: '69%' }}>
                                        <ControlledAccordions activeStep={activeStep} courseContentId={courseContent.id}></ControlledAccordions>
                                    </Grid>
                                </Grid>
                                {/* <TextField type="hidden" value={activeStep} name="activeStep" />
                                    <TextField type="hidden" value={course.id} name="courseId" /> */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: "flex", justifyContent: 'flex-end' }}>
                                        <AlertDialog onClickSubmit={handleSubmit} intent="submitting course" />
                                    </Box>
                                </Box>

                            </Box>

                        </>
                    )}

        </>
    )
}

