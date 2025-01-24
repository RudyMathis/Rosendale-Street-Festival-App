type ButtonProps = {
    label: string;
    secondaryLabel?: string;
    onClick?: () => void;
    className: string;
    type: "button" | "reset" | "submit";
};

const Button: React.FC<ButtonProps> = ({ label, secondaryLabel, onClick, className, type }) => {

    return (
        <button onClick={onClick} type={type} className={className}>
            {label} {secondaryLabel}
        </button>
    );
};

export default Button;
