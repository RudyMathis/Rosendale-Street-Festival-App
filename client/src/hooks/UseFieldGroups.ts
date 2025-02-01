
import useLabels from "./UseLabels";

const useFieldGroups = () => {
  const serverLabel = useLabels();

  if (!serverLabel) {
    throw new Error('Labels context is null');
  }

  const fieldGroups: { [key: string]: string[] } = {
    all: [
      `${serverLabel.record.name[0]}`,
      `${serverLabel.record.email[0]}`,
      `${serverLabel.record.level[0]}`,
      `${serverLabel.record.committeeNotes[0]}`,
      `${serverLabel.record.members[0]}`,
      `${serverLabel.record.hudsonValley[0]}`,
      `${serverLabel.record.summary[0]}`,
      `${serverLabel.record.genre[0]}`,
      `${serverLabel.record.link[0]}`, 
      `${serverLabel.record.dates[0]}`, 
      `${serverLabel.record.anotherGig[0]}`,
      `${serverLabel.record.gigIfYes[0]}`,
      `${serverLabel.record.shirtSizeXS[0]}`,
      `${serverLabel.record.shirtSizeS[0]}`,
      `${serverLabel.record.shirtSizeM[0]}`,
      `${serverLabel.record.shirtSizeL[0]}`,
      `${serverLabel.record.shirtSizeXL[0]}`,
      `${serverLabel.record.shirtSizeXXL[0]}`,
      `${serverLabel.record.primaryContact[0]}`,
      `${serverLabel.record.primaryEmail[0]}`,
      `${serverLabel.record.primaryPhone[0]}`,
      `${serverLabel.record.primaryAddress[0]}`,
      `${serverLabel.record.secondaryContact[0]}`,
      `${serverLabel.record.secondaryEmail[0]}`,
      `${serverLabel.record.secondaryPhone[0]}`,
      `${serverLabel.record.isNewToStreeFest[0]}`,
      `${serverLabel.record.isWillingToFundraise[0]}`,
      `${serverLabel.record.anythingElse[0]}`,
      `${serverLabel.record.isAccepted[0]}`,
      `${serverLabel.record.nameOfUser[0]}`,
      `${serverLabel.record.editedTime[0]}`
    ],
    isAccepted: [`${serverLabel.record.isAccepted[0]}`],
    emails: [`${serverLabel.record.email[0]}`, `${serverLabel.record.primaryEmail[0]}`, `${serverLabel.record.secondaryEmail[0]}`],
    contacts: [
      `${serverLabel.record.primaryContact[0]}`,
      `${serverLabel.record.primaryPhone[0]}`,
      `${serverLabel.record.secondaryContact[0]}`,
      `${serverLabel.record.secondaryPhone[0]}`
    ],
    levels: [`${serverLabel.record.level[0]}`],
    shirts: [
      `${serverLabel.record.shirtSizeXS[0]}`,
      `${serverLabel.record.shirtSizeS[0]}`,
      `${serverLabel.record.shirtSizeM[0]}`,
      `${serverLabel.record.shirtSizeL[0]}`,
      `${serverLabel.record.shirtSizeXL[0]}`,
      `${serverLabel.record.shirtSizeXXL[0]}`
    ],
    primaryPhone: [`${serverLabel.record.primaryPhone[0]}`],
    members: [`${serverLabel.record.members[0]}`],
    committeeNotes: [`${serverLabel.record.committeeNotes[0]}`]
  };

  return fieldGroups;
};

export default useFieldGroups;