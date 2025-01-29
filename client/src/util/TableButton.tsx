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
            {label}
            {sortConfig?.key === columnKey && (
                <span className="sort-icon">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
            )}
        </button>
    </th>
);

export default TableButton;
