import { useTheme } from "@emotion/react";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


let theme = createTheme()
theme = responsiveFontSizes(theme)

function VideoMediaCardCorrectForm({ correctForm, open }) {
    return (
        open &&
        <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: 345, maxHeight: 645, height: '100%' }}>
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
                    <Typography maxHeight={300} overflow={'auto'} gutterBottom variant="h5" component="div">
                        {correctForm.description}
                    </Typography>
                </ThemeProvider>
            </CardContent>
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
                <Grid container justifyContent={'center'}>
                    <Grid item>
                        <DialogTitle id="responsive-dialog-title">
                            {"Correct Exercise Form"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid justifyContent={'center'} item container spacing={3}>
                                <Grid item sm>
                                    <VideoMediaCardCorrectForm correctForm={correctForm} open={open}> </VideoMediaCardCorrectForm>
                                </Grid>
                                <Grid item sm>
                                    <VideoMediaCardCorrectForm correctForm={correctForm} open={open}>
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