import { useCallback } from "react";

const useDownloadVisibility = () => {
    const showDownloadButton = useCallback((group: string) => {
        // Hide all download buttons
        const allDownloadButtons = document.querySelectorAll(".records-data-button");
        allDownloadButtons.forEach((button) => {
            button.classList.add("hidden-download-button");
        });

        // Show the download button for the selected group
        const currentButton = document.querySelector(
            `[data-group="${group}"] .records-data-button`
        );

        if (currentButton) {
            currentButton.classList.remove("hidden-download-button");
        }
    }, []);

    return { showDownloadButton };
};
export default useDownloadVisibility;