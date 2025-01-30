import { createContext, useContext, ReactNode } from "react";
import { useUserContext } from "./UserContext";
import Loading from "../UI/LoadingMessage";
import useLabels from "../hooks/UseLabels";

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

export const RoleContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const serverLabel = useLabels();

  // Ensure roles exist before setting up the context
  if (!serverLabel?.role) {
    console.log("RoleContextProvider waiting for serverLabel.role...");
    return <Loading message="Loading roles..." />; // Or return null;
  }

  const roleHierarchy = {
    [serverLabel.role.level1?.[0]]: {
      differentDisplay: "",
      canViewContent: false,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    [serverLabel.role.level2?.[0]]: {
      differentDisplay: "Suggest Performer/Band",
      canViewContent: true,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    [serverLabel.role.level3?.[0]]: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: false,
    },
    [serverLabel.role.level4?.[0]]: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: true,
    },
  };

  const permissions = roleHierarchy[currentUser?.role ?? serverLabel.role.level1?.[0]];

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
