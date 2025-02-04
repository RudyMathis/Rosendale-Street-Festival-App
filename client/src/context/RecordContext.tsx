import { createContext, useState, useEffect, ReactNode } from "react";
import { RecordType } from "../types/RecordType";
import LoadingMessage from "../UI/LoadingMessage";

export const RecordContext = createContext<{
    records: RecordType[] | null;
    setRecords: React.Dispatch<React.SetStateAction<RecordType[] | null>>;
    refreshRecords: () => void;
    fetchRecordById: (id: string) => Promise<RecordType | null>;
} | null>(null);

export const RecordProvider = ({ children }: { children: ReactNode }) => {
    const [records, setRecords] = useState<RecordType[] | null>(null);
    const [refreshKey, setRefreshKey] = useState(0); // This will force re-fetching when incremented
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data: RecordType[] = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Error fetching records:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [refreshKey]);
    const refreshRecords = () => setRefreshKey((key) => key + 1);
    const fetchRecordById = async (id: string): Promise<RecordType | null> => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`
            );

            if (!response.ok) {
                throw new Error("Record not found");
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching record with id ${id}:`, error);
            return null;
        }
    };

    if (loading) {
        return <LoadingMessage />;
    }

    return (
        <RecordContext.Provider value={{ records, setRecords, refreshRecords, fetchRecordById }}>
            {children}
        </RecordContext.Provider>
    );
};
