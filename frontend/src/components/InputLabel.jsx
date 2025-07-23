import LabelComponent from './Label';
import InputComponent from './Input';

const InputLabel = ({
    label,
    prop,
    value,
    type = "text",
    required = false,
    placeholder = "",
    helpText = "PNG, JPG or JPEG",
    style = {
        backgroundColor: "white",
        color: "black",
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
    },
    onChange,
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
                style={style}
                onChange={onChange}
            />
        </div>
    );
};

export default InputLabel;
