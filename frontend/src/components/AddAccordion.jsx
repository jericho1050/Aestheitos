import { Box, Grid, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const headingDefault = 'Add a Accordion: Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
export default function AddAccordion({ onAddAccordion }) {
    // This component represents the input field for adding a section / accordion

    const [heading, setHeading] = useState(headingDefault);

    return (
        <Box component="div" mb={4}>
            <Grid container alignItems={'center'} spacing={3}>
                <Grid item xs={10} sm={11}>
                    <TextField
                        id="outlined-textarea"
                        label="Add Accordion / Section"
                        value={heading}
                        placeholder="Summary or Section's Heading"
                        multiline
                        fullWidth
                        onChange={e => setHeading(e.target.value)}
                        name="heading"
                    />
                </Grid>
                <Grid item xs={2} sm={1}>
                    <IconButton sx={{border: '1px solid #1976D2'}} onClick={() => {
                        setHeading('');
                        onAddAccordion(heading);
                    }} color="primary" aria-label="add">
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>

    )
}