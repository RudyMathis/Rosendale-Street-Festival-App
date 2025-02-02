import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import Login from "../Login";
import LoginReminder from "../../UI/LoginReminder";
import useRecords from "../../hooks/UseRecords";
import Label from "../../labels/UILabel.json";
import { useRoleContext } from "../../context/RoleContext";
import "../../styles/Csv.css";
import "../../styles/Table.css";

const CsvUpload = ({ formFields, displayLabels }: { formFields: string[], displayLabels: string[] }) => {
    const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [hoverName, setHoverName] = useState("");
    const [mappedNameColumn, setMappedNameColumn] = useState<string | null>(null);

    const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { refreshRecords } = useRecords(); // Import from context
    const { canViewContent } = useRoleContext();

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
        setMappedFields((prevMappings) => {
            const updatedMappings = { ...prevMappings, [csvHeader]: mappedField };
    
            // If this CSV column is mapped to "name", store its header
            if (mappedField === "name") {
                setMappedNameColumn(csvHeader);
            }
    
            return updatedMappings;
        });
    };
    

    const handleInputChange = (rowIndex: number, columnName: string, value: string) => {
        setCsvData((prevData) => {
            const updatedData: Record<string, unknown>[] = [...prevData];
            updatedData[rowIndex][columnName as keyof typeof updatedData[0]] = value;  // Ensure correct value type
            setHoverName(value);
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
        <>
            {canViewContent ? 
            <>
                <section className="csv-header-container card">
                    <h3>{Label.csv.title}</h3>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="csv-upload-input"
                    />
                </section>
                {error && <p className="error-message">{error}</p>}
                {headers.length > 0 && (
                    <section className="csv-upload-container card">
                        <h3>{Label.csv.mapColumn}</h3>
                        <h3 className="csv-header-mobile">{Label.csv.header}</h3>
                        <table className="csv-table">
                            <thead>
                                <tr>
                                    <th className="csv-header-desktop">{Label.csv.header}</th>
                                    <th className="map-field-desktop">{Label.csv.map}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {headers.map((header) => (
                                    <tr key={header}>
                                        <td className="header-td">{header}</td>
                                        <td>
                                            <span className="map-field-mobile">{Label.csv.map}</span>
                                            <select
                                                value={mappedFields[header] || ""}
                                                name={mappedFields[header] || "Ignore"}
                                                onChange={(e) =>
                                                    handleFieldMappingChange(header, e.target.value)
                                                }
                                            >
                                                <option value="">{Label.csv.ignore}</option>
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
                        {csvData.length > 0 && (
                            <div className="csv-preview">
                                <h3>{Label.csv.preview}</h3>
                                <table className="csv-table bottom">
                                    <thead>
                                        <tr>
                                            {headers.map((header) => (
                                                <th key={header}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvData.map((row, rowIndex) => (
                                            <tr 
                                                key={rowIndex} 
                                                data-name={mappedNameColumn ? (row[mappedNameColumn] as string || "") : ""}
                                                onMouseEnter={() => setHoverName(mappedNameColumn ? (row[mappedNameColumn] as string || "") : "")} 
                                                onMouseLeave={() => setHoverName("")}
                                                onTouchStart={() => setHoverName(mappedNameColumn ? (row[mappedNameColumn] as string || "") : "")} 
                                                onTouchEnd={() => setHoverName("")}
                                            >
                                            {headers.map((header) => (
                                                <td key={header}>
                                                    <label>
                                                        <input
                                                            type="text"
                                                            name={mappedFields[header] || `field_${header}`}
                                                            value={row[header as keyof typeof row] as string || ""}
                                                            onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                                                        />
                                                    </label>
                                                </td>
                                            ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={handleSubmit} className="submit-button">{Label.actions.submit}</button>
                            </div>
                        )}
                        <div className={`hover-name-display ${hoverName ? "show" : ""}`}>
                            {hoverName && <span>{hoverName}</span>}
                        </div>
                    </section>
                )}
            </>
            : 
            <>
                <LoginReminder />
                <Login />
            </>}
        </>
    );
};

export default CsvUpload;
