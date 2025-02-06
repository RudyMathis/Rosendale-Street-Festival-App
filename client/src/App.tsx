import React, { Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import { RoleContextProvider } from "./context/RoleContext";
import { LabelProvider } from "./context/LabelContext";
import { RecordProvider } from "./context/RecordContext";
import Loading from "./UI/LoadingMessage";
import Navbar from "./components/Navbar";
import "./App.css";

// Providers component
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