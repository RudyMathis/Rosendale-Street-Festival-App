import { useContext } from "react";
import { LabelsType } from "../types/LabelsType";
import { LabelContext } from "../context/LabelContext";
export default function useLabels(): LabelsType | null {
    return useContext(LabelContext);
}
