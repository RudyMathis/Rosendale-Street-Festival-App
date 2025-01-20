
import { useEffect, useState } from "react";
import { RecordType } from "../types/RecordType";
import LabelDetail from "../UI/LabelDetail";
import useLabels from "../hooks/UseLabels";
import useRecords from "../hooks/UseRecords";
import ConfirmationModal from "./ComfirmationModal";
import FieldGroups from "../UI/FieldGroups";
import FilterButton from "../UI/FilterButton";
import Header from "./RecordsHeader";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/Records.css"

export default function Records() {
    const { records,  } = useRecords();
    const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null);
    const labels = useLabels();

    useEffect(() => {
        if (records) {
            setFilteredRecords(records); // Initialize with all records
        }
    }, [records]);

    useEffect(() => {
        setSelectedFields(FieldGroups["all"]);
    }, []);

    if (!records) {
        return <ErrorMessage />;
    }

    if (!labels) {
        return <ErrorMessage />;
    }

    if (records.length === 0) {
        return <p>{labels.actions.loading}</p>;
    }

    const groupLabels = {
        all: labels.show.showAll,
        levels: labels.show.showLevels,
        emails: labels.show.showEmails,
        contacts: labels.show.showContacts,
        isAccepted: labels.show.showAccpeted,
        shirts: labels.show.showShirtSizes,
    };

    const downloadLabels = {
        all: labels.download.downloadAll,
        levels: labels.download.downloadLevels,
        emails: labels.download.downloadEmails,
        contacts: labels.download.downloadContacts,
        isAccepted: labels.download.downloadAccpeted,
        shirts: labels.download.downloadShirtSizes,
    };

    function handleFieldGroup(group: string) {
        setSelectedFields(FieldGroups[group]);
        setSelectedGroup(group);

        if (!records) {
            return <ErrorMessage />;
        }
    
        if (group === "isAccepted") {
            const filtered = records.filter((record) => record.isAccepted);
            setFilteredRecords(filtered);
        } else if (group === "levels") {
            // Levels filtering will be handled separately
            setFilteredRecords(records);
        } else {
            setFilteredRecords(records); // Reset to all records for other groups
        }
    }
    

    function handleLevelFilter(level: string) {
        if (!records) {
            return <ErrorMessage />;
        }
        const filtered = records.filter((record) => record.level.toLowerCase() === level.toLowerCase());
        setFilteredRecords(filtered);
    }

    function handleIsAcceptedFilter(isAccepted: boolean) {
        if (!records) {
            return <ErrorMessage />;
        }
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
                return `${record.name} - ${labels.record[field as keyof typeof labels.record]}: ${
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
            <h3>{labels.show.allRecords}</h3>
            <Header
                labels={labels}
                selectedGroup={selectedGroup}
                onFieldGroupChange={handleFieldGroup}
                onDownloadButtonClick={handleDownloadButtonClick}
                groupLabels={groupLabels}
                downloadLabels={downloadLabels}
            />
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
            {selectedGroup === "isAccepted" && (
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
            )}
            {filteredRecords.map((record) => (
                <div key={record._id} className="record-detail-container container-shadow all-record-container">
                    <h4>{record.name}</h4>
                    {selectedFields.map((field) => (
                        <LabelDetail
                            key={field}
                            label={labels.record.fields[field]}
                            value={String(record[field as keyof RecordType]) || "N/A"}
                            />
                    ))}
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