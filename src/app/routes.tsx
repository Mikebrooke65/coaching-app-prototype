import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { Landing } from "./components/pages/Landing";
import { Lessons } from "./components/pages/Lessons";
import { Games } from "./components/pages/Games";
import { Resources } from "./components/pages/Resources";
import { Schedule } from "./components/pages/Schedule";
import { Messaging } from "./components/pages/Messaging";
import { User } from "./App";

export const createRouter = (user: User, onLogout: () => void) =>
  createBrowserRouter([
    {
      path: "/",
      element: <MainLayout user={user} onLogout={onLogout} />,
      children: [
        { index: true, element: <Landing user={user} /> },
        { path: "lessons", element: <Lessons /> },
        { path: "games", element: <Games /> },
        { path: "resources", element: <Resources /> },
        { path: "schedule", element: <Schedule /> },
        { path: "messaging", element: <Messaging user={user} /> },
      ],
    },
  ]);
