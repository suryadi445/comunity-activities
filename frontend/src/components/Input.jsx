import { TextInput } from "flowbite-react";

const InputComponent = ({ prop, type = "text", required = false, placeholder = "", value, style = {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
},
    onChange,
}) => {
    return (
        <div>
            <TextInput
                id={prop}
                type={type}
                name={prop}
                value={value}
                placeholder={placeholder}
                required={required}
                style={style}
                onChange={onChange}
            />
        </div>
    );
}

export default InputComponent;
