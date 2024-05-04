import { useTheme } from "@emotion/react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useAutoAnimate } from "@formkit/auto-animate/react";
import DeleteIcon from '@mui/icons-material/Delete';
import InputFileUpload from "./InputFileUpload";


let theme = createTheme()
theme = responsiveFontSizes(theme)

const wrongForm2 = {
    demo: 'https://www.youtube.com/embed/IODxDxX7oi4',
    description: "scapula not moving"
}

function WorkoutMediaWrongFormCard({ errorState, onChangeImage, onClick, onChange, wrongForm, workoutId, open }) {
    const {isError, setIsError} = errorState;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [description, setDescription] = React.useState(wrongForm.description || '');
    console.log(isError);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            onChange(description, 'wrongForm', workoutId, wrongForm.id);
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [description])

    return (
        open &&
        <Card data-cy="Wrong Form Workout Card" sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: 645, height: '100%', borderTop: '4px solid red' }}>
            <CardMedia
                component="img"
                sx={{ aspectRatio: 16 / 9, width: { xs: 350, sm: 'auto' } }}
                src={wrongForm.demo}
                alt="workout demo"
            />
            <InputFileUpload wrongFormId={wrongForm.id} workoutId={workoutId} onChange={onChangeImage} name="demo" text="GIF File" />
            {isError && <Typography variant="small" sx={{ color: 'red', textAlign: 'center', mb: 1, mt: 1 }}>Something Happend.Please try again</Typography>}

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
                        required
                        autoFocus
                        name="exercise"
                        value={description}
                        onChange={e => {
                            setDescription(e.target.value);
                            setIsError(false);
                        }}
                        error={isError}


                    />
                </Box>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto' }}>
                <Grid container justifyContent={'center'}>
                    <Grid item xs={12}>
                        <Button fullWidth={true} onClick={() => onClick(workoutId, wrongForm.id, null)} startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>

            </CardActions>
        </Card>

    );
}


export default function WrongFormDialog({ errorState, eventHandlers, workoutId, wrongFormExercises, open, setOpen }) { 
    const {handleImageUpload, handleDeleteCard, handleChangeDescription, handleAddCard: onClick} = eventHandlers;
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
                        <DialogTitle id="responsive-dialog-title" sx={{color: 'red'}}>
                            {"Wrong Exercise Form"}
                        </DialogTitle>
                    </Grid>
                    <DialogContent>
                        <Grid ref={parent} justifyContent={{ xs: 'center', sm: 'flex-start' }} item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>

                            {
                                wrongFormExercises?.map(exercise => {

                                    return (
                                        <Grid key={exercise.id} item sm={6}>
                                            <WorkoutMediaWrongFormCard errorState={errorState} onChangeImage={handleImageUpload} onClick={handleDeleteCard} onChange={handleChangeDescription} workoutId={workoutId} wrongForm={exercise} open={open}> </WorkoutMediaWrongFormCard>
                                        </Grid>
                                    )
                                })
                            }

                            <Grid item sm={6}>
                                {/* add WorkoutMediaCard / Workout button */}
                                <Button onClick={() => { onClick('wrongForm', workoutId) }} sx={{ height: { xs: 250, sm: 622, md: 622 }, width: { xs: 340, sm: '100%', md: 391 } }}>
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








// use it for the rendering of synced data later not create ui
{/* <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: 645, height: '100%', borderTop: '4px solid red' }}>
<CardMedia
    component="img"
    sx={{ aspectRatio: 16 / 9, }}
    src={wrongForm.demo}
    alt="workout demo"
    allowFullScreen
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
/>
<CardContent sx={{ width: 300 }}>
    <ThemeProvider theme={theme}>
        <Typography maxHeight={{ xs: 200, sm: 250 }} height={{ xs: 200, sm: 250 }} overflow={'auto'} gutterBottom variant="h5" component="div">
            <ClearIcon sx={{ border: "2px solid red" }} fontSize="large" color="warning"></ClearIcon> {wrongForm.description}
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