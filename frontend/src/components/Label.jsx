import { Label } from "flowbite-react";

const LabelComponent = ({ htmlFor, label, className = 'text-sm font-medium text-black dark:text-black', required = false }) => {
    return (
        <div className="mb-1 block">
            <Label htmlFor={htmlFor} className={className}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </Label>
        </div>
    );
};

export default LabelComponent;

