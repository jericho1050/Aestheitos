import { useAtom } from "jotai";
import { Box, InputAdornment, TextField } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';

export function YoutubeInput({actionData, lecture, onChange, isError}) {
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

export function DescriptionInput({actionData,  description, onChange, isError}) {

    return (
        <TextField
        data-cy="lecture textfield"
        error={isError}
        helperText=" "
        id="demo-helper-text-aligned-no-helper"
        label={isError && actionData?.message ?
            
            Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                if (key === 'description') {
                    return `${key}: ${value}`;
                } else {
                    return null;
                }
            })
            : "Your lecture's description or Readme Text"
        }
        fullWidth={true}
        minRows={10}
        maxRows={10}
        multiline
        required={true}
        name="overview"
        value={description}
        onChange={e => {
            onChange(e.target.value) // This is setDescription from the parent component, so  we are sending the values to our server.
        }
        }
    />
    )

}
