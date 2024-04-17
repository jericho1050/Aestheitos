// import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useFormAction } from 'react-router-dom';

// stepper is responsible also for submission of our FORMS
export default function ProgressMobileStepper({ intent, setIntent, isError, activeStep, setActiveStep }) {
  const theme = useTheme();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIntent('update')
  };

  return (
    <MobileStepper
      variant="progress"
      steps={3}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button
        name="intent"
        value={intent}
          data-cy="nextButton"
          size="small"
          type="submit"
          disabled={activeStep === 2 || isError}
        >
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      } 
      backButton={
        <Button data-cy="prevButton" size="small" type="button" disabled={activeStep === 0} onClick={handleBack}>
          Back
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />

          ) : (
            <KeyboardArrowLeft />

          )}
        </Button>
      }
    />
  );
}