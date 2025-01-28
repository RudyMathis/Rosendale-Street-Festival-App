import { useState } from "react";
import CsvUpload from "./CsvUpload";
import { useUserContext } from "../../context/UserContext";
import useLabels from "../../hooks/UseLabels";
import Label from "../../labels/UILabel.json"
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

    const [labels] = useState({
        [Label.record.name]: "", 
        [Label.record.email]: "", 
        [Label.record.level]: "", 
        [Label.record.committeNotes]: "", 
        [Label.record.members]: 1,
        [Label.record.hudsonValley]: false, 
        [Label.record.shirtSizeXS]: 0, 
        [Label.record.shirtSizeS]: 0, 
        [Label.record.shirtSizeM]: 0,
        [Label.record.shirtSizeL]: 0,
        [Label.record.shirtSizeXL]: 0, 
        [Label.record.shirtSizeXXL]: 0, 
        [Label.record.primaryContact]: "",
        [Label.record.primaryEmail]: "", 
        [Label.record.primaryPhone]: "", 
        [Label.record.primaryAddress]: "",
        [Label.record.secondaryContact]: "", 
        [Label.record.secondaryEmail]: "", 
        [Label.record.secondaryPhone]: "", 
        [Label.record.approval]: false,
        [Label.record.nameOfUser]: currentUser?.name,
        [Label.record.editedTime]: new Date().toLocaleDateString(),
    })
    return (
        <>
            <CsvUpload formFields={Object.keys(form)} displayLabels={Object.keys(labels)} />
        </>
    )
}