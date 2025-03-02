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

/**
 * A button in a table header that can be used to sort the table by a column.
 * The button renders a label and a sort direction icon, and calls the `onClick`
 * function when clicked.
 */

const TableButton = ({
    label,
    onClick,
    sortConfig,
    columnKey,
    className,
}: TableButtonProps) => (
    <th className={className}>
        <button onClick={onClick} className="table-header-button">
            <div>{label}
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
            </div>

        </button>
    </th>
);

export default TableButton;
