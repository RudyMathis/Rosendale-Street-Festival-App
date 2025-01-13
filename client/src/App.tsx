import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./components/context/UserContext";
import { RoleContextProvider } from "./components/context/RoleContext";
import { LabelProvider } from "./components/context/LabelContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <RoleContextProvider>
        <LabelProvider>
          <main>
            <Navbar />
            <Outlet />
          </main>
        </LabelProvider>
      </RoleContextProvider>
    </UserContextProvider>
  );
};

export default App;

// Only none guests can see Outlet