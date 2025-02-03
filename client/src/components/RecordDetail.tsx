import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import { RecordType } from "../types/RecordType";
import LabelDetail from "../UI/LabelDetail";
import useRecords from "../hooks/UseRecords";
import useLabels from "../hooks/UseLabels";
import Button from "../util/Button"
import SystemMessage from "../util/SystemMessage";
import LoadingMessage from "../UI/LoadingMessage";
import Label from "../labels/UILabel.json"
import "../styles/RecordDetail.css";

export default function RecordDetail() {
    const { id } = useParams<{ id: string }>();
    const { canViewContent, canViewEditedDetail } = useRoleContext();
    const { fetchRecordById } = useRecords();
    const serverLabel = useLabels();
    const [record, setRecord] = useState<RecordType | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(false); // Add error state

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true); // Start loading
                setError(false); // Reset error state
                const data = await fetchRecordById(id);
                setRecord(data);
            } catch (err) {
                console.error("Error fetching record:", err);
                setError(true);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, [id, fetchRecordById]);

    if (loading) {
        return <LoadingMessage message="Loading record details..." />; // fix this
    }

    if (!record) {
        return <SystemMessage
                    title="Error"
                    message="Missing Records"
                    type="Error"
                    parentElement="div"
                />
    }

    if (error) {
        return <SystemMessage
                    title="Error"
                    message="System Error"
                    type="Error"
                    parentElement="div"
                />
    }

    const createEmailBody = () => {
        const emailContent = Object.entries(record)
            .filter(([key]) => !["_id", `${Label.otherLabels.nameOfUser}`, `${Label.otherLabels.editedTime}`].includes(key)) // Exclude specific keys
            .map(([key, value]) => {
                const label = serverLabel.record[key as keyof typeof serverLabel.record][1] || key;
                return `${label}: ${value || "N/A"}`;
            })
            .join("\n");
    
        return encodeURIComponent(emailContent); // Encode email body
    };
    
    const handleSendEmail = () => {
        const subject = encodeURIComponent("Record Details");
        const emailBody = createEmailBody();
        window.location.href = `mailto:?subject=${subject} - ${record.name}&body=${emailBody}`;
    };
    
    const createDownloadContent = () => {
        return Object.entries(record)
            .filter(([key]) => !["_id", `${Label.otherLabels.nameOfUser}`, `${Label.otherLabels.editedTime}`].includes(key)) // Exclude specific keys
            .map(([key, value]) => {
                const label = serverLabel.record[key as keyof typeof serverLabel.record][1] || key;
                return `${label}: ${value || "N/A"}`;
            })
            .join("\n");
    };
    
    const handleDownload = () => {
        const subject = "Record Details"; // Subject for file name
        const downloadContent = createDownloadContent(); // Create the content for download
    
        // Create a Blob object and trigger the download
        const blob = new Blob([downloadContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${subject} - ${record.name}.txt`; // File name with record name
        link.click();
    };
    
    return (
        <>
            {canViewContent && 
                <>
                    <h3>{record.name}</h3>
                    <div className="record-detail-container card">
                        {Object.entries(serverLabel.record)
                            .filter(
                                ([key]) => ![`${Label.otherLabels.nameOfUser}`, `${Label.otherLabels.editedTime}`].includes(key)
                            )
                            .map(([key, label]) => (
                                <LabelDetail
                                    key={key}
                                    label={label[1]}
                                    type={label[0]}
                                    link={record[key] as string}
                                    value={record[key] ? record[key].toString() : "N/A"}
                                />
                            )
                        )}
                        {canViewEditedDetail && (
                            <>
                                <LabelDetail
                                    label={serverLabel.record.nameOfUser[1]}
                                    value={record.nameOfUser || "N/A"}
                                    style={{ color: "hsl(173 58% 39%)" }} 
                                />
                                <LabelDetail
                                    label={serverLabel.record.editedTime[1]}
                                    value={record.editedTime || "N/A"}
                                    style={{ color: "hsl(173 58% 39%)" }} 
                                />
                            </>
                        )}
                    </div>
                    <div className="record-detail-button-container">
                        <Button 
                            label={Label.actions.sendEmail} 
                            onClick={handleSendEmail} 
                            className="button"
                            type="button"
                        />
                        <Button 
                            label={Label.actions.download} 
                            onClick={handleDownload} 
                            className="button"
                            type="button"
                        />
                        <Link to={`/edit/${record._id}`}>
                            <button className="action-edit">{Label.actions.edit}</button>
                        </Link>
                    </div>
                </>
            }
        </>
    );
}
