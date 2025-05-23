import Button from "../util/Button";
import Label from "../labels/UILabel.json"
import "../styles/ConfirmationModal.css";

type ConfirmationModalProps = {
    isOpen: boolean;
    message: string | React.ReactNode;
    optionalMessage?: string;
    secondOptionalMessage?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    message,
    optionalMessage,
    secondOptionalMessage,
    onConfirm,
    onCancel,
}) => {

    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay" onClick={onCancel}>
            <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <p className="confirmation-message">{optionalMessage}</p>
                <p className="confirmation-message">{message}</p>
                <p className="confirmation-message">{secondOptionalMessage}</p>
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
    );
};

export default ConfirmationModal;
