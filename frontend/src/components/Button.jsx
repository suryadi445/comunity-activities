import { Button } from 'flowbite-react';
import { Tooltip } from 'react-tooltip';

const ButtonComponent = ({
    children,
    type = "button",
    className = "",
    onClick,
    icon: Icon,
    color = 'purple',
    size = 'md',
    disabled = false,
    tooltipContent,
    tooltipId = "btn-tip",
    tooltipPlace = "top",
    ...props }) => {
    const gradientColors = {
        default: "bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
        alternative: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700",
        blue: "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
        cyan: "bg-cyan-700 text-white hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800",
        dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
        gray: "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800",
        green: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
        indigo: "bg-indigo-700 text-white hover:bg-indigo-800 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800",
        light: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
        lime: "bg-lime-700 text-white hover:bg-lime-800 focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800",
        pink: "bg-pink-700 text-white hover:bg-pink-800 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800",
        purple: "bg-purple-700 text-white hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800",
        red: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
        teal: "bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800",
        yellow: "bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
    };

    const colorClass = gradientColors[color] || gradientColors.blue;
    const sizeClass = size === 'large' ? 'px-6 py-1' : size === 'small' ? 'px-2' : 'px-4';
    const tooltipProps = tooltipContent
        ? {
            'data-tooltip-id': tooltipId,
            'data-tooltip-content': tooltipContent,
            'data-tooltip-place': tooltipPlace,
        }
        : {};


    return (
        <>
            <Button type={type}
                className={`${colorClass} ${className} ${sizeClass} text-white`}
                onClick={onClick}
                disabled={disabled}
                {...tooltipProps}
                {...props}
            >
                {Icon && <Icon className="w-5 h-5 mr-2" />}
                {children}
            </Button>
            {tooltipContent && (
                <Tooltip
                    id={tooltipId}
                    style={{
                        backgroundColor: "#0B2447",
                        color: "#f1f1f1",
                        fontSize: "0.875rem",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                />
            )}

        </>
    );
};

export default ButtonComponent;
