import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import useLabels from "../hooks/UseLabels";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/Login.css";
import { UserRole } from "../types/RoleType";

type Member = {
    _id: string;
    name: string;
    role: string;
    password: string;
};

const Login: React.FC = () => {
    const { setCurrentUser } = useUserContext();
    const [members, setMembers] = useState<Member[]>([]);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const labels = useLabels();

    // Fetch the members from your API (assuming the API exists)
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch members");
                }

                const data = await response.json();
                setMembers(data);
            } catch (err: unknown) {
                setError((err as Error).message);
            }
        };

        fetchMembers();
    }, []);

    const handleLogin = () => {
        // Validate user credentials against the fetched members
        const user = members.find(
            (member) => member.name === name && member.password === password
        );

        if (!user) {
            setError("Invalid name or password.");
            return;
        }

        // If user is found, store them in localStorage and set context
        const userData = { name: user.name, role: user.role };
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("loggedIn", "true");

        // Update the user context
        setCurrentUser({ name: user.name, role: user.role as UserRole, password: "" });
        navigate("/");
    };

    if (!labels) {
        return <ErrorMessage />;
    }

    return (
        <div className="container-shadow">
            <h2>{labels.login.login}</h2>
            <form
                className="login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <div className="login-container">
                    <label className="login-label">
                        {labels.login.name}:
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="on"
                            placeholder="Enter your name"
                        />
                    </label>
                    <label className="login-label">
                        {labels.login.password}:
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <button className="submit-button" type="submit">
                    {labels.actions.submit}
                </button>
            </form>
        </div>
    );
};

export default Login;
