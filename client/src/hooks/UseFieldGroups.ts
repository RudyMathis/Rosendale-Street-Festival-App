
import useLabels from "./UseLabels";

const useFieldGroups = () => {
  const serverLabel = useLabels();

  if (!serverLabel) {
    throw new Error('Labels context is null');
  }

  const fieldGroups: { [key: string]: string[] } = {
    all: [
      `${serverLabel.record.name}`,
      `${serverLabel.record.email}`,
      `${serverLabel.record.level}`,
      `${serverLabel.record.committeNotes}`,
      `${serverLabel.record.members}`,
      `${serverLabel.record.hudsonValley}`,
      `${serverLabel.record.summary}`,
      `${serverLabel.record.genre}`,
      `${serverLabel.record.link}`, 
      `${serverLabel.record.dates}`, 
      `${serverLabel.record.anotherGig}`,
      `${serverLabel.record.gigIfYes}`,
      `${serverLabel.record.shirtSizeXS}`,
      `${serverLabel.record.shirtSizeS}`,
      `${serverLabel.record.shirtSizeM}`,
      `${serverLabel.record.shirtSizeL}`,
      `${serverLabel.record.shirtSizeXL}`,
      `${serverLabel.record.shirtSizeXXL}`,
      `${serverLabel.record.primaryContact}`,
      `${serverLabel.record.primaryEmail}`,
      `${serverLabel.record.primaryPhone}`,
      `${serverLabel.record.primaryAddress}`,
      `${serverLabel.record.secondaryContact}`,
      `${serverLabel.record.secondaryEmail}`,
      `${serverLabel.record.secondaryPhone}`,
      `${serverLabel.record.isNewToStreeFest}`,
      `${serverLabel.record.isWillingToFundraise}`,
      `${serverLabel.record.anythingElse}`,
      `${serverLabel.record.isAccepted}`,
      `${serverLabel.record.nameOfUser}`,
      `${serverLabel.record.editedTime}`
    ],
    isAccepted: [`${serverLabel.record.isAccepted}`],
    emails: [`${serverLabel.record.email}`, `${serverLabel.record.primaryEmail}`, `${serverLabel.record.secondaryEmail}`],
    contacts: [
      `${serverLabel.record.primaryContact}`,
      `${serverLabel.record.primaryPhone}`,
      `${serverLabel.record.secondaryContact}`,
      `${serverLabel.record.secondaryPhone}`
    ],
    levels: [`${serverLabel.record.level}`],
    shirts: [
      `${serverLabel.record.shirtSizeXS}`,
      `${serverLabel.record.shirtSizeS}`,
      `${serverLabel.record.shirtSizeM}`,
      `${serverLabel.record.shirtSizeL}`,
      `${serverLabel.record.shirtSizeXL}`,
      `${serverLabel.record.shirtSizeXXL}`
    ]
  };

  return fieldGroups;
};

export default useFieldGroups;