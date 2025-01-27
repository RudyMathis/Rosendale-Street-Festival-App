import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import Login from "../Login";
import RecordListBody from "./RecordListBody"
import useRecords from "../../hooks/UseRecords";
import SystemMessage from "../../util/SystemMessage";
import Button from "../../util/Button";
import TableButton from "../../util/TableButton";
import DeleteToggle from "./DeleteToggle"
import LoginReminder from "../../UI/LoginReminder";
import Label from "../../labels/UILabel.json"
import "../../styles/RecordList.css";
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
    const [toggleDelete, setToggleDelete] = useState(true);
    const { records, setRecords } = useRecords();
    const navigate = useNavigate();
    const { canViewContent, canViewActions, canViewEditedDetail } = useRoleContext();
    const [sortConfig, setSortConfig] = useState<{ key: keyof RecordType; direction: "asc" | "desc" }>({
        key: "name",
        direction: "desc",
    });

    if (!records) {
        return <SystemMessage
                    title="Error"
                    message="Missing Records"
                    type="Error"
                    parentElement="td"
                />
    }

    async function deleteRecord(id: string) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`, // Make into hook
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
    
            if (sortConfig.key === `${Label.record.level}`.toLocaleLowerCase()) {
                aValue = rankingMap[a.level];
                bValue = rankingMap[b.level];
            } else if (sortConfig.key === `${Label.record.members}`.toLocaleLowerCase()) {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortConfig.key === "editedTime") {
                if (aValue !== null && typeof aValue === 'string') {
                    aValue = new Date(aValue).getTime();
                } else {
                    aValue = 0; // or some other default value
                }
                if (bValue !== null && typeof bValue === 'string') {
                    bValue = new Date(bValue).getTime();
                } else {
                    bValue = 0; // or some other default value
                }
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

    function handleToggleDelete() {
        setToggleDelete(!toggleDelete);
    }
    
    return (
        <>
            {canViewContent ? 
                <section className="record-list-container container-shadow">
                    <div className="record-list-header">
                        <h3>Band Records</h3>
                        <DeleteToggle label="Toggle Delete" onClick={handleToggleDelete} />
                        <Button
                            label="All Records"
                            onClick={handleAllRecords} 
                            className="button"
                            type="button"
                        />
                    </div>
                    <table>
                        <thead>
                            <tr className="record-tr-container">
                                <TableButton
                                    label={Label.record.name}
                                    onClick={() => requestSort("name")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.name}
                                />                            
                                <TableButton
                                    label={Label.record.email}
                                    onClick={() => requestSort("email")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.email}
                                />
                                <TableButton
                                    label={Label.record.level}
                                    onClick={() => requestSort("level")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.level}
                                />
                                <TableButton
                                    label={Label.record.hudsonValley}
                                    onClick={() => requestSort("hudsonValley")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.hudsonValley}
                                />
                                <TableButton
                                    label={Label.record.isAccepted}
                                    onClick={() => requestSort("isAccepted")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.isAccepted}
                                />
                                <th className="more-button" onClick={handleMore}>{Label.actions.more}</th>
                                <TableButton
                                    className="more-selection hidden-button"
                                    label={Label.record.members}
                                    onClick={() => requestSort("members")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.members}
                                />
                                <TableButton
                                    className="more-selection hidden-button"
                                    label={Label.record.link}
                                    onClick={() => requestSort("link")}
                                    sortConfig={sortConfig}
                                    columnKey={Label.record.link}
                                />
                                {canViewEditedDetail && 
                                    <>
                                        <TableButton
                                            className="more-selection hidden-button"
                                            label={Label.record.nameOfUser}
                                            onClick={() => requestSort("nameOfUser")}
                                            sortConfig={sortConfig}
                                            columnKey="nameOfUser"
                                        />
                                        <TableButton
                                            className="more-selection hidden-button"
                                            label={Label.record.editedTime}
                                            onClick={() => requestSort("editedTime")}
                                            sortConfig={sortConfig}
                                            columnKey="editedTime"
                                        />
                                    </>
                                } 
                                {canViewActions && <th className="action-header">{Label.actions.action}</th>} 
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.map((record) => (
                                <RecordListBody record={record} deleteRecord={() => deleteRecord(record._id)} key={record._id} comfirmation={toggleDelete} />
                            ))}
                        </tbody>
                    </table>
                </section>
                : 
                <>
                    <LoginReminder />
                    <Login />
                </>
            }
        </>
    );
}