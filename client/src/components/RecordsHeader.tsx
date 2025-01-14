import { LabelsType } from "../types/LabelsType";

type HeaderProps = {
    labels: LabelsType;
    selectedGroup: string;
    onFieldGroupChange: (group: string) => void;
    onDownloadButtonClick: (group: string) => void;
    groupLabels: { [key: string]: string };
    downloadLabels: { [key: string]: string };
}

function Header({
    selectedGroup,
    onFieldGroupChange,
    onDownloadButtonClick,
    groupLabels,
    downloadLabels,
}: HeaderProps) {
    return (
        <div className="records-header">
            {Object.keys(groupLabels).map((group) => (
                <div key={group} className="record-header-button-container">
                    <button
                        className={`records-show-button ${selectedGroup === group ? 'selected' : ''}`}
                        onClick={() => onFieldGroupChange(group)}
                    >
                        {groupLabels[group]}
                    </button>
                    <button
                        className="records-data-button"
                        onClick={() => onDownloadButtonClick(group)}
                    >
                        {downloadLabels[group]}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Header;
