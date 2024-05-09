import { useTheme } from "@emotion/react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InputFileUpload from "./InputFileUpload";
import { modules, modulesCard } from "../helper/quillModule";
import ReactQuill from "react-quill";


let theme = createTheme()
theme = responsiveFontSizes(theme)

const correctForm2 = {
    demo: 'https://www.youtube.com/embed/IZMKe61144w',
    description: " Aenean leo liguleget."
}

function WorkoutMediaCorrectFormCard({ errorState, onChangeImage, onClick, onChange, workoutId, correctForm, open }) {
    const {isError, setIsError} = errorState;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [description, setDescription] = React.useState(correctForm.description || '');

    React.useEffect(() => {

        // debounce event handler
        const handler = setTimeout(() => {
            onChange(description, 'correctForm', workoutId, correctForm.id);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [description]);

    return (
        open &&
        <Card data-cy="Correct Form Workout Card" sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: 700, height: '100%', borderTop: '4px solid green' }}>
            <CardMedia
                component="img"
                sx={{ aspectRatio: 16 / 9, width: { xs: 350, sm: 'auto' } }}
                src={correctForm.demo}
                alt="workout demo"
            />
            <InputFileUpload correctFormId={correctForm.id} workoutId={workoutId} onChange={onChangeImage} name="demo" text="GIF File" />
            {isError && <Typography variant="small" sx={{ color: 'red', textAlign: 'center', mt: 1 }}>Something Happend.Please try again</Typography>}
            <CardContent>
            <Box width={{ xs: 'inherit', sm: 'inherit' }} component={'div'}>
                    {/* workout description textarea input */}
                    {/* <TextField
                        helperText=" "
                        id="demo-helper-text-aligned-no-helper"
                        label="Your Workout's Description"
                        fullWidth={true}
                        minRows={isSmallScreen ? 7 : 10}
                        maxRows={isSmallScreen ? 7 : 10}
                        multiline
                        required
                        autoFocus
                        name="exercise"
                        value={description}
                        onChange={e => {
                            setDescription(e.target.value);
                            setIsError(false);
                        }}
                        error={isError}
                    /> */}
                    <ReactQuill 
                        modules={modulesCard}
                            onChange={value => {
                                setDescription(value);
                                setIsError(false);
                            }}
                            value={description}
                            className={isError ? "ql-workout ql-error" : "ql-workout"}
                        />
                </Box>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto' }}>
                <Grid container justifyContent={'center'}>
                    <Grid item xs={12}>
                        <Button fullWidth={true} onClick={() => { onClick(workoutId, null, correctForm.id) }} startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>

            </CardActions>
        </Card>
    );
}


export default function CorrectFormDialog({ errorState, eventHandlers, workoutId, correctFormExercises, open, setOpen }) {
    const { handleImageUpload, handleDeleteCard, handleChangeDescription, handleAddCard: onClick } = eventHandlers;
    const theme2 = useTheme();
    const fullScreen = useMediaQuery(theme2.breakpoints.down('sm'));
    const [parent, enableAnimations] = useAutoAnimate();



    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={true}
                maxWidth={'md'}
            >
                <Grid container >
                    <Grid item container justifyContent={'flex-start'} marginLeft={{ md: 2 }} marginRight={{ md: 2 }}>
                        <DialogTitle id="responsive-dialog-title" sx={{color: 'green'}}>
                            {"Correct Exercise Form"}
                        </DialogTitle>
                    </Grid>
                    <DialogContent>
                        <Grid ref={parent} justifyContent={{ xs: 'center', sm: 'flex-start' }} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>


                            {
                                correctFormExercises?.map(exercise => {


                                    return (
                                        <Grid key={exercise.id} item sm={6}>
                                            <WorkoutMediaCorrectFormCard errorState={errorState} onChangeImage={handleImageUpload} onClick={handleDeleteCard} onChange={handleChangeDescription} workoutId={workoutId} correctForm={exercise} open={open}> </WorkoutMediaCorrectFormCard>
                                        </Grid>
                                    )
                                })
                            }

                            <Grid item sm={6}>
                                {/* add WorkoutMediaCard / Workout button */}
                                <Button disabled={workoutId === 3} onClick={() => onClick('correctForm', workoutId)} sx={{ height: { xs: 250, sm: 622, md: 622 }, width: { xs: 340, sm: '100%', md: 391 } }}>
                                    <AddIcon fontSize="large" sx={{ height: 300, width: 300 }} />
                                </Button>
                            </Grid>

                        </Grid>
                    </DialogContent>
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




// t be use later on same goes with formdialog
{/* <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: 645, height: '100%', borderTop: '4px solid green' }}>
<CardMedia
    component="img"
    sx={{ aspectRatio: 16 / 9, }}
    src={correctForm.demo}
    alt="workout demo"
    allowFullScreen
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
/>
<CardContent sx={{ width: 300 }} >
    <ThemeProvider theme={theme}>
        <Typography maxHeight={{ xs: 200, sm: 250 }} height={{ xs: 200, sm: 250 }} overflow={'auto'} gutterBottom variant="h5" component="div">
            <CheckIcon sx={{ border: "2px solid green" }} fontSize="large" color="success"></CheckIcon> {correctForm.description}
        </Typography>
    </ThemeProvider>
</CardContent>
<CardActions sx={{ marginTop: 'auto' }}>
    <Grid container justifyContent={'center'}>
        <Grid item>
            <Button startIcon={<EditIcon />}>
                Edit
            </Button>
        </Grid>
    </Grid>

</CardActions>
</Card> */}