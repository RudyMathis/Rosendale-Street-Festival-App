const LoginReminder = () => (
    <div className={"card"} style={styles.container}>
        <h2>Please login to view this page</h2>
    </div>
);

const styles = {
    container: {
        padding: `var(--secondary-padding)` as string,
        marginBottom: `1em` as string,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
};

export default LoginReminder;
