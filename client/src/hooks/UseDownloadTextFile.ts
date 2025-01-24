import { useCallback } from "react";

const useDownloadTextFile = (FieldGroups: Record<string, string[]>, filteredRecords: Record<string, unknown>[]) => {
    const downloadTextFile = useCallback(
        (group: string) => {
            const subject = `Records - ${FieldGroups[group]}`;
            const downloadBody = FieldGroups[group]
                .map((field) => {
                    return filteredRecords
                        .map((record) => {
                            const value = record[field as keyof typeof record];
                            return `${record.name} - ${FieldGroups[group]}: ${
                                typeof value === "boolean"
                                    ? value
                                        ? "Yes"
                                        : "No"
                                    : field.includes("Email")
                                    ? value || "N/A"
                                    : field.includes("link")
                                    ? value || "N/A"
                                    : value || "N/A"
                            }`;
                        })
                        .join("\n");
                })
                .join("\n\n");
    
            const blob = new Blob([downloadBody], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${subject}.txt`;
            link.click();
        },
        [FieldGroups, filteredRecords]
    );

    return { downloadTextFile };
};

export default useDownloadTextFile;
