import { useState } from "react";
import ConfirmationModal from "../ComfirmationModal"

type DeleteMemberProps = {
    memberId: string;
    role: string; // Add role to determine if the button should be disabled
    deleteMemeber: (id: string) => void;
};

const DeleteMember: React.FC<DeleteMemberProps> = ({ memberId, role, deleteMemeber }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

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
                    disabled={role === "admin"} // Disable button for admin members
                >
                    Delete Member
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
