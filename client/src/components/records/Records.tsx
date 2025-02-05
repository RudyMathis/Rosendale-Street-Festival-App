import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecordType } from "../../types/RecordType";
import { useRoleContext } from "../../context/RoleContext";
import Header from "./RecordsHeader";
import Login from "../Login";
import ConfirmationModal from "../ConfirmationModal";
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
    const [count, setCount] = useState(0);
    const [, setSelectedBoolean] = useState<boolean | null | undefined>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToDownload, setGroupToDownload] = useState<string | null>(null);
    const { canViewContent, canViewEditedDetail } = useRoleContext();
    const { downloadTextFile } = useDownloadTextFile(fieldGroups, selectedFields, filteredRecords, serverLabel);

    useEffect(() => {
        if (records) {
            setFilteredRecords(records);
            setCount(records.length);
        }
    }, [records]);

    useEffect(() => {
        setSelectedFields(fieldGroups["all"]);
    }, []);

    if (!records || records.length === 0) {
        return <SystemMessage
                    title="Error"
                    message="Missing Records"
                />
    }

    const groupLabels = {
        all: Label.group.all,
        levels: Label.group.levels,
        emails: Label.group.emails,
        contacts: Label.group.contacts,
        isAccepted: Label.group.accepted,
        shirts: Label.group.shirtSizes,
        members: Label.group.members,
        committeeNotes: Label.group.committeeNotes,
    };

    const downloadLabels = {
        all: Label.download.all,
        levels: Label.download.levels,
        emails: Label.download.emails,
        contacts: Label.download.contacts,
        isAccepted: Label.download.accepted,
        shirts: Label.download.shirtSizes,
        members: Label.download.members,
        committeeNotes: Label.download.committeeNotes,
    };

    /*******************************************************************/
    /***************************HEADER FILTERS**************************/
    /*******************************************************************/

    function handleLevelFilter(level: string) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Level Filter"
                    />
        }

        const filtered = records.filter((record) => record.level === level);

        setFilteredRecords(filtered);
        setSelected(level);
        setCount(filtered.length);
    }
    function handleEmailFilter(email: string) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Email Filter"
                    />
        }

        const filtered = records.filter((record) => record[`${email}Email`]);

        setSelectedFields([`${email}Email`]);
        setFilteredRecords(filtered);
        setSelected(email);
        setCount(filtered.length);
    }

    function handleContactFilter(contact: string) {
        if (!records) {
            return (
                <SystemMessage
                    title="Error"
                    message="Missing Contact Filter"
                />
            );
        }
    
             // Filter the records where both the contact and phone fields exist
            const filtered = records.filter((record) => {
            const contactField = record[`${contact}Contact`];
            const phoneField = record[`${contact}Phone`];
            
            // Check if both contact and phone fields exist and are non-empty
            return contactField && phoneField;
        });
    
        setSelectedFields([`${contact}Contact`, `${contact}Phone`]); 
        setFilteredRecords(filtered);
        setSelected(contact);
        setCount(filtered.length);
    }
    

    function handleIsAcceptedFilter(accept: string) {
        if (!records) {
            return (
                <SystemMessage
                    title="Error"
                    message="Missing Accepted Filter"
                />
            );
        }
    
        let isAccepted: boolean | null = null;
    
        // Map the accept string to its corresponding value
        if (accept === "Accepted") {
            isAccepted = true;
        } else if (accept === "Not Accepted") {
            isAccepted = false;
        } else if (accept === "Pending") {
            isAccepted = null;
        }
    
        let filtered;
        if (isAccepted === null) {
            // Filter for records where isAccepted is either false or null
            filtered = records.filter((record) => record.isAccepted === null);
        } else {
            filtered = records.filter((record) => record.isAccepted === isAccepted);
        }
    
        setFilteredRecords(filtered);
        setSelectedBoolean(isAccepted);
        setCount(filtered.length);
    }
    

    function handleShirtFilter(size: string) {
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Shirt Filter"
                    />
        }

        const filtered = records.filter((record) => record[`shirtSize${size}`]);

        // Update the selected fields to only include the selected shirt size
        setSelectedFields([`shirtSize${size}`]);
        setFilteredRecords(filtered);
        setSelected(size);
        setCount(filtered.length);
    }

    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/

    function handleDownloadButtonClick(group: string) {
        setGroupToDownload(group);
        setIsModalOpen(true);
    }

    function handleFieldGroup(group: string) {
        setSelectedFields(fieldGroups[group]);
        setSelectedGroup(group);
    
        if (!records) {
            return <SystemMessage
                        title="Error"
                        message="Missing Shirt Filter"
                    />
        }

        const filtered = records.filter((record) => {
            // Get the fields associated with this group
            const groupFields = fieldGroups[group];

            // Check if at least one field in the group has a valid value
            return groupFields.some((field) => {
                const value = record[field];
                return value !== null && value !== undefined && value !== ""; // Allow only non-empty values
            });
        });
    
        setFilteredRecords(filtered);
        setCount(filtered.length);
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
        setSelectedBoolean(undefined);
    }
    
    return (
        <>
            {canViewContent ? 
                <section className="records-container">
                    <h3>{count} Records</h3>
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
                            {["Low", "Medium", "High"].map((level) => (
                                <FilterButton
                                    selected={selected === level ? "selected" : ""}
                                    key={level}
                                    name={level}
                                    onClick={() => handleLevelFilter(level)}
                                />
                            ))}
                        </div>
                    )}
                    {selectedGroup === "emails" && (
                        <div className="filter-buttons-container">
                            {["primary", "secondary"].map((email) => (
                                <FilterButton
                                    selected={selected === email ? "selected" : ""}
                                    key={email}
                                    name={email}
                                    field={`${email}Email`}
                                    onClick={() => handleEmailFilter(email)}
                                />
                            ))}
                        </div>
                    )}
                    {selectedGroup === "contacts" && (
                        <div className="filter-buttons-container">
                            {["primary", "secondary"].map((contact) => (
                                <FilterButton
                                    selected={selected === contact ? "selected" : ""}
                                    key={contact}
                                    name={contact}
                                    field={`${contact}Contact`}
                                    onClick={() => handleContactFilter(contact)}
                                />
                            ))}
                        </div>
                    )}
                    {selectedGroup === "isAccepted" && (
                        <div className="filter-buttons-container">
                            {["Accepted", "Not Accepted", "Pending"].map((accept) => (
                                <FilterButton
                                    selected={selected === accept ? "selected" : ""}
                                    key={accept}
                                    name={accept}
                                    onClick={() => handleIsAcceptedFilter(accept)}
                                />
                            ))}
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
                    {Array.isArray(filteredRecords) &&
                        filteredRecords.map((record) => (
                            <section key={record._id}>
                                <Link to={`/record/${record._id}`}>
                                    <h2 className="record-title">{record.name}</h2>
                                </Link>
                                <div className="record-detail-button-container card">
                                    <ul className="label-detail-ul">
                                        {Array.isArray(selectedFields) &&
                                            selectedFields
                                                .filter(
                                                    (field) =>
                                                    ![serverLabel.record.nameOfUser[0], serverLabel.record.editedTime[0]].includes(field)
                                                )
                                                .map((field) => (
                                                    <LabelDetail
                                                        key={field}
                                                        type={field}
                                                        label={serverLabel.record[field]?.[1] || field}
                                                        value={String(record[field as keyof RecordType]) || "N/A"}
                                                    />
                                                ))}
                                            {canViewEditedDetail && selectedGroup === "all" && (
                                                <>
                                                    <LabelDetail
                                                        label={serverLabel.record.nameOfUser[1]}
                                                        value={record.nameOfUser || "N/A"}
                                                        type={serverLabel.record.nameOfUser[0]}
                                                        style={{ color: "hsl(173 58% 39%)" }}
                                                    />
                                                    <LabelDetail
                                                        label={serverLabel.record.editedTime[1]}
                                                        value={record.editedTime || "N/A"}
                                                        type={serverLabel.record.editedTime[0]}
                                                        style={{ color: "hsl(173 58% 39%)" }}
                                                    />
                                                </>
                                            )
                                        }
                                    </ul>
                                </div>
                            </section>
                            )   
                        )
                    }
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