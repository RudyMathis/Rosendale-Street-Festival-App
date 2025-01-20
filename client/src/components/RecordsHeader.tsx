import { LabelsType } from "../types/LabelsType";

type HeaderProps = {
    labels: LabelsType;
    selectedGroup: string;
    onFieldGroupChange: (group: string) => void;
    onDownloadButtonClick: (group: string) => void;
    groupLabels: { [key: string]: string };
    downloadLabels: { [key: string]: string };
};

function moreButtonHidden(group: string) {
    const moreGroup = ["isAccepted", "shirts"];
    return moreGroup.includes(group);
}

function handleMore() {
    const moreSelection = document.querySelectorAll(".more-selection");

    if (moreSelection) {
        moreSelection.forEach((element) => {
            element.classList.toggle("hidden-button");
        });

        document.querySelectorAll(".more-selection").forEach((element, index) => {
            (element as HTMLElement).style.position = "absolute";
            (element as HTMLElement).style.top = `${5 * (index + 1)}em`;
        });
    }
}

function adjustMoreSelectionPosition() {
    const moreSelection = document.querySelectorAll(".more-selection");

    moreSelection.forEach((element, index) => {
        if (window.innerWidth > 720) {
            (element as HTMLElement).style.position = "relative";
            (element as HTMLElement).style.top = "";
        } else {
            (element as HTMLElement).style.position = "absolute";
            (element as HTMLElement).style.top = `${5 * (index + 1)}em`;
        }
    });
}

// Initialize ResizeObserver
const resizeObserver = new ResizeObserver(() => {
    adjustMoreSelectionPosition();
});

// Ensure observer starts observing the document body
resizeObserver.observe(document.body);

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
                <div
                    key={group}
                    className={`record-header-button-container ${
                        moreButtonHidden(group) ? "hidden-button hidden-group" : ""
                    }`}
                >
                    <button
                        className={`records-show-button ${
                            selectedGroup === group ? "selected" : ""
                        }`}
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
            <div className="more-button-container">
                <button className="more-button" onClick={handleMore}>
                    More
                </button>
                {Object.keys(groupLabels).map((group) => (
                    <div
                        key={group}
                        className={`record-header-button-container ${
                            !moreButtonHidden(group)
                                ? "hidden-group"
                                : "more-selection hidden-button"
                        }`}
                    >
                        <button
                            className={`records-show-button ${
                                selectedGroup === group ? "selected" : ""
                            }`}
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
        </div>
    );
}

export default Header;
