import LabelComponent from './Label';
import DatePicker from './DatePicker';

const DatepickerLabel = ({
    label,
    prop = "",
    required = false,
    onChange,
    value
}) => {
    return (
        <div>
            {label && (
                <LabelComponent htmlFor={prop} label={label} required={required} />
            )}
            <DatePicker
                prop={prop}
                required={required}
                onChange={onChange}
                value={value}
            />
        </div>
    );
};

export default DatepickerLabel;
