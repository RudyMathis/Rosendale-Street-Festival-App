type TableButtonProps = {
    label: string;
    onClick: () => void;
    sortConfig?: {
        key: string;
        direction: "asc" | "desc";
    };
    columnKey: string;
    className?: string;
};

const TableButton = ({
    label,
    onClick,
    sortConfig,
    columnKey,
    className,
}: TableButtonProps) => (
    <th className={className}>
        <button onClick={onClick} className="table-header-button">
            <span>{label}</span>
            {sortConfig?.key === columnKey && (
                <span className="sort-icon">
                    {sortConfig.direction === "desc" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 15 12 9 18 15"></polyline>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    )}
                </span>
            )}
        </button>
    </th>
);

export default TableButton;
