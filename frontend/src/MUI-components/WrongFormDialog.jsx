import { useTheme } from "@emotion/react";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

let theme = createTheme()
theme = responsiveFontSizes(theme)

const wrongForm2 = {
    demo: 'https://www.youtube.com/embed/IODxDxX7oi4',
    description: "scapula not moving"
}

function WorkoutMediaCardWrongForm({ wrongForm, open }) {
    return (
        open &&
        <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 500, sm: 400 }, maxHeight: 645, height: '100%' }}>
            <CardMedia
                component="iframe"
                sx={{ aspectRatio: 16 / 9, }}
                src={wrongForm.demo}
                alt="workout demo"
                allowFullScreen
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
            />
            <CardContent>
                <ThemeProvider theme={theme}>
                    <Typography maxHeight={{ xs: 200, sm: 250 }} height={{ xd: 200, sm: 250 }} width={{ xs: 420, sm: 'inherit' }} overflow={'auto'} gutterBottom variant="h5" component="div">
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
        </Card>
    );
}


export default function WrongFormDialog({ wrongForm, open, setOpen }) {
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
                    <Grid item container justifyContent={'center'} marginLeft={{ md: 2 }} marginRight={{ md: 2 }}>
                        <DialogTitle id="responsive-dialog-title">
                            {"Wrong Exercise Form"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid justifyContent={{ xs: 'center', sm: 'flex-start' }} item container spacing={3} columns={12}>
                                <Grid item sm={6}>
                                    <WorkoutMediaCardWrongForm wrongForm={wrongForm} open={open}> </WorkoutMediaCardWrongForm>
                                </Grid>
                                <Grid item sm={6}>
                                    {/* add WorkoutMediaCard / Workout button ( for wrongForm exercise ) */}
                                    <Button sx={{ height: { xs: 250, sm: 622, md: 622 }, width: { xs: 340, sm: '100%', md: 391 } }}>
                                        <AddIcon fontSize="large" sx={{ height: 300, width: 300 }} />
                                    </Button>
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









{/* <Grid item sm={6}>
<VideoMediaCardWrongForm wrongForm={wrongForm} open={open}>
</VideoMediaCardWrongForm>
</Grid>
<Grid item sm={6}>
<VideoMediaCardWrongForm wrongForm={wrongForm2} open={open}>
</VideoMediaCardWrongForm>
</Grid> */}