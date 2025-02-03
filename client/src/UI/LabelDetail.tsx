type LabelDetailProps = {
    label: string;
    value: React.ReactNode;
    style?: React.CSSProperties;
    type?: string;
    link?: string;
};

const LabelDetail = ({ label, value, style, type, link }: LabelDetailProps) => (
    <div style={style}>
        <strong>{label}: </strong>
        {type === 'link' 
        ?   <a href={link} target="_blank" rel="noopener noreferrer">
                <span>{value !== null && value !== undefined && value !== '' ? value : 'N/A'}</span>
            </a>
        :
        <span>{value !== null && value !== undefined && value !== '' ? value : 'N/A'}</span>
        }
    </div>
);

export default LabelDetail;
