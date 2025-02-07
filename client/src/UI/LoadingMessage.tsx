
type LoadingMessageProps = {
    message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ message= "Loading" }) => {
    return (
        <div className="card internal loading-message-container">
            <h2>{message}</h2>
            <div>
                <span className="dot1 dot"></span>
                <span className="dot2 dot"></span>
                <span className="dot3 dot"></span>
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

export default LoadingMessage;
