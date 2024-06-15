import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Divider, ThemeProvider, Typography, responsiveFontSizes } from "@mui/material";
import { getBlogs, getUser } from "../courses";
import { Link, useLoaderData } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { parseBlogDateTime } from "../helper/parseDateTime";

export async function loader() {
    const user = await getUser();
    const blogs = await getBlogs();
    return { user, blogs };

}

export default function Blogs() {
    const { user, blogs } = useLoaderData();
    let theme = useTheme();
    theme = responsiveFontSizes(theme);
    return (
        <Container maxWidth="md" component={'main'}>
            <Box m={4}>
                {user.is_staff && <Button size="large" variant="contained" href="/blog/create">Create Blog</Button>}
            </Box>
            <Box m={4}>
                <ThemeProvider theme={theme}>
                    <Typography variant={'h2'} fontFamily={'Play'} fontWeight={'bolder'}>
                        Posts
                    </Typography>
                </ThemeProvider>
                <Box>
                    {blogs.results
                        .sort((a, b) => new Date(b.blog_created) - new Date(a.blog_created))
                        .map(blog => {
                            const [blog_day_name, blog_month_name, blog_day, blog_year] = parseBlogDateTime(blog.blog_created);
                            return (
                                <>
                                    <Box key={blog.id} variant="outlined" position={'relative'} mt={4}>
                                        <ThemeProvider theme={theme}>
                                            <Typography fontWeight={'bolder'} variant="h4" gutterBottom>
                                                <Link to={`/blog/${blog.id}`} className="blogs-link">
                                                    {blog.title}
                                                </Link>
                                            </Typography>
                                            <Typography color={'text.secondary'} gutterBottom>
                                                {blog.summary}
                                            </Typography>
                                        </ThemeProvider>
                                        <Avatar src={blog.author.profile_pic || ''} alt="Avatar" sx={{ height: 30, width: 30 }} />
                                        <Typography mt={1} fontWeight={'bold'}>
                                            <Link to={`profile/${blog.author.user_id}`} className="blogs-link">{`${blog.author.first_name && blog.author.last_name ? `${blog.author.first_name} ${blog.author.last_name}` : blog.author.username}`}</Link>
                                        </Typography>
                                        <Typography mt={1} fontSize={'smaller'} color={'text.secondary'}>
                                            {`${blog_day_name}, ${blog_month_name} ${blog_day} ${blog_year}`}
                                        </Typography>
                                        <Button size="small" sx={{ position: 'absolute', bottom: 2, right: 2 }} >
                                            <Link to={`/blog/${blog.id}`} className="blogs-link">
                                                Read more
                                            </Link>
                                        </Button>
                                    </Box>
                                    <Divider sx={{ mt: 3, mb: 2 }} />
                                </>
                            )
                        })}
                </Box>
            </Box>
        </Container>
    )

}