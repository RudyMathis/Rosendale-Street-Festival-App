import { createContext, useContext, ReactNode } from "react";
import { useUserContext } from "./UserContext";
import useLabels from "../hooks/UseLabels";
import ErrorMessage from "../UI/ErrorMessage";

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
  const labels = useLabels();
  
  if (!labels) {
    return <ErrorMessage />;
  }
  
  const roleHierarchy = {
    [labels.role.level1]: {
      differentDisplay: "",
      canViewContent: false,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    [labels.role.level2]: {
      differentDisplay: "Suggest Performer/Band",
      canViewContent: true,
      canViewActions: false,
      canAccept: false,
      canViewEditedDetail: false,
      canEditRecords: false,
    },
    [labels.role.level3]: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: false,
    },
    [labels.role.level4]: {
      differentDisplay: "Add Performer/Band",
      canViewContent: true,
      canViewActions: true,
      canAccept: true,
      canViewEditedDetail: true,
      canEditRecords: true,
    },
  };

  // Resolve permissions based on currentUser's role, default to "guest" if no user
  const permissions = roleHierarchy[currentUser?.role ?? labels.role.level1];

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
