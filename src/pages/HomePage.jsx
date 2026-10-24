import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import {
  Maximize2,
  Plus,
  ChevronDown,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  Search,
  Wrench,
  MousePointer2,
  X,
  Circle,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";

// Custom Google Chrome SVG Icon matching the screenshot
function ChromeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" fill="#4285F4" />
      <path d="M12 2a10 10 0 0 1 8.66 5l-4.33 7.5A4 4 0 0 0 12 8V2z" fill="#EA4335" />
      <path d="M20.66 7a10 10 0 0 1 0 10H12a4 4 0 0 0 3.46-2l5.2-8z" fill="#FBBC05" />
      <path d="M12 22a10 10 0 0 1-8.66-5l4.33-7.5A4 4 0 0 0 12 16v6z" fill="#34A853" />
    </svg>
  );
}

export default function HomePage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark = true } = useThemeContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentsFilter, setRecentsFilter] = useState("All");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [quickLinkModalOpen, setQuickLinkModalOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
  const [isAiActivated, setIsAiActivated] = useState(false);

  // Dynamic user name and greeting
  const displayName = user?.nameEn || "NIRON ROEM";

  // Current formatted date time
  const [timeString, setTimeString] = useState("Tuesday, Oct 20 10:58");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: "long", month: "short", day: "numeric" };
      const datePart = now.toLocaleDateString("en-US", options);
      const hours = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      setTimeString(`${datePart} ${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Quicklinks state
  const [quicklinks, setQuicklinks] = useState([
    {
      id: "1",
      title: "Plane Changelog",
      time: "1 day ago",
      iconType: "chrome",
      url: "https://plane.so/changelog",
    },
    {
      id: "2",
      title: "Plane Docs",
      time: "1 day ago",
      iconType: "doc",
      url: "https://docs.plane.so",
    },
    {
      id: "3",
      title: "Plane Blogs",
      time: "1 day ago",
      iconType: "chrome",
      url: "https://plane.so/blog",
    },
  ]);

  // Recents work items matching screenshot
  const [recentItems, setRecentItems] = useState([
    {
      id: "TERRA-4",
      title: "3. Create and assign Work Items",
      emoji: "✏️",
      time: "10 minutes ago",
      status: "in-progress",
      statusColor: "#f97316", // orange
      priorityIcon: "bars",
    },
    {
      id: "TERRA-7",
      title: "6. Customize your settings",
      emoji: "⚙️",
      time: "1 day ago",
      status: "backlog",
      statusColor: "#64748b",
      priorityIcon: "dash",
    },
    {
      id: "HRMANAGEME-1",
      title: "Design UI",
      emoji: "💻",
      time: "1 day ago",
      status: "review",
      statusColor: "#eab308", // yellow
      priorityIcon: "star",
    },
    {
      id: "TERRA-5",
      title: "4. Visualize your work",
      emoji: "👤",
      time: "1 day ago",
      status: "backlog",
      statusColor: "#64748b",
      priorityIcon: "dash",
    },
  ]);

  const handleAddQuickLink = (e) => {
    e.preventDefault();
    if (!newLinkTitle.trim()) return;
    setQuicklinks([
      ...quicklinks,
      {
        id: Date.now().toString(),
        title: newLinkTitle,
        time: "Just now",
        iconType: newLinkUrl.includes("doc") ? "doc" : "chrome",
        url: newLinkUrl || "#",
      },
    ]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setQuickLinkModalOpen(false);
  };

  // Color tokens
  const pageBg = isDark ? "#0c0d10" : "#ffffff";
  const cardBg = isDark ? "#14151a" : "#f8fafc";
  const cardBorder = isDark ? "#22242c" : "#e2e8f0";
  const textColor = isDark ? "#f3f4f6" : "#0f172a";
  const textMuted = isDark ? "#8b92a0" : "#64748b";
  const hoverBg = isDark ? "#1a1b22" : "#f1f5f9";

  return (
    <DashboardLayout
      user={user}
      logout={logout}
      language={language}
      changeLanguage={changeLanguage}
      toggleColorMode={toggleColorMode}
      isDark={isDark}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      pageTitle="Home"
      onManageWidgets={() => setWidgetsModalOpen(true)}
    >
      <Box
        sx={{
          maxWidth: 1040,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* ─── 1. Greeting Section ─── */}
        <Box sx={{ textAlign: "center", mt: 1, mb: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.875rem" },
              letterSpacing: "-0.02em",
              color: textColor,
              mb: 0.75,
            }}
          >
            Good morning, {displayName}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: textMuted,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <span>⛅</span>
            <span>{timeString}</span>
          </Box>
        </Box>

        {/* ─── 2. "Ask Plane AI" Card ─── */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.25,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: textColor,
                letterSpacing: "-0.01em",
              }}
            >
              Ask Plane AI
            </Typography>

            <Tooltip title="Expand widget" arrow>
              <IconButton
                size="small"
                sx={{
                  color: textMuted,
                  "&:hover": { color: textColor, bgcolor: hoverBg },
                }}
              >
                <Maximize2 size={15} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "12px",
              p: { xs: 2.5, sm: 3, md: 3.5 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 3, md: 4 },
              transition: "border-color 0.2s ease",
              "&:hover": {
                borderColor: isDark ? "#2e313c" : "#cbd5e1",
              },
            }}
          >
            {/* Left Column: UI Mockup Preview */}
            <Box
              sx={{
                flex: { xs: "none", md: "0 0 320px" },
                width: { xs: "100%", md: 320 },
                backgroundColor: isDark ? "#0d0e12" : "#ffffff",
                border: `1px solid ${cardBorder}`,
                borderRadius: "10px",
                p: 2,
                boxShadow: isDark
                  ? "0 10px 25px rgba(0,0,0,0.4)"
                  : "0 10px 25px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              {/* Mockup Acme Corp chip */}
              <Box sx={{ mb: 1.5 }}>
                <Chip
                  icon={<span style={{ fontSize: "0.75rem" }}>🏢</span>}
                  label="Acme Corp"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    bgcolor: isDark ? "#1d1f27" : "#f1f5f9",
                    color: textColor,
                    border: `1px solid ${cardBorder}`,
                  }}
                />
              </Box>

              {/* Mockup action list */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  backgroundColor: isDark ? "#131419" : "#f8fafc",
                  p: 1,
                  borderRadius: "8px",
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.6,
                    px: 1,
                    borderRadius: "5px",
                    color: textMuted,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Search size={13} />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      Ask
                    </Typography>
                  </Box>
                  <Check size={13} color="#38bdf8" />
                </Box>

                {/* Build mode row with mouse cursor simulation */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 0.6,
                    px: 1,
                    borderRadius: "5px",
                    backgroundColor: isDark ? "#242733" : "#e2e8f0",
                    color: textColor,
                    position: "relative",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Wrench size={13} color="#38bdf8" />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      Build
                    </Typography>
                  </Box>
                  {/* Cursor pointer */}
                  <Box
                    sx={{
                      position: "absolute",
                      right: 18,
                      bottom: -8,
                      pointerEvents: "none",
                    }}
                  >
                    <MousePointer2 size={16} fill="#ffffff" color="#000000" />
                  </Box>
                </Box>
              </Box>

              {/* Tag at bottom */}
              <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
                <Chip
                  icon={<Search size={11} />}
                  label="Ask"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: isDark ? "#181a21" : "#f1f5f9",
                    color: textMuted,
                  }}
                />
              </Box>
            </Box>

            {/* Right Column: AI Action description and button */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  color: textColor,
                  mb: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                Plane AI can now take actions for you.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: textMuted,
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  mb: 2.5,
                  maxWidth: 480,
                }}
              >
                Use Build mode to create work items, cycles and more. Activate now to start Plane AI actions.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setIsAiActivated(!isAiActivated)}
              >
                {isAiActivated ? "Plane AI Active ✓" : "Activate Plane AI"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ─── 3. "Quicklinks" Section ─── */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.25,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: textColor,
              }}
            >
              Quicklinks
            </Typography>

            <Button
              size="small"
              onClick={() => setQuickLinkModalOpen(true)}
              startIcon={<Plus size={13} />}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: textMuted,
                borderRadius: "6px",
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDark ? "#14151a" : "#ffffff",
                px: 1.2,
                py: 0.4,
                "&:hover": {
                  color: textColor,
                  backgroundColor: hoverBg,
                  borderColor: isDark ? "#383c48" : "#cbd5e1",
                },
              }}
            >
              Add quick link
            </Button>
          </Box>

          {/* Quicklink Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {quicklinks.map((link) => (
              <Box
                key={link.id}
                component="a"
                href={link.url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.75,
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: isDark ? "#3b3e4d" : "#cbd5e1",
                    backgroundColor: hoverBg,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {/* Icon wrapper */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: isDark ? "#1a1b22" : "#f1f5f9",
                    flexShrink: 0,
                  }}
                >
                  {link.iconType === "chrome" ? (
                    <ChromeIcon size={18} />
                  ) : (
                    <FileText size={18} color="#38bdf8" />
                  )}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: textColor,
                    }}
                    noWrap
                  >
                    {link.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textMuted,
                      fontSize: "0.75rem",
                    }}
                  >
                    {link.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── 4. "Recents" Section ─── */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.25,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: textColor,
              }}
            >
              Recents
            </Typography>

            {/* Filter Dropdown */}
            <Box
              component="button"
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: textMuted,
                fontSize: "0.78125rem",
                fontWeight: 500,
                py: 0.4,
                px: 1,
                borderRadius: "5px",
                "&:hover": { color: textColor, bgcolor: hoverBg },
              }}
            >
              <span>{recentsFilter}</span>
              <ChevronDown size={14} />
            </Box>

            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={() => setFilterAnchor(null)}
              slotProps={{
                paper: {
                  sx: {
                    bgcolor: isDark ? "#16171d" : "#ffffff",
                    color: textColor,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "8px",
                    minWidth: 140,
                  },
                },
              }}
            >
              {["All", "Assigned to me", "Created by me"].map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => {
                    setRecentsFilter(option);
                    setFilterAnchor(null);
                  }}
                  sx={{
                    fontSize: "0.8125rem",
                    py: 0.75,
                    "&:hover": { bgcolor: hoverBg },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* List of recent items */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {recentItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.1,
                  px: 1.5,
                  borderRadius: "8px",
                  border: `1px solid transparent`,
                  backgroundColor: "transparent",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  },
                }}
              >
                {/* Left side: Icon, ID, Title, Emoji, Time */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {/* Layer / Work item icon */}
                  <Layers size={14} color={textMuted} style={{ flexShrink: 0 }} />

                  {/* Item ID */}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: textMuted,
                      letterSpacing: "0.02em",
                      flexShrink: 0,
                    }}
                  >
                    {item.id}
                  </Typography>

                  {/* Title and Emoji */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      color: textColor,
                    }}
                    noWrap
                  >
                    {item.title} <span style={{ marginLeft: 4 }}>{item.emoji}</span>
                  </Typography>

                  {/* Time */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: textMuted,
                      fontSize: "0.75rem",
                      display: { xs: "none", sm: "inline" },
                      flexShrink: 0,
                    }}
                  >
                    {item.time}
                  </Typography>
                </Box>

                {/* Right side: Status icons matching screenshot */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0, pl: 2 }}>
                  {item.status === "in-progress" ? (
                    <>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `2px solid #f97316`,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f97316" }} />
                      </Box>
                      {/* Signal bars */}
                      <Box sx={{ display: "flex", alignItems: "flex-end", gap: "2px", height: 12 }}>
                        <Box sx={{ width: 2, height: 4, bgcolor: "#f97316" }} />
                        <Box sx={{ width: 2, height: 8, bgcolor: "#f97316" }} />
                        <Box sx={{ width: 2, height: 12, bgcolor: "#f97316" }} />
                      </Box>
                    </>
                  ) : item.status === "review" ? (
                    <>
                      {/* Double circle */}
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `2px solid #eab308`,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#eab308" }} />
                      </Box>
                      {/* Sparkle icon */}
                      <Sparkles size={13} color="#c084fc" />
                    </>
                  ) : (
                    <>
                      {/* Dashed circle */}
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `1.5px dashed ${textMuted}`,
                        }}
                      />
                      {/* Horizontal Dash */}
                      <Box sx={{ width: 10, height: 2, bgcolor: textMuted, borderRadius: 1 }} />
                    </>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── Add Quicklink Dialog ─── */}
      <Dialog
        open={quickLinkModalOpen}
        onClose={() => setQuickLinkModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: cardBg,
              color: textColor,
              borderRadius: "10px",
              border: `1px solid ${cardBorder}`,
            },
          },
        }}
      >
        <form onSubmit={handleAddQuickLink}>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Add quick link
            </Typography>
            <IconButton size="small" onClick={() => setQuickLinkModalOpen(false)} sx={{ color: textMuted }}>
              <X size={16} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              size="small"
              label="Title"
              placeholder="e.g. Project Roadmap"
              fullWidth
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              required
            />
            <TextField
              size="small"
              label="URL"
              placeholder="https://..."
              fullWidth
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: `1px solid ${cardBorder}` }}>
            <Button size="small" onClick={() => setQuickLinkModalOpen(false)} sx={{ textTransform: "none", color: textMuted }}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="small"
              variant="contained"
              sx={{ textTransform: "none", bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" } }}
            >
              Add link
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Manage Widgets Dialog ─── */}
      <Dialog
        open={widgetsModalOpen}
        onClose={() => setWidgetsModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: cardBg,
              color: textColor,
              borderRadius: "10px",
              border: `1px solid ${cardBorder}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Manage widgets
          </Typography>
          <IconButton size="small" onClick={() => setWidgetsModalOpen(false)} sx={{ color: textMuted }}>
            <X size={16} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {["Ask Plane AI", "Quicklinks", "Recents", "Work item metrics", "Calendar cycles"].map((widget) => (
            <Box
              key={widget}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.25,
                borderRadius: "6px",
                border: `1px solid ${cardBorder}`,
              }}
            >
              <Typography variant="body2">{widget}</Typography>
              <Chip label="Enabled" size="small" color="primary" sx={{ height: 20, fontSize: "0.7rem" }} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${cardBorder}` }}>
          <Button size="small" onClick={() => setWidgetsModalOpen(false)} sx={{ textTransform: "none", color: textMuted }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
