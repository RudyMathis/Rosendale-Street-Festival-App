import "../styles/ConfirmationModal.css";

type ConfirmationModalProps = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-container">
            <div className="confirmation-modal-overlay">
                <div className="confirmation-modal">
                    <p className="confirmation-message">{message}</p>
                    <div className="confirmation-buttons">
                        <button className="confirm-button" onClick={onConfirm}>
                            Confirm
                        </button>
                        <button className="cancel-button" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
