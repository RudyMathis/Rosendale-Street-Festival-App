import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import ConfirmationModal from "./ComfirmationModal";
import useLabels from "../hooks/UseLabels";
import useRecords from "../hooks/UseRecords";
import TableButton from "../UI/TableButton";
import ErrorMessage from '../UI/ErrorMessage';
import "../styles/RecordList.css";
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

type RecordProps = {
    record: RecordType;
    deleteRecord: (id: string) => void;
};

const Record = ({ record, deleteRecord }: RecordProps) => {
    
    const { canViewActions, canAccept, canViewEditedDetail } = useRoleContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [, setRecords] = useState<RecordType[]>([]);
    const [updateisAccepted, setUpdateIsAccepted] = useState(record.isAccepted);
    const labels = useLabels();
    

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleConfirmDelete = () => {
        deleteRecord(record._id);
        closeModal();
    };

    async function updateAccepted(id: string) {
        try {
            const newIsAccepted = !updateisAccepted;
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}/isAccepted`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isAccepted: newIsAccepted }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update isAccepted");
            }
    
            const updatedRecord = await response.json();
    
            // Update the main records state
            setRecords((prevRecords) =>
                prevRecords.map((record) =>
                    record._id === id ? { ...record, isAccepted: updatedRecord.isAccepted } : record
                )
            );
            
            // Update local state for immediate feedback
            setUpdateIsAccepted(updatedRecord.isAccepted);
    
        } catch (error) {
            console.error("Failed to update isAccepted:", error);
        }
    }

    if (!labels) {
        return <ErrorMessage />;
    }
    
    return (
        <>
            <tr>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.name}</div>
                    <Link to={`/record/${record._id}`}>{record.name}</Link>
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.email}</div>
                    <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                        {record.email}
                    </a>
                </td>
                <td className={`record-td-container level-${record.level.toLowerCase()}`}>
                    <div className="hidden-desktop">{labels.record.fields.level}</div>
                    {record.level}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.members}</div>
                    {record.members}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.link}</div>
                    <a ref={record.link} target="_blank" rel="noopener noreferrer">
                        {record.link}
                    </a>
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.hudsonValley}</div>
                    <input
                        type="checkbox"
                        disabled
                        checked={record.hudsonValley}
                        onChange={() => {}}
                    />
                </td>
                <td className={`record-td-container ${updateisAccepted ? "approved" : "pending"}`}>
                    <div className="hidden-desktop">{labels.record.fields.isAccepted}</div>
                    <input
                        type="checkbox"
                        disabled={!canAccept}
                        checked={updateisAccepted} // Correct state binding
                        onChange={() => updateAccepted(record._id)}
                    />
                </td> 
                {canViewEditedDetail && (
                    <>
                        <td className="record-td-container">
                            <div className="hidden-desktop">{labels.record.fields.addedBy}</div>
                            {record.nameOfUser}
                        </td>
                        <td className="record-td-container">
                            <div className="hidden-desktop">{labels.record.fields.editedTime}</div>
                            {record.editedTime}
                        </td>
                    </>
                )}
                {canViewActions && ( // Only show the "Action" column if the user has permission
                    <td>
                        <div className="action-container">
                            <Link to={`/edit/${record._id}`}>
                                <button className="action-edit">{labels.actions.edit}</button>
                            </Link>
                            <button className="action-delete" type="button" onClick={openModal}>{labels.actions.delete}</button>
                        </div>
                    </td>
                )}
            </tr>
            {modalOpen && (
                <ConfirmationModal
                    isOpen={modalOpen}
                    message="Are you sure you want to delete this record?"
                    onConfirm={handleConfirmDelete}
                    onCancel={closeModal}
                />
            )}
        </>
        );
};

export default function RecordList() {
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
                                label={labels.record.fields.members}
                                onClick={() => requestSort("members")}
                                sortConfig={sortConfig}
                                columnKey="members"
                            />
                            <TableButton
                                label={labels.record.fields.link}
                                onClick={() => requestSort("link")}
                                sortConfig={sortConfig}
                                columnKey="link"
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
                            {canViewEditedDetail && 
                                <>
                                    <TableButton
                                        label={labels.record.fields.nameOfUser}
                                        onClick={() => requestSort("nameOfUser")}
                                        sortConfig={sortConfig}
                                        columnKey="nameOfUser"
                                    />
                                    <TableButton
                                        label={labels.record.fields.editedTime}
                                        onClick={() => requestSort("editedTime")}
                                        sortConfig={sortConfig}
                                        columnKey="editedTime"
                                    />
                                </>
                            } 
                            {canViewActions && <th>{labels.actions.action}</th>} 
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRecords.map((record) => (
                            <Record record={record} deleteRecord={() => deleteRecord(record._id)} key={record._id} />
                        ))}
                    </tbody>
                </table>
            </section>}
        </>
    );
}