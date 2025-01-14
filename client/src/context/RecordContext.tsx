import { createContext, useState, useEffect, ReactNode } from "react";
import { RecordType } from "../types/RecordType";
import Loading from "../UI/LoadingMessage";

export const RecordContext = createContext<{
    records: RecordType[] | null;
    setRecords: React.Dispatch<React.SetStateAction<RecordType[] | null>>;
    fetchRecordById: (id: string) => Promise<RecordType | null>;
} | null>(null);

export const RecordProvider = ({ children }: { children: ReactNode }) => {
    const [records, setRecords] = useState<RecordType[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data: RecordType[] = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Error fetching records:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Loading data from the server..." />;
    }

    return (
        <RecordContext.Provider value={{ records, setRecords, fetchRecordById }}>
            {children}
        </RecordContext.Provider>
    );
};
