import { useContext } from "react";
import { RecordContext } from "../context/RecordContext";

export default function useRecords() {
    const context = useContext(RecordContext);

    if (!context) {
        throw new Error("useRecords must be used within a RecordProvider");
    }

    return context;
}
