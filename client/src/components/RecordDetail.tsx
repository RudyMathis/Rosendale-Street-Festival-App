import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import { RecordType } from "../types/RecordType";
import LabelDetail from "../UI/LabelDetail";
import useLabels from "../hooks/UseLabels";
import useRecords from "../hooks/UseRecords";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/RecordDetail.css";

export default function RecordDetail() {
    const { id } = useParams<{ id: string }>();
    const { canViewEditedDetail } = useRoleContext();
    const labels = useLabels();
    const { fetchRecordById } = useRecords();
    const [record, setRecord] = useState<RecordType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const data = await fetchRecordById(id);
            setRecord(data);
        };
    
        fetchData();
    }, [id, fetchRecordById]);

    if (!labels) {
        return <ErrorMessage />;
    }

    if (!record) {
        return <ErrorMessage />;
    }

    const createEmailBody = () => {
        const emailContent = Object.entries(record)
            .filter(([key]) => !["_id", "nameOfUser", "editedTime"].includes(key)) // Exclude specific keys
            .map(([key, value]) => `${labels.record.fields[key] || key}: ${value || "N/A"}`)
            .join("\n");
    
        return encodeURIComponent(emailContent); // Encode email body
    };
    

    const handleSendEmail = () => {
        const subject = encodeURIComponent("Record Details");
        const emailBody = createEmailBody();
        window.location.href = `mailto:?subject=${subject} - ${record.name}&body=${emailBody}`;
    };

    return (
        <>
            <h3>{record.name}</h3>
            <div className="record-detail-container container-shadow">
                {Object.entries(labels.record.fields).map(([key, label]) => (
                    <LabelDetail
                        key={key}
                        label={label}
                        value={record[key] ? record[key].toString() : "N/A"}                    
                    />
                ))}
                {canViewEditedDetail && (
                    <>
                        <LabelDetail
                            label={labels.record.fields.nameOfUser}
                            value={record.nameOfUser || "N/A"}
                            style={{ color: "hsl(173 58% 39%)" }}
                        />
                        <LabelDetail
                            label={labels.record.fields.editedTime}
                            value={record.editedTime || "N/A"}
                            style={{ color: "hsl(173 58% 39%)" }}
                        />
                    </>
                )}
            </div>
            <button onClick={handleSendEmail}>{labels.actions.sendEmail}</button>
        </>
    );
}
