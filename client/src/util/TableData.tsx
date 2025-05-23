import { Link } from "react-router-dom";
/**
 * TableData is a component that displays a single table data cell.
 * It's type determines how the value is displayed.
 * For example, if the type is "name", the value is displayed as a link to the record detail page.
 * If the type is "email", the value is displayed as a mailto link.
 * If the type is "checkbox", the value is displayed as a checkbox that, when clicked, calls the updateAccepted function with the recordId.
 * If the type is "link", the value is displayed as a link to the value (which should be a URL).
 * If the type is not recognized, the value is displayed as a string.
 */
type TableDataProps = {
    label: string;
    value: unknown;
    type: string;
    recordId?: string;
    isDisabled?: boolean;
    checkboxLabel?: string;
    updateAccepted?: (id: string) => void;
    countNameRepetitions?: (name: string) => number;
};

const TableData = ({
    label,
    value,
    type,
    recordId,
    isDisabled = false,
    checkboxLabel,
    updateAccepted,
    countNameRepetitions,
}: TableDataProps) => {
    return (
        <td className={`record-td-container ${type.toLowerCase()}${type === "level" ? ` level-${value}` : ""}`}>
            <div className="hidden-desktop">{label}</div>
            {type === "name" && recordId ? (
                <div>
                    <Link to={`/record/${recordId}`}>{value as string}</Link>
                    {countNameRepetitions && countNameRepetitions(value as string) > 1 && (
                        <div>Repeated: {countNameRepetitions(value as string)}</div>
                    )}
                </div>
            ) : type === "email" ? (
                <a className="link" href={`mailto:${value as string}`} target="_blank" rel="noopener noreferrer">
                    {value as string}
                </a>
            ) : type === "checkbox" ? (
                <>
                    <label htmlFor={`${checkboxLabel}-${label}`}></label>
                    <input
                        type="checkbox"
                        id={`${checkboxLabel}-${label}-${recordId}`}
                        disabled={!isDisabled}
                        checked={Boolean(value)}
                        onChange={() => recordId && updateAccepted && updateAccepted(recordId)}
                    />
                </>
            ) : type === "link" ? (
                <a className="link" href={value as string} target="_blank" rel="noopener noreferrer">
                    {value as string}
                </a>
            ) : (
                value as string
            )}
        </td>
    );
};

export default TableData;
