import { useTheme } from "@emotion/react";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

let theme = createTheme()
theme = responsiveFontSizes(theme)

const correctForm2 = {
    demo: 'https://www.youtube.com/embed/IZMKe61144w',
    description: " Aenean leo liguleget."
}

function VideoMediaCardCorrectForm({ correctForm, open }) {
    return (
        open &&
        <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: {xs: 500, sm: 400}, maxHeight: 645, height: '100%' }}>
            <CardMedia
                component="iframe"
                sx={{ aspectRatio: 16 / 9, }}
                src={correctForm.demo}
                alt="workout demo"
                allowFullScreen
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
            />
            <CardContent>
                <ThemeProvider theme={theme}>
                    <Typography maxHeight={{xs: 200, sm: 250}} height={{xd: 200, sm: 250}} width={{xs: 420, sm: 'inherit'}} overflow={'auto'} gutterBottom variant="h5" component="div">
                        <CheckIcon sx={{border: "2px solid green"}} fontSize="large" color="success"></CheckIcon> {correctForm.description}
                    </Typography>
                </ThemeProvider>
            </CardContent>
            <CardActions sx={{marginTop: 'auto'}}>
                <Grid container justifyContent={'center'}>
                    <Grid item>
                        <Button startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Grid>
                </Grid>
                
            </CardActions>
        </Card>
    );
}


export default function CorrectFormDialog({ correctForm, open, setOpen }) {
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
                    <Grid item container justifyContent={'center'} marginLeft={{md : 2}} marginRight={{md: 2}}>
                        <DialogTitle id="responsive-dialog-title">
                            {"Correct Exercise Form"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid justifyContent={{xs: 'center', sm: 'flex-start'}} item container spacing={3} columns={12}>
                                <Grid item sm={6}>
                                    <VideoMediaCardCorrectForm correctForm={correctForm} open={open}> </VideoMediaCardCorrectForm>
                                </Grid>
                                <Grid item sm={6}>
                                    <VideoMediaCardCorrectForm correctForm={correctForm} open={open}>
                                    </VideoMediaCardCorrectForm>
                                </Grid>
                                <Grid item sm={6}>
                                    <VideoMediaCardCorrectForm correctForm={correctForm2} open={open}>
                                    </VideoMediaCardCorrectForm>
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