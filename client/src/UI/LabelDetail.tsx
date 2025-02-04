type LabelDetailProps = {
    label: string;
    value: React.ReactNode;
    style?: React.CSSProperties;
    type: string;
    link?: string;
};

const LabelDetail = ({ label, value, style, type, link }: LabelDetailProps) => {
    // Normalize the value to "N/A" if it's null, undefined, an empty string, or the string "null"
    const normalizedValue =
    value === null || value === undefined || value === '' || value === 'null'
        ? 'N/A'
        : value;

    // Render based on type
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
