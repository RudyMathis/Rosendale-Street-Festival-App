import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./components/context/UserContext";
import { RoleContextProvider } from "./components/context/RoleContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <RoleContextProvider>
        <main>
          <Navbar />
          <Outlet />
        </main>
      </RoleContextProvider>
    </UserContextProvider>
  );
};

export default App;

// Error Handling 
// transfer data from google sheets
// display total data page, ie total type of shirts, total memebers etc --