import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LoadingMessage from "./UI/LoadingMessage";

// Lazy load components to improve performance
const CreateRecord = React.lazy(() => import("./components/CreateRecord"));
const UploadRecords = React.lazy(() => import("./components/csv/UploadRecords"));
const RecordDetail = React.lazy(() => import("./components/RecordDetail"));
const Records = React.lazy(() => import("./components/records/Records"));
const RecordListHeader = React.lazy(() => import("./components/record list/RecordListHeader"));
const Login = React.lazy(() => import("./components/Login"));
const MembersPage = React.lazy(() => import("./components/members/MembersPage"));

/**
 * Define application routes with React Router
 * Each route uses React.Suspense to lazily load components with a fallback LoadingMessage
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { 
        path: "/", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Records Table" />}>
            <RecordListHeader />
          </React.Suspense>
        ) 
      },
      { 
        path: "/edit/:id", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Record Form" />}>
            <CreateRecord />
          </React.Suspense>
        ) 
      },
      { 
        path: "/record/:id", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Record Details" />}>
            <RecordDetail />
          </React.Suspense>
        ) 
      },
      { 
        path: "/record/all", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading All Records" />}>
            <Records />
          </React.Suspense>
        ) 
      },
      { 
        path: "/create", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Record Form" />}>
            <CreateRecord />
          </React.Suspense>
        ) 
      },
      { 
        path: "/upload", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading CSV Upload" />}>
            <UploadRecords />
          </React.Suspense>
        ) 
      },
      { 
        path: "/login", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Login" />}>
            <Login />
          </React.Suspense>
        ) 
      },
      { 
        path: "/members", 
        element: (
          <React.Suspense fallback={<LoadingMessage message="Loading Members Page..." />}>
            <MembersPage />
          </React.Suspense>
        ) 
      },
    ],
  },
]);

// Render the React application with the defined router
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

