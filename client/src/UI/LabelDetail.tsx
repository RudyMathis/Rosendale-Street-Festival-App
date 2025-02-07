/**
 * A component that displays a label-value pair in a list item.
 * The value will be normalized to "N/A" if it's null, undefined, an empty string, or the string "null"
 * The component can be customized with a style object and a type string.
 * The type string can be "link" or "email" to render the value as a link.
 * The link type requires a link prop to be passed in.
 * The email type will render the value as a mailto link.
 * If the type is not recognized, the component will render the value as a string.
 */
type LabelDetailProps = {
    label: string;
    value: React.ReactNode;
    style?: React.CSSProperties;
    type: string;
    link?: string;
};

const LabelDetail = ({ label, value, style, type, link }: LabelDetailProps) => {
    const normalizedValue =
    value === null || value === undefined || value === '' || value === 'null'
        ? 'N/A'
        : value;

    if (type === 'link' && normalizedValue !== 'N/A') {
        return (
            <li style={style}>
                <span>{label}: </span>
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <span>{normalizedValue}</span>
                </a>
            </li>
        );
    } else if ((type?.includes('email') || type?.includes('Email')) && normalizedValue !== 'N/A') {
        return (
            <li style={style}>
                <span>{label}: </span>
                <a href={`mailto:${normalizedValue}`} target="_blank" rel="noopener noreferrer">
                    <span>{normalizedValue}</span>
                </a>
            </li>
        );
    } else {
        return (
            <li style={style}>
                <span>{label}: </span>
                <span>{normalizedValue}</span>
            </li>
        );
    }
};

export default LabelDetail;