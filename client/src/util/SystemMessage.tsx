type SystemMessageProps = {
    title: string;
    message?: string;
};

const SystemMessage: React.FC<SystemMessageProps> = ({ title, message }) => {
    return (
        <div className="card internal">
            <h1>{title}</h1>
            <p>{message}</p>
        </div>
    );
};

export default SystemMessage;
