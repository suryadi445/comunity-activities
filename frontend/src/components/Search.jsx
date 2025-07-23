import { HiSearch } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { TextInput } from "flowbite-react";

const SearchInput = ({
    value = "",
    onChange,
    onClick,
    placeholder = "Search...",
}) => {
    const handleClear = () => {
        onChange?.("");
    };

    return (
        <div className="relative w-full max-w-xs">
            <TextInput
                id="search"
                name="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="pr-20"
                style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                }}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-red-500 hover:text-red-700"
                    >
                        <IoClose size={20} />
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClick}
                    className="px-3 py-3 bg-gray-400 hover:bg-gray-500 rounded text-white"
                >
                    <HiSearch />
                </button>
            </div>
        </div>
    );
};

export default SearchInput;


