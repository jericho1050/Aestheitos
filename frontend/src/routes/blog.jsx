import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  ThemeProvider,
  Typography,
  responsiveFontSizes,
} from "@mui/material";
import { getBlog } from "../courses";
import { Link, useLoaderData } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { parseBlogDateTime } from "../helper/parseDateTime";
import { useTheme } from "@emotion/react";
import { Parser } from "html-to-react";

export async function loader({ params }) {
  const blog = await getBlog(params.blogId);

  return { blog };
}

export default function Blog() {
  const { blog } = useLoaderData();
  let theme = useTheme();
  theme = responsiveFontSizes(theme);
  const [blog_day_name, blog_month_name, blog_day, blog_year] =
    parseBlogDateTime(blog.blog_created);
  const htmlToReactParser = new Parser();

  return (
    <Container maxWidth="md" component={"main"}>
      <Box padding={"2em"}>
        <Button startIcon={<ArrowBackIosIcon />}>
          <Link to={`/blogs`} className="blogs-link">
            Back to blog
          </Link>
        </Button>
        <Typography
          mt={1}
          fontSize={"smaller"}
          color={"text.secondary"}
          gutterBottom
        >
          {`${blog_day_name}, ${blog_month_name} ${blog_day} ${blog_year}`}
        </Typography>
        <ThemeProvider theme={theme}>
          <Typography variant="h2" fontWeight={"bolder"}>
            {blog.title}
          </Typography>
          <Typography color={"text.secondary"} gutterBottom>
            {blog.summary}
          </Typography>
          <Box display={"flex"} gap={1} mb={2} mt={2}>
            <Avatar src={blog.author.profile_pic || ""} alt="Avatar" />
            <Typography mt={1} fontWeight={"bold"}>
              <Link
                to={`profile/${blog.author.user_id}`}
                className="blogs-link"
              >{`${
                blog.author.first_name && blog.author.last_name
                  ? `${blog.author.first_name} ${blog.author.last_name}`
                  : blog.author.username
              }`}</Link>
            </Typography>
          </Box>
        </ThemeProvider>
        <Divider />
        <Box className="html-content" lineHeight={"1.4em"} overflow={"auto"}>
          {htmlToReactParser.parse(blog.content)}
        </Box>
      </Box>
    </Container>
  );
}
