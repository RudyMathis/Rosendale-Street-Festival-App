type ToggleProps = {
    label: string;
    onClick?: () => void;
};

const DeleteToggle: React.FC<ToggleProps> = ({ label, onClick }) => {

    return (
        <div className="toggle-container">
            <label>{label}</label>
            <input onClick={onClick} type="checkbox" /> 
        </div>
    );
};

export default DeleteToggle;
