// import Login from "./Login";
import { useState } from "react";
import CsvUpload from "../CsvUpload";
import { useUserContext } from "../../context/UserContext";
import useLabels from "../../hooks/UseLabels";

// import FormInput from "../util/FormInput";
// import LoginReminder from "../UI/LoginReminder";
// import "../styles/CreateRecord.css";


export default function UploadRecords() {
    const serverLabel = useLabels();
    const { currentUser } = useUserContext();
    const [form] = useState({
        [serverLabel.record.name]: "", 
        [serverLabel.record.email]: "", 
        [serverLabel.record.level]: "", 
        [serverLabel.record.committeNotes]: "", 
        [serverLabel.record.members]: 1,
        [serverLabel.record.hudsonValley]: false, 
        [serverLabel.record.shirtSizeXS]: 0, 
        [serverLabel.record.shirtSizeS]: 0, 
        [serverLabel.record.shirtSizeM]: 0,
        [serverLabel.record.shirtSizeL]: 0,
        [serverLabel.record.shirtSizeXL]: 0, 
        [serverLabel.record.shirtSizeXXL]: 0, 
        [serverLabel.record.primaryContact]: "",
        [serverLabel.record.primaryEmail]: "", 
        [serverLabel.record.primaryPhone]: "", 
        [serverLabel.record.primaryAddress]: "",
        [serverLabel.record.secondaryContact]: "", 
        [serverLabel.record.secondaryEmail]: "", 
        [serverLabel.record.secondaryPhone]: "", 
        [serverLabel.record.approval]: false,
        [serverLabel.record.nameOfUser]: currentUser?.name,
        [serverLabel.record.editedTime]: new Date().toLocaleDateString(),
    });
    return (
        <>
            <CsvUpload formFields={Object.keys(form)} />
        </>
    )
}