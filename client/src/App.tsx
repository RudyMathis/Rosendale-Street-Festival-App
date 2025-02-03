import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
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