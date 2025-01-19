import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import App from "./App";
import CreateRecord from "./components/CreateRecord";
import RecordDetail from "./components/RecordDetail";
import Records from "./components/Records";
import RecordListHeader from "./components/record list/RecordListHeader";
import Login from "./components/Login";
import MembersPage from "./components/members/MembersPage";
import "./index.css";

// Define the routes array with type annotations for better TypeScript support.
const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordListHeader />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <CreateRecord />,
      },
    ],
  },
  {
    path: "/record/:id",
    element: <App />,
    children: [
      {
        path: "/record/:id",
        element: <RecordDetail />,
      },
    ],
  },
  {
    path: "/record/all",
    element: <App />,
    children: [
      {
        path: "/record/all",
        element: <Records />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <CreateRecord />,
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/members",
    element: <App />,
    children: [
      {
        path: "/members",
        element: <MembersPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
