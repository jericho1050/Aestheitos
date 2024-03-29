import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddAccordionDetail from "../components/AddAccordionDetail";
import { ResponsiveDialog } from "../routes/create";
import { useState } from "react";


export default function Section({ onDeleteItem, onChangeItem, onDelete, onChange, handleChange, expanded, accordion, handleAddAccordionItem }) {
    const [isEditing, setIsEditing] = useState(false);
    let accordionHeadingContent;


    if (isEditing) {
        accordionHeadingContent = (
            <>
                <TextField
                    id="standard-multiline-flexible"
                    label="Multiline"
                    multiline
                    maxRows={4}
                    variant="standard"
                    value={accordion.heading}
                    fullWidth
                    onChange={e => onChange({
                        ...accordion,
                        heading: e.target.value
                    })}
                />
                <Button onClick={() => setIsEditing(false)}>
                    Save
                </Button>
            </>
        )
    } else {
        accordionHeadingContent = (
            <Typography fontWeight="bold" align='justify' sx={{ maxWidth: '96%', flexShrink: 0 }}>
                {accordion.heading}
            </Typography>
        )
    }

    return (
        <Accordion expanded={isEditing ? false : expanded === accordion.id} onChange={handleChange(accordion.id)} sx={{ maxWidth: '100%' }}>
            <AccordionSummary
                expandIcon={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button onClick={() => setIsEditing(true)} sx={{ paddingLeft: 2 }} startIcon={!isEditing ? <EditIcon /> : null} size="small" />
                    <Button onClick={() => onDelete(accordion.id)} sx={{ paddingLeft: 2 }} startIcon={!isEditing ? <DeleteIcon /> : null} size="small" />

                </Box>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ padding: '3%' }}
            >

                {accordionHeadingContent}
            </AccordionSummary>
            <AccordionDetails >
                <AddAccordionDetail onAddAccordionItem={handleAddAccordionItem} accordionId={accordion.id} />
            </AccordionDetails>
            {accordion.items ? accordion.items.map((item) => (

                <AccordionDetails
                    key={item.id} sx={{ paddingLeft: '5%' }}>
                    <ResponsiveDialog onDelete={onDeleteItem} onChange={onChangeItem} accordionId={accordion.id} accordionItem={item}>
                        {item.heading}
                    </ResponsiveDialog>
                </AccordionDetails>
            )) :
                null

            }

        </Accordion>
    )
}