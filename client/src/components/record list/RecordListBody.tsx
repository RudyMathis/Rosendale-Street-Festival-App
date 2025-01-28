
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import ConfirmationModal from "../ComfirmationModal";
import Label from "../../labels/UILabel.json"
import useRecords from "../../hooks/UseRecords";
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
    comfirmation: boolean
};

const RecordListBody = ({ record, deleteRecord, comfirmation }: RecordProps) => {
    
    const { canViewActions, canAccept, canViewEditedDetail } = useRoleContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [ , setRecords] = useState<RecordType[]>([]);
    const [updateIsAccepted, setUpdateIsAccepted] = useState(record.isAccepted);
    const currentRecords = useRecords();
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleConfirmDelete = () => {
        deleteRecord(record._id);
        closeModal();
    };

    async function updateAccepted(id: string) {
        try {
            const newIsAccepted = !updateIsAccepted;
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
    
            // Update the record list immediately with the updated record
            setRecords((prevRecords) =>
                prevRecords?.map((record) =>
                    record._id === id ? { ...record, isAccepted: updatedRecord.isAccepted } : record
                ) || []
            );
    
            // Update local state for immediate feedback
            setUpdateIsAccepted(updatedRecord.isAccepted);
    
        } catch (error) {
            console.error("Failed to update isAccepted:", error);
        }
    }
    // function that returns the amount of times a record name has been repeated in the records array
    function countNameRepetitions(name: string): number {
        if (!currentRecords.records) {
            return 0;
        }
            // Count occurrences of the name in the records
        return currentRecords.records.reduce(
            (count, record) => (record.name === name ? count + 1 : count),
            0
        );
    }
    
    return (
        <>
            <tr>
                <td className="record-td-container sticky-name">
                    <div className="hidden-desktop">{Label.record.name}</div>
                    <Link to={`/record/${record._id}`}>{record.name}</Link>
                    {record && countNameRepetitions(record.name) > 1 
                    ? <div>Repeated: {countNameRepetitions(record.name)}</div>
                    : undefined}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{Label.record.email}</div>
                    <a className="link" href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                        {record.email}
                    </a>
                </td>
                <td className={`record-td-container level-${record.level}`}>
                    <div className="hidden-desktop">{Label.record.level}</div>
                    {record.level}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{Label.record.hudsonValley}</div>
                    <input
                        type="checkbox"
                        name="Hudson Valley"
                        disabled
                        checked={record.hudsonValley}
                        onChange={() => {}}
                    />
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{Label.record.isAccepted}</div>
                    <input
                        type="checkbox"
                        name="Accpepted"
                        disabled={!canAccept}
                        checked={updateIsAccepted}
                        onChange={() => updateAccepted(record._id)}
                    />
                </td> 
                <td className="record-td-container">
                    <div className="hidden-desktop">{Label.record.members}</div>
                    {record.members}
                </td>
                <td className="record-td-container">
                    <div className="hidden-desktop">{Label.record.link}</div>
                    <a className="link" ref={record.link} target="_blank" rel="noopener noreferrer">
                        {record.link}
                    </a>
                </td>
                {canViewEditedDetail && (
                    <>
                        <td className="record-td-container">
                            <div className="hidden-desktop">{Label.record.nameOfUser}</div>
                            {record.nameOfUser}
                        </td>
                        <td className="record-td-container">
                            <div className="hidden-desktop">{Label.record.editedTime}</div>
                            {record.editedTime}
                        </td>
                    </>
                )}
                {canViewActions && ( // Only show the "Action" column if the user has permission
                    <td>
                        <div className="action-container">
                            <Link to={`/edit/${record._id}`}>
                                <button className="action-edit">{Label.actions.edit}</button>
                            </Link>
                            <button
                                className="action-delete"
                                type="button"
                                onClick={() => {
                                    if (comfirmation) {
                                        openModal(); // Show confirmation modal
                                    } else {
                                        deleteRecord(record._id); // Delete the record directly
                                    }
                                }}
                                >
                                {Label.actions.delete}
                            </button>
                        </div>
                    </td>
                )}
            </tr>
            {modalOpen && (
                <tr>
                    <td className="confirmation-modal-container">
                        <ConfirmationModal
                            isOpen={modalOpen}
                            message="Are you sure you want to delete this record?"
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            />
                    </td>
                </tr>
            )}
        </>
        );
};

export default RecordListBody;