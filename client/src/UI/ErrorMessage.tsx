type ErrorMessageProps = {
    message?: string; 
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = "Something went wrong" }) => { // Default value for message
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Something went wrong</h2>
            <p style={styles.message}>{message}</p>
            <p style={styles.contact}>
                If the issue persists, please contact the admin at 
                <a href="mailto:admin@example.com" style={styles.email}>admin@example.com</a>
            </p>
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
    },
    message: {
        fontSize: '1em',
        marginBottom: '10px',
    },
    contact: {
        fontSize: '1em',
    },
    email: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default ErrorMessage;
