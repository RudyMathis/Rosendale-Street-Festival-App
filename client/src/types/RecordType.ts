    /******************************************* 
     ******************************************* 
    ******************************************* 
    Update this if changes are made to the form
    *******************************************
    *******************************************
    *******************************************/

export type RecordType = {
    [key: string]: unknown;
    _id: string;
    timestamp: string;
    name: string;
    email: string;
    volunteerStatus: boolean;
    level: string;
    committeeNotes: string;
    members: number;
    hudsonValley: boolean;
    summary: string;
    genre: string;
    link: string;
    website: string;
    dates: string;
    anotherGig: boolean;
    gigIfYes: string;
    shirtSizeXS: number;
    shirtSizeS: number;
    shirtSizeM: number;
    shirtSizeL: number;
    shirtSizeXL: number;
    shirtSizeXXL: number;
    primaryContact: string;
    primaryEmail: string;
    primaryPhone: string;
    primaryAddress: string;
    secondaryContact: string;
    secondaryEmail: string;
    secondaryPhone: string;
    isNewToStreeFest: boolean;
    isWillingToFundraise: boolean;
    anythingElse: string;
    isAccepted: boolean;
    nameOfUser: string;
    editedTime: string;
    isDemoData: boolean;
};