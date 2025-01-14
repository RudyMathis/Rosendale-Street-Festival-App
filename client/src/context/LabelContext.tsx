import  { createContext, useState, useEffect, ReactNode } from "react";
import { LabelsType } from "../types/LabelsType";
import Loading from "../UI/LoadingMessage";

export const LabelContext = createContext<LabelsType | null>(null);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
    const [labels, setLabels] = useState<LabelsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/labels`);
                if (!response.ok) {
                    throw new Error("Failed to fetch labels");
                }
                const data: LabelsType = await response.json();
                setLabels(data);
            } catch (error) {
                console.error("Error fetching labels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabels();
    }, []);

    if (loading) {
        return <Loading message="Loading data from the server..." />;
    }

    return <LabelContext.Provider value={labels}>{children}</LabelContext.Provider>;
};
