import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRoleContext } from "./context/RoleContext";

import ConfirmationModal from "./ComfirmationModal";

type RecordType = {
    _id: string;
    name: string;
    email: string;
    level: "Low" | "Medium" | "High";
    members: number;
    link: string;
    hudsonValley: boolean;
    isAccepted: boolean;
};

type RecordProps = {
    record: RecordType;
    deleteRecord: (id: string) => void;
};

const Record = ({ record, deleteRecord }: RecordProps) => {
    
    const { canViewActions, canAccept } = useRoleContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [, setRecords] = useState<RecordType[]>([]);
    const [updateisAccepted, setUpdateIsAccepted] = useState(record.isAccepted);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleConfirmDelete = () => {
        deleteRecord(record._id);
        closeModal();
    };

    // Function to update isAccepted
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

            setRecords((prevRecords) =>
                prevRecords.map((record) =>
                    record._id === id ? { ...record, isAccepted: updatedRecord.isAccepted } : record
                )
            );

            setUpdateIsAccepted(newIsAccepted);

        } catch (error) {
            console.error("Failed to update isAccepted:", error);
        }
    }

    return (
        <>
            <tr className={!updateisAccepted ? "approved" : "pending"}>
                <td>
                    <Link to={`/record/${record._id}`}>{record.name}</Link>
                </td>
                <td className="hidden-mobile">
                    <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                        {record.email}
                    </a>
                </td>
                <td className="hidden-mobile">{record.level}</td>
                <td className="hidden-mobile">{record.members}</td>
                <td className="hidden-mobile">
                    <a href={record.link} target="_blank" rel="noopener noreferrer">
                        {record.link}
                    </a>
                </td>
                <td className="hidden-mobile">
                    <input
                        type="checkbox"
                        disabled
                        checked={record.hudsonValley}
                        onChange={() => {}}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        disabled={!canAccept}
                        checked={!updateisAccepted} // Use isAccepted state here
                        onChange={() => updateAccepted(record._id)} // Update state on change
                    />
                </td> 
                {canViewActions && ( // Only show the "Action" column if the user has permission
                    <td>
                        <div className="action-container">
                            <Link to={`/edit/${record._id}`}>
                                <div className="action-edit">Edit</div>
                            </Link>
                            <button className="action-delete" type="button" onClick={openModal}>Delete</button>
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
    const [records, setRecords] = useState<RecordType[]>([]);
    const { canViewContent, canViewActions } = useRoleContext(); // Check permission for the "Action" column
    const [sortConfig, setSortConfig] = useState<{ key: keyof RecordType; direction: "asc" | "desc" }>({
        key: "name",
        direction: "desc",
    });

    useEffect(() => {
        async function getRecords() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/`);
            console.log(response);
            if (!response.ok) {
                console.error(`An error occurred: ${response.statusText}`);
                return;
            }

            const records: RecordType[] = await response.json();
            setRecords(records);
        } catch (error) {
            console.error("Failed to fetch records:", error);
        }
        }

        getRecords();
    }, []);

    async function deleteRecord(id: string) {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`, {
                method: "DELETE",
            });
            setRecords((prevRecords) => prevRecords.filter((el) => el._id !== id));
        } catch (error) {
            console.error("Failed to delete record:", error);
        }
    }

    const sortedRecords = (() => {
        if (!sortConfig || !sortConfig.key) return records;

        const rankingMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

        return [...records].sort((a, b) => {
            const aValue = sortConfig.key === "level" ? rankingMap[a.level] : a[sortConfig.key];
            const bValue = sortConfig.key === "level" ? rankingMap[b.level] : b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    })();

    const requestSort = (key: keyof RecordType) => {
        const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    return (
        <>
            {canViewContent && <section className="record-list-container container-shadow">
                <h3>Band Records</h3>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button type="button" onClick={() => requestSort("name")}>
                                    Name {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th className="hidden-mobile">
                                <button type="button" onClick={() => requestSort("email")}>
                                    Email {sortConfig?.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th className="hidden-mobile">
                                <button type="button" onClick={() => requestSort("level")}>
                                    Level {sortConfig?.key === "level" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th className="hidden-mobile">
                                <button type="button" onClick={() => requestSort("members")}>
                                    Members {sortConfig?.key === "members" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th className="hidden-mobile">
                                <button type="button" onClick={() => requestSort("link")}>
                                    Link {sortConfig?.key === "link" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th className="hidden-mobile">
                                <button type="button" onClick={() => requestSort("hudsonValley")}>
                                    Hudson Valley {sortConfig?.key === "hudsonValley" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th>
                                <button type="button" onClick={() => requestSort("isAccepted")}>
                                    Accepted {sortConfig?.key === "isAccepted" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            {canViewActions && <th>Action</th>} 
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