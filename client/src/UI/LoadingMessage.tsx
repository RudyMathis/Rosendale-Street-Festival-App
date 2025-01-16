
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
        textAlign: "center" as const,
        backgroundColor: "#f5f5f5",
    },
    message: {
        fontSize: "1.2rem",
        color: "#333",
    },
};

export default LoadingMessage;
