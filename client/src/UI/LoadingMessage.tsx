
type LoadingMessageProps = {
    message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ message= "Loading" }) => {
    return (
        <div style={styles.container} className="card">
            <p style={styles.message}>{message}</p>
            <div style={styles.dotsContainer}>
                <span style={styles.dot} className="dot1"></span>
                <span style={styles.dot} className="dot2"></span>
                <span style={styles.dot} className="dot3"></span>
            </div>
            <style>
                {`
                    @keyframes bounce {
                        0%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-8px); }
                    }

                    .dot1 { animation: bounce 1.2s infinite ease-in-out; }
                    .dot2 { animation: bounce 1.2s infinite ease-in-out 0.2s; }
                    .dot3 { animation: bounce 1.2s infinite ease-in-out 0.4s; }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center" as const,
        padding: "var(--primary-padding)",
    },
    message: {
        fontSize: "1.2rem",
        color: "#333",
        marginBottom: "10px",
    },
    dotsContainer: {
        display: "flex",
        gap: "5px",
    },
    dot: {
        width: "10px",
        height: "10px",
        backgroundColor: "#333",
        borderRadius: "50%",
        display: "inline-block",
    },
};

export default LoadingMessage;
