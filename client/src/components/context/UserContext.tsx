import { createContext, useContext, useState } from "react";

// Define the possible roles
type UserRole = "guest" | "member" | "moderator" | "admin";

// Define the shape of the user object
type User = {
    name: string;
    role: UserRole;
    password: string;
}

// Define the context value type
type UserContextType ={
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    isGuest: boolean;
    isModerator: boolean;
    isAdmin: boolean;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Role-based checks
    const isGuest = currentUser?.role === "guest";
    const isModerator = currentUser?.role === "moderator";
    const isAdmin = currentUser?.role === "admin";

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, isGuest, isModerator, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};
