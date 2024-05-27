import { atomWithReducer } from 'jotai/utils'

export const snackbarReducerAtom = atomWithReducer({
  open: false,
  message: '',
}, snackBarReducer);



function snackBarReducer(snackbar, action) {

    switch(action.type) {
        case 'submitting': 
            return {
                message: action.text,
                open: true
            }
        case 'deleting':
            return {
                message: action.text,
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