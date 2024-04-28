import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ResponsiveDialog } from "../routes/create";
import { useEffect, useRef, useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import AddAccordionItem from "./AddAccordionItem";
import { atom } from "jotai";


export default function AccordionSection({ actionData, setIsError, isError, onClickDeleteItem, onChangeItem, onClickDelete, onChange, handleChange, expanded, accordion, handleAddAccordionItem }) {
    const [isEditing, setIsEditing] = useState(false);
    const [parent, enableAnimations] = useAutoAnimate()
    const [heading, setHeading] = useState(accordion.heading);
    
    useEffect(() => {
        if (isEditing) {
            // debounce event handler
            const handler = setTimeout(() => {
                onChange({
                    ...accordion,
                    heading: heading
                });
            }, 300);
            return () => {
                clearTimeout(handler);
            };
        } 
    }, [heading]);
    let accordionHeadingContent;

    if (isEditing) {
        accordionHeadingContent = (
            <>
                {/* Accordtion heading edit, Textarea input form */}
                <TextField
                    error={isError}
                    data-cy={`Accordion edit-${accordion.id}`}
                    id="standard-multiline-flexible"
                    label={'Accordion Heading'}
                    multiline
                    maxRows={4}
                    variant="standard"
                    value={heading}
                    fullWidth
                    onChange={e => {
                        setHeading(e.target.value);
                        if (!e.target.value) {
                            setIsError(true);
                        } else {
                            setIsError(false);
                        }
                    }}
                />
                <Button onClick={() => setIsEditing(false)} disabled={isError}>
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
                <AddAccordionItem isError={isError} setIsError={setIsError} onClick={handleAddAccordionItem} accordionId={accordion.id} />
            </AccordionDetails>
            <ul ref={parent}>
                {accordion.items ? accordion.items.map((item) => (

                    <AccordionDetails
                        key={item.id} sx={{ paddingLeft: '2%' }}>
                        <ResponsiveDialog 
                        actionData={actionData}
                        isError={isError} 
                        setIsError={setIsError} 
                        itemId={item.id} 
                        onClick={onClickDeleteItem} 
                        onChange={onChangeItem} 
                        accordionId={accordion.id} 
                        accordionItem={item}
                        >
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