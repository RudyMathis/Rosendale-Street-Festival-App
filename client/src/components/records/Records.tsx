import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecordType } from "../../types/RecordType";
import { useRoleContext } from "../../context/RoleContext";
import Header from "./RecordsHeader";
import Login from "../Login";
import ConfirmationModal from "../ComfirmationModal";
import useRecords from "../../hooks/UseRecords";
import useFieldGroups from "../../hooks/UseFieldGroups";
import useDownloadTextFile  from "../../hooks/UseDownloadTextFile";
import useLabels from "../../hooks/UseLabels";
import FilterButton from "../../util/FilterButton";
import SystemMessage from "../../util/SystemMessage";
import LabelDetail from "../../UI/LabelDetail";
import LoginReminder from "../../UI/LoginReminder";
import Label from "../../labels/UILabel.json"
import "../../styles/Records.css";


export default function Records() {
    const { records,  } = useRecords();
    const fieldGroups = useFieldGroups();
    const serverLabel = useLabels();
    const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("all");
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [selected, setSelected] = useState('');
    const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null);
    const { canViewContent } = useRoleContext();
    const { downloadTextFile } = useDownloadTextFile(fieldGroups, filteredRecords, serverLabel);

    useEffect(() => {
        if (records) {
            setFilteredRecords(records);
        }
    }, [records]);

    useEffect(() => {
        setSelectedFields(fieldGroups["all"]);
    }, []);

    if (!records) {
        return <SystemMessage
                    title="Error"
                    message="Missing Records"
                    type="Error"
                    parentElement="div"
                />
    }

    if (records.length === 0) {
        return <p>{Label.actions.loading}</p>; // fix this
    }

    const groupLabels = {
        all: Label.otherLabels.all,
        levels: serverLabel.record.level[1],
        emails: serverLabel.record.email[1],
        contacts: Label.otherLabels.contacts,
        isAccepted: serverLabel.record.isAccepted[1],
        shirts: Label.otherLabels.shirts,
    };

    const downloadLabels = {
        all: Label.download.downloadAll,
        levels: Label.download.downloadLevels,
        emails: Label.download.downloadEmails,
        contacts: Label.download.downloadContacts,
        isAccepted: Label.download.downloadAccpeted,
        shirts: Label.download.downloadShirtSizes,
    };

    function handleFieldGroup(group: string) {
        setSelectedFields(fieldGroups[group]);
        setSelectedGroup(group);
        
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Field Group"
                        type="Error"
                        parentElement="div"
                    />
        }
        
        // reset the filtered records
        setFilteredRecords(records); 
    }
    
    function handleLevelFilter(level: string) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Level Filter"
                        type="Error"
                        parentElement="div"
                    />
        }

        const filtered = records.filter((record) => record.level === level);
        setFilteredRecords(filtered);
        setSelected(level);
    }

    function handleIsAcceptedFilter(isAccepted: boolean) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Accepted Filter"
                        type="Error"
                        parentElement="div"
                    />
        }

        const filtered = records.filter((record) => record.isAccepted === isAccepted);
        setFilteredRecords(filtered);
        setSelectedBoolean(isAccepted);
    }

    function handleShirtFilter(size: string) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Shirt Filter"
                        type="Error"
                        parentElement="div"
                    />
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
            downloadTextFile(groupToDownload);
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

    return (
        <>
            {canViewContent ? 
                <section className="records-container">
                    <h3>{Label.displayRecords.all}</h3>
                    <Header
                        labels={serverLabel}
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
                                selected={selected === "Low" ? "selected" : ""}
                                name="Low"
                                field="low"
                                onClick={() => handleLevelFilter("Low")}
                            />
                            <FilterButton
                                selected={selected === "Medium" ? "selected" : ""}
                                name="Medium"
                                field="medium"
                                onClick={() => handleLevelFilter("Medium")}
                            />
                            <FilterButton
                                selected={selected === "High" ? "selected" : ""}
                                name="High"
                                field="high"
                                onClick={() => handleLevelFilter("High")}
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
                    {/* Bugged when downloading specific shirt sizes all shirt sizes for the record show up */}
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
                        <div key={record._id} className="record-detail-container card all-record-container">
                            <Link to={`/record/${record._id}`}><h4>{record.name}</h4></Link>
                            {selectedFields.map((field) => (
                                <LabelDetail
                                    key={field}
                                    label={serverLabel.record[field][1]}
                                    value={String(record[field as keyof RecordType]) || "N/A"} 
                                />
                            ))}
                        </div>
                    ))}
                    <div className="confirmation-modal-container">
                        <ConfirmationModal
                            isOpen={isModalOpen}
                            message={`Are you sure you want to download the records for ${groupToDownload}?`}
                            onConfirm={handleConfirmAction}
                            onCancel={handleCancelDownload}
                        />
                    </div>
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