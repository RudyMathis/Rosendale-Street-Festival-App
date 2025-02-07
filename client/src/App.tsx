import React, { Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import { RoleContextProvider } from "./context/RoleContext";
import { LabelProvider } from "./context/LabelContext";
import { RecordProvider } from "./context/RecordContext";
import Loading from "./UI/LoadingMessage";
import Navbar from "./components/Navbar";
import "./App.css";

/**
 * A higher-order component that wraps the application with the necessary context providers.
 * 
 * @param {React.ReactNode} children The children components to be wrapped with the context providers.
 * @returns {React.ReactElement} The wrapped children components.
 */
const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LabelProvider>
      <UserContextProvider>
        <RoleContextProvider>
          <RecordProvider>
            {children}
          </RecordProvider>
        </RoleContextProvider>
      </UserContextProvider>
    </LabelProvider>
  );
};

/**
 * The main App component that renders the application.
 * 
 * @returns {React.ReactElement} The application component.
 */
const App: React.FC = () => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname.split("/")[1]);

  useEffect(() => {
    setPath(location.pathname.split("/")[1]);
    document.body.id = path;
  }, [location.pathname, path]);

  return (
      <Suspense fallback={<Loading />}>
        <Providers>
            <main>
              <Navbar />
              <Outlet />
            </main>
        </Providers>
      </Suspense>
  );
};

export default App;
