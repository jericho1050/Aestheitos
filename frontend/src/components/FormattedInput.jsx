
import * as React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {Box} from "@mui/material";

export default function FormattedInputs({setIsError, error, course, setCourse}) {
    
    const handleChange = (event) => {
        setCourse({
            ...course,
            price: event.target.value,
        });
        setIsError(false);
    };

    return (
    <Box display={{display: 'flex', alignItems: 'center'}}>
        <AttachMoneyIcon sx={{mb: -4}} />
        <TextField
            label="Price"
            value={course.price}
            onChange={handleChange}
            name="price"
            id="formatted-numberformat-input"
            InputProps={{
                inputComponent: NumericFormatCustom,
                style: { fontSize: '2.5rem' } 
            }}
            variant="standard"
            sx={{ml: 'auto', mr: 4, marginTop: 3, width: 69 }}
            error={error}
        />
    </Box>
    );
}


const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                
            />
        );
    },
);

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};