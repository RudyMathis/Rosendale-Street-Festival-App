
import { useEffect, useState } from "react";
import { RecordType } from "../types/RecordType";
import { useRoleContext } from "../context/RoleContext";
import LabelDetail from "../UI/LabelDetail";
import useLabels from "../hooks/UseLabels";
import useRecords from "../hooks/UseRecords";
import Login from "./Login";
import LoginReminder from "../UI/LoginReminder";
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
    const [selected, setSelected] = useState('');
    const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null);
    const { canViewContent } = useRoleContext();
    const labels = useLabels();

    useEffect(() => {
        if (records) {
            setFilteredRecords(records);
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
        all: labels.otherLabels.all,
        levels: labels.record.fields.level,
        emails: labels.record.fields.email,
        contacts: labels.otherLabels.contacts,
        isAccepted: labels.record.fields.isAccepted,
        shirts: labels.otherLabels.shirts,
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
        
        // reset the filtered records
        setFilteredRecords(records); 
    }
    

    function handleLevelFilter(level: string) {
        if (!records) {
            return <ErrorMessage />;
        }

        const filtered = records.filter((record) => record.level.toLowerCase() === level.toLowerCase());
        setFilteredRecords(filtered);
        setSelected(level);
    }

    function handleIsAcceptedFilter(isAccepted: boolean) {
        if (!records) {
            return <ErrorMessage />;
        }

        const filtered = records.filter((record) => record.isAccepted === isAccepted);
        setFilteredRecords(filtered);
        setSelectedBoolean(isAccepted);
    }

    function handleShirtFilter(size: string) {
        if (!records) {
            return <ErrorMessage />;
        }

        const filtered = records.filter((record) => record[`shirtSize${size}` as keyof RecordType]);
    
        // Update the selected fields to only include the selected shirt size
        setSelectedFields([`shirtSize${size}`]);
        setFilteredRecords(filtered);
        setSelected(size);
    }

    function handleDownloadButtonClick(group: string) {
        setGroupToDownload(group);
        setIsModalOpen(true);
    }

    const handleConfirmAction = () => {
        if (groupToDownload) {
            handleDownloadTextFile(groupToDownload);
            setGroupToDownload(null); // Reset the state after action
        }

        setIsModalOpen(false);
    };
    

    const handleCancelDownload = () => {
        setGroupToDownload(null); // Reset download state
        setIsModalOpen(false);
    };
    
    
    function handleFilterReset() {
        setSelected('');
        setSelectedBoolean(null);
        if (records) {
            setFilteredRecords(records); // Reset to all records
        }
    }

    const handleDownloadTextFile = (group: string) => {
        const subject = `Records - ${FieldGroups[group]}`;
        const downloadBody = FieldGroups[group]
            .map((field) => {
                return filteredRecords
                    .map((record) => {
                        const value = record[field as keyof RecordType];
                        return `${record.name} - ${FieldGroups[group]}: ${
                            typeof value === "boolean"
                                ? value
                                    ? "Yes"
                                    : "No"
                                : field.includes("Email")
                                ? value || "N/A"
                                : field.includes("link")
                                ? value || "N/A"
                                : value || "N/A"
                        }`;
                    })
                    .join("\n");
            })
            .join("\n\n");
    
        const blob = new Blob([downloadBody], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${subject}.txt`;
        link.click();
    };
    
    
    return (
        <>
            {canViewContent ? 
                <section className="records-container">
                    <h3>{labels.record.fields.allRecords}</h3>
                    <Header
                        labels={labels}
                        selectedGroup={selectedGroup}
                        onFieldGroupChange={handleFieldGroup}
                        onDownloadButtonClick={handleDownloadButtonClick}
                        groupLabels={groupLabels}
                        downloadLabels={downloadLabels}
                        onFilterReset={handleFilterReset}
                    />
                    {selectedGroup === "levels" && (
                        <div className="filter-buttons-container">
                            <FilterButton
                                selected={selected === "low" ? "selected" : ""}
                                name="Low"
                                field="low"
                                onClick={() => handleLevelFilter("low")}
                            />
                            <FilterButton
                                selected={selected === "medium" ? "selected" : ""}
                                name="Medium"
                                field="medium"
                                onClick={() => handleLevelFilter("medium")}
                            />
                            <FilterButton
                                selected={selected === "high" ? "selected" : ""}
                                name="High"
                                field="high"
                                onClick={() => handleLevelFilter("high")}
                            />
                        </div>
                    )}
                    {selectedGroup === "isAccepted" && (
                        <div className="filter-buttons-container">
                            <FilterButton
                                selected={selectedBoolean === true ? "selected" : ""}
                                name="Accepted"
                                field="isAccepted"
                                onClick={() => handleIsAcceptedFilter(true)}
                            />
                            <FilterButton
                                selected={selectedBoolean === false ? "selected" : ""}
                                name="Not Accepted"
                                field="isAccepted"
                                onClick={() => handleIsAcceptedFilter(false)}
                            />
                        </div>
                    )}
                    {selectedGroup === "shirts" && (
                        <div className="filter-buttons-container">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <FilterButton
                                    selected={selected === size ? "selected" : ""}
                                    key={size}
                                    name={size}
                                    field={`shirtSize${size}`}
                                    onClick={() => handleShirtFilter(size)}
                                />
                            ))}
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
                        message={`Are you sure you want to download the records for ${groupToDownload}?`}
                        onConfirm={handleConfirmAction}
                        onCancel={handleCancelDownload}
                    />
                </section>
                : 
                <>
                    <LoginReminder />
                    <Login />
                </>
            }
        </>
    );
}