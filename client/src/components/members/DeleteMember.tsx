import { useState } from "react";
import ConfirmationModal from "../ComfirmationModal"
import useLabels from "../../hooks/UseLabels";
import Label from "../../labels/UILabel.json"

type DeleteMemberProps = {
    memberId: string;
    role: string;
    deleteMemeber: (id: string) => void;
};

const DeleteMember: React.FC<DeleteMemberProps> = ({ memberId, role, deleteMemeber }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const serverLabel = useLabels();

    const handleConfirmDelete = () => {
        deleteMemeber(memberId);
        closeModal();
    };

    return (
        <>
            <div>
                <button
                    className="action-delete"
                    type="button"
                    onClick={openModal}
                    disabled={role === `${serverLabel.role.level4}`} // Disable button for admin members
                >
                    {Label.adminPanel.delete}
                </button>
            </div>
            {modalOpen && (
                <ConfirmationModal
                    isOpen={modalOpen}
                    message="Are you sure you want to delete this member?"
                    onConfirm={handleConfirmDelete}
                    onCancel={closeModal}
                />
            )}
        </>
    );
};

export default DeleteMember;
