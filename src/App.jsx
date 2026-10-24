import { Snackbar, Alert } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LearningHubPage from "./pages/LearningHubPage";
import LearningPage from "./pages/LearningPage";
import ThemeCustomizer from "./components/ThemeCustomizer/ThemeCustomizer";
import {
  AIAssistantPage,
  CalendarPage,
  CareerPathPage,
  CoursesPage,
  DiscussionsPage,
  DocumentsPage,
  EventsPage,
  FindTeammatesPage,
  MyPlanPage,
  NotificationsPage,
  NotesPage,



  ResearchPage,

  SkillMapPage,
  TeamsPage,
} from "./pages/PlatformPages";
import SettingsPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import ProjectsPage from "./pages/ProjectPage";
import ProjectOverviewPage from "./pages/ProjectOverviewPage";
import WorkspacePage from "./pages/WorkspacePage";
import DraftPage from "./pages/DraftPage";
import PortfolioPage from "./pages/PortfolioPage";
import StickiesPage from "./pages/StickiesPage";
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated, alert, setAlert } = useAuth();
  const alertState = alert ? alert() : { open: false, status: "info", message: { messageEn: "" } };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    if (setAlert) setAlert(false, "", { messageEn: "", messageKh: "" });
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <ProtectedRoute>
              <DraftPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <MyPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-overview"
          element={
            <ProtectedRoute>
              <ProjectOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-work-items"
          element={
            <ProtectedRoute>
              <PortfolioPage projectName="TerraLink" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stickies"
          element={
            <ProtectedRoute>
              <StickiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-hub"
          element={
            <ProtectedRoute>
              <LearningHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research"
          element={
            <ProtectedRoute>
              <ResearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-map"
          element={
            <ProtectedRoute>
              <SkillMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <PortfolioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career"
          element={
            <ProtectedRoute>
              <CareerPathPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-teammates"
          element={
            <ProtectedRoute>
              <FindTeammatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions"
          element={
            <ProtectedRoute>
              <DiscussionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning/:lessonId"
          element={
            <ProtectedRoute>
              <LearningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:username/:section/new"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:username/:section/:id/views/:view"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
      </Routes>
      <ThemeCustomizer />

      {/* Global Context Alert Notification */}
      <Snackbar
        open={Boolean(alertState?.open)}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertState?.status === "success" ? "success" : alertState?.status === "error" ? "error" : "info"}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 600 }}
        >
          {alertState?.message?.messageEn || alertState?.message?.messageKh || "Notification"}
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
