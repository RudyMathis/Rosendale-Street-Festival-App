import Button from "./Button";
import Label from "../labels/UILabel.json"
function PaginationControls({
    currentPage,
    totalPages,
    setCurrentPage,
}: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}) {
    return (
        <div className="pagination-controls">
            <Button
                label={Label.pagination.previous}
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className={"pagination-button"}
                type={"button"}
                disabled={currentPage === 1}
            />
            <span>{Label.pagination.page} {currentPage} {Label.pagination.of} {totalPages}</span>
            <Button
                label={Label.pagination.next}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                className={"pagination-button"}
                type={"button"}
                disabled={currentPage === totalPages}
            />
        </div>
    );
}

export default PaginationControls;