import { Box, Container, Grid, Paper } from "@mui/material";

export default function Course() {
    const course = {
        title: "test course",
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac tortor sed risus pellentesque efficitur. Cras et nulla mauris. Nulla auctor vel nisl vitae iaculis. Suspendisse laoreet cursus elit. Curabitur maximus ultricies orci. Fusce consectetur sollicitudin purus, in dignissim neque condimentum in. Mauris mattis dapibus quam, at rhoncus sapien viverra in. Maecenas mollis erat risus, ac sagittis leo pharetra ultricies. In pellentesque rhoncus tortor, at tristique nisl consequat in. Praesent ipsum eros, egestas gravida efficitur sed, suscipit sed dui.

        Aliquam arcu arcu, pellentesque a nunc rhoncus, imperdiet interdum ipsum. Proin euismod risus ut velit dignissim ornare. Fusce eu nisi sit amet quam placerat egestas eu non urna. Sed at diam ut libero cursus blandit. Integer in lectus ac est laoreet ultrices. Nunc iaculis vel dolor placerat consectetur. Aliquam tellus enim, pretium eu ipsum sit amet, finibus mollis nibh. Donec et lacinia ligula. Sed feugiat nulla lectus, quis dictum neque hendrerit nec. In tempor congue malesuada. Nunc sodales nulla ut massa pellentesque, at lobortis quam pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Sed ullamcorper pharetra velit nec ullamcorper. Fusce pulvinar purus eu interdum viverra. Suspendisse aliquam tellus eget arcu dignissim, sed tempus ante consectetur.`,
        // thumbnail: 'https://i.imgur.com/B5wZm19.jpeg',
        thumbnail: 'https://i.imgur.com/e3mMEwA.gif',
        courseCreated: '10/20/2024',
        created_by: 'testuser'
    }
    const courseContent = {
        lecture: "https://www.youtube.com/watch?v=CXMZxgNnnv8",
        overview: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex quam, blandit feugiat dignissim eget, vestibulum ultrices diam. Curabitur ut tellus a sapien porttitor vulputate. Sed pulvinar tincidunt lacus. Praesent tincidunt leo id nibh fringilla, tempor interdum felis rhoncus. Duis vestibulum, mi eu porta sodales, magna mauris bibendum lacus, id tincidunt ipsum libero ac justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed lorem libero. Donec cursus dictum leo a feugiat. Mauris non felis vitae mi fermentum blandit. Sed placerat, nunc et accumsan gravida, leo ipsum venenatis nulla, non gravida nisl ex et felis. Proin quis gravida orci, at aliquam enim. Curabitur eget mi nisl. Donec mattis dui tellus, non congue lacus suscipit et. Nullam sit amet ultricies massa. Nullam rutrum ullamcorper lacus. Fusce dictum interdum ligula vel pellentesque.

        Phasellus luctus lorem sed sapien pharetra, ac laoreet arcu sollicitudin. Morbi viverra rhoncus bibendum. In tellus nisi, varius sed ligula sit amet, ultricies laoreet magna. Donec maximus a augue nec vestibulum. Donec accumsan odio at porta rutrum. Nulla a blandit mi. Sed tortor justo, imperdiet in maximus sed, sagittis at eros. Nunc id sagittis mauris, porta malesuada mi. Vivamus ut nisl mollis, egestas odio at, ornare massa. Proin dictum, augue vel fermentum egestas, arcu elit fermentum lorem, nec consectetur mi massa ac mauris. Sed sollicitudin eleifend ullamcorper. Duis commodo lorem eu finibus ultricies. Pellentesque cursus risus eget volutpat lacinia. Nulla vitae est at massa vehicula bibendum.`,
        weeks: 12,
    }
    const workouts = {
        intesity: "H",
        exercise: "pushup",
        demo: "https://www.youtube.com/watch?v=IODxDxX7oi4",
        rest_time: 2,
        sets: 3,
        reps: 10,
        excertion: 8,
    }
    const correctForm = {
        demo: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        description: "scapula retracted"
    }
    const wrongForm = {
        demo: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        description: "scapula not moving"
    }

    return (
        <>
        <br></br>
            <Box>
                <Grid container wrap="nowrap" sx={{justifyContent: {xs: 'center', md: 'flex-start'}}} >
                    <Paper sx={{ width: '300px', height: '400px', padding: '3%' }} elevation={4}>
                        <Grid item container justifyContent={'center'}>
                            <Grid item xs sx={{padding: '3%'}}>
                                    <Container component="div">
                                        <img src={course.thumbnail} className="course-thumbnail" />
                                    </Container>
                            </Grid>
                        </Grid>
                        <Grid item container justifyContent={'center'}>
                            <Grid item md={6}>
                                <small>Instructor: <b>{course.created_by}</b></small>
                            </Grid>
                            <Grid item>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>
            </Box>
        </>
    )
}