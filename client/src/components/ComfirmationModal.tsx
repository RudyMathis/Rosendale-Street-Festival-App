import Button from "../util/Button";
import Label from "../labels/UILabel.json"
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
                        <Button 
                            label={Label.actions.confirm}
                            onClick={onConfirm}
                            className="confirm-button"
                            type="button"
                        />
                        <Button 
                            label={Label.actions.cancel}
                            onClick={onCancel}
                            className="cancel-button"
                            type="button"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
