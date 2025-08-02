const TextareaComponent = ({
    prop,
    required = false,
    placeholder = "",
    disabled = false,
    rows = 4,
    onChange,
    value,
    style = {
        backgroundColor: disabled ? "#D1D5DB" : "white",
        color: "black",
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
    },
}) => {
    return (
        <textarea
            id={prop}
            name={prop}
            rows={rows}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            style={style}
            onChange={onChange}
            value={value}
            className="w-full p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        ></textarea>
    );
};

export default TextareaComponent;
