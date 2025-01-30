import { Link } from "react-router-dom";

type TableDataProps = {
    label: string;
    value: unknown;
    type: string;
    recordId?: string;
    isDisabled?: boolean;
    updateAccepted?: (id: string) => void;
    countNameRepetitions?: (name: string) => number;
};

const TableData = ({
    label,
    value,
    type,
    recordId,
    isDisabled = false,
    updateAccepted,
    countNameRepetitions,
}: TableDataProps) => {
    return (
        <td className={`record-td-container ${type === "name" ? "sticky-name" : ""} ${type === "level" ? `level-${value}` : ""}`}>
            <div className="hidden-desktop">{label}</div>

            {type === "name" && recordId ? (
                <>
                    <Link to={`/record/${recordId}`}>{value as string}</Link>
                    {countNameRepetitions && countNameRepetitions(value as string) > 1 && (
                        <div>Repeated: {countNameRepetitions(value as string)}</div>
                    )}
                </>
            ) : type === "email" ? (
                <a className="link" href={`mailto:${value as string}`} target="_blank" rel="noopener noreferrer">
                    {value as string}
                </a>
            ) : type === "checkbox" ? (
            <input
                type="checkbox"
                disabled={!isDisabled}
                checked={Boolean(value)}
                onChange={() => recordId && updateAccepted && updateAccepted(recordId)}
            />
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
