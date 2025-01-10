import { useEffect, useState } from "react";
import { RecordType } from "./types/RecordType";
import LabelDetail from "./helper/LabelDetail";
import Label from "../labels/formLabels.json";

export default function Records() {
    const [records, setRecords] = useState<RecordType[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>([]); // State to manage displayed fields

    // Define field groups for easy management
    const fieldGroups: { [key: string]: string[] } = {
        all: [
            "name", "email", "level", "committeNotes", "members", "hudsonValley", "summary", "genre", 
            "link", "dates", "anotherGig", "gigIfYes", "shirtSizeXS", "shirtSizeS", "shirtSizeM", 
            "shirtSizeL", "shirtSizeXL", "shirtSizeXXL", "primaryContact", "primaryEmail", "primaryPhone", 
            "primaryAddress", "secondaryContact", "secondaryEmail", "secondaryPhone", "isNewToStreeFest", 
            "isWillingToFundraise", "anythingElse", "isAccepted", "nameOfUser", "editedTime"
        ],
        isAccepted: ["isAccepted"],
        emails: ["email", "primaryEmail", "secondaryEmail"],
        contacts: ["primaryContact", "primaryPhone", "secondaryContact", "secondaryPhone"],
        shirts: ["shirtSizeXS", "shirtSizeS", "shirtSizeM", "shirtSizeL", "shirtSizeXL", "shirtSizeXXL"],
    };

    useEffect(() => {
        async function fetchRecords() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data: RecordType[] = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        }
        fetchRecords();
    }, []);

    if (records.length === 0) {
        return <p>{Label.actions.loading}</p>;
    }

    function handleFieldGroup(group: string) {
        setSelectedFields(fieldGroups[group]); // Update fields to display
    }

    const handleDownloadTextFile = (group: string) => {
        const subject = `Records - ${group}`;
        const emailBody = fieldGroups[group].map(field => {
            return records.map(record => {
                const value = record[field as keyof RecordType];
                return `${record.name} - ${Label.record[field as keyof typeof Label.record]}: ${
                    typeof value === "boolean"
                        ? value ? "Yes" : "No"
                        : field.includes("Email")
                        ? value || "N/A"
                        : field.includes("link")
                        ? value || "N/A"
                        : value || "N/A"
                }`;
            }).join("\n");
        }).join("\n\n");

        // Create a Blob with the email body and trigger a download
        const blob = new Blob([emailBody], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${subject}.txt`; // Name of the downloaded file
        link.click();
    };
    


    return (
        <section className="records-container">
            <h3>{Label.show.allRecords}</h3>
            <div className="records-header">
                <div className="record-header-button-container">
                    <button className="records-show-button" onClick={() => handleFieldGroup("all")}>{Label.show.showAll}</button>
                    <button className="records-data-button" onClick={() => handleDownloadTextFile("all")}>{Label.show.allRecords} Data</button>
                </div>
                <div className="record-header-button-container">
                    <button className="records-show-button" onClick={() => handleFieldGroup("isAccepted")}>{Label.show.showAccpeted}</button>
                    <button className="records-data-button" onClick={() => handleDownloadTextFile("isAccepted")}>{Label.record.isAccepted} Data</button>
                </div>
                <div className="record-header-button-container">
                    <button className="records-show-button" onClick={() => handleFieldGroup("emails")}>{Label.show.showEmails}</button>
                    <button className="records-data-button" onClick={() => handleDownloadTextFile("emails")}>{Label.record.email} Data</button>
                </div>
                <div className="record-header-button-container">
                    <button className="records-show-button" onClick={() => handleFieldGroup("contacts")}>{Label.show.showContacts}</button>
                    <button className="records-data-button" onClick={() => handleDownloadTextFile("contacts")}>{Label.record.contacts} Data</button>
                </div>
                <div className="record-header-button-container">
                    <button className="records-show-button" onClick={() => handleFieldGroup("shirts")}>{Label.show.showShirtSizes}</button>
                    <button className="records-data-button" onClick={() => handleDownloadTextFile("shirts")}>{Label.record.shirts} Data</button>
                </div>
            </div>
            {records.map((record) => (
                <div key={record._id} className="record-detail-container container-shadow all-record-container">
                    <h4>{record.name}</h4>
                    {selectedFields.map((field) => {
                        const value = record[field as keyof RecordType];
                        return (
                            <LabelDetail
                                key={field}
                                label={Label.record[field as keyof typeof Label.record]}
                                value={
                                    typeof value === "boolean"
                                        ? value ? "Yes" : "No"
                                        : field.includes("Email")
                                        ? <a href={`mailto:${value || ""}`}>{value || "N/A"}</a>
                                        : field.includes("link")
                                        ? <a ref={record.link}></a>
                                        : value
                                }
                            />
                        );
                    })}
                </div>
            ))}
        </section>
    );
}
