type ToggleProps = {
    label: string;
    onClick?: () => void;
};

const DeleteToggle: React.FC<ToggleProps> = ({ label, onClick }) => {

    return (
        <>
            <label>{label}</label>
            <input onClick={onClick} type="checkbox" /> 
        </>
    );
};

export default DeleteToggle;
