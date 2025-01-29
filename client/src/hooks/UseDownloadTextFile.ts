import { useCallback } from "react";

type Labels = {
    [key: string]: Record<string, string>;
}

const useDownloadTextFile = (
    FieldGroups: Record<string, string[]>,
    filteredRecords: Record<string, unknown>[],
    Labels: Labels
) => {
    const downloadTextFile = useCallback(
        (group: string) => {
            const subject = `Records - ${group}`;
            const fieldsToDownload = FieldGroups[group] || []; // Get fields for the group

            const downloadBody = filteredRecords
                .map((record) => {
                    const recordLines = fieldsToDownload.map((field) => {
                        const label = Labels.record[field]?.[1] || field; // Get second value from label array
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
        [FieldGroups, filteredRecords, Labels]
    );

    return { downloadTextFile };
};


export default useDownloadTextFile;
