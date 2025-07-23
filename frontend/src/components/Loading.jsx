import { Commet } from "react-loading-indicators";

const Loading = ({
    text = "Loading...",
    textColor = "#fff",
    size = "small"
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
            <div className="flex flex-col items-center justify-center py-4">
                <Commet color={["#696969", "#c0c0c0"]} size={size} text={text} textColor={textColor} />

            </div>
        </div>
    );
};

export default Loading;
