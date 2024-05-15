import { atomWithReducer } from 'jotai/utils'

export const snackbarReducerAtom = atomWithReducer({
  open: false,
  message: `Course submitted! It's now under review (3-7 days). Thanks for your patience!`,
}, snackBarReducer);



function snackBarReducer(snackbar, action) {

    switch(action.type) {
        case 'submitting': 
            return {
                ...snackbar,
                open: true
            }
        case 'close':
            return {
                ...snackbar,
                open: false
            }
        default:
            return snackbar;
    }
}