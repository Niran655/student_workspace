import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  InputBase,
  Button,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Search,
  ChevronDown,
  Inbox,
  HelpCircle,
  Menu as MenuIcon,
  Check,
  Plus,
  Sparkles,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  Compass,
  FolderKanban,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderBar({
  user,
  logout,
  language,
  changeLanguage,
  toggleColorMode,
  isDark = true,
  searchQuery,
  onSearchChange,
  onToggleNavigation,
  onOpenNewWorkItem,
}) {
  const navigate = useNavigate();
  const [workspaceAnchor, setWorkspaceAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [helpAnchor, setHelpAnchor] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState("TerraLink");

  const workspaces = [
    { name: "TerraLink", initial: "T", color: "#d946ef", role: "Owner" },
    { name: "HR Management", initial: "H", color: "#f59e0b", role: "Admin" },
    { name: "UniForge Student Lab", initial: "U", color: "#06b6d4", role: "Member" },
  ];

  const isKhLang = language === "kh";

  // Visual tokens tailored for obsidian dark / clean light theme
  const headerBg = isDark ? "#0d0e12" : "#ffffff";
  const borderColor = isDark ? "#21232b" : "#e5e7eb";
  const textColor = isDark ? "#f3f4f6" : "#111827";
  const textMuted = isDark ? "#9ca3af" : "#6b7280";
  const searchBg = isDark ? "#17181f" : "#f3f4f6";
  const buttonBg = isDark ? "#16171d" : "#ffffff";

  return (
    <Box
      component="header"
      sx={{
        height: 52,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, sm: 2, md: 2.5 },
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        zIndex: 1200,
        position: "sticky",
        top: 0,
      }}
    >
      {/* LEFT: Mobile Nav Toggle + Workspace Selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Mobile menu button */}
        <IconButton
          size="small"
          onClick={onToggleNavigation}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: textMuted,
            "&:hover": { color: textColor },
          }}
        >
          <MenuIcon size={18} />
        </IconButton>

        {/* Workspace Switcher */}
        <Box
          component="button"
          onClick={(e) => setWorkspaceAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.2,
            py: 0.6,
            borderRadius: "7px",
            border: `1px solid transparent`,
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: isDark ? "#1c1e26" : "#f3f4f6",
              borderColor: isDark ? "#2d303b" : "#e5e7eb",
            },
          }}
        >
          {/* Logo badge */}
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "6px",
              backgroundColor:
                activeWorkspace === "TerraLink"
                  ? "#d946ef"
                  : activeWorkspace === "HR Management"
                  ? "#f59e0b"
                  : "#06b6d4",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: "0.75rem",
              fontWeight: 800,
              boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
            }}
          >
            {activeWorkspace.charAt(0)}
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: textColor,
              letterSpacing: "-0.01em",
            }}
          >
            {activeWorkspace}
          </Typography>

          <ChevronDown size={14} color={textMuted} />
        </Box>

        {/* Workspace Switcher Menu */}
        <Menu
          anchorEl={workspaceAnchor}
          open={Boolean(workspaceAnchor)}
          onClose={() => setWorkspaceAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                bgcolor: isDark ? "#16171d" : "#ffffff",
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                minWidth: 230,
                mt: 1,
                boxShadow: isDark
                  ? "0 12px 30px rgba(0,0,0,0.6)"
                  : "0 12px 30px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ color: textMuted, fontWeight: 700 }}>
              WORKSPACES
            </Typography>
          </Box>

          {workspaces.map((ws) => (
            <MenuItem
              key={ws.name}
              onClick={() => {
                setActiveWorkspace(ws.name);
                setWorkspaceAnchor(null);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1,
                px: 2,
                "&:hover": { bgcolor: isDark ? "#21232d" : "#f1f5f9" },
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "5px",
                  bgcolor: ws.color,
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {ws.initial}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={activeWorkspace === ws.name ? 600 : 400}>
                  {ws.name}
                </Typography>
                <Typography variant="caption" sx={{ color: textMuted }}>
                  {ws.role}
                </Typography>
              </Box>
              {activeWorkspace === ws.name && <Check size={15} color="#38bdf8" />}
            </MenuItem>
          ))}

          <Divider sx={{ my: 1, borderColor: borderColor }} />

          <MenuItem
            onClick={() => {
              setWorkspaceAnchor(null);
              navigate("/projects");
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 0.9,
              px: 2,
              fontSize: "0.8125rem",
              color: textMuted,
              "&:hover": { color: textColor, bgcolor: isDark ? "#21232d" : "#f1f5f9" },
            }}
          >
            <Plus size={15} />
            <span>Create new workspace</span>
          </MenuItem>
        </Menu>
      </Box>

      {/* CENTER: Search Bar with Icon and Shortcut */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          width: { sm: 260, md: 360, lg: 420 },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: 32,
            px: 1.5,
            borderRadius: "7px",
            backgroundColor: searchBg,
            border: `1px solid ${borderColor}`,
            transition: "all 0.15s ease",
            "&:hover": {
              borderColor: isDark ? "#3e4252" : "#cbd5e1",
            },
            "&:focus-within": {
              borderColor: "#0284c7",
              boxShadow: "0 0 0 1px #0284c7",
            },
          }}
        >
          <Search size={14} color={textMuted} style={{ marginRight: 8, flexShrink: 0 }} />
          <InputBase
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              color: textColor,
              fontSize: "0.8125rem",
              "& input": {
                padding: 0,
                "&::placeholder": {
                  color: textMuted,
                  opacity: 0.9,
                },
              },
            }}
          />
          <Box
            sx={{
              px: 0.8,
              py: 0.2,
              borderRadius: "4px",
              backgroundColor: isDark ? "#22242f" : "#e2e8f0",
              color: textMuted,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            /
          </Box>
        </Box>
      </Box>

      {/* RIGHT: Actions (Get Started, Inbox, Help, User Avatar) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Get started button */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => onOpenNewWorkItem && onOpenNewWorkItem()}
          sx={{
            display: { xs: "none", md: "inline-flex" },
            height: 30,
            textTransform: "none",
            fontSize: "0.78125rem",
            fontWeight: 500,
            color: textColor,
            borderColor: borderColor,
            backgroundColor: buttonBg,
            borderRadius: "6px",
            px: 1.5,
            "&:hover": {
              backgroundColor: isDark ? "#21232d" : "#f8fafc",
              borderColor: isDark ? "#3e4252" : "#cbd5e1",
            },
          }}
        >
          Get started
        </Button>

        {/* Notifications / Inbox button */}
        <Tooltip title="Inbox" arrow>
          <IconButton
            size="small"
            onClick={() => navigate("/notifications")}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              color: textMuted,
              "&:hover": {
                color: textColor,
                backgroundColor: isDark ? "#1c1e26" : "#f1f5f9",
              },
            }}
          >
            <Inbox size={16} />
          </IconButton>
        </Tooltip>

        {/* Help icon button */}
        <Tooltip title="Help & Support" arrow>
          <IconButton
            size="small"
            onClick={(e) => setHelpAnchor(e.currentTarget)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              color: textMuted,
              "&:hover": {
                color: textColor,
                backgroundColor: isDark ? "#1c1e26" : "#f1f5f9",
              },
            }}
          >
            <HelpCircle size={16} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={helpAnchor}
          open={Boolean(helpAnchor)}
          onClose={() => setHelpAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                bgcolor: isDark ? "#16171d" : "#ffffff",
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                minWidth: 190,
                mt: 1,
              },
            },
          }}
        >
          <MenuItem onClick={() => { setHelpAnchor(null); navigate("/documents"); }}>
            <ListItemIcon><FileText size={16} color={textMuted} /></ListItemIcon>
            <ListItemText primary="Documentation" />
          </MenuItem>
          <MenuItem onClick={() => { setHelpAnchor(null); navigate("/discussions"); }}>
            <ListItemIcon><Compass size={16} color={textMuted} /></ListItemIcon>
            <ListItemText primary="Community & Help" />
          </MenuItem>
          <MenuItem onClick={() => { setHelpAnchor(null); }}>
            <ListItemIcon><Sparkles size={16} color="#38bdf8" /></ListItemIcon>
            <ListItemText primary="What's new" />
          </MenuItem>
        </Menu>

        {/* User profile avatar */}
        <Tooltip title={user?.nameEn || "NIRON ROEM"} arrow>
          <Box
            component="button"
            onClick={(e) => setUserAnchor(e.currentTarget)}
            sx={{
              p: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              ml: 0.5,
            }}
          >
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: `2px solid ${isDark ? "#282a35" : "#e2e8f0"}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              {user?.nameEn?.charAt(0) || "N"}
            </Avatar>
          </Box>
        </Tooltip>

        {/* User Profile Menu */}
        <Menu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={() => setUserAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                bgcolor: isDark ? "#16171d" : "#ffffff",
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                minWidth: 220,
                mt: 1,
                boxShadow: isDark
                  ? "0 16px 36px rgba(0,0,0,0.6)"
                  : "0 16px 36px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.nameEn || "NIRON ROEM"}
            </Typography>
            <Typography variant="caption" sx={{ color: textMuted }} noWrap display="block">
              {user?.email || "niron.roem@workspace.io"}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5, borderColor: borderColor }} />

          <MenuItem onClick={() => { setUserAnchor(null); navigate("/profile"); }}>
            <ListItemText primary="Your profile" />
          </MenuItem>
          <MenuItem onClick={() => { setUserAnchor(null); navigate("/settings"); }}>
            <ListItemIcon><Settings size={16} color={textMuted} /></ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>

          <Divider sx={{ my: 0.5, borderColor: borderColor }} />

          {/* Theme Switcher in menu */}
          <MenuItem onClick={() => { toggleColorMode && toggleColorMode(); }}>
            <ListItemIcon>
              {isDark ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
            </ListItemIcon>
            <ListItemText primary={isDark ? "Light theme" : "Dark theme"} />
          </MenuItem>

          {/* Language Switcher */}
          <MenuItem onClick={() => { changeLanguage && changeLanguage(isKhLang ? "en" : "kh"); }}>
            <ListItemIcon><Globe size={16} color={textMuted} /></ListItemIcon>
            <ListItemText primary={isKhLang ? "Language: 🇰🇭 KH" : "Language: 🇺🇸 EN"} />
          </MenuItem>

          <Divider sx={{ my: 0.5, borderColor: borderColor }} />

          <MenuItem
            onClick={() => {
              setUserAnchor(null);
              if (logout) logout();
            }}
            sx={{ color: "#ef4444" }}
          >
            <ListItemIcon><LogOut size={16} color="#ef4444" /></ListItemIcon>
            <ListItemText primary="Sign out" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}