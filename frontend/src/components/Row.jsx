const Row = ({ children, cols = 1, className = "" }) => {
    const colClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-5',
        6: 'grid-cols-1 sm:grid-cols-6',
    }[cols] || 'grid-cols-1';

    return (
        <div className={`grid ${colClass} ${className} gap-2`}>
            {children}
        </div>
    );
};

export default Row;