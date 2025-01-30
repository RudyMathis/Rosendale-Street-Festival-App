type ButtonProps = {
    label: string;
    secondaryLabel?: string;
    onClick?: () => void;
    className: string;
    type: "button" | "reset" | "submit";
    role?: string;
};

const Button: React.FC<ButtonProps> = ({ label, secondaryLabel, onClick, className, type, role }) => {

    return (
        <button onClick={onClick} type={type} className={className} disabled={role === "admin"}>
            {label} {secondaryLabel}
        </button>
    );
};

export default Button;
