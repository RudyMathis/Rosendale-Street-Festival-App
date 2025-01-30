import { useState } from "react";
import CsvUpload from "./CsvUpload";
import { useUserContext } from "../../context/UserContext";
import useLabels from "../../hooks/UseLabels";

export default function UploadRecords() {
    const serverLabel = useLabels();
    const { currentUser } = useUserContext();
    if (!serverLabel) {
        throw new Error('Labels context is null');
    }
    const [form] = useState({
        [serverLabel.record.name[0]]: "", 
        [serverLabel.record.email[0]]: "", 
        [serverLabel.record.level[0]]: "", 
        [serverLabel.record.committeNotes[0]]: "", 
        [serverLabel.record.members[0]]: 1,
        [serverLabel.record.hudsonValley[0]]: false, 
        [serverLabel.record.shirtSizeXS[0]]: 0, 
        [serverLabel.record.shirtSizeS[0]]: 0, 
        [serverLabel.record.shirtSizeM[0]]: 0,
        [serverLabel.record.shirtSizeL[0]]: 0,
        [serverLabel.record.shirtSizeXL[0]]: 0, 
        [serverLabel.record.shirtSizeXXL[0]]: 0, 
        [serverLabel.record.primaryContact[0]]: "",
        [serverLabel.record.primaryEmail[0]]: "", 
        [serverLabel.record.primaryPhone[0]]: "", 
        [serverLabel.record.primaryAddress[0]]: "",
        [serverLabel.record.secondaryContact[0]]: "", 
        [serverLabel.record.secondaryEmail[0]]: "", 
        [serverLabel.record.secondaryPhone[0]]: "", 
        [serverLabel.record.approval[0]]: false,
        [serverLabel.record.nameOfUser[0]]: currentUser?.name,
        [serverLabel.record.editedTime[0]]: new Date().toLocaleDateString(),
    });

    const [labels] = useState({
        [serverLabel.record.name[1]]: "", 
        [serverLabel.record.email[1]]: "", 
        [serverLabel.record.level[1]]: "", 
        [serverLabel.record.committeNotes[1]]: "", 
        [serverLabel.record.members[1]]: 1,
        [serverLabel.record.hudsonValley[1]]: false, 
        [serverLabel.record.shirtSizeXS[1]]: 0, 
        [serverLabel.record.shirtSizeS[1]]: 0, 
        [serverLabel.record.shirtSizeM[1]]: 0,
        [serverLabel.record.shirtSizeL[1]]: 0,
        [serverLabel.record.shirtSizeXL[1]]: 0, 
        [serverLabel.record.shirtSizeXXL[1]]: 0, 
        [serverLabel.record.primaryContact[1]]: "",
        [serverLabel.record.primaryEmail[1]]: "", 
        [serverLabel.record.primaryPhone[1]]: "", 
        [serverLabel.record.primaryAddress[1]]: "",
        [serverLabel.record.secondaryContact[1]]: "", 
        [serverLabel.record.secondaryEmail[1]]: "", 
        [serverLabel.record.secondaryPhone[1]]: "", 
        [serverLabel.record.approval[1]]: false,
        [serverLabel.record.nameOfUser[1]]: currentUser?.name,
        [serverLabel.record.editedTime[1]]: new Date().toLocaleDateString(),
    })
    return (
        <>
            {/* <CsvUpload formFields={Object.keys(form)} displayLabels={Object.keys(labels)} /> */}
            <CsvUpload formFields={Object.keys(form)} displayLabels={Object.keys(labels)} />
        </>
    )
}