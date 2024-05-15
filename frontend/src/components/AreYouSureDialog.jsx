import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import { useAtom } from 'jotai';
import { snackbarReducerAtom } from '../atoms/snackbarAtom';

export default function AlertDialog({onClickSubmit}) {
    const theme2 = useTheme();
    const isXsmallScreen = useMediaQuery(theme2.breakpoints.only('xs'));
    const [open, setOpen] = React.useState(false);
    const navigation = useNavigation();
    const[, dispatch] = useAtom(snackbarReducerAtom);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    
    return (
        <React.Fragment>
            <Button onClick={handleClickOpen} disabled={navigation.state === 'submitting'}  sx={{ mt: 3 }} fullWidth={isXsmallScreen ? true : false} startIcon={<SendIcon />} variant="contained" color="primary">
                Submit
            </Button>
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
                        Are you sure you want to submit?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button autoFocus onClick={() => {
                        onClickSubmit();
                        dispatch({
                            type: 'submitting'
                        })
                        }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
