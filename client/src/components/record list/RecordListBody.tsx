
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoleContext } from "../../context/RoleContext";
import ConfirmationModal from "../ConfirmationModal";
import { RecordType } from "../../types/RecordType";
import Label from "../../labels/UILabel.json"
import useRecords from "../../hooks/UseRecords";
import useLabels from "../../hooks/UseLabels";
import TableData from "../../util/TableData";
import "../../styles/RecordList.css";
import "../../styles/Table.css";

type RecordProps = {
    record: RecordType;
    deleteRecord: (id: string) => void;
    confirmation: boolean
};

const RecordListBody = ({ record, deleteRecord, confirmation }: RecordProps) => {
    
    const { canViewActions, canAccept, canViewEditedDetail } = useRoleContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [ , setRecords] = useState<RecordType[]>([]);
    const [updateIsAccepted, setUpdateIsAccepted] = useState(record.isAccepted);
    const currentRecords = useRecords();
    const serverLabel = useLabels();
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
                <TableData label={serverLabel.record.name[1]} value={record.name} type="name" recordId={record._id} countNameRepetitions={countNameRepetitions} />
                <TableData label={serverLabel.record.email[1]} value={record.email} type="email" />
                <TableData label={serverLabel.record.level[1]} value={record.level} type="level" />
                <TableData label={serverLabel.record.hudsonValley[1]} value={record.hudsonValley} type="checkbox" recordId={record._id} isDisabled={true} checkboxLabel={record.name}/>
                <TableData label={serverLabel.record.isAccepted[1]} value={updateIsAccepted} type="checkbox" recordId={record._id} isDisabled={canAccept} checkboxLabel={record.name} updateAccepted={updateAccepted} />
                <TableData label={serverLabel.record.members[1]} value={record.members} type="text" />
                <TableData label={serverLabel.record.link[1]} value={record.link} type="link" />
                <TableData label={serverLabel.record.anotherGig[1]} value={record.anotherGig} type="checkbox" recordId={record._id} isDisabled={true} checkboxLabel={record.name}/>
                <TableData label={serverLabel.record.primaryContact[1]} value={record.primaryContact} type="text" />
                <TableData label={serverLabel.record.primaryEmail[1]} value={record.primaryEmail} type="email" />
                <TableData label={serverLabel.record.primaryPhone[1]} value={record.primaryPhone} type="text" />
                <TableData label={serverLabel.record.primaryAddress[1]} value={record.primaryAddress} type="text" />
                {canViewEditedDetail && (
                    <>
                        <TableData label={serverLabel.record.nameOfUser[1]} value={record.nameOfUser} type="text" />
                        <TableData label={serverLabel.record.editedTime[1]} value={record.editedTime} type="text" />
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
                                    if (confirmation) {
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