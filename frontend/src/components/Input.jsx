import { TextInput } from "flowbite-react";

const InputComponent = ({ prop, type = "text", required = false, placeholder = "", value, disabled = false, style = {
    backgroundColor: disabled ? "#D1D5DB" : "white",
    color: "black",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
},
    onChange,
}) => {
    const handleChange = (e) => {
        if (type === "number") {
            const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // hanya angka
            onChange({ ...e, target: { ...e.target, value: onlyNums } });
        } else {
            onChange(e);
        }
    };

    return (
        <div>
            <TextInput
                id={prop}
                type={type === "number" ? "text" : type}
                name={prop}
                value={value}
                placeholder={placeholder}
                required={required}
                style={style}
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
}

export default InputComponent;
