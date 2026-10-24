import { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
  Drawer,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Pencil,
  UserCheck,
  StickyNote,
  FolderKanban,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  BookOpen,
  Sparkles,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Layers,
  RefreshCw,
  Grid,
  FileText,
  Briefcase,
  Calendar,
  X,
  CreditCard,
} from "lucide-react";

export default function SidebarNav({
  user,
  open = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  onOpenNewWorkItem,
  isDark = true,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // State for collapsible sections
  const [activeDock, setActiveDock] = useState("work");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isTerraLinkOpen, setIsTerraLinkOpen] = useState(true);
  const [isTryOpen, setIsTryOpen] = useState(true);

  // Check if a path is active
  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`));
  };

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // Color tokens
  const dockBg = isDark ? "#090a0d" : "#f1f5f9";
  const panelBg = isDark ? "#121317" : "#f8fafc";
  const borderColor = isDark ? "#21232b" : "#e2e8f0";
  const textColor = isDark ? "#e2e5eb" : "#0f172a";
  const textMuted = isDark ? "#8b92a0" : "#64748b";
  const activeBg = isDark ? "#22242c" : "#e2e8f0";
  const hoverBg = isDark ? "#191a20" : "#eef2f6";

  // Left primary icon strip items
  const dockItems = [
    { id: "work", label: "Work", icon: Briefcase, path: "/home" },
    { id: "wiki", label: "Wiki", icon: BookOpen, path: "/documents" },
    { id: "ai", label: "AI", icon: Sparkles, path: "/ai-assistant" },
  ];

  const dockBottomItems = [
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Secondary Navigation tree data
  const mainNavItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Drafts", path: "/drafts", icon: Pencil },
    { label: "Your work", path: "/portfolio", icon: UserCheck },
    { label: "Stickies", path: "/stickies", icon: StickyNote },
  ];



  const terraLinkSubItems = [
    { label: "Overview", path: "/project-overview", icon: LayoutDashboard },
    { label: "Work items", path: "/project-work-items", icon: Layers },
    { label: "Cycles", path: "/dashboard", icon: RefreshCw },
    { label: "Modules", path: "/explore", icon: Grid },
    { label: "Views", path: "/research", icon: SlidersHorizontal },
    { label: "Pages", path: "/documents", icon: FileText },
  ];

  // Sidebar Inner Content Component (Reusable for Desktop and Mobile Drawer)
  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: isCollapsed ? 54 : { xs: 290, sm: 294 },
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        borderRight: `1px solid ${borderColor}`,
        userSelect: "none",
      }}
    >
      {/* ─── 1. Left Primary Dock (Icon Strip) ─── */}
      <Box
        sx={{
          width: 54,
          flexShrink: 0,
          backgroundColor: dockBg,
          borderRight: `1px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 1.5,
          zIndex: 2,
        }}
      >
        {/* Top dock icons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeDock === item.id;
            return (
              <Tooltip key={item.id} title={item.label} placement="right" arrow>
                <Box
                  component="button"
                  onClick={() => {
                    setActiveDock(item.id);
                    if (isCollapsed && onToggleCollapse) onToggleCollapse();
                    if (item.path) handleNav(item.path);
                  }}
                  sx={{
                    width: 42,
                    height: 44,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isSelected ? (isDark ? "#1e2027" : "#e2e8f0") : "transparent",
                    color: isSelected ? textColor : textMuted,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: isDark ? "#17181f" : "#e2e8f0",
                      color: textColor,
                    },
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: isSelected ? 600 : 500,
                      mt: 0.3,
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Bottom dock icons */}
        <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
          {dockBottomItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeDock === item.id;
            return (
              <Tooltip key={item.id} title={item.label} placement="right" arrow>
                <Box
                  component="button"
                  onClick={() => {
                    setActiveDock(item.id);
                    handleNav(item.path);
                  }}
                  sx={{
                    width: 42,
                    height: 44,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isSelected ? (isDark ? "#1e2027" : "#e2e8f0") : "transparent",
                    color: isSelected ? textColor : textMuted,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: isDark ? "#17181f" : "#e2e8f0",
                      color: textColor,
                    },
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: isSelected ? 600 : 500,
                      mt: 0.3,
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}

          {/* Minimal collapse / expand button at dock bottom for desktop */}
          {onToggleCollapse && (
            <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right" arrow>
              <IconButton
                size="small"
                onClick={onToggleCollapse}
                sx={{
                  color: textMuted,
                  display: { xs: "none", md: "inline-flex" },
                  "&:hover": { color: textColor, bgcolor: isDark ? "#1e2027" : "#e2e8f0" },
                }}
              >
                {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* ─── 2. Secondary Sidebar Panel ─── */}
      {!isCollapsed && (
        <Box
          sx={{
            flex: 1,
            backgroundColor: panelBg,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            px: 1.5,
            py: 1.5,
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isDark ? "#282a35" : "#cbd5e1",
              borderRadius: 3,
            },
          }}
        >
          {/* Header of secondary sidebar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
              px: 0.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: textColor,
                letterSpacing: "-0.01em",
              }}
            >
              Work
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="View options" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: textMuted,
                    p: 0.5,
                    "&:hover": { color: textColor, bgcolor: hoverBg },
                  }}
                >
                  <SlidersHorizontal size={14} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Collapse sidebar" arrow>
                <IconButton
                  size="small"
                  onClick={onToggleCollapse}
                  sx={{
                    color: textMuted,
                    p: 0.5,
                    "&:hover": { color: textColor, bgcolor: hoverBg },
                  }}
                >
                  <PanelLeftClose size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* "+ New work item" Action Button */}
          <Box
            component="button"
            onClick={() => onOpenNewWorkItem && onOpenNewWorkItem()}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
              py: 0.8,
              px: 1.25,
              mb: 1.5,
              backgroundColor: isDark ? "#1c1e24" : "#ffffff",
              border: `1px solid ${borderColor}`,
              borderRadius: "7px",
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: isDark ? "#242730" : "#f1f5f9",
                borderColor: isDark ? "#383c48" : "#cbd5e1",
              },
            }}
          >
            <Plus size={15} color={textMuted} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8125rem" }}>
              New work item
            </Typography>
          </Box>

          {/* Main Navigation links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, mb: 2 }}>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const selected = isActive(item.path);
              return (
                <Box
                  key={item.label}
                  component="button"
                  onClick={() => handleNav(item.path)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    width: "100%",
                    py: 0.7,
                    px: 1,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: selected ? activeBg : "transparent",
                    color: selected ? textColor : textMuted,
                    fontWeight: selected ? 600 : 400,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: selected ? activeBg : hoverBg,
                      color: textColor,
                    },
                  }}
                >
                  <Icon size={16} strokeWidth={selected ? 2.2 : 1.8} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "inherit" }}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Section: Workspace */}
          <Box sx={{ mb: 2 }}>
            <Box
              component="button"
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                py: 0.5,
                px: 0.5,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: textMuted,
                "&:hover": { color: textColor },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.02em",
                  color: "inherit",
                }}
              >
                Workspace
              </Typography>
              {isWorkspaceOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Box>

            <Collapse in={isWorkspaceOpen}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, mt: 0.5 }}>
                <Box
                  component="button"
                  onClick={() => handleNav("/projects")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    width: "100%",
                    py: 0.65,
                    px: 1,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: textMuted,
                    "&:hover": { backgroundColor: hoverBg, color: textColor },
                  }}
                >
                  <FolderKanban size={15} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "inherit" }}>
                    Projects
                  </Typography>
                </Box>

                <Box
                  component="button"
                  onClick={() => handleNav("/explore")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    width: "100%",
                    py: 0.65,
                    px: 1,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: textMuted,
                    "&:hover": { backgroundColor: hoverBg, color: textColor },
                  }}
                >
                  <MoreHorizontal size={15} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "inherit" }}>
                    More
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Section: Projects */}
          <Box sx={{ mb: 2 }}>
            <Box
              component="button"
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                py: 0.5,
                px: 0.5,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: textMuted,
                "&:hover": { color: textColor },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.02em",
                  color: "inherit",
                }}
              >
                Projects
              </Typography>
              {isProjectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Box>

            <Collapse in={isProjectsOpen}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4, mt: 0.5 }}>
                {/* HR Management */}
                <Box
                  component="button"
                  onClick={() => handleNav("/projects")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    width: "100%",
                    py: 0.65,
                    px: 1,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: textMuted,
                    "&:hover": { backgroundColor: hoverBg, color: textColor },
                  }}
                >
                  <span style={{ fontSize: "0.95rem" }}>😀</span>
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "inherit" }} noWrap>
                    HR Management
                  </Typography>
                </Box>

                {/* TerraLink (Expanded project tree) */}
                <Box>
                  <Box
                    component="button"
                    onClick={() => setIsTerraLinkOpen(!isTerraLinkOpen)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      py: 0.65,
                      px: 1,
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      color: textColor,
                      "&:hover": { backgroundColor: hoverBg },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <span style={{ fontSize: "0.95rem" }}>👇</span>
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "inherit" }} noWrap>
                        TerraLink
                      </Typography>
                    </Box>
                    {isTerraLinkOpen ? <ChevronDown size={13} color={textMuted} /> : <ChevronRight size={13} color={textMuted} />}
                  </Box>

                  <Collapse in={isTerraLinkOpen}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, pl: 2, mt: 0.25 }}>
                      {terraLinkSubItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const selected = isActive(subItem.path);
                        return (
                          <Box
                            key={subItem.label}
                            component="button"
                            onClick={() => handleNav(subItem.path)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.25,
                              width: "100%",
                              py: 0.55,
                              px: 1,
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: selected ? activeBg : "transparent",
                              color: selected ? textColor : textMuted,
                              "&:hover": {
                                backgroundColor: selected ? activeBg : hoverBg,
                                color: textColor,
                              },
                            }}
                          >
                            <SubIcon size={14} color={selected ? textColor : textMuted} />
                            <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "inherit" }}>
                              {subItem.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Bottom Section: Try + Trial Badge */}
          <Box sx={{ mt: "auto", pt: 1.5 }}>
            <Box
              component="button"
              onClick={() => setIsTryOpen(!isTryOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                py: 0.5,
                px: 0.5,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: textMuted,
                "&:hover": { color: textColor },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.02em",
                  color: "inherit",
                }}
              >
                Try
              </Typography>
              {isTryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Box>

            <Collapse in={isTryOpen}>
              <Box
                component="button"
                onClick={() => handleNav("/settings")}
                sx={{
                  mt: 0.75,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  py: 0.9,
                  px: 1.25,
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "#2a2d37" : "#e2e8f0"}`,
                  backgroundColor: isDark ? "#17181f" : "#ffffff",
                  color: textColor,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: isDark ? "#3e4252" : "#cbd5e1",
                    backgroundColor: isDark ? "#1e2029" : "#f1f5f9",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: isDark ? "#c5cbd6" : "#475569",
                  }}
                >
                  Business trial ends in 12d
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "flex" },
          height: "calc(100vh - 52px)",
          position: "sticky",
          top: 52,
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: "auto",
              bgcolor: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <Box sx={{ height: "100vh", bgcolor: dockBg }}>{sidebarContent}</Box>
      </Drawer>
    </>
  );
}
