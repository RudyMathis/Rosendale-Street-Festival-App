import { useState } from "react";
import ConfirmationModal from "../ComfirmationModal"

type DeleteMemberProps = {
    memberId: string;
    deleteMemeber: (id: string) => void;
};

const DeleteMember: React.FC<DeleteMemberProps> = ({ memberId, deleteMemeber }) => {
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
            <button className="action-delete" type="button" onClick={openModal}>
                Delete Member
            </button>
        </div>
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

export default DeleteMember;
