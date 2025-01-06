import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoleContext } from "./context/RoleContext";
import  LabelDetail  from './helper/LabelDetail';
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
    nameOfUser: string;
    editedTime: string;
};

export default function RecordDetail() {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<RecordType | null>(null);
    const { canViewEditedDetail } = useRoleContext();

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
        return <p>{Label.actions.loading}</p>;
    }

    return (
        <div className="record-detail-container container-shadow">
            <h3>{record.name}</h3>
            <LabelDetail label={Label.record.email} value={<a href={`mailto:${record.email}`}>{record.email}</a>} />
            <LabelDetail label={Label.record.level} value={record.level} />
            <LabelDetail label={Label.record.committeNotes} value={record.committeNotes} />
            <LabelDetail label={Label.record.members} value={record.members} />
            <LabelDetail label={Label.record.hudsonValley} value={record.hudsonValley} />
            <LabelDetail label={Label.record.summary} value={record.summary} />
            <LabelDetail label={Label.record.genre} value={record.genre} />
            <LabelDetail label={Label.record.link} value={<a href={record.link || '#'}>{record.link || 'N/A'}</a>} />
            <LabelDetail label={Label.record.dates} value={record.dates} />
            <LabelDetail label={Label.record.anotherGig} value={record.anotherGig} />
            <LabelDetail label={Label.record.gigIfYes} value={record.gigIfYes} />
            <LabelDetail label={Label.record.shirtSizeXS} value={record.shirtSizeXS} />
            <LabelDetail label={Label.record.shirtSizeS} value={record.shirtSizeS} />
            <LabelDetail label={Label.record.shirtSizeM} value={record.shirtSizeM} />
            <LabelDetail label={Label.record.shirtSizeL} value={record.shirtSizeL} />
            <LabelDetail label={Label.record.shirtSizeXL} value={record.shirtSizeXL} />
            <LabelDetail label={Label.record.shirtSizeXXL} value={record.shirtSizeXXL} />
            <LabelDetail label={Label.record.primaryContact} value={record.primaryContact} />
            <LabelDetail label={Label.record.primaryEmail} value={<a href={`mailto:${record.primaryEmail}`}>{record.primaryEmail}</a>} />
            <LabelDetail label={Label.record.primaryPhone} value={record.primaryPhone} />
            <LabelDetail label={Label.record.primaryAddress} value={record.primaryAddress} />
            <LabelDetail label={Label.record.secondaryContact} value={record.secondaryContact} />
            <LabelDetail label={Label.record.secondaryEmail} value={<a href={`mailto:${record.secondaryEmail || ''}`}>{record.secondaryEmail || 'N/A'}</a>} />
            <LabelDetail label={Label.record.secondaryPhone} value={record.secondaryPhone} />
            <LabelDetail label={Label.record.isNewToStreeFest} value={record.isNewToStreeFest} />
            <LabelDetail label={Label.record.isWillingToFundraise} value={record.isWillingToFundraise} />
            <LabelDetail label={Label.record.anythingElse} value={record.anythingElse} />
            <LabelDetail label={Label.record.isAccepted} value={record.isAccepted} />
            {canViewEditedDetail && (
                <>
                    <LabelDetail 
                        label={Label.record.addedBy} 
                        value={record.nameOfUser} 
                        style={{ color: 'hsl(173 58% 39%)'}} 
                    />
                    <LabelDetail 
                        label={Label.record.editedTime} 
                        value={record.editedTime} 
                        style={{ color: 'hsl(173 58% 39%)'}} 
                    />
                </>
            )}
        </div>
    );
}