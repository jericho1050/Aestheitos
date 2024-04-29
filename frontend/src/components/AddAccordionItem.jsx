import { Box, Grid, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useAtom } from "jotai";
import { isErrorAtom } from "../atoms/isErrorAtom";







const headingDefault = 'Add an item, e.g., week 1-4: workout routine.'

export default function AddAccordionItem({ accordionId, onClick }) {
    // This component represents the input field for adding a section / accordion

    const [heading, setHeading] = useState(headingDefault);
    const [isError, setIsError] = useAtom(isErrorAtom);

    return (
        <Box pl={4} mr={0} component="div" mb={4}>
            <Grid container alignItems={'center'} spacing={3}>
                <Grid item xs={10} lg={11}>
                    <TextField
                        error={isError}
                        id="outlined-textarea"
                        label={"Add Accordion Detail / Section Item"}
                        value={heading}
                        placeholder="Section Item Heading"
                        multiline
                        fullWidth
                        onChange={e => {
                            setHeading(e.target.value)
                            setIsError(false);
                        }
                        }
                    // name="heading"
                    />
                </Grid>
                <Grid item xs={2} lg={1}>
                    <IconButton data-cy="Add Accordion Item" sx={{ border: '1px solid #1976D2' }} onClick={() => {
                        setHeading('');
                        onClick(heading, accordionId);
                    }} size="medium" color="primary" aria-label="add">
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>

    )
}