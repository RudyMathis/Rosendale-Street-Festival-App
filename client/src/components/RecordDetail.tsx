import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Label from "../labels/formLabels.json";

type RecordType = {
    _id: string;
    name: string;
    email: string;
    level: string;
    committeNotes: string;
    members: number;
    hudsonValley: boolean;
    summary: string;
    genre: string;
    link: string | null;
    dates: string;
    anotherGig: boolean;
    gigIfYes: string;
    shirtSizeXS: number;
    shirtSizeS: number;
    shirtSizeM: number;
    shirtSizeL: number;
    shirtSizeXL: number;
    shirtSizeXXL: number;
    primaryContact: string;
    primaryEmail: string;
    primaryPhone: string;
    primaryAddress: string;
    secondaryContact: string;
    secondaryEmail: string | null;
    secondaryPhone: string;
    isNewToStreeFest: boolean;
    isWillingToFundraise: boolean;
    anythingElse: string;
    isAccepted: boolean;
};

export default function RecordDetail() {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<RecordType | null>(null);

    useEffect(() => {
        async function fetchRecord() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`);
                console.log(response);
                if (!response.ok) {
                    throw new Error('Record not found');
                }
                const data: RecordType = await response.json();
                setRecord(data);
            } catch (error) {
                console.error('Failed to fetch record:', error);
            }
        }

        fetchRecord();
    }, [id]);

    if (!record) {
        return <p>{Label.actions.loading}</p>;
    }

    // console.log(record)
    
    const renderField = (label: string, value: React.ReactNode ) => (       
        <p>
            <strong>{label}:</strong> {value !== null && value !== undefined && value !== ''  ? value : 'N/A'}
        </p>
    );

    return (
        <div className="record-detail-container container-shadow">
            <h3>{record.name}</h3>
            {renderField(Label.record.email, (
                <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                    {record.email || 'N/A'}
                </a>
            ))}
            {renderField(Label.record.level, record.level)}
            {renderField(Label.record.committeNotes, record.committeNotes)}
            {renderField(Label.record.members, record.members)}
            {renderField(Label.record.hudsonValley, record.hudsonValley?.toString())}
            {renderField(Label.record.summary, record.summary)}
            {renderField(Label.record.genre, record.genre)}
            {renderField(Label.record.link, record.link ? (
                <a href={record.link} target="_blank" rel="noopener noreferrer">
                    {record.link}
                </a>
            ) : 'N/A')}
            {renderField(Label.record.dates, record.dates)}
            {renderField(Label.record.anotherGig, record.anotherGig?.toString())}
            {renderField(Label.record.gigIfYes, record.gigIfYes)}
            {renderField(Label.record.shirtSizeXS, record.shirtSizeXS)}
            {renderField(Label.record.shirtSizeS, record.shirtSizeS)}
            {renderField(Label.record.shirtSizeM, record.shirtSizeM)}
            {renderField(Label.record.shirtSizeL, record.shirtSizeL)}
            {renderField(Label.record.shirtSizeXL, record.shirtSizeXL)}
            {renderField(Label.record.shirtSizeXXL, record.shirtSizeXXL)}
            {renderField(Label.record.primaryContact, record.primaryContact)}
            {renderField(Label.record.primaryEmail, (
                <a href={`mailto:${record.primaryEmail}`} target="_blank" rel="noopener noreferrer">
                    {record.primaryEmail || 'N/A'}
                </a>
            ))}
            {renderField(Label.record.primaryPhone, record.primaryPhone)}
            {renderField(Label.record.primaryAddress, record.primaryAddress)}
            {renderField(Label.record.secondaryContact, record.secondaryContact)}
            {renderField(Label.record.secondaryEmail, record.secondaryEmail ? (
                <a href={`mailto:${record.secondaryEmail}`} target="_blank" rel="noopener noreferrer">
                    {record.secondaryEmail}
                </a>
            ) : 'N/A')}
            {renderField(Label.record.secondaryPhone, record.secondaryPhone)}
            {renderField(Label.record.isNewToStreeFest, record.isNewToStreeFest?.toString())}
            {renderField(Label.record.isWillingToFundraise, record.isWillingToFundraise?.toString())}
            {renderField(Label.record.anythingElse, record.anythingElse)}
            {renderField(Label.record.isAccepted, record.isAccepted?.toString())}
        </div>
    );
}