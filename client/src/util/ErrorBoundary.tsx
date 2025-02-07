import { useState, useEffect, ReactNode } from "react";
import SystemMessage from "../util/SystemMessage";

type ErrorBoundaryProps = {
    children: ReactNode;
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [, setErrorMessage] = useState("");

    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => {
            setHasError(true);
            setErrorMessage(event.error?.message || "An unexpected error occurred.");
        };

        window.addEventListener("error", errorHandler);
        return () => window.removeEventListener("error", errorHandler);
    }, []);

    if (hasError) {
        return <SystemMessage title="Oops! There was an internal server error." message="Don't worry, our development team has been notified." />;
    }

    return <>{children}</>;
};

export default ErrorBoundary;
