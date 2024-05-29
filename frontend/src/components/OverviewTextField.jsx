import { Container, Grid, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
import ReactQuill from "react-quill";
import { modules, modulesCard } from "../helper/quillModule";


export default function OverviewTextField({ isError, setIsError, courseContent, setCourseContent, actionData }) {
    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return (
        <>
            <Grid item alignSelf='flex-start'>
                <ThemeProvider theme={theme} >
                    <Typography variant="h4" fontWeight={'bold'}>
                        Overview
                    </Typography>
                </ThemeProvider>
            </Grid>
            <Grid item width={'100%'}>
                <Container className="ql-editor-container">
                    <fieldset className="quill-fieldset">
                        {isError && actionData?.message ?

                            Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                                if (key === 'overview') {
                                    return <legend style={{ color: 'red', visibility: 'visible', bottom: '94%' }}>{key}: {value}</legend>;
                                } else {
                                    return null;
                                }
                            })

                            : <legend style={{ bottom: '94%' }}>Your Course's Overview</legend>

                        }
                        <ReactQuill
                            onChange={value => {
                                setCourseContent({
                                    ...courseContent,
                                    overview: value
                                });
                                setIsError(false);
                            }}
                            data-cy="Course Overview"
                            value={courseContent.overview}
                            modules={modules}
                            className={isError ? 'ql-overview ql-error' : 'ql-overview'}
                            placeholder="Your Course's Overview"
                            style={{ border: isError ? '1px solid red' : '' }}
                        />

                    </fieldset>
                    <TextField type="hidden" value={courseContent.overview} name="overview" />  {/* we need the name attribute when sending this data to server, hence the hidden */}
                </Container>
            </Grid>
        </>

    )
}