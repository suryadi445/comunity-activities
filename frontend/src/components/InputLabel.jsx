import LabelComponent from './Label';
import InputComponent from './Input';

const InputLabel = ({
    label,
    prop,
    value,
    type = "text",
    required = false,
    placeholder = "",
    disabled = false,
    helpText = "PNG, JPG or JPEG",
    onChange,
    multiple = false
}) => {
    {/* Input File */ }
    if (type === "file") {
        return (
            <div>
                {/* Label */}
                <LabelComponent htmlFor={prop} label={label} required={required} />

                {/* Input File */}
                <input
                    id={prop}
                    name={prop}
                    onChange={onChange}
                    type="file"
                    disabled={disabled}
                    accept="image/png, image/jpeg, image/jpg"
                    multiple={multiple}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                    aria-describedby={`${prop}_help`}
                />

                {/* Help Text */}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id={`${prop}_help`}>
                    {helpText}
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Label */}
            <LabelComponent htmlFor={prop} label={label} required={required} />

            {/* Default Input */}
            <InputComponent
                label={label}
                prop={prop}
                type={type}
                value={value}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
            />
        </div>
    );
};

export default InputLabel;
