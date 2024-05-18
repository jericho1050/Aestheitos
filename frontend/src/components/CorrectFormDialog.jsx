import { useTheme } from "@emotion/react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DOMPurify from "dompurify";
import { Check } from "@mui/icons-material";

let theme = createTheme()
theme = responsiveFontSizes(theme)

const correctForm2 = {
    demo: 'https://www.youtube.com/embed/IZMKe61144w',
    description: " Aenean leo liguleget."
}

function WorkoutMediaCorrectFormCard({ correctForm, open }) {
    return (
        open &&
        <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 350, sm: 400 }, maxHeight: 645, height: '100%', borderTop: '4px solid green' }}>
            <Box position="relative">
            <CardMedia
                component="img"
                sx={{ aspectRatio: 16 / 9, }}
                src={correctForm.demo}
                alt="workout demo"
                allowFullScreen
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
            />
            <CheckIcon  fontSize="large" className="correct-icon"/>
            </Box>
            <CardContent sx={{ width: 300 }} >
                <Container width="inherit" sx={{ height: { xs: 300, md: 350 }, overflow: 'auto' }} >
                    <Box className="html-content" component="div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(correctForm.description) }} />
                </Container>
            </CardContent>
        </Card>
    );
}

export default function CorrectFormDialog({ correctFormExercises, open, setOpen }) {
    const theme2 = useTheme();
    const fullScreen = useMediaQuery(theme2.breakpoints.down('sm'));

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

                        <Grid justifyContent={'flex-start'} item container spacing={3} columns={12}>
                            {
                                correctFormExercises.length ?
                                    correctFormExercises?.map(exercise =>

                                        <Grid key={exercise.id} item sm={6}>
                                            <WorkoutMediaCorrectFormCard correctForm={exercise} open={open} />
                                        </Grid>
                                    )
                                    :
                                    <Grid item sm={12}>
                                        <ThemeProvider theme={theme} >
                                            <Typography variant="body1" height={350}>
                                                No Workouts To Show
                                            </Typography>
                                        </ThemeProvider>
                                    </Grid>
                            }

                        </Grid>
                    </DialogContent>
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