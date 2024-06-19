import { fn } from '@storybook/test';
import CorrectFormDialog from '../components/CorrectFormDialog';
import pushup from '../static/images/pushupVecs.gif'
import pullup from '../static/images/chinupVecs.gif'
const meta = {
  component: CorrectFormDialog,
  tags: ['autodocs']
};

export default meta;

/** Rendered when the correct form button is clicked */
export const Default = {
  args: {
    correctFormExercises: [{
      workout: 0,
      description: `<h4>An example would be this: </h4>
      <p>shoulders blade down</p>`,
      demo: pushup
    },
    {
      workout: 0,
      description: `<h4> An example would be this: </h4>
      <p>pulling with your elbows</p>`,
      demo: pullup
    }
  ], open: true, setOpen: fn() 
  }
};

