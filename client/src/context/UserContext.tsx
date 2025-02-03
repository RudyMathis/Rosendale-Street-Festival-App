import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LabelContext } from "./LabelContext";

type User = {
    name: string;
    role: string;
    password: string;
};

type UserContextType = {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [, setIsUserLoaded] = useState(false);

    const serverLabel = useContext(LabelContext); // Access the labels context

    useEffect(() => {

        if (serverLabel) {
            const storedUser = localStorage.getItem("currentUser");
            const loggedIn = localStorage.getItem("loggedIn");

            if (storedUser && loggedIn === "true") {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser({ name: parsedUser.name, role: parsedUser.role, password: "" });
            } else {
                setCurrentUser(null); // Clear current user
            }
            setIsUserLoaded(true);
        }
    }, [serverLabel]);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};
// error when loading from this page might not be big deal