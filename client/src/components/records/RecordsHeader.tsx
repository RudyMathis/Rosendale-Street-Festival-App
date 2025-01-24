import { LabelsType } from "../../types/LabelsType";
import { useRoleContext } from "../../context/RoleContext";
import Button from "../../util/Button";
import Login from "../Login";
import LoginReminder from "../../UI/LoginReminder";

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
    const { canViewContent } = useRoleContext();

    return (
        <>
            {canViewContent ?
                <section className="records-header">
                    {Object.keys(groupLabels).map((group) => (
                        <div
                            key={group}
                            data-group={group}
                            className={"record-header-button-container"}
                        >
                            <Button 
                                label={groupLabels[group]}
                                onClick={() => {
                                    onFieldGroupChange(group);
                                    handleShowDownload(group);
                                    onFilterReset();
                                }}
                                className={`records-show-button ${
                                    selectedGroup === group ? "selected" : ""
                                }`}
                                type="button"
                            />
                            <Button 
                                label={downloadLabels[group]}
                                onClick={() => onDownloadButtonClick(group)}
                                className="records-data-button hidden-download-button"
                                type="button"
                            />
                        </div>
                    ))}
            </section>
            : 
            <>
                <LoginReminder />
                <Login />
            </>}
        </>
    );
}


export default Header;
