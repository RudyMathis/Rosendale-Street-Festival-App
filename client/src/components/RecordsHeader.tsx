import { LabelsType } from "../types/LabelsType";

type HeaderProps = {
    labels: LabelsType;
    selectedGroup: string;
    onFieldGroupChange: (group: string) => void;
    onDownloadButtonClick: (group: string) => void;
    groupLabels: { [key: string]: string };
    downloadLabels: { [key: string]: string };
    onFilterReset: () => void;
};


function handleShowDownload(group: string) {
    // Hide all download buttons
    const allDownloadButtons = document.querySelectorAll(".records-data-button");
    allDownloadButtons.forEach((button) => {
        button.classList.add("hidden-download-button");
    });

    // Show the download button for the currently selected group
    const currentButton = document.querySelector(
        `[data-group="${group}"] .records-data-button`
    );

    if (currentButton) {
        currentButton.classList.remove("hidden-download-button");
    }
}

function Header({
    selectedGroup,
    onFieldGroupChange,
    onDownloadButtonClick,
    groupLabels,
    downloadLabels,
    onFilterReset,
}: HeaderProps) {
    return (
        <div className="records-header">
            {Object.keys(groupLabels).map((group) => (
                <div
                    key={group}
                    data-group={group}
                    className={"record-header-button-container"}
                >
                    <button
                        className={`records-show-button ${
                            selectedGroup === group ? "selected" : ""
                        }`}
                        onClick={() => {
                            onFieldGroupChange(group);
                            handleShowDownload(group);
                            onFilterReset(); // Call the passed reset function
                        }}
                    >
                        {groupLabels[group]}
                    </button>
                    <button
                        className="records-data-button hidden-download-button"
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
