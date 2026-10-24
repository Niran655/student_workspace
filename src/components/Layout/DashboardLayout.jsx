import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { LayoutGrid, Home, FolderKanban, Settings, Sparkles, PencilLine } from "lucide-react";
import { useLocation } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import SidebarNav from "./SidebarNav";
import NewWorkItemModal from "./NewWorkItemModal";

export default function DashboardLayout({
  children,
  user,
  logout,
  language,
  changeLanguage,
  toggleColorMode,
  isDark = true,
  searchQuery,
  onSearchChange,
  showSubHeader = true,
  pageTitle,
  pageIcon,
  onManageWidgets,
  headerRight,
  titleExtra, // NEW: rendered right next to the page title (badges, action buttons…)
}) {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  // Background and border colors
  const mainBg = isDark ? "#0c0d10" : "#ffffff";
  const borderColor = isDark ? "#21232b" : "#e2e8f0";
  const textColor = isDark ? "#f3f4f6" : "#0f172a";
  const textMuted = isDark ? "#8b92a0" : "#64748b";

  // Derive active page title & icon if not explicitly passed
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/" || path === "/home") return { title: "Home", icon: Home };
    if (path.startsWith("/projects")) return { title: "Projects", icon: FolderKanban };
    if (path.startsWith("/settings")) return { title: "Settings", icon: Settings };
    if (path.startsWith("/ai-assistant")) return { title: "Plane AI", icon: Sparkles };
    if (path.startsWith("/portfolio")) return { title: "Your work", icon: Home };
    if (path.startsWith("/draft")) return { title: "Drafts", icon: PencilLine };
    const clean = path.replace("/", "").replace(/-/g, " ");
    return {
      title: clean.charAt(0).toUpperCase() + clean.slice(1),
      icon: Home,
    };
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageIcon || pageInfo.icon;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: mainBg,
        color: textColor,
      }}
    >
      {/* ─── Global Top Header ─── */}
      <HeaderBar
        user={user}
        logout={logout}
        language={language}
        changeLanguage={changeLanguage}
        toggleColorMode={toggleColorMode}
        isDark={isDark}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onToggleNavigation={() => setIsMobileSidebarOpen((prev) => !prev)}
        onOpenNewWorkItem={() => setIsNewItemModalOpen(true)}
      />

      {/* ─── Body Area: Dual-Sidebar + Content ─── */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Left Dual-Sidebar (Icon Dock + Navigation Pane) */}
        <SidebarNav
          user={user}
          open={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenNewWorkItem={() => setIsNewItemModalOpen(true)}
          isDark={isDark}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: mainBg,
            overflowY: showSubHeader ? "auto" : "hidden",
            height: "calc(100vh - 52px)",
          }}
        >
          {/* Sub-header: [icon] Title [titleExtra]            [headerRight | Manage widgets] */}
          {showSubHeader && (
            <Box
              sx={{
                height: 44,
                px: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                borderBottom: `1px solid ${borderColor}`,
                backgroundColor: mainBg,
                flexShrink: 0,
              }}
            >
              {/* Title group: icon + title + any inline extras (flex row) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                <PageIcon size={15} color={textMuted} style={{ flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: textColor,
                  }}
                >
                  {pageTitle || pageInfo.title}
                </Typography>
                {titleExtra}
              </Box>

              {/* Top right area: custom headerRight or Manage widgets button */}
              {headerRight !== undefined ? (
                headerRight
              ) : onManageWidgets ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onManageWidgets}
                  startIcon={<LayoutGrid size={14} />}
                  sx={{
                    height: 28,
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: textMuted,
                    border: `1px solid ${isDark ? "#282a35" : "#cbd5e1"}`,
                    borderColor: `${isDark ? "#282a35" : "#cbd5e1"} !important`,
                    backgroundColor: isDark ? "#14151b" : "#f8fafc",
                    borderRadius: "6px",
                    px: 1.25,
                    boxShadow: "none",
                    flexShrink: 0,
                    "&:hover": {
                      color: textColor,
                      backgroundColor: isDark ? "#1b1c24" : "#f1f5f9",
                      border: `1px solid ${isDark ? "#383c48" : "#94a3b8"}`,
                      borderColor: `${isDark ? "#383c48" : "#94a3b8"} !important`,
                    },
                  }}
                >
                  Manage widgets
                </Button>
              ) : null}
            </Box>
          )}

          {/* Page Body */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/* New Work Item Quick Creation Modal */}
      <NewWorkItemModal
        open={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        isDark={isDark}
      />
    </Box>
  );
}