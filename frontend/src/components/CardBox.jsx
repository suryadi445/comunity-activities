const CardBox = ({ children, className = '' }) => {
    return (
        <>
            <div className={`w-full bg-gray-20 border border-gray-200 shadow-xl mt-2 rounded-xl px-3 pt-3 ${className}`}>
                {children}
                <br />
            </div>
        </>
    );
};

export default CardBox;
