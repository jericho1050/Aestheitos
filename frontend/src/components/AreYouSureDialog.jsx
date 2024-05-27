import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Fab, useMediaQuery, useTheme } from '@mui/material';
import { useNavigation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import { useAtom } from 'jotai';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AlertDialog({ onClickSubmit, onClickDelete, intent }) {
    const theme2 = useTheme();
    const isXsmallScreen = useMediaQuery(theme2.breakpoints.only('xs'));
    const [open, setOpen] = React.useState(false);
    const navigation = useNavigation();
    const isSmallScreen = useMediaQuery(theme2.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <React.Fragment>

            {intent === 'submitting' && (<Button onClick={handleClickOpen} disabled={navigation.state === 'submitting'} sx={{ mt: 3 }} fullWidth={isXsmallScreen ? true : false} startIcon={<SendIcon />} variant="contained" color="primary">
                Submit
            </Button>)}
            {intent === 'deleting' && (
                <Box display="flex" position="fixed" bottom="20px" right="20px" flexDirection={'column'} gap={'0.69em'}>
                    <Fab color="primary" size={isSmallScreen ? 'medium' : 'large'} aria-label="edit">
                        <EditIcon />
                    </Fab>
                    <Fab color="error" size={isSmallScreen ? 'medium' : 'large'} aria-label="delete" onClick={handleClickOpen}>
                        <DeleteIcon />
                    </Fab>
                </Box>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intent === 'submitting' ? "Are you sure you want to submit?": "Are you sure you want to delete the course?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button autoFocus onClick={() => {
                        if (intent === 'submitting') {
                            onClickSubmit();

                        } else {
                            onClickDelete();
                        }

                    }}>
                        {intent === 'submitting' ? "Submit" : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
