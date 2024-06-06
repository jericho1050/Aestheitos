import { Avatar, Badge, Box, Container, Divider, Grid, IconButton, Paper, ThemeProvider, Typography, Zoom, responsiveFontSizes, styled, useTheme } from "@mui/material";
import { getCourses, getUser, updateUser } from "../courses";
import { Link, useLoaderData, } from "react-router-dom";
import { parseUserDateTime } from "../helper/parseDateTime";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { VisuallyHiddenInput } from "../components/InputFileUpload";
import { useState } from "react";
import truncateText from "../helper/truncateText";
import { Parser } from "html-to-react";


export async function loader({ request }) {
    const user = await getUser();
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const courses = await getCourses(true, page || 1, 'A');
    return { user, courses };

}



export default function Profile() {
    const { user, courses } = useLoaderData();
    const [profilePic, setProfilePic] = useState('');
    let theme = useTheme();
    theme = responsiveFontSizes(theme);
    const [date_joined_day, date_joined_month, date_joined_year] = parseUserDateTime(user.date_joined);
    const htmlToReactParser = new Parser();
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
            <Paper square={false} sx={{ width: 'max-content', p: '1.5em 3em', m: '0 auto 0 auto', borderRadius: 10 }} position="relative" >
                <Box className="profile-bg"></Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={"center"} flexDirection={'column'} gap={2} >
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
                <Box display={"flex"} alignItems={"flex-start"} flexDirection={"column"} mt={2}>
                    <ThemeProvider theme={theme}>
                        <Typography fontWeight="bolder" fontSize="3em" variant="h1">
                            {user.first_name || ''} {user.last_name || ''}
                        </Typography>
                        <Typography color="grey">Username: {user.username}</Typography>
                        <Typography color="grey">Date joined: {date_joined_day}/{date_joined_month}/{date_joined_year}</Typography>
                    </ThemeProvider>
                </Box>
            </Paper>
            <Box mt={5}>
                <ThemeProvider theme={theme}>
                    <Typography variant="h2" fontWeight={'bolder'} mb={2}>
                        {`${user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}'s Courses`}
                    </Typography>
                </ThemeProvider>
                <Grid container spacing={3}>
                    {courses.results.map(course => {
                        return course.created_by === user.user_id && (
                            <Grid key={course.id} item xs={12} md={6}>
                                <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
                                    <Zoom in={true}>
                                        <Paper square={false}elevation={4} sx={{ padding: 5, cursor: 'pointer' }} >
                                            <Box display={'flex'} gap={2}>
                                                <Box width={125} height={150} border="1px dashed black" sx={{
                                                    backgroundImage: `url(${course.thumbnail})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    overflow: 'hidden'
                                                }}>
                                                    {/* <img src={course.thumbnail} alt="course-thumbnail" style={{maxWidth: '100%', maxHeight: '100%' }} /> */}
                                                </Box>
                                                <Box>
                                                    <Typography height={'auto'} gutterBottom fontFamily={'Play'} fontSize={'1.5em'} fontWeight={'bolder'} sx={{ wordBreak: 'break-word' }}>
                                                        {truncateText(course.title, 50)}
                                                    </Typography>
                                                    <Box maxHeight={'2em'} height={'100%'} maxWidth={250} sx={{ wordBreak: 'break-word' }}>
                                                        {htmlToReactParser.parse(truncateText(course.description, 35))}
                                                    </Box>
                                                </Box>

                                            </Box>
                                        </Paper>
                                    </Zoom>

                                </Link>
                            </Grid>
                        )
                    })}

                </Grid>
            </Box>
        </Container>
    )
}

