import { useTheme } from "@emotion/react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, useMediaQuery } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

export default function SearchBar({ isOpen, setIsOpen }) {
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        isSmallScreen ?
            (<>
                <Grid item xs>
                    <IconButton onClick={() => {
                        setIsOpen(true);
                    }} size="large" aria-label="search" color="inherit">
                        <SearchIcon />
                    </IconButton>
                </Grid>
                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                    }}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            // console.log(email);
                            setIsOpen(false);
                        },
                    }}
                >
                    <DialogTitle>Search for Courses</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>
                  Search Available Courses
                </DialogContentText> */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setIsOpen(false);
                        }}>Cancel</Button>
                        <Button type="submit">Search</Button>
                    </DialogActions>
                </Dialog>
            </>)
            :
            (<Grid item xs>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            </Grid>)

    )

}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));