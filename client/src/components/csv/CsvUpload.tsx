import Papa from "papaparse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import { useRoleContext } from "../../context/RoleContext";
import LoadingMessage from "../../UI/LoadingMessage";
import LoginReminder from "../../UI/LoginReminder";
import PaginationControls from "../../util/PaginationControls";
import Button from "../../util/Button";
import useRecords from "../../hooks/UseRecords";
import Label from "../../labels/UILabel.json";
import "../../styles/Csv.css";
import "../../styles/Table.css";

const CsvUpload = ({ formFields, displayLabels }: { formFields: string[], displayLabels: string[] }) => {
    const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [isParsing, setIsParsing] = useState<boolean>(false); // For file parsing/loading message
    const [isHidden, setIsHidden] = useState(false);
    const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
    const [, setError] = useState("");
    const navigate = useNavigate();
    const { refreshRecords } = useRecords(); 
    const { canViewContent } = useRoleContext();

    // Pagination state for CSV preview
    const CSV_ROWS_PER_PAGE = Label.pagination.count;
    const [csvCurrentPage, setCsvCurrentPage] = useState(1);
    const csvTotalPages = Math.ceil(csvData.length / CSV_ROWS_PER_PAGE);
    const paginatedCsvData = csvData.slice(
        (csvCurrentPage - 1) * CSV_ROWS_PER_PAGE,
        csvCurrentPage * CSV_ROWS_PER_PAGE
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true); // Start showing the loading message

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                if (result.errors.length) {
                    setError("Error parsing CSV file.");
                    console.error(result.errors);
                } else {
                    // Set the headers and CSV data
                    setHeaders(Object.keys(result.data[0] as object));
                    setCsvData(result.data as Record<string, unknown>[]);
                    setError("");
                    setMappedFields(
                        Object.keys(result.data[0] as object).reduce((acc, header) => {
                            acc[header] = ""; 
                            return acc;
                        }, {} as Record<string, string>)
                    );
                    // Reset CSV pagination on new upload
                    setCsvCurrentPage(1);
                }
                setIsParsing(false); // Parsing is done, hide the loading message
            },
        });
    };

    const handleFieldMappingChange = (csvHeader: string, mappedField: string) => {
        setMappedFields((prevMappings) => {
            const updatedMappings = { ...prevMappings, [csvHeader]: mappedField };
            return updatedMappings;
        });
    };

    const handleInputChange = (rowIndex: number, columnName: string, value: string) => {
        setCsvData((prevData) => {
            const updatedData = [...prevData];
            updatedData[rowIndex][columnName] = value;
            return updatedData;
        });
    };

    const preprocessData = () => {
        return csvData.map((row) => {
            const newRow: Record<string, unknown> = {};
            Object.entries(mappedFields).forEach(([csvHeader, mappedField]) => {
                if (mappedField && row[csvHeader]) {
                    newRow[mappedField] = row[csvHeader];
                } else {
                    console.warn(`Missing value for ${csvHeader}`);
                }
            });
            return newRow;
        });
    };

    const handleSubmit = async () => {
        const chunkSize = 10;
        const processedData = preprocessData().map(record =>
            Object.fromEntries(
                Object.entries(record).map(([key, value]) => {
                    if (value === "") return [key, Label.undefinedValues.string];
                    if (typeof value === "string") {
                        const lowerValue = value.toLowerCase();
                        if (lowerValue === "yes") return [key, true];
                        if (lowerValue === "no") return [key, false];
                        if (!isNaN(Number(value))) return [key, Number(value)]; // Convert numeric strings to numbers
                    }
                    return [key, value];
                })
            )
        );
    
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

    const handleHideTable = () => {
        setIsHidden(prevHidden => !prevHidden);
    };

    return (
        <>
            {canViewContent ? (
                <>
                    <section className="csv-header-container card">
                        <h2>{Label.csv.title}</h2>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="csv-upload-input"
                        />
                    </section>
                    {isParsing && <LoadingMessage message="Processing Data" />}
                    {headers.length > 0 && !isParsing && (
                        <section className="csv-upload-container card">
                            <div className="csv-header-container">
                                <h3>{Label.csv.mapColumn}</h3>
                                <h3 className="csv-header-mobile">{Label.csv.header}</h3>
                                <Button
                                    label={`${isHidden ? Label.csv.show : Label.csv.hide}`}
                                    onClick={handleHideTable}
                                    type="button" 
                                    className={"form-fields-hide-button"}                           
                                />
                            </div>
                            <table className={`csv-table ${isHidden ? "hidden" : ""}`}>
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
                                    <table className={`csv-table bottom ${isHidden ? "extend" : ""}`}>
                                        <thead>
                                            <tr>
                                                {headers.map((header) => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedCsvData.map((row, rowIndex) => (
                                                <tr key={rowIndex} >
                                                    {headers.map((header) => (
                                                        <td key={header}>
                                                            <label>
                                                                <input
                                                                    type="text"
                                                                    name={mappedFields[header] || `field_${header}`}
                                                                    value={(row[header] as string) || ""}
                                                                    onChange={(e) => handleInputChange((csvCurrentPage - 1) * CSV_ROWS_PER_PAGE + rowIndex, header, e.target.value)}
                                                                />
                                                            </label>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <PaginationControls
                                        currentPage={csvCurrentPage}
                                        totalPages={csvTotalPages}
                                        setCurrentPage={setCsvCurrentPage}
                                    />
                                    <button onClick={handleSubmit} className="submit-button">
                                        {Label.actions.submit}
                                    </button>
                                </div>
                            )}
                        </section>
                    )}
                </>
            ) : (
                <>
                    <LoginReminder />
                    <Login />
                </>
            )}
        </>
    );
};

export default CsvUpload;
