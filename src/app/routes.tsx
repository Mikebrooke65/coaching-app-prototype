import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { DesktopLayout } from "./components/DesktopLayout";
import { Landing } from "./components/pages/Landing";
import { Lessons } from "./components/pages/Lessons";
import { Games } from "./components/pages/Games";
import { Resources } from "./components/pages/Resources";
import { Schedule } from "./components/pages/Schedule";
import { Messaging } from "./components/pages/Messaging";
import { DesktopLanding } from "./components/desktop/DesktopLanding";
import { DesktopCoaching } from "./components/desktop/DesktopCoaching";
import { DesktopGames } from "./components/desktop/DesktopGames";
import { DesktopResources } from "./components/desktop/DesktopResources";
import { DesktopSchedule } from "./components/desktop/DesktopSchedule";
import { DesktopMessaging } from "./components/desktop/DesktopMessaging";
import { TeamsManagement } from "./components/desktop/TeamsManagement";
import { UserManagement } from "./components/desktop/UserManagement";
import { Reporting } from "./components/desktop/Reporting";
import { Announcements } from "./components/desktop/Announcements";
import { LessonBuilder } from "./components/desktop/LessonBuilder";
import { SessionBuilder } from "./components/desktop/SessionBuilder";
import { User } from "./App";

export const createRouter = (user: User, onLogout: () => void) =>
  createBrowserRouter([
    // Mobile Routes
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
    // Desktop Routes
    {
      path: "/desktop",
      element: <DesktopLayout user={user} onLogout={onLogout} />,
      children: [
        { index: true, element: <DesktopLanding user={user} /> },
        { path: "coaching", element: <DesktopCoaching /> },
        { path: "games", element: <DesktopGames /> },
        { path: "resources", element: <DesktopResources /> },
        { path: "schedule", element: <DesktopSchedule /> },
        { path: "messaging", element: <DesktopMessaging user={user} /> },
        { path: "teams", element: <TeamsManagement /> },
        { path: "users", element: <UserManagement /> },
        { path: "reporting", element: <Reporting /> },
        { path: "announcements", element: <Announcements /> },
        { path: "lesson-builder", element: <LessonBuilder /> },
        { path: "session-builder", element: <SessionBuilder /> },
      ],
    },
  ]);