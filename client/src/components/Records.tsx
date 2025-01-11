import { useEffect, useState } from "react";
import { RecordType } from "./types/RecordType";
import LabelDetail from "./helper/LabelDetail";
import Label from "../labels/formLabels.json";
import ConfirmationModal from "./ComfirmationModal";

export default function Records() {
    const [records, setRecords] = useState<RecordType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null); // Track the group for download

    const groupLabels = {
        all: Label.show.showAll,
        isAccepted: Label.show.showAccpeted,
        emails: Label.show.showEmails,
        contacts: Label.show.showContacts,
        shirts: Label.show.showShirtSizes,
    };

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

    useEffect(() => {
        setSelectedFields(fieldGroups["all"]);
    }, []);

    if (records.length === 0) {
        return <p>{Label.actions.loading}</p>;
    }

    function handleFieldGroup(group: string) {
        setSelectedFields(fieldGroups[group]);
        setSelectedGroup(group);
    }

    // Handle the button click to trigger the download confirmation
    function handleDownloadButtonClick(group: string) {
        setGroupToDownload(group);
        setIsModalOpen(true);
    }

    // Proceed with the file download
    const handleConfirmDownload = () => {
        if (groupToDownload) {
            handleDownloadTextFile(groupToDownload);
        }
        setIsModalOpen(false);
    };

    // Cancel the download
    const handleCancelDownload = () => {
        setIsModalOpen(false);
    };

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

        const blob = new Blob([emailBody], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${subject}.txt`;
        link.click();
    };

    return (
        <section className="records-container">
            <h3>{Label.show.allRecords}</h3>
            <div className="records-header">
                {Object.keys(fieldGroups).map((group) => (
                    <div key={group} className="record-header-button-container">
                        <button
                            className={`records-show-button ${selectedGroup === group ? 'selected' : ''}`}
                            onClick={() => handleFieldGroup(group)}
                        >
                            {groupLabels[group as keyof typeof groupLabels]}
                        </button>
                        <button
                            className="records-data-button"
                            onClick={() => handleDownloadButtonClick(group)}
                        >
                            {Label.show[`${group}Records` as keyof typeof Label.show] ?? `${group} Data`}
                        </button>
                    </div>
                ))}
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
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                message="Are you sure you want to download this file?"
                onConfirm={handleConfirmDownload}
                onCancel={handleCancelDownload}
            />
        </section>
    );
}
