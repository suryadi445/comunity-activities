import LabelComponent from "./Label";
import SelectComponent from "./Select";

const SelectLabel = ({
    label,
    prop,
    required,
    options = [],
    placeholder = "Please Choose",
    defaultValue = "",
    onChange,
    value,
    multiple = false,
    disabled = false,
    style
}) => {
    return (
        <div>
            <LabelComponent
                htmlFor={prop}
                label={label}
                required={required}
            />
            <SelectComponent
                prop={prop}
                required={required}
                options={options}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                value={value}
                style={style}
                multiple={multiple}
                disabled={disabled}
            />
        </div>
    );
};

export default SelectLabel;
