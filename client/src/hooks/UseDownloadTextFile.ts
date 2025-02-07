import { useCallback } from "react";
/**
 * This hook provides a function to download a text file containing
 * records grouped by a given field.
 *
 * The function takes two parameters:
 *   - group: the name of the field to group the records by
 *   - selectedFields: an array of field names to include in the download
 *   - filteredRecords: an array of records filtered by the selected fields
 *   - Labels: an object containing labels for the fields
 *
 * The function returns a new function that can be called to download the text file.
 * The returned function takes a single parameter, the name of the field to group the records by.
 * The function will create a text file with the records grouped by the given field.
 * The records will contain the values of the selected fields.
 * The file will be named after the field used to group the records.
 * The file will have a ".txt" extension.
 *
 * The function is memoized using useCallback to prevent it from being recreated on every render.
 */
type Labels = {
    [key: string]: Record<string, string>;
}

const useDownloadTextFile = (
    FieldGroups: Record<string, string[]>,
    selectedFields: string[],
    filteredRecords: Record<string, unknown>[],
    Labels: Labels
) => {
    const downloadTextFile = useCallback(
        (group: string) => {
            const subject = `Records - ${group}`;
            const fieldsToDownload = selectedFields.length > 0 ? selectedFields : (FieldGroups[group] || []);

            const downloadBody = filteredRecords
                .map((record) => {
                    const recordLines = fieldsToDownload.map((field) => {
                        const label = Labels.record[field]?.[1] || field;
                        const value = record[field as keyof typeof record];

                        return `${label}: ${
                            typeof value === "boolean"
                                ? value
                                    ? "Yes"
                                    : "No"
                                : value || "N/A"
                        }`;
                    });

                    return `Name: ${record.name}\n${recordLines.join("\n")}`;
                })
                .join("\n\n");

            const blob = new Blob([downloadBody], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${subject}.txt`;
            link.click();
        },
        [FieldGroups, selectedFields, filteredRecords, Labels]
    );

    return { downloadTextFile };
};

export default useDownloadTextFile;

