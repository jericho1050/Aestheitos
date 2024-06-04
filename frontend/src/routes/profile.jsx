import { Avatar, Badge, Box, Container, IconButton, ThemeProvider, Typography, responsiveFontSizes, styled, useTheme } from "@mui/material";
import { getUser, updateUser } from "../courses";
import { useFetcher, useLoaderData } from "react-router-dom";
import { parseUserDateTime } from "../helper/parseDateTime";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { BorderColor } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/InputFileUpload";
import { useState } from "react";

export async function loader({ params }) {
    const user = await getUser();
    return { user };

}


export default function Profile() {
    const { user } = useLoaderData();
    const [profilePic, setProfilePic] = useState('');
    let theme = useTheme();
    theme = responsiveFontSizes(theme);
    const [date_joined_day, date_joined_month, date_joined_year] = parseUserDateTime(user.date_joined);
    const fetcher = useFetcher();

    function handleChangeProfile(e) {
        const file = e.target.files[0]; // file object
        const formData = new FormData();

        // read file for preview
        const reader = new FileReader();
        reader.onloadend = async () => {
            setProfilePic(reader.result);
            // then imperatively send the request without action route (fetcher.submit() can't handle images even with multipart/formData as ecntype)

            // Append the file to the form data
            formData.append('profile_pic', file);
            try {
                const response = await updateUser(formData);
                if (response.statusCode >= 400) {
                    throw new Error(response);
                }
            }
            catch (error) {
                console.error('An error occured updating profile picture: ', error);
            }

        };

        if (file) {
            reader.readAsDataURL(file);

        }
    }
    return (
        <Container maxWidth="large" component={"main"} sx={{ p: '2em' }} >
            <Box display={'flex'} alignItems={'center'} justifyContent={"center"} flexDirection={'column'} gap={2}>
                <IconButton component="label" role={undefined}>
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => { handleChangeProfile(e) }} />
                    <Badge overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <PhotoCameraIcon sx={{ zIndex: 1, background: 'white', borderRadius: '5em', padding: '0.1em' }} fontSize="large" color="primary" />
                        }
                    >
                        <Avatar src={profilePic || `${import.meta.env.VITE_API_URL}${user.profile_pic}`} sx={{ width: 150, height: 150 }} />
                    </Badge>
                </IconButton>

            </Box>
            <Box display={"flex"} alignItems={"center"} flexDirection={"column"} mt={2}>
                <ThemeProvider theme={theme}>
                    <Typography fontWeight="bolder" fontSize="4em" variant="h1">
                        {user.first_name || ''} {user.last_name || ''}
                    </Typography>
                    <Typography color="grey">Date joined: {date_joined_day}/{date_joined_month}/{date_joined_year}</Typography>
                </ThemeProvider>
            </Box>

        </Container>
    )
}

