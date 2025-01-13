import { useContext } from "react";
import { LabelsType } from "../types/LabelsType";
import { LabelContext } from "../context/LabelContext"; // Update the path as needed

export default function useLabels(): LabelsType | null {
    return useContext(LabelContext);
}
