import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import useRecords from "../../hooks/UseRecords";
import "../../styles/Table.css";

const CsvUpload = ({ formFields, displayLabels }: { formFields: string[], displayLabels: string[] }) => {
    const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { refreshRecords } = useRecords(); // Import from context

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            if (result.errors.length) {
            setError("Error parsing CSV file.");
            console.error(result.errors);
            } else {
                setHeaders(Object.keys(result.data[0] as object));
            setCsvData(result.data as Record<string, unknown>[]);
            setError("");
            setMappedFields(
                Object.keys(result.data[0] as object).reduce((acc, header) => {
                acc[header] = ""; // Initialize mapping as empty
                return acc;
                }, {} as Record<string, string>)
            );
            }
        },
        });
    };

    const handleFieldMappingChange = (csvHeader: string, mappedField: string) => {
        setMappedFields((prevMappings) => ({ ...prevMappings, [csvHeader]: mappedField }));
    };

    const handleInputChange = (rowIndex: number, columnName: string, value: string) => {
        setCsvData((prevData) => {
            const updatedData: Record<string, unknown>[] = [...prevData];
            updatedData[rowIndex][columnName as keyof typeof updatedData[0]] = value;  // Ensure correct value type
            return updatedData;
        });
    };

    const preprocessData = () => {
        return csvData.map((row) => {
            const newRow: Record<string, unknown> = {};
            Object.entries(mappedFields).forEach(([csvHeader, mappedField]) => {
                if (mappedField && row[csvHeader]) {  // Ensure there is data in the row
                    newRow[mappedField] = row[csvHeader as keyof typeof row];
                } else {
                    console.warn(`Missing value for ${csvHeader}`);
                }
            });
                return newRow;
            });
        };

    const handleSubmit = async () => {
        const chunkSize = 10;
        const processedData = preprocessData();
        console.log("Processed Data:", processedData);  // Check final structure
    
        for (let i = 0; i < processedData.length; i += chunkSize) {
            const chunk = processedData.slice(i, i + chunkSize);
            
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(chunk),
                    }
                );
                
                if (!response.ok) {
                    const responseBody = await response.text();
                    console.error(`Error: ${response.status}, ${responseBody}`);
                    throw new Error(`Error submitting chunk starting at record ${i}`);
                }
                refreshRecords();

                } catch (err) {
                    console.error(err);
                    setError("Failed to submit some records. Check the console for details.");
                    return;
                }
            }
        navigate("/");
    };
    

    return (
        <section className="csv-upload-container container-shadow">
        <h3>Upload and Process CSV File</h3>

        <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="csv-upload-input"
        />

        {error && <p className="error-message">{error}</p>}

        {headers.length > 0 && (
            <div className="field-mapping">
            <h4>Map CSV Columns to Form Fields</h4>
            <table>
                <thead>
                <tr>
                    <th>CSV Header</th>
                    <th>Map to Form Field</th>
                </tr>
                </thead>
                <tbody>
                {headers.map((header) => (
                    <tr key={header}>
                    <td>{header}</td>
                    <td>
                        <select
                            value={mappedFields[header] || ""}
                            name={mappedFields[header] || "Ignore"}
                            onChange={(e) =>
                                handleFieldMappingChange(header, e.target.value)
                            }
                        >
                            <option value="">-- Ignore --</option>
                            {formFields.map((field, index) => (
                                <option key={field} value={field}>
                                    {displayLabels[index] || field}
                                </option>
                            ))}
                        </select>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {csvData.length > 0 && (
            <div className="csv-preview">
            <h4>Preview and Edit Data</h4>
            <table>
                <thead>
                <tr>
                    {headers.map((header) => (
                    <th key={header}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    {headers.map((header) => (
                            <td key={header}>
                                <label>
                                <input
                                    type="text"
                                    name={mappedFields[header] || `field_${header}`}  // Use a fallback name if mapping is empty
                                    value={row[header as keyof typeof row] as string || ""}
                                    onChange={(e) =>
                                        handleInputChange(rowIndex, header, e.target.value)
                                    }
                                />
                                </label>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
                <button onClick={handleSubmit} className="submit-button">
                    Submit to Database
                </button>
            </div>
        )}
        </section>
    );
};

export default CsvUpload;
