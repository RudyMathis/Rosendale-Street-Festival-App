import { LabelsType } from "../../types/LabelsType";
import { useRoleContext } from "../../context/RoleContext";
import Button from "../../util/Button";
import Login from "../Login";
import LoginReminder from "../../UI/LoginReminder";
import useDownloadVisibility from "../../hooks/UseDownloadVisibility";

type HeaderProps = {
    labels: LabelsType;
    selectedGroup: string;
    onFieldGroupChange: (group: string) => void;
    onDownloadButtonClick: (group: string) => void;
    groupLabels: { [key: string]: string };
    downloadLabels: { [key: string]: string };
    onFilterReset: () => void;
};

function Header({
    selectedGroup,
    onFieldGroupChange,
    onDownloadButtonClick,
    groupLabels,
    downloadLabels,
    onFilterReset,
}: HeaderProps) {
    const { canViewContent } = useRoleContext();
    const { showDownloadButton } = useDownloadVisibility();

    return (
        <>
            {canViewContent ? (
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
                                    showDownloadButton(group); // Use the function returned by the hook
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
            ) : (
                <>
                    <LoginReminder />
                    <Login />
                </>
            )}
        </>
    );
}

export default Header;