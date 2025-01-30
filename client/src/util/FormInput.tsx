import { ChangeEvent } from "react";

type FormInputProps = {
    label: string;
    name: string;
    id?: string;
    type: string;
    value: string | number | boolean;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    options?: string[];
    error?: string;
};

const FormInput = ({
    label,
    name,
    id = `${name}`,
    type,
    value,
    placeholder = "",
    onChange,
    options = [],
    error = "",
}: FormInputProps) => {

    const validateNumber = () => {
        if (type === "number" && typeof value === "number" && value < 0) {
            return false;
        }
        return true;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;

        // For number types, ensure the value stays above or equal to 0
        if (type === "number") {
            const numericValue = Number(value);
            if (isNaN(numericValue) || numericValue < 0) {
                // Set value to 0 if an invalid value is entered
                onChange({ target: { name, value: 0 } } as unknown as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
                return;
            }
        }

        onChange(e);;
        validateNumber();
    };

    return (
        <div className="form-input-container">
            <label {...(type !== "radio" && { htmlFor: id })}>                    
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    id={id}
                    value={value as string}
                    placeholder={placeholder}
                    onChange={handleChange}
                    rows={5} 
                    cols={33}
                />
            ) : type === "radio" && options.length > 0 ? (
                options.map((option, index) => (
                    <div key={index} className={`form-${type}-container`}>
                        <input
                            type="radio"
                            name={name}
                            id={`${id}-${option}`}
                            value={option}
                            checked={value === option}
                            onChange={handleChange}

                        />
                        <label htmlFor={`${id}-${option}`}>{option}</label>
                    </div>
                ))
            ) : type === "checkbox" ? (
                <input
                    type="checkbox"
                    name={name}
                    id={id}
                    checked={typeof value === "boolean" ? value : false}
                    onChange={handleChange}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value as string | number}
                    placeholder={placeholder}
                    onChange={handleChange}
                    autoComplete="off"
                />
            )}
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default FormInput;
