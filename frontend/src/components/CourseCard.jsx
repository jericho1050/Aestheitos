import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid, Rating, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import defaultImage from '../static/images/noimg.png'
import { Link } from 'react-router-dom';
import { Parser } from 'html-to-react';
let theme = createTheme();
theme = responsiveFontSizes(theme);


export default function CourseCard(props) {
  // const description = removeTags(props.description);
  const htmlToReactParser = new Parser();
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: 500, sm: 400 }, maxHeight: 645, height: '100%' }}>
      <ThemeProvider theme={theme}>

        <CardActionArea className="course-card" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Link to={`course/${props.id}`} style={{color: 'inherit', textDecoration: 'none'}}>
          <CardMedia
            component="img"
            sx={{ aspectRatio: 16 / 9 }}
            src={props.thumbnail || defaultImage}
            alt="workout demo"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src=defaultImage;
          }}
          />
          <CardContent>
            <Typography sx={{ height:'4em', mb: 2}} align='justify' gutterBottom fontFamily={'Play'} fontSize={'1rem'} fontWeight={'bolder'}>
              {truncateText(props.title, 9)} {/* Replace 2nd argument with the maximum number of words you want */}
            </Typography>
            <Box height={'2em'}>
              {htmlToReactParser.parse(truncateText(props.description, 10))}
            </Box>

          </CardContent>
          <Box sx={{ marginLeft: 2, marginRight: 2}} component={'div'}>
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
                    {props.enrollee_count === 0 ? 'No enrollees' : `${props.enrollee_count} enrolled`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography noWrap fontSize="x-small" variant='small' color="text.secondary">
                    Created: {props.course_created}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container justifyContent={'space-between'}>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon />
                    <Typography fontWeight="bolder" fontSize="large" variant='button'>{props.price == 0.00 ? 'Free' : props.price}</Typography>
                  </Box>           
                </Grid>
                <Grid item>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Rating name="half-rating-read" size="small" defaultValue={props.average_rating} precision={0.5} readOnly />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          </Link>
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
