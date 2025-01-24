import { useContext } from "react";
import { RecordContext } from "../context/RecordContext";

export default function useRecords() {
    const record = useContext(RecordContext);

    if (!record) {
        throw new Error("useRecords must be used within a RecordProvider");
    }

    return record;
}
