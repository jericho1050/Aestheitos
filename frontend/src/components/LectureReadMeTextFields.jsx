import { useAtom } from "jotai";
import { Box, Container, InputAdornment, TextField } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import ReactQuill from "react-quill";
import { modules } from "../helper/quillModule";

export function YoutubeInput({ actionData, lecture, onChange, isError }) {
    return (

        <Box className="course-lecture-container" sx={{ width: '81%' }} component={'div'}>
            <TextField
                error={isError}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <YouTubeIcon />
                        </InputAdornment>

                    )
                }}
                fullWidth={true}
                id="lecture-url"
                label={isError && actionData?.message ?

                    Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                        if (key === 'lecture') {
                            return `${key}: ${value}`;
                        } else {
                            return null;
                        }
                    })
                    : 'e.g https://www.youtube.com/watch?v=SOMEID'
                }
                type="url"
                name="lecture"
                value={lecture}
                onChange={e => {
                    onChange(e.target.value) // This is setLecture from the parent component, so  we are sending the values to our server.
                }
                }
            />
        </Box>
    )
}

export function DescriptionInput({ actionData, description, onChange, isError }) {

    return (

        <Container className="ql-editor-container">
            {isError && actionData?.message ?

                Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                    if (key === 'lecture') {
                        return <label style={{ color: 'red', position: "absolute", margin: '10px 0 10px 10px', fontSize: '12px' }}>{key}: {value}</label>;
                    } else {
                        return null;
                    }
                })
                : ""
            }
            <ReactQuill
                modules={modules}
                placeholder="Your information or lecture's description."
                value={description}
                onChange={value => { onChange(value); }}
                className={isError ? 'ql-read-me ql-error' : 'ql-read-me'}
            />
        </Container>
    )
}
