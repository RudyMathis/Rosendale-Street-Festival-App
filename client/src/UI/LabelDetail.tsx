type LabelDetailProps = {
    label: string;
    value: React.ReactNode;
    style?: React.CSSProperties;
};

const LabelDetail = ({ label, value, style }: LabelDetailProps) => (
    <div style={style}>
        <strong>{label}: </strong>
        <span>{value !== null && value !== undefined && value !== '' ? value : 'N/A'}</span>
    </div>
);

export default LabelDetail;
