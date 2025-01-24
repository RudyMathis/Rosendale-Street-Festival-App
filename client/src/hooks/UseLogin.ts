import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../types/RoleType";

type Member = {
    _id: string;
    name: string;
    role: string;
    password: string;
};

const useLogin = () => {
    const { setCurrentUser } = useUserContext();
    const [members, setMembers] = useState<Member[]>([]);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    return {
        members,
        name,
        setName,
        password,
        setPassword,
        error,
        handleLogin,
    };
};

export default useLogin;
