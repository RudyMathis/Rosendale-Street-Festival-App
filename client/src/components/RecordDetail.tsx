import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoleContext } from "./context/RoleContext";
import { RecordType } from "./types/RecordType";
import LabelDetail from "./helper/LabelDetail";
import useLabels from "./hooks/UseLabels";

export default function RecordDetail() {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<RecordType | null>(null);
    const { canViewEditedDetail } = useRoleContext();
    const labels = useLabels(); // Fetch labels

    useEffect(() => {
        async function fetchRecord() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`
                );

                if (!response.ok) {
                    throw new Error("Record not found");
                }
                const data: RecordType = await response.json();
                setRecord(data);
            } catch (error) {
                console.error("Failed to fetch record:", error);
            }
        }

        fetchRecord();
    }, [id]);

    if (!labels) {
        return <p>Failed to Loaad Labels...</p>;
    }

    if (!record) {
        return <p>{labels.actions.loading || "Loading..."}</p>;
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
            <button onClick={handleSendEmail}>{labels.actions.sendEmail || "Send Data as Email"}</button>
        </>
    );
}
