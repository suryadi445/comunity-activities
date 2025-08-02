import LabelComponent from "./Label";
import TextareaComponent from "./Textarea";

const TextareaLabel = ({
    label,
    prop,
    required = false,
    placeholder = "",
    rows = 4,
    disabled = false,
    onChange,
    value
}) => {
    return (
        <div>
            <LabelComponent htmlFor={prop} label={label} required={required} />
            <TextareaComponent
                prop={prop}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                onChange={onChange}
                value={value}
            />
        </div>
    );
};

export default TextareaLabel;
