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

    if (type === "time") {
        const handleTimeChange = (e) => {
            let val = e.target.value;

            // hanya angka dan ":" yang boleh
            val = val.replace(/[^\d:]/g, "");

            // otomatis kasih ":" setelah 2 digit
            if (val.length === 2 && !val.includes(":")) {
                val = val + ":";
            }

            // potong maksimal 5 karakter (HH:MM)
            if (val.length > 5) {
                val = val.slice(0, 5);
            }

            // validasi jam & menit
            const [h, m] = val.split(":");
            if (h && Number(h) > 23) val = "23" + (m !== undefined ? ":" + m : "");
            if (m && Number(m) > 59) val = h + ":59";

            onChange({ target: { name: prop, value: val } });
        };

        return (
            <div>
                <LabelComponent htmlFor={prop} label={label} required={required} />
                <input
                    id={prop}
                    name={prop}
                    type="text"
                    value={value}
                    required={required}
                    disabled={disabled}
                    placeholder="HH:MM"
                    onChange={handleTimeChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none py-3"
                />
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
