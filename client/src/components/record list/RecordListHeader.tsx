import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import Login from "../Login";
import RecordListBody from "./RecordListBody"
import useRecords from "../../hooks/UseRecords";
import useLabels from "../../hooks/UseLabels";
import SystemMessage from "../../util/SystemMessage";
import Button from "../../util/Button";
import TableButton from "../../util/TableButton";
import DeleteToggle from "./DeleteToggle"
import LoginReminder from "../../UI/LoginReminder";
import Label from "../../labels/UILabel.json"
import "../../styles/RecordList.css";
import "../../styles/Table.css";
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
    const serverLabel = useLabels();
    const navigate = useNavigate();
    const { canViewContent, canViewActions, canEditRecords, canViewEditedDetail } = useRoleContext();
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
    
            if (sortConfig.key === `${serverLabel.record.level[0]}`) {
                aValue = rankingMap[a.level];
                bValue = rankingMap[b.level];
            } else if (sortConfig.key === `${serverLabel.record.members[0]}`) {
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
                const aLower = aValue.toLowerCase().trimStart();
                const bLower = bValue.toLowerCase().trimStart();
    
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
        const direction =
            sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    
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
                (element as HTMLElement).style.top = `${100 * (index + 1)}%`; 
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
                <section className="record-list-container card">
                    <div className="record-list-header">
                        <h3>Band Records</h3>
                        <div className="record-list-header-button-container">
                        {canEditRecords &&
                            <DeleteToggle label={Label.actions.toggleDelete} onClick={handleToggleDelete} />
                        }
                        <Button
                            label="All Records"
                            onClick={handleAllRecords} 
                            className="button"
                            type="button"
                            />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr className="record-tr-container sticky-header-name">
                                <TableButton
                                    label={serverLabel.record.name[1]}
                                    onClick={() => requestSort("name")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.name[0]}
                                />                            
                                <TableButton
                                    label={serverLabel.record.email[1]}
                                    onClick={() => requestSort("email")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.email[0]}
                                />
                                <TableButton
                                    label={serverLabel.record.level[1]}
                                    onClick={() => requestSort("level")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.level[0]}
                                />
                                <TableButton
                                    label={serverLabel.record.hudsonValley[1]}
                                    onClick={() => requestSort("hudsonValley")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.hudsonValley[0]}
                                />
                                <TableButton
                                    label={serverLabel.record.isAccepted[1]}
                                    onClick={() => requestSort("isAccepted")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.isAccepted[0]}
                                />
                                <TableButton
                                    label={serverLabel.record.members[1]}
                                    onClick={() => requestSort("members")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.members[0]}
                                />
                                <TableButton
                                    label={serverLabel.record.link[1]}
                                    onClick={() => requestSort("link")}
                                    sortConfig={sortConfig}
                                    columnKey={serverLabel.record.link[0]}
                                />
                                {canViewEditedDetail && 
                                    <>
                                        <TableButton
                                            label={serverLabel.record.nameOfUser[1]}
                                            onClick={() => requestSort("nameOfUser")}
                                            sortConfig={sortConfig}
                                            columnKey={serverLabel.record.nameOfUser[0]}
                                        />
                                        <TableButton
                                            label={serverLabel.record.editedTime[1]}
                                            onClick={() => requestSort("editedTime")}
                                            sortConfig={sortConfig}
                                            columnKey={serverLabel.record.editedTime[0]}
                                        />
                                    </>
                                } 
                                {canViewActions && 
                                    <th>
                                        <Button
                                            label={Label.actions.action}
                                            className="action-header"
                                            type="button"
                                        />
                                    </th>
                                } 
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