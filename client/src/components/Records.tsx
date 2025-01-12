
import { useEffect, useState } from "react";
import { RecordType } from "./types/RecordType";
import LabelDetail from "./helper/LabelDetail";
import Label from "../labels/formLabels.json";
import ConfirmationModal from "./ComfirmationModal";
import FieldGroups from "./helper/FieldGroups";
import FilterButton from "./helper/FilterButton";

export default function Records() {
    const [records, setRecords] = useState<RecordType[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null);

    const groupLabels = {
        all: Label.show.showAll,
        isAccepted: Label.show.showAccpeted,
        emails: Label.show.showEmails,
        contacts: Label.show.showContacts,
        levels: Label.show.showLevels,
        shirts: Label.show.showShirtSizes,
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
                setFilteredRecords(data); // Initialize with all records
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        }
        fetchRecords();
    }, []);

    useEffect(() => {
        setSelectedFields(FieldGroups["all"]);
    }, []);

    if (records.length === 0) {
        return <p>{Label.actions.loading}</p>;
    }

    function handleFieldGroup(group: string) {
        setSelectedFields(FieldGroups[group]);
        setSelectedGroup(group);
        if (group !== "levels") {
            setFilteredRecords(records); // Reset to all records for other groups
        }

        if (group != "isAccepted") {
            const filtered = records.filter((record) => record.isAccepted);
            setFilteredRecords(filtered);
        }
    }

    function handleLevelFilter(level: string) {
        const filtered = records.filter((record) => record.level.toLowerCase() === level.toLowerCase());
        setFilteredRecords(filtered);
    }

    function handleIsAcceptedFilter(isAccepted: boolean) {
        const filtered = records.filter((record) => record.isAccepted === isAccepted);
        setFilteredRecords(filtered);
    }

    // Handle the button click to trigger the download confirmation
    function handleDownloadButtonClick(group: string) {
        setGroupToDownload(group);
        setIsModalOpen(true);
    }

    const handleConfirmDownload = () => {
        if (groupToDownload) {
            handleDownloadTextFile(groupToDownload);
        }
        setIsModalOpen(false);
    };

    const handleCancelDownload = () => {
        setIsModalOpen(false);
    };

    const handleDownloadTextFile = (group: string) => {
        const subject = `Records - ${group}`;
        const emailBody = FieldGroups[group].map(field => {
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
                {Object.keys(FieldGroups).map((group) => (
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
            {selectedGroup === "levels" && (
                <div className="filter-buttons-container">
                    <FilterButton
                        name="Low"
                        field="low"
                        onClick={() => handleLevelFilter("low")}
                    />
                    <FilterButton
                        name="Medium"
                        field="medium"
                        onClick={() => handleLevelFilter("medium")}
                    />
                    <FilterButton
                        name="High"
                        field="high"
                        onClick={() => handleLevelFilter("high")}
                    />
                </div>
            )}
            {selectedGroup === "isAccepted" ? (
                <div className="filter-buttons-container">
                    <FilterButton
                        name="Accepted"
                        field="isAccepted"
                        onClick={() => handleIsAcceptedFilter(true)}
                    />
                    <FilterButton
                        name="Not Accepted"
                        field="isAccepted"
                        onClick={() => handleIsAcceptedFilter(false)}
                    />
                </div>
            ) : null}
            {filteredRecords.map((record) => (
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
            <ConfirmationModal
                isOpen={isModalOpen}
                message="Are you sure you want to download this file?"
                onConfirm={handleConfirmDownload}
                onCancel={handleCancelDownload}
            />
        </section>
    );
}
