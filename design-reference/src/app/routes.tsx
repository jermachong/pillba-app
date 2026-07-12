import { createBrowserRouter, Navigate } from "react-router";
import Root from "./Root";
import DashboardPage from "./pages/DashboardPage";
import SchedulePage from "./pages/SchedulePage";
import LogsPage from "./pages/LogsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "schedule", Component: SchedulePage },
      { path: "logs", Component: LogsPage },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
