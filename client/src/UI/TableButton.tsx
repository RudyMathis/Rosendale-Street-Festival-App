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
    <th>
        <button onClick={onClick} className="table-header-button">
            {label} {sortConfig?.key === columnKey ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
        </button>
    </th>
);

export default TableButton;