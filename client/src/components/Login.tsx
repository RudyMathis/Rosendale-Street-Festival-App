import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

// Hardcoded users with roles and passwords
const hardcodedUsers = [
    { name: "Valerie", password: "testpassword", role: "member" as const },
    { name: "Moderator1", password: "modpassword", role: "moderator" as const },
    { name: "Admin1", password: "adminpassword", role: "admin" as const },
];

const Login: React.FC = () => {
    const { setCurrentUser } = useUserContext();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const user = hardcodedUsers.find(
            (u) => u.name === name && u.password === password
        );

        if (!user) {
            setError("Invalid name or password.");
            return;
        }

        setCurrentUser({ name: user.name, role: user.role, password: "" }); // No need to store the password in context
        navigate("/"); 
    };

    return (
        <div className="container-shadow">
            <h2>Login</h2>
            <form className="login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <div className="login-container">
                    <label className="login-label">
                        Name: 
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </label>
                    <label className="login-label">
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <button className="submit-button" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Login;
