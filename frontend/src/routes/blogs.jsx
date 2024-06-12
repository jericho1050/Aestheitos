import { Box, Button, Container } from "@mui/material";
import { getBlogs } from "../courses";

export async function loader() { 
    const blogs = await getBlogs();
    return { blogs };
    
}
export default function Blogs() {

    return (
        <Container maxWidth="lg">
            <Box mt={5} mr={4} ml={4}>
                <Button size="large" variant="contained" href="/blog/create">Create Blog</Button>
            </Box>
        </Container>
    )
    
}