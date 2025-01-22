import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import useLabels from "../../hooks/UseLabels";
import useRecords from "../../hooks/UseRecords";
import TableButton from "../../UI/TableButton";
import ErrorMessage from '../../UI/ErrorMessage';
import "../../styles/RecordList.css";
import RecordListBody from "./RecordListBody"
type RecordType = {
    _id: string;
    name: string;
    email: string;
    level: string;
    members: number;
    link: string | null;
    hudsonValley: boolean;
    isAccepted: boolean;
    nameOfUser: string;
    editedTime: string;
};

export default function RecordListHeader() {
    const { records, setRecords } = useRecords();
    const navigate = useNavigate();
    const { canViewContent, canViewActions, canViewEditedDetail } = useRoleContext(); // Check permission for the "Action" column
    const [sortConfig, setSortConfig] = useState<{ key: keyof RecordType; direction: "asc" | "desc" }>({
        key: "name",
        direction: "desc",
    });
    const labels = useLabels();

    if (!records) {
        return <ErrorMessage />;
    }

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

    const sortedRecords = (() => {
        if (!sortConfig || !sortConfig.key) return records;
    
        const rankingMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
    
        return [...records].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
    
            if (sortConfig.key === "level") {
                aValue = rankingMap[a.level];
                bValue = rankingMap[b.level];
            } else if (sortConfig.key === "members") {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
    
            if (typeof aValue === "boolean" && typeof bValue === "boolean") {
                // Sort boolean values explicitly
                return sortConfig.direction === "asc"
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }
    
            if (aValue === undefined || aValue === null) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (bValue === undefined || bValue === null) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
    
            if (typeof aValue === "string" && typeof bValue === "string") {
                const aLower = aValue.toLowerCase();
                const bLower = bValue.toLowerCase();
    
                return sortConfig.direction === "asc"
                    ? aLower.localeCompare(bLower)
                    : bLower.localeCompare(aLower);
            }
    
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }
    
            return 0; // Default for other types
        });
    })();  
    
    
    const requestSort = (key: keyof RecordType) => {
        const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    
    function handleAllRecords() {
        navigate("/record/all");
    }

    function handleMore () {
        // toggle the visibility of the tablebuttons visibility based on class more-selection
        const moreSelection = document.querySelectorAll(".more-selection");
        
        if (moreSelection) {
            moreSelection.forEach((element) => {
                element.classList.toggle("hidden-button");
                
            });
            
            document.querySelectorAll('.record-tr-container .more-selection').forEach((element, index) => {
                (element as HTMLElement).style.position = 'absolute';
                (element as HTMLElement).style.top = `${3.9 * (index + 1)}em`; 
            });
        }
    }

    // Resize observer function
    const resizeObserver = new ResizeObserver(() => {
        if (window.innerWidth > 720) {
            document.querySelectorAll('.record-tr-container .more-selection').forEach((element) => {
                (element as HTMLElement).style.position = 'relative'; 
                (element as HTMLElement).style.top = ''; 
            });
        } else {
            handleMore ();
        }
    });

    // Start observing the document body (or a specific container if preferred)
    resizeObserver.observe(document.body);


    if (!labels) {
        return <ErrorMessage />;
    }
    
    return (
        <>
            {canViewContent && <section className="record-list-container container-shadow">
                <div className="record-list-header">
                    <h3>Band Records</h3>
                    <button onClick={handleAllRecords}>All Records</button>
                </div>
                <table>
                    <thead>
                        <tr className="record-tr-container">
                            <TableButton
                                label={labels.record.fields.name}
                                onClick={() => requestSort("name")}
                                sortConfig={sortConfig}
                                columnKey="name"
                            />                            
                            <TableButton
                                label={labels.record.fields.email}
                                onClick={() => requestSort("email")}
                                sortConfig={sortConfig}
                                columnKey="email"
                            />
                            <TableButton
                                label={labels.record.fields.level}
                                onClick={() => requestSort("level")}
                                sortConfig={sortConfig}
                                columnKey="level"
                            />
                            <TableButton
                                label={labels.record.fields.hudsonValley}
                                onClick={() => requestSort("hudsonValley")}
                                sortConfig={sortConfig}
                                columnKey="hudsonValley"
                            />
                            <TableButton
                                label={labels.record.fields.isAccepted}
                                onClick={() => requestSort("isAccepted")}
                                sortConfig={sortConfig}
                                columnKey="isAccepted"
                            />
                            <th className="more-button" onClick={handleMore}>More</th>
                            <TableButton
                                className="more-selection hidden-button"
                                label={labels.record.fields.members}
                                onClick={() => requestSort("members")}
                                sortConfig={sortConfig}
                                columnKey="members"
                            />
                            <TableButton
                                className="more-selection hidden-button"
                                label={labels.record.fields.link}
                                onClick={() => requestSort("link")}
                                sortConfig={sortConfig}
                                columnKey="link"
                            />
                            {canViewEditedDetail && 
                                <>
                                    <TableButton
                                        className="more-selection hidden-button"
                                        label={labels.record.fields.nameOfUser}
                                        onClick={() => requestSort("nameOfUser")}
                                        sortConfig={sortConfig}
                                        columnKey="nameOfUser"
                                    />
                                    <TableButton
                                        className="more-selection hidden-button"
                                        label={labels.record.fields.editedTime}
                                        onClick={() => requestSort("editedTime")}
                                        sortConfig={sortConfig}
                                        columnKey="editedTime"
                                    />
                                </>
                            } 
                            {canViewActions && <th className="action-header">{labels.actions.action}</th>} 
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRecords.map((record) => (
                            <RecordListBody record={record} deleteRecord={() => deleteRecord(record._id)} key={record._id} />
                        ))}
                    </tbody>
                </table>
            </section>}
        </>
    );
}