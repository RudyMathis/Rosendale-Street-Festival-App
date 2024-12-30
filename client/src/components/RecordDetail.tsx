import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        return <p>Loading...</p>;
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
            {renderField('Email', (
                <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
                    {record.email || 'N/A'}
                </a>
            ))}
            {renderField('Level', record.level)}
            {renderField('Committee Notes', record.committeNotes)}
            {renderField('Members', record.members)}
            {renderField('Located in Hudson Valley', record.hudsonValley?.toString())}
            {renderField('Summary', record.summary)}
            {renderField('Genre', record.genre)}
            {renderField('Link', record.link ? (
                <a href={record.link} target="_blank" rel="noopener noreferrer">
                    {record.link}
                </a>
            ) : 'N/A')}
            {renderField('Dates Available', record.dates)}
            {renderField('Another Gig', record.anotherGig?.toString())}
            {renderField('Another Gig Details', record.gigIfYes)}
            {renderField('Shirt Size XS', record.shirtSizeXS)}
            {renderField('Shirt Size S', record.shirtSizeS)}
            {renderField('Shirt Size M', record.shirtSizeM)}
            {renderField('Shirt Size L', record.shirtSizeL)}
            {renderField('Shirt Size XL', record.shirtSizeXL)}
            {renderField('Shirt Size XXL', record.shirtSizeXXL)}
            {renderField('Primary Contact', record.primaryContact)}
            {renderField('Primary Email', (
                <a href={`mailto:${record.primaryEmail}`} target="_blank" rel="noopener noreferrer">
                    {record.primaryEmail || 'N/A'}
                </a>
            ))}
            {renderField('Primary Phone', record.primaryPhone)}
            {renderField('Primary Address', record.primaryAddress)}
            {renderField('Secondary Contact', record.secondaryContact)}
            {renderField('Secondary Email', record.secondaryEmail ? (
                <a href={`mailto:${record.secondaryEmail}`} target="_blank" rel="noopener noreferrer">
                    {record.secondaryEmail}
                </a>
            ) : 'N/A')}
            {renderField('Secondary Phone', record.secondaryPhone)}
            {renderField('New To StreetFest', record.isNewToStreeFest?.toString())}
            {renderField('Willing To Fundraise', record.isWillingToFundraise?.toString())}
            {renderField('Anything Else', record.anythingElse)}
            {renderField('Accepted', record.isAccepted?.toString())}
        </div>
    );
}