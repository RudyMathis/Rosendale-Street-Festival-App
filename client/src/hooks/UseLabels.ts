import { useContext } from "react";
import { LabelsType } from "../types/LabelsType";
import { LabelContext } from "../context/LabelContext";

export default function useLabels(): LabelsType {
    const serverLabel = useContext(LabelContext);
    if (!serverLabel) {
        throw new Error('Labels context is null');
    }
    return serverLabel;
}