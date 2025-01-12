import { useState, useEffect } from "react";
import { LabelsType } from "../types/LabelsType";

export default function useLabels(): LabelsType | null {
    const [labels, setLabels] = useState<LabelsType | null>(null);

    useEffect(() => {
        async function fetchLabels() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/labels`);
                if (!response.ok) {
                    throw new Error("Failed to fetch labels");
                }
                const data: LabelsType = await response.json();
                setLabels(data);
            } catch (error) {
                console.error("Error fetching labels:", error);
            }
        }

        fetchLabels();
    }, []);

    return labels;
}
