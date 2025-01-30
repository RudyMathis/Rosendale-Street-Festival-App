import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import App from "./App";
import CreateRecord from "./components/CreateRecord";
import UploadRecords from "./components/csv/UploadRecords";
import RecordDetail from "./components/RecordDetail";
import Records from "./components/records/Records";
import RecordListHeader from "./components/record list/RecordListHeader";
import Login from "./components/Login";
import MembersPage from "./components/members/MembersPage";
import "./index.css";

// Define the routes array with type annotations for better TypeScript support.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wrap everything inside App
    children: [
      { path: "/", element: <RecordListHeader /> },
      { path: "/edit/:id", element: <CreateRecord /> },
      { path: "/record/:id", element: <RecordDetail /> },
      { path: "/record/all", element: <Records /> },
      { path: "/create", element: <CreateRecord /> },
      { path: "/upload", element: <UploadRecords /> },
      { path: "/login", element: <Login /> },
      { path: "/members", element: <MembersPage /> },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
