
type LoadingMessageProps = {
    message: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ message = "Loading, please wait..." }) => {
    return (
        <div style={styles.container}>
            <p style={styles.message}>{message}</p>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Fill the viewport
        width: "100%",
        textAlign: "center" as const,
        backgroundColor: "#f5f5f5", // Light background for contrast
    },
    message: {
        fontSize: "1.2rem",
        color: "#333",
    },
};

export default LoadingMessage;
