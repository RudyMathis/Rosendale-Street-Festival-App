import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import Login from "../Login";
import RecordListBody from "./RecordListBody";
import { RecordType } from "../../types/RecordType";
import useRecords from "../../hooks/UseRecords";
import useLabels from "../../hooks/UseLabels";
import SystemMessage from "../../util/SystemMessage";
import PaginationControls from "../../util/PaginationControls";
import Button from "../../util/Button";
import TableButton from "../../util/TableButton";
import DeleteToggle from "./DeleteToggle";
import LoginReminder from "../../UI/LoginReminder";
import Label from "../../labels/UILabel.json";
import "../../styles/RecordList.css";
import "../../styles/Table.css";

export default function RecordListHeader() {
    const [toggleDelete, setToggleDelete] = useState(true);
    const { records, setRecords } = useRecords();
    const serverLabel = useLabels();
    const navigate = useNavigate();
    const { canViewContent, canViewActions, canEditRecords, canViewEditedDetail } = useRoleContext();
    const [sortConfig, setSortConfig] = useState<{ key: keyof RecordType; direction: "asc" | "desc" }>({
        key: "name",
        direction: "asc",
    });

    // Pagination state and constant
    const RECORDS_PER_PAGE = Label.pagination.count;
    const [currentPage, setCurrentPage] = useState(1);

    async function deleteRecord(id: string) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Failed to delete the record");
            }

            // Update the context state
            setRecords((prevRecords) => prevRecords?.filter((record) => record._id !== id) || null);
        } catch (error) {
            console.error("Failed to delete record:", error);
        }
    }

    if (!records) {
        return (
            <SystemMessage
                title="Error"
                message="Missing Records"
            />
        );
    }
    
    const sortedRecords = (() => {
        // If there's no sort configuration or key, return the original records
        if (!sortConfig || !sortConfig.key) return records;

        // Define a ranking map for sorting levels
        const rankingMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
        // Create a sorted copy of the records array
        return [...records].sort((a, b) => {
            // Get the values for the current sort key from the records
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // If sorting by "level", convert values using the ranking map
            if (sortConfig.key === `${serverLabel.record.level[0]}`) {
                aValue = rankingMap[a.level];
                bValue = rankingMap[b.level];
            } 
            // If sorting by "members", convert values to numbers
            else if (sortConfig.key === `${serverLabel.record.members[0]}`) {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } 
            // If sorting by "editedTime", convert date strings to timestamps
            else if (sortConfig.key === "editedTime") {
                if (aValue !== null && typeof aValue === 'string') {
                    aValue = new Date(aValue).getTime();
                } else {
                    aValue = 0;
                }
                if (bValue !== null && typeof bValue === 'string') {
                    bValue = new Date(bValue).getTime();
                } else {
                    bValue = 0;
                }
            }

            /***************************** DEFAULT SORTING *****************************/

            // Explicitly sort boolean values
            if (typeof aValue === "boolean" && typeof bValue === "boolean") {
                return sortConfig.direction === "asc"
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            // Handle undefined or null values by placing them last
            if (aValue === undefined || aValue === null) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }

            if (bValue === undefined || bValue === null) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }

            // Sort strings lexicographically
            if (typeof aValue === "string" && typeof bValue === "string") {
                const aLower = aValue.toLowerCase().trimStart();
                const bLower = bValue.toLowerCase().trimStart();

                return sortConfig.direction === "asc"
                    ? aLower.localeCompare(bLower)
                    : bLower.localeCompare(aLower);
            }

            // Sort numbers numerically
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });
    })();  

    // Calculate pagination values based on sorted records
    const totalPages = Math.ceil(sortedRecords.length / RECORDS_PER_PAGE);
    const paginatedRecords = sortedRecords.slice(
        (currentPage - 1) * RECORDS_PER_PAGE,
        currentPage * RECORDS_PER_PAGE
    );

    const requestSort = (key: keyof RecordType) => {
        setSortConfig((prevSortConfig) => ({
            key,
            direction: prevSortConfig.key === key && prevSortConfig.direction === "asc" ? "desc" : "asc",
        }));
        // Reset to first page whenever sorting changes.
        setCurrentPage(1);
    };
    
    function handleAllRecords() {
        navigate("/record/all");
    }

    function handleToggleDelete() {
        setToggleDelete(!toggleDelete);
    }
    
    return (
        <>
            {canViewContent ? (
                <>
                    <header className="record-list-header">
                        <h2>Total {records.length} {records.length === 1 ? "Record" : "Records"}</h2>
                        <div className="record-list-header-button-container">
                            {canEditRecords && (
                                <DeleteToggle
                                    label={Label.actions.toggleDelete}
                                    onClick={handleToggleDelete}
                                />
                            )}
                            <Button
                                label={`View ${records.length} ${records.length === 1 ? "Record" : "Records"}`}
                                onClick={handleAllRecords}
                                className="button"
                                type="button"
                            />
                        </div>
                    </header>
                    <section className="record-list-container card">
                        <table>
                            <thead>
                                <tr className="record-tr-container">
                                    {[
                                        "name",
                                        "email",
                                        "level",
                                        "hudsonValley",
                                        "isAccepted",
                                        "members",
                                        "link",
                                        "anotherGig",
                                        "primaryContact",
                                        "primaryEmail",
                                        "primaryPhone",
                                        "primaryAddress",
                                    ].map((key) => (
                                        <TableButton
                                            key={key}
                                            label={serverLabel.record[key][1]}
                                            onClick={() => requestSort(key as keyof RecordType)}
                                            sortConfig={sortConfig.key === key ? { key, direction: sortConfig.direction } : undefined}
                                            columnKey={key}
                                        />
                                    ))}

                                    {canViewEditedDetail && (
                                        ["nameOfUser", "editedTime"].map((key) => (
                                            <TableButton
                                                key={key}
                                                label={serverLabel.record[key][1]}
                                                onClick={() => requestSort(key as keyof RecordType)}
                                                sortConfig={sortConfig.key === key ? { key, direction: sortConfig.direction } : undefined}
                                                columnKey={key}
                                            />
                                        ))
                                    )}

                                    {canViewActions && (
                                        <th className="action-header-container">
                                            <Button
                                                label={Label.actions.action}
                                                className="action-header"
                                                type="button"
                                            />
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRecords.map((record) => (
                                    <RecordListBody
                                        key={record._id}
                                        record={record}
                                        deleteRecord={() => deleteRecord(record._id)}
                                        confirmation={toggleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </section>
                </>
            ) : (
                <>
                    <LoginReminder />
                    <Login />
                </>
            )}
        </>
    );
}
