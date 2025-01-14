import { createContext, useContext } from "react";
import { useUserContext } from "../context/UserContext";

// Define all possible permissions
type RoleContextType = {
  differentDisplay: string;
  canViewContent: boolean;
  canViewActions: boolean;
  canAccept: boolean;
  canViewEditedDetail: boolean;
  canEditRecords: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();

  // Define role-based hierarchy
  const roleHierarchy = {
    guest: {
      differentDisplay: "",
      canViewContent: false,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    member: {
      differentDisplay: "Suggest Performer/Band",
      canViewContent: true,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    moderator: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: false,
    },
    admin: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: true,
    },
  };

  // Resolve permissions based on currentUser's role, default to "guest" if no user
  const permissions = roleHierarchy[currentUser?.role ?? "guest"];

  return (
    <RoleContext.Provider value={permissions}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleContextProvider");
  }
  return context;
};
