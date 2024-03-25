import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme();
theme = responsiveFontSizes(theme);



export default function CourseCard(props) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: {xs: 500, sm: 400}, maxHeight: 645, height: '100%' }}>
      <ThemeProvider theme={theme}>

    <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <CardMedia
                component="img"
                sx={{ aspectRatio: 16 / 9, }}
                src={props.thumbnail}
                alt="workout demo"
            />

        <CardContent>
        <Typography align='justify' gutterBottom variant='h5'>
            {truncateText(props.title, 29)} {/* Replace 2nd argument with the maximum number of words you want */}
        </Typography>

        <Typography variant='body2' color={"text.secondary"}>
          Description: {truncateText(props.description, 20)}
        </Typography>
       
       
        </CardContent>
      <Box sx={{marginLeft: 2, marginRight: 2, marginTop: 'auto'}} component={'div'}>
          <Grid marginBottom={2} spacing={2} container>
            <Grid item container justifyContent={'space-between'}>
              <Grid item>
                <Typography noWrap fontSize="small" fontWeight="bold" variant='small' color="text.secondary">
                 {props.created_by_name}
                </Typography>
              </Grid>
              <Grid item>
              <Typography noWrap variant='small' color="text.secondary">
                {props.difficulty_display}
              </Typography>
            </Grid>
            </Grid>
            <Grid item container justifyContent={'space-between'}>
              <Grid item>
                <Typography noWrap variant='small' color="text.secondary">
                    {props.enrollee_count === 0 ? 'No enrollees' : `${props.enrollee_count} enrolled` } 
                </Typography>
              </Grid>
              <Grid item>
                <Typography noWrap fontSize="x-small" variant='small' color="text.secondary">
                Created on {props.course_created}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography fontWeight="bolder" fontSize="large" variant='button'>P{props.price}</Typography>
            </Grid>
            
          </Grid>
          </Box>
          </CardActionArea>

          </ThemeProvider>
    </Card>
  );
}

function truncateText(text, maxWords) {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  } else {
    return text;
  }
}