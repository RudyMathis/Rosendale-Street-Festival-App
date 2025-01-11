type TableButtonProps = {
    label: string;
    onClick: () => void;
    sortConfig?: {
        key: string;
        direction: "asc" | "desc";
    };
    columnKey: string;
};

const TableButton = ({ label, onClick, sortConfig, columnKey }: TableButtonProps) => (
    <button onClick={onClick} className="table-header-button">
        {label} {sortConfig?.key === columnKey ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
    </button>
);

export default TableButton;