import { createContext, useState, useEffect, ReactNode } from "react";
import { useUserContext } from "../context/UserContext";
import { RecordType } from "../types/RecordType";
import LoadingMessage from "../UI/LoadingMessage";

/**
 * RecordContext is a context that contains all the records fetched from the API.
 * This context is used to share the records between different components.
 * The context is initialized with a null value, and it is set to the fetched records when the component mounts.
 * The context also contains functions to refresh the records, and to fetch a record by id.
 * The refresh function increments a key, which causes the component to re-fetch the records when it is rendered.
 * The fetchRecordById function fetches a record from the API with the given id.
 * If the record is not found, it returns null.
 * If there is an error, it logs the error and returns null.
 * The component also handles loading state, and renders a LoadingMessage component if the records are being fetched.
 */
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
    const { currentUser } = useUserContext();
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data: RecordType[] = await response.json();

                if(currentUser?.name === "Demo Account"){
                    setRecords(data.filter((record) => record.isDemoData === true));
                } else {
                    setRecords((data.filter((record) => record.isDemoData === false || record.isDemoData === undefined || record.isDemoData === null)));
                }
            } catch (error) {
                console.error("Error fetching records:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [currentUser?.name, refreshKey]);
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
