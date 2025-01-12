const fieldGroups: { [key: string]: string[] } = {
    all: [
        "name", "email", "level", "committeNotes", "members", "hudsonValley", "summary", "genre", 
        "link", "dates", "anotherGig", "gigIfYes", "shirtSizeXS", "shirtSizeS", "shirtSizeM", 
        "shirtSizeL", "shirtSizeXL", "shirtSizeXXL", "primaryContact", "primaryEmail", "primaryPhone", 
        "primaryAddress", "secondaryContact", "secondaryEmail", "secondaryPhone", "isNewToStreeFest", 
        "isWillingToFundraise", "anythingElse", "isAccepted", "nameOfUser", "editedTime"
    ],
    isAccepted: ["isAccepted"],
    emails: ["email", "primaryEmail", "secondaryEmail"],
    contacts: ["primaryContact", "primaryPhone", "secondaryContact", "secondaryPhone"],
    levels: ["level"],
    shirts: ["shirtSizeXS", "shirtSizeS", "shirtSizeM", "shirtSizeL", "shirtSizeXL", "shirtSizeXXL"],
};

export default fieldGroups;