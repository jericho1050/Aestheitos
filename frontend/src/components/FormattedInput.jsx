
import * as React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {Box} from "@mui/material";

export default function FormattedInputs({course, setCourse}) {
    
    const handleChange = (event) => {
        setCourse({
            ...course,
            price: event.target.value,
        });
    };

    return (
    <Box display={{display: 'flex', alignItems: 'center'}}>
        <AttachMoneyIcon sx={{mb: -4}} />
        <TextField
            label="Course Price"
            value={course.price}
            onChange={handleChange}
            name="price"
            id="formatted-numberformat-input"
            InputProps={{
                inputComponent: NumericFormatCustom,
            }}
            variant="standard"
            sx={{ marginTop: 3 }}
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