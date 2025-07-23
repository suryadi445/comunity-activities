import Select from 'react-select';

const SelectComponent = ({
    prop,
    required = false,
    options = [],
    placeholder = "Please Choose",
    onChange,
    value,
    multiple = false,
    disabled = false,
    style = {
        backgroundColor: "white",
        color: "black",
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
    },
}) => {
    const formattedOptions = options.map(opt => ({
        value: opt.value,
        label: opt.label,
    }));

    const selectedValue = multiple
        ? formattedOptions.filter(opt => value?.includes(opt.value))
        : formattedOptions.find(opt => opt.value === value) || null;

    const handleChange = (selectedOption) => {
        if (onChange) {
            const newValue = multiple
                ? selectedOption.map(opt => opt.value)
                : selectedOption?.value || "";

            onChange({
                target: {
                    name: prop,
                    value: newValue,
                }
            });
        }
    };

    return (
        <>
            <Select
                id={prop}
                name={prop}
                options={formattedOptions}
                value={selectedValue}
                isRequired={required}
                placeholder={placeholder}
                isDisabled={disabled}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        backgroundColor: disabled ? '#D1D5DB' : style.backgroundColor,
                        color: disabled ? '#9CA3AF' : style.color,
                        border: style.border,
                        borderRadius: style.borderRadius,
                        cursor: disabled ? 'not-allowed' : 'default',
                        '&:hover': {
                            borderColor: disabled ? provided.borderColor : '#2563EB',
                        }
                    }),
                }}
                className="text-sm"
                onChange={handleChange}
                isMulti={multiple}
            />
            <small>
                {disabled && <span className="text-blue-400"> This option is disabled</span>}
            </small>
        </>

    );
};

export default SelectComponent;
