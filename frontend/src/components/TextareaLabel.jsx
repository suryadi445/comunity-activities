import LabelComponent from "./Label";
import TextareaComponent from "./Textarea";

const TextareaLabel = ({
    label,
    prop,
    required = false,
    placeholder = "",
    rows = 4,
    style = {
        backgroundColor: "white",
        color: "black",
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
    },
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
                rows={rows}
                style={style}
                onChange={onChange}
                value={value}
            />
        </div>
    );
};

export default TextareaLabel;
