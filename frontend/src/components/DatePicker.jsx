import { Datepicker } from "flowbite-react";

const DatepickerComponent = ({
    prop = "",
    required = false,
    disabled = false,
    onChange,
    value,
    style = {
        backgroundColor: disabled ? "#D1D5DB" : "white",
        color: value ? "black" : "#D1D5DB",
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
    },
}) => {

    const initialDate =
        value && typeof value === "string" && !isNaN(new Date(value).getTime())
            ? new Date(value)
            : new Date();

    const placeholder = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <div>
            <Datepicker
                id={prop}
                name={prop}
                title="Date"
                required={required}
                style={style}
                onChange={onChange}
                value={initialDate}
                disabled={disabled}
                placeholder={placeholder} />
        </div>
    );
};

export default DatepickerComponent;
