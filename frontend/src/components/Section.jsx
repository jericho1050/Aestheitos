import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddAccordionDetail from "../components/AddAccordionDetail";
import { ResponsiveDialog } from "../routes/create";
import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'


export default function Section({ onClickDeleteItem, onChangeItem, onClickDelete, onChange, handleChange, expanded, accordion, handleAddAccordionItem }) {
    const [isEditing, setIsEditing] = useState(false);
    const [parent, enableAnimations] = useAutoAnimate()

    let accordionHeadingContent;


    if (isEditing) {
        accordionHeadingContent = (
            <>
                {/* Accordtion heading edit, Textarea input form */}
                <TextField
                    data-cy={`Accordion edit-${accordion.id}`}
                    id="standard-multiline-flexible"
                    label="Accordion Heading"
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
                    <Button onClick={() => onClickDelete(accordion.id)} sx={{ paddingLeft: 2 }} startIcon={!isEditing ? <DeleteIcon /> : null} size="small" />

                </Box>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ padding: '3%' }}
            >

                {accordionHeadingContent}
            </AccordionSummary>
            <AccordionDetails >
                <AddAccordionDetail onClick={handleAddAccordionItem} accordionId={accordion.id} />
            </AccordionDetails>
            <ul ref={parent}>
            {accordion.items ? accordion.items.map((item) => (

                <AccordionDetails
                     key={item.id} sx={{ paddingLeft: '2%' }}>
                    <ResponsiveDialog itemId={item.id} onClick={onClickDeleteItem} onChange={onChangeItem} accordionId={accordion.id} accordionItem={item}>
                        {item.heading}
                    </ResponsiveDialog>
                </AccordionDetails>
            )) :
                null

            }
            </ul>

        </Accordion>
    )
}