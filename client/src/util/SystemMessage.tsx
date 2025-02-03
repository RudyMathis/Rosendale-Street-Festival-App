type SystemMessageProps = {
    title: string;
    message: string;
};

const SystemMessage: React.FC<SystemMessageProps> = ({ title, message }) => {
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{title}</h2>
            <p style={styles.message}>{message}</p>
            <a href="mailto:admin@example.com" style={styles.email}>admin@example.com</a>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        padding: '20px',
        marginTop: '20px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '1.5em',
        marginBottom: '10px',
        textAlign: 'center' as const,
    },
    message: {
        fontSize: '1em',
        marginBottom: '10px',
    },
    email: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default SystemMessage;
