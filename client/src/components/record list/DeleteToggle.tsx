type ToggleProps = {
    label: string;
    onClick?: () => void;
};

const DeleteToggle: React.FC<ToggleProps> = ({ label, onClick }) => {

    return (
        <div className="toggle-container">
            <label htmlFor={label}>{label}</label>
            <input id={label} onClick={onClick} type="checkbox" /> 
        </div>
    );
};

export default DeleteToggle;
