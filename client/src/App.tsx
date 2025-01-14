import React, { Suspense, PropsWithChildren  } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./context/UserContext";
import { RoleContextProvider } from "./context/RoleContext";
import { LabelProvider } from "./context/LabelContext";
import { RecordProvider } from "./context/RecordContext";
import Loading from "./UI/LoadingMessage";
import "./App.css";

const Providers: React.FC<PropsWithChildren<object>> = ({ children }) => {
  return (
    <UserContextProvider>
      <RoleContextProvider>
        <LabelProvider>
          <RecordProvider>{children}</RecordProvider>
        </LabelProvider>
      </RoleContextProvider>
    </UserContextProvider>
  );
};

const App: React.FC = () => {
  return (
    <Providers>
      <Suspense fallback={<Loading message="Loading records..." />}>
        <main>
          <Navbar />
          <Outlet />
        </main>
      </Suspense>
    </Providers>
  );
};

export default App;
