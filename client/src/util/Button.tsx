type ButtonProps = {
    label: string;
    secondaryLabel?: string;
    onClick?: () => void;
    className: string;
    type: "button" | "reset" | "submit";
    role?: string | number;
    disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    label,
    secondaryLabel,
    onClick,
    className,
    type,
    role,
    disabled,
}) => {
    const isDisabled = disabled || role === "admin";
    return (
        <button onClick={onClick} type={type} className={className} disabled={isDisabled}>
        {label} {secondaryLabel}
        </button>
    );
};

export default Button;
