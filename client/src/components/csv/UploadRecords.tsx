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
        [serverLabel.record.timestamp[0]]: "",
        [serverLabel.record.name[0]]: "", 
        [serverLabel.record.email[0]]: "",
        [serverLabel.record.volunteerStatus[0]]: false,
        [serverLabel.record.level[0]]: "", 
        [serverLabel.record.committeeNotes[0]]: "", 
        [serverLabel.record.members[0]]: 1,
        [serverLabel.record.hudsonValley[0]]: false,
        [serverLabel.record.summary[0]]: "",
        [serverLabel.record.genre[0]]: "", 
        [serverLabel.record.link[0]]: "",
        [serverLabel.record.website[0]]: "",
        [serverLabel.record.dates[0]]: "",
        [serverLabel.record.anotherGig[0]]: false,
        [serverLabel.record.gigIfYes[0]]: "",
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
        [serverLabel.record.isNewToStreeFest[0]]: false, 
        [serverLabel.record.isWillingToFundraise[0]]: false, 
        [serverLabel.record.anythingElse[0]]: "", 
        [serverLabel.record.isAccepted[0]]: false,
        [serverLabel.record.nameOfUser[0]]: currentUser?.name,
        [serverLabel.record.editedTime[0]]: new Date().toLocaleDateString('en-US'),
    });

    const [labels] = useState({
        [serverLabel.record.timestamp[1]]: "",
        [serverLabel.record.name[1]]: "", 
        [serverLabel.record.email[1]]: "", 
        [serverLabel.record.volunteerStatus[1]]: false,
        [serverLabel.record.level[1]]: "", 
        [serverLabel.record.committeeNotes[1]]: "", 
        [serverLabel.record.members[1]]: 1,
        [serverLabel.record.hudsonValley[1]]: false,
        [serverLabel.record.summary[1]]: "",
        [serverLabel.record.genre[1]]: "", 
        [serverLabel.record.link[1]]: "", 
        [serverLabel.record.website[1]]: "",
        [serverLabel.record.dates[1]]: "",
        [serverLabel.record.anotherGig[1]]: false,
        [serverLabel.record.gigIfYes[1]]: "",
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
        [serverLabel.record.isNewToStreeFest[1]]: false, 
        [serverLabel.record.isWillingToFundraise[1]]: false, 
        [serverLabel.record.anythingElse[1]]: "", 
        [serverLabel.record.isAccepted[1]]: false,
        [serverLabel.record.nameOfUser[1]]: currentUser?.name,
        [serverLabel.record.editedTime[1]]: new Date().toLocaleDateString('en-US'),
    })
    return (
        <>
            <CsvUpload formFields={Object.keys(form)} displayLabels={Object.keys(labels)} />
        </>
    )
}