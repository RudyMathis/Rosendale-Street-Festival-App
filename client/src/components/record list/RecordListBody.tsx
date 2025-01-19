
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import ConfirmationModal from "../ComfirmationModal";
import useLabels from "../../hooks/UseLabels";
import ErrorMessage from '../../UI/ErrorMessage';
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

type RecordProps = {
    record: RecordType;
    deleteRecord: (id: string) => void;
};


const RecordListBody = ({ record, deleteRecord }: RecordProps) => {
    
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
                    <a className="link" href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                        {record.email}
                    </a>
                </td>
                <td className={`record-td-container level-${record.level.toLowerCase()}`}>
                    <div className="hidden-desktop">{labels.record.fields.level}</div>
                    {record.level}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.hudsonValley}</div>
                    <input
                        type="checkbox"
                        name="Hudson Valley"
                        disabled
                        checked={record.hudsonValley}
                        onChange={() => {}}
                    />
                </td>
                <td className={`record-td-container ${updateisAccepted ? "approved" : "pending"}`}>
                    <div className="hidden-desktop">{labels.record.fields.isAccepted}</div>
                    <input
                        type="checkbox"
                        name="Accpepted"
                        disabled={!canAccept}
                        checked={updateisAccepted}
                        onChange={() => updateAccepted(record._id)}
                    />
                </td> 
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.members}</div>
                    {record.members}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{labels.record.fields.link}</div>
                    <a className="link" ref={record.link} target="_blank" rel="noopener noreferrer">
                        {record.link}
                    </a>
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

export default RecordListBody;