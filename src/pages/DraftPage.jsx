import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Button,
  Divider,
  Popover,
} from "@mui/material";
import {
  Pencil,
  PencilLine,
  Plus,
  Trash2,
  Copy,
  FolderInput,
  MoreHorizontal,
  CalendarClock,
  CalendarCheck,
  CircleDashed,
  Circle,
  CheckCircle2,
  XCircle,
  BarChart2,
  Minus,
  Contrast,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CreateDraftModal from "../components/Modals/CreateDraftModal";

/* ───────────── constants & helpers ───────────── */

const STORAGE_DRAFTS = "uniforge_drafts";
const STORAGE_ITEMS = "uniforge_work_items";

const STATE_COLORS = {
  Backlog: "#858b98",
  Todo: "#8a8f9c",
  "In Progress": "#f59e0b",
  Done: "#10b981",
  Cancelled: "#ef4444",
};

const PRIORITY_COLORS = {
  Urgent: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#3b82f6",
  None: "#858b98",
};

const STATE_OPTIONS = Object.keys(STATE_COLORS);
const PRIORITY_OPTIONS = Object.keys(PRIORITY_COLORS);

const LABEL_OPTIONS = [
  { name: "admin", color: "#0ea5e9" },
  { name: "concepts", color: "#a855f7" },
  { name: "bug", color: "#ef4444" },
  { name: "feature", color: "#22c55e" },
  { name: "design", color: "#f59e0b" },
];

const DEFAULT_CYCLES = ["Cycle 1: Getting Started with Plane", "Cycle 2: Sprint 15"];
const DEFAULT_MEMBERS = ["NIRON ROEM", "Alex Rivera", "Elena Vance"];

const INITIAL_DRAFTS = [
  {
    id: "draft-1",
    projectKey: "TERRA",
    project: "TerraLink",
    title: "Hello",
    content: "Implement real-time collaboration cursor sync in Canvas.",
    type: "work-item",
    parentItem: "TERRA-6 5. Use Cycles to time box tasks 🗓️",
    priority: "Medium",
    state: "Backlog",
    labels: "2 labels",
    startDate: "Oct 19, 2026",
    endDate: "Oct 28, 2026",
    cycle: "Cycle 1: Getting Started with Plane",
    assignee: "NIRON ROEM",
    extraCount: "+1",
    updatedAt: "15 minutes ago",
  },
  {
    id: "draft-2",
    projectKey: "TERRA",
    project: "TerraLink",
    title: "Sprint 14 Architecture Review: Micro-frontend vs Monolith",
    content: "Draft proposal comparing Module Federation vs Single-SPA for the student workspace portal.",
    type: "work-item",
    parentItem: null,
    priority: "High",
    state: "In Progress",
    labels: "Architecture",
    startDate: "Oct 18, 2026",
    endDate: "Oct 24, 2026",
    cycle: "Cycle 1: Getting Started with Plane",
    assignee: "Alex Rivera",
    extraCount: null,
    updatedAt: "2 hours ago",
  },
  {
    id: "draft-3",
    projectKey: "TERRA",
    project: "TerraLink",
    title: "Fix OAuth token refresh expiration loop on cold start",
    content: "Users report getting redirected back to the login page intermittently after their session expires overnight.",
    type: "work-item",
    parentItem: null,
    priority: "Urgent",
    state: "Todo",
    labels: "Bug",
    startDate: "Oct 20, 2026",
    endDate: "Oct 22, 2026",
    cycle: "Cycle 2: Sprint 15",
    assignee: "Elena Vance",
    extraCount: null,
    updatedAt: "Yesterday",
  },
];

// "TerraLink" → "TERRA", "HR Management" → "HRMANAGEME"
const projectKeyOf = (project) =>
  project === "TerraLink"
    ? "TERRA"
    : (project || "TERRA").replace(/\s+/g, "").substring(0, 10).toUpperCase();

const loadDrafts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_DRAFTS));
    return Array.isArray(saved) ? saved : INITIAL_DRAFTS;
  } catch {
    return INITIAL_DRAFTS;
  }
};

/* ── dates are stored as "Oct 28, 2026" strings ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseDate = (str) => {
  if (!str) return null;
  const m = String(str).match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/);
  if (m) {
    const mi = MONTHS.findIndex((x) => x.toLowerCase() === m[1].toLowerCase());
    if (mi >= 0) return new Date(Number(m[3]), mi, Number(m[2]));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const formatDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* ── labels: stored as `labelList` (array) + `labels` (display string, kept for other pages) ── */
const labelText = (list) => (list.length === 0 ? "" : list.length === 1 ? list[0] : `${list.length} labels`);

const deriveLabels = (str) => {
  if (!str || str === "No labels") return [];
  const m = String(str).match(/^(\d+)\s+labels?$/i);
  if (m) return LABEL_OPTIONS.slice(0, Number(m[1])).map((l) => l.name);
  return String(str).split(",").map((s) => s.trim()).filter(Boolean);
};

const labelListOf = (draft) =>
  Array.isArray(draft.labelList) && labelText(draft.labelList) === (draft.labels || "")
    ? draft.labelList
    : deriveLabels(draft.labels);

const labelColor = (name) => LABEL_OPTIONS.find((l) => l.name.toLowerCase() === String(name).toLowerCase())?.color || "#0ea5e9";

/* State icon: dashed / circle / ringed dot / check / cross */
function StateIcon({ state, size = 13 }) {
  const color = STATE_COLORS[state] || STATE_COLORS.Backlog;
  if (state === "Backlog" || !state) return <CircleDashed size={size} color={color} />;
  if (state === "Todo") return <Circle size={size} color={color} />;
  if (state === "Done") return <CheckCircle2 size={size} color={color} />;
  if (state === "Cancelled") return <XCircle size={size} color={color} />;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box sx={{ width: size / 3.5, height: size / 3.5, borderRadius: "50%", bgcolor: color }} />
    </Box>
  );
}

/* Priority icon: red "!" box for Urgent, bars otherwise */
function PriorityIcon({ priority, size = 13 }) {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.None;
  if (priority === "Urgent") {
    return (
      <Box
        sx={{
          width: size + 1,
          height: size + 1,
          borderRadius: "3px",
          bgcolor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: "#fff", fontSize: size * 0.75, fontWeight: 900, lineHeight: 1 }}>!</Typography>
      </Box>
    );
  }
  if (priority === "None") return <Minus size={size} color={color} strokeWidth={2.5} />;
  return <BarChart2 size={size} color={color} />;
}

function AssigneeAvatar({ size = 22 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 35% 35%, #7e22ce, #3b0764 70%, #000)",
        boxShadow: "0 0 6px rgba(168,85,247,.4)",
        flexShrink: 0,
      }}
    >
      <Sparkles size={size * 0.5} color="#e9d5ff" />
    </Box>
  );
}

/* ───────────── Calendar picker (month / year selects + prev / next) ───────────── */
function CalendarPicker({ value, onPick, onClear, minDate, maxDate, t }) {
  const now = new Date();
  const start = value || now;
  const [view, setView] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const year = view.getFullYear();
  const month = view.getMonth();

  const years = [];
  for (let y = Math.min(now.getFullYear() - 5, year); y <= Math.max(now.getFullYear() + 6, year); y++) years.push(y);

  const gridStart = new Date(year, month, 1 - new Date(year, month, 1).getDay());
  const cells = Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));

  const go = (delta) => setView(new Date(year, month + delta, 1));

  const selectSx = {
    appearance: "none",
    WebkitAppearance: "none",
    background: "transparent",
    border: "none",
    outline: "none",
    color: t.text,
    fontSize: "1.05rem",
    fontWeight: 700,
    cursor: "pointer",
    paddingRight: 2,
    fontFamily: "inherit",
  };

  return (
    <Box sx={{ width: 280, p: 1.5 }}>
      {/* header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Box
              component="select"
              value={month}
              onChange={(e) => setView(new Date(year, Number(e.target.value), 1))}
              sx={selectSx}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i} style={{ color: "#000" }}>
                  {m}
                </option>
              ))}
            </Box>
            <ChevronDown size={13} color={t.muted} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Box
              component="select"
              value={year}
              onChange={(e) => setView(new Date(Number(e.target.value), month, 1))}
              sx={selectSx}
            >
              {years.map((y) => (
                <option key={y} value={y} style={{ color: "#000" }}>
                  {y}
                </option>
              ))}
            </Box>
            <ChevronDown size={13} color={t.muted} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" onClick={() => go(-1)} sx={{ color: t.muted, "&:hover": { color: t.text } }}>
            <ChevronLeft size={16} />
          </IconButton>
          <IconButton size="small" onClick={() => go(1)} sx={{ color: t.muted, "&:hover": { color: t.text } }}>
            <ChevronRight size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* weekday header */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <Typography key={d} sx={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: t.muted }}>
            {d}
          </Typography>
        ))}
      </Box>

      {/* days */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d) => {
          const inMonth = d.getMonth() === month;
          const selected = sameDay(d, value);
          const isToday = sameDay(d, now);
          const disabled = (minDate && d < minDate) || (maxDate && d > maxDate);
          return (
            <Box
              key={d.getTime()}
              onClick={() => !disabled && onPick(d)}
              sx={{
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: selected ? 700 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.3 : 1,
                color: selected ? "#fff" : inMonth ? t.text : t.muted,
                bgcolor: selected ? t.accent : "transparent",
                border: isToday && !selected ? `1px solid ${t.accent}` : "1px solid transparent",
                "&:hover": disabled ? {} : { bgcolor: selected ? t.accent : t.hover },
              }}
            >
              {d.getDate()}
            </Box>
          );
        })}
      </Box>

      {/* footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.25, pt: 1, borderTop: `1px solid ${t.border}` }}>
        <Button
          size="small"
          onClick={() => onPick(new Date(now.getFullYear(), now.getMonth(), now.getDate()))}
          sx={{ textTransform: "none", fontSize: "0.75rem", color: t.accent, minWidth: 0 }}
        >
          Today
        </Button>
        <Button
          size="small"
          onClick={onClear}
          sx={{ textTransform: "none", fontSize: "0.75rem", color: t.muted, minWidth: 0 }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}

/* ───────────── Page ───────────── */
export default function DraftPage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Persistent drafts
  const [drafts, setDrafts] = useState(loadDrafts);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  // Row action menu (•••)
  const [rowMenuAnchor, setRowMenuAnchor] = useState(null);
  const [selectedDraftForMenu, setSelectedDraftForMenu] = useState(null);

  // Inline property picker: { type, id, anchor }
  const [picker, setPicker] = useState(null);

  // Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRAFTS, JSON.stringify(drafts));
    } catch (e) {
      console.error("Failed to save drafts", e);
    }
  }, [drafts]);

  /* Search filter (the layout's search box feeds searchQuery) */
  const visibleDrafts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter((d) =>
      [d.title, d.content, d.project, d.projectKey, d.state, d.priority, d.assignee, d.labels]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [drafts, searchQuery]);

  /* Options for the cycle / assignee pickers, built from what already exists */
  const cycleOptions = useMemo(
    () =>
      Array.from(
        new Set([...DEFAULT_CYCLES, ...drafts.map((d) => d.cycle).filter((c) => c && !c.endsWith("..."))])
      ),
    [drafts]
  );
  const memberOptions = useMemo(
    () => Array.from(new Set([user?.nameEn, ...DEFAULT_MEMBERS, ...drafts.map((d) => d.assignee)].filter(Boolean))),
    [drafts, user]
  );

  /* ── design tokens ── */
  const cardBorder = isDark ? "#282a32" : "#e2e8f0";
  const pillBorder = isDark ? "#282a32" : "#e2e8f0";
  const pillBg = isDark ? "#14151a" : "#ffffff";
  const pillHoverBg = isDark ? "#1c1e26" : "#f1f5f9";
  const pillHoverBorder = isDark ? "#3a3d49" : "#cbd5e1";
  const textColor = isDark ? "#f0f2f5" : "#0f172a";
  const textMuted = isDark ? "#8b949e" : "#64748b";
  const rowHover = isDark ? "#14151a" : "#f8fafc";
  const accent = "#2b8fd0";
  const paperBg = isDark ? "#14151a" : "#ffffff";
  const calendarTheme = {
    text: textColor,
    muted: textMuted,
    border: cardBorder,
    hover: isDark ? "#1f212a" : "#f1f5f9",
    accent,
  };

  /* ── handlers ── */
  const handleOpenNew = () => {
    setEditingDraft(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (draft) => {
    if (!draft) return;
    setEditingDraft(draft);
    setIsEditorOpen(true);
  };

  const updateDraft = (id, patch) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: "Just now" } : d)));

  const handleSaveModalDraft = (savedDraft) => {
    if (editingDraft) {
      setDrafts((prev) =>
        prev.map((d) => (d.id === editingDraft.id ? { ...d, ...savedDraft, updatedAt: "Just now" } : d))
      );
      notify("Draft updated successfully");
    } else {
      const newDraft = {
        id: `draft-${Date.now()}`,
        projectKey: projectKeyOf(savedDraft.project),
        extraCount: null,
        updatedAt: "Just now",
        ...savedDraft,
      };
      setDrafts((prev) => [newDraft, ...prev]);
      notify("Draft saved to drafts");
    }
  };

  const handleDelete = (id) => {
    if (!id) return;
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    notify("Draft discarded", "info");
  };

  const handleDuplicate = (draft) => {
    if (!draft) return;
    const copy = {
      ...draft,
      id: `draft-${Date.now()}`,
      title: `${draft.title} (copy)`,
      updatedAt: "Just now",
    };
    setDrafts((prev) => [copy, ...prev]);
    notify("Draft duplicated");
  };

  const handleMoveProject = (draft) => {
    if (!draft) return;
    const targetProject = draft.project === "TerraLink" ? "HR Management" : "TerraLink";
    const prefix = projectKeyOf(targetProject);

    let existing = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_ITEMS) || "[]");
      existing = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(e);
    }

    // Next work item number for the target project (TERRA starts after the seeded items)
    const maxNum = existing.reduce((max, it) => {
      const m = String(it.id || "").match(new RegExp(`^${prefix}-(\\d+)$`));
      return m ? Math.max(max, Number(m[1])) : max;
    }, prefix === "TERRA" ? 8 : 0);
    const newId = `${prefix}-${maxNum + 1}`;

    const newWorkItem = {
      id: newId,
      projectKey: prefix,
      project: targetProject,
      title: draft.title,
      description: draft.content || "",
      state: draft.state || "Backlog",
      priority: draft.priority || "Medium",
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
      dateRange:
        draft.startDate && draft.endDate ? `${draft.startDate} – ${draft.endDate}` : draft.startDate || draft.endDate || "",
      assignee: draft.assignee || user?.nameEn || "NIRON ROEM",
      creator: user?.nameEn || "NIRON ROEM",
      labels: draft.labels || "",
      extraCount: draft.extraCount || null,
      hasTagIcon: !draft.labels,
      subscribed: true,
      cycle: draft.cycle || "",
      updatedAt: "Just now",
    };

    try {
      localStorage.setItem(STORAGE_ITEMS, JSON.stringify([newWorkItem, ...existing]));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }

    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
    notify(`Moved "${draft.title}" to ${targetProject} as ${newId}. It now appears under Your work → Assigned!`);
  };

  const handleOpenRowMenu = (e, draft) => {
    e.stopPropagation();
    setRowMenuAnchor(e.currentTarget);
    setSelectedDraftForMenu(draft);
  };

  const handleCloseRowMenu = () => {
    setRowMenuAnchor(null);
    setSelectedDraftForMenu(null);
  };

  const runMenuAction = (fn) => {
    const draft = selectedDraftForMenu;
    handleCloseRowMenu();
    fn(draft);
  };

  /* ── inline property picker ── */
  const openPicker = (type, draft) => (e) => {
    e.stopPropagation();
    setPicker({ type, id: draft.id, anchor: e.currentTarget });
  };
  const closePicker = () => setPicker(null);
  const pickedDraft = picker ? drafts.find((d) => d.id === picker.id) : null;

  const toggleLabel = (draft, name) => {
    const list = labelListOf(draft);
    const next = list.includes(name) ? list.filter((n) => n !== name) : [...list, name];
    updateDraft(draft.id, { labelList: next, labels: labelText(next) });
  };

  const pickDate = (field, date) => {
    if (!pickedDraft) return;
    updateDraft(pickedDraft.id, { [field]: date ? formatDate(date) : "" });
    closePicker();
  };

  /* ── styles ── */
  const pillSx = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    bgcolor: active ? pillHoverBg : pillBg,
    border: `1px solid ${active ? pillHoverBorder : pillBorder}`,
    borderRadius: "6px",
    px: 1.25,
    py: 0.45,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: textColor,
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    outline: "none",
    transition: "background-color 0.12s ease, border-color 0.12s ease",
    "&:hover, &:focus-visible": { bgcolor: pillHoverBg, borderColor: pillHoverBorder },
  });

  const menuPaperSx = {
    minWidth: 190,
    bgcolor: paperBg,
    color: textColor,
    border: `1px solid ${cardBorder}`,
    borderRadius: "8px",
    boxShadow: isDark ? "0 16px 36px rgba(0,0,0,0.7)" : "0 10px 25px rgba(0,0,0,0.12)",
    p: 0.5,
    backgroundImage: "none",
    mt: 0.5,
  };

  const menuItemSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.25,
    px: 1.25,
    py: 0.75,
    borderRadius: "6px",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: textColor,
    "&:hover": { bgcolor: isDark ? "#1f212a" : "#f1f5f9" },
  };

  const optionRow = (icon, label, checked) => (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
        {icon}
        <span>{label}</span>
      </Box>
      {checked && <Check size={14} />}
    </>
  );

  /* Rendered by DashboardLayout in the title row: count badge next to the title,
     "Draft a work item" pushed to the far right (space-between) */
  const titleExtra = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          bgcolor: isDark ? "#0c3a56" : "#e0f2fe",
          color: isDark ? "#38bdf8" : "#0284c7",
          fontSize: "0.72rem",
          fontWeight: 700,
          px: 1,
          py: 0.35,
          borderRadius: "4px",
          lineHeight: 1.2,
        }}
      >
        {drafts.length}
      </Box>
      <Button
        variant="outlined"
        onClick={handleOpenNew}
        size="small"
        startIcon={<Plus size={14} />}
        sx={{
          height: 28,
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "6px",
          px: 1.5,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Draft a work item
      </Button>
    </Box>
  );

  const pageContent = (
    <Box sx={{ width: "100%" }}>
      {/* ─── List ─── */}
      {visibleDrafts.length === 0 ? (
        <Box sx={{ py: 10, px: 3, textAlign: "center" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              mx: "auto",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark ? "#1c1e24" : "#f1f5f9",
              color: textMuted,
              mb: 2,
            }}
          >
            <PencilLine size={22} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: "1.05rem", color: textColor, mb: 0.5 }}>
            No drafts found
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: textMuted, maxWidth: 360, mx: "auto", mb: 2.5 }}>
            {searchQuery.trim()
              ? "No drafts match your search."
              : "You don't have any saved drafts in progress right now."}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={15} />}
            onClick={handleOpenNew}
            sx={{
              bgcolor: accent,
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "6px",
              "&:hover": { bgcolor: "#2379b0" },
            }}
          >
            Draft a work item
          </Button>
        </Box>
      ) : (
        <Box>
          {visibleDrafts.map((draft) => {
            const projectKey = draft.projectKey || projectKeyOf(draft.project);
            const endDate = draft.endDate || draft.dueDate;
            const labels = labelListOf(draft);
            const isOpen = (type) => picker?.id === draft.id && picker.type === type;
            const keyOpen = (type) => (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPicker(type, draft)(e);
              }
            };

            return (
              <Box
                key={draft.id}
                onClick={() => handleEdit(draft)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: 1.25,
                  borderBottom: `1px solid ${cardBorder}`,
                  cursor: "pointer",
                  transition: "background-color 0.12s ease",
                  "&:hover": { bgcolor: rowHover },
                }}
              >
                {/* Left: project key + title */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0, flex: "1 1 240px" }}>
                  <Typography
                    sx={{ fontSize: "0.75rem", fontWeight: 500, color: textMuted, letterSpacing: "0.03em", flexShrink: 0 }}
                  >
                    {projectKey}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: textColor,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {draft.title || "Untitled draft"}
                  </Typography>
                </Box>

                {/* Right: editable property pills + menu */}
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: 1, cursor: "default" }}
                >
                  {/* State */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("state", draft)}
                    onKeyDown={keyOpen("state")}
                    sx={pillSx(isOpen("state"))}
                  >
                    <StateIcon state={draft.state || "Backlog"} />
                    <span>{draft.state || "Backlog"}</span>
                  </Box>

                  {/* Priority */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("priority", draft)}
                    onKeyDown={keyOpen("priority")}
                    sx={pillSx(isOpen("priority"))}
                  >
                    <PriorityIcon priority={draft.priority || "None"} />
                    <span>{draft.priority || "None"}</span>
                  </Box>

                  {/* Labels */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("labels", draft)}
                    onKeyDown={keyOpen("labels")}
                    sx={{ ...pillSx(isOpen("labels")), color: labels.length ? textColor : textMuted }}
                  >
                    {labels.length ? (
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: labelColor(labels[0]), flexShrink: 0 }} />
                    ) : (
                      <Tag size={13} color={textMuted} />
                    )}
                    <span>{labels.length ? labelText(labels) : "Labels"}</span>
                  </Box>

                  {/* Start date */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("startDate", draft)}
                    onKeyDown={keyOpen("startDate")}
                    sx={{ ...pillSx(isOpen("startDate")), color: draft.startDate ? textColor : textMuted }}
                  >
                    <CalendarClock size={13} color={textMuted} />
                    <span>{draft.startDate || "Start date"}</span>
                  </Box>

                  {/* End date */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("endDate", draft)}
                    onKeyDown={keyOpen("endDate")}
                    sx={{ ...pillSx(isOpen("endDate")), color: endDate ? textColor : textMuted }}
                  >
                    <CalendarCheck size={13} color={textMuted} />
                    <span>{endDate || "Due date"}</span>
                  </Box>

                  {/* Assignee */}
                  <Tooltip title={draft.assignee || "Unassigned"}>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={openPicker("assignee", draft)}
                      onKeyDown={keyOpen("assignee")}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "50%",
                        outline: isOpen("assignee") ? `2px solid ${pillHoverBorder}` : "none",
                        outlineOffset: 2,
                        display: "flex",
                        "&:hover, &:focus-visible": { outline: `2px solid ${pillHoverBorder}`, outlineOffset: 2 },
                      }}
                    >
                      <AssigneeAvatar />
                    </Box>
                  </Tooltip>

                  {/* Cycle */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={openPicker("cycle", draft)}
                    onKeyDown={keyOpen("cycle")}
                    sx={{ ...pillSx(isOpen("cycle")), maxWidth: 260, color: draft.cycle ? textColor : textMuted }}
                  >
                    <Contrast size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "inherit",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {draft.cycle || "Add cycle"}
                    </Typography>
                  </Box>

                  {/* Extra counter */}
                  {draft.extraCount && (
                    <Box sx={{ ...pillSx(false), cursor: "default", px: 1 }}>{draft.extraCount}</Box>
                  )}

                  {/* ••• */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenRowMenu(e, draft)}
                    sx={{
                      p: 0.5,
                      color: textMuted,
                      borderRadius: "6px",
                      "&:hover": { color: textColor, bgcolor: isDark ? "#1f212a" : "#e2e8f0" },
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ─── Inline pickers (state / priority / labels / assignee / cycle) ─── */}
      {pickedDraft && (
        <>
          {/* State */}
          <Menu
            anchorEl={picker.anchor}
            open={picker.type === "state"}
            onClose={closePicker}
            slotProps={{ paper: { sx: menuPaperSx } }}
          >
            {STATE_OPTIONS.map((s) => (
              <MenuItem
                key={s}
                sx={menuItemSx}
                onClick={() => {
                  updateDraft(pickedDraft.id, { state: s });
                  closePicker();
                }}
              >
                {optionRow(<StateIcon state={s} size={14} />, s, (pickedDraft.state || "Backlog") === s)}
              </MenuItem>
            ))}
          </Menu>

          {/* Priority */}
          <Menu
            anchorEl={picker.anchor}
            open={picker.type === "priority"}
            onClose={closePicker}
            slotProps={{ paper: { sx: menuPaperSx } }}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <MenuItem
                key={p}
                sx={menuItemSx}
                onClick={() => {
                  updateDraft(pickedDraft.id, { priority: p });
                  closePicker();
                }}
              >
                {optionRow(<PriorityIcon priority={p} size={14} />, p, (pickedDraft.priority || "None") === p)}
              </MenuItem>
            ))}
          </Menu>

          {/* Labels (multi-select, stays open) */}
          <Menu
            anchorEl={picker.anchor}
            open={picker.type === "labels"}
            onClose={closePicker}
            slotProps={{ paper: { sx: menuPaperSx } }}
          >
            {LABEL_OPTIONS.map((l) => (
              <MenuItem key={l.name} sx={menuItemSx} onClick={() => toggleLabel(pickedDraft, l.name)}>
                {optionRow(
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: l.color }} />,
                  l.name,
                  labelListOf(pickedDraft).includes(l.name)
                )}
              </MenuItem>
            ))}
          </Menu>

          {/* Assignee */}
          <Menu
            anchorEl={picker.anchor}
            open={picker.type === "assignee"}
            onClose={closePicker}
            slotProps={{ paper: { sx: menuPaperSx } }}
          >
            <MenuItem
              sx={menuItemSx}
              onClick={() => {
                updateDraft(pickedDraft.id, { assignee: "" });
                closePicker();
              }}
            >
              {optionRow(<Minus size={14} color={textMuted} />, "Unassigned", !pickedDraft.assignee)}
            </MenuItem>
            {memberOptions.map((name) => (
              <MenuItem
                key={name}
                sx={menuItemSx}
                onClick={() => {
                  updateDraft(pickedDraft.id, { assignee: name });
                  closePicker();
                }}
              >
                {optionRow(<AssigneeAvatar size={18} />, name, pickedDraft.assignee === name)}
              </MenuItem>
            ))}
          </Menu>

          {/* Cycle */}
          <Menu
            anchorEl={picker.anchor}
            open={picker.type === "cycle"}
            onClose={closePicker}
            slotProps={{ paper: { sx: { ...menuPaperSx, minWidth: 260 } } }}
          >
            <MenuItem
              sx={menuItemSx}
              onClick={() => {
                updateDraft(pickedDraft.id, { cycle: "" });
                closePicker();
              }}
            >
              {optionRow(<Minus size={14} color={textMuted} />, "No cycle", !pickedDraft.cycle)}
            </MenuItem>
            {cycleOptions.map((cy) => (
              <MenuItem
                key={cy}
                sx={menuItemSx}
                onClick={() => {
                  updateDraft(pickedDraft.id, { cycle: cy });
                  closePicker();
                }}
              >
                {optionRow(<Contrast size={14} color="#f59e0b" />, cy, pickedDraft.cycle === cy)}
              </MenuItem>
            ))}
          </Menu>

          {/* Start / due date calendar */}
          {(picker.type === "startDate" || picker.type === "endDate") && (
            <Popover
              open
              anchorEl={picker.anchor}
              onClose={closePicker}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              slotProps={{ paper: { sx: { ...menuPaperSx, p: 0 } } }}
            >
              <CalendarPicker
                key={`${picker.id}-${picker.type}`}
                t={calendarTheme}
                value={parseDate(picker.type === "startDate" ? pickedDraft.startDate : pickedDraft.endDate || pickedDraft.dueDate)}
                minDate={picker.type === "endDate" ? parseDate(pickedDraft.startDate) : null}
                maxDate={picker.type === "startDate" ? parseDate(pickedDraft.endDate || pickedDraft.dueDate) : null}
                onPick={(d) => pickDate(picker.type, d)}
                onClear={() => pickDate(picker.type, null)}
              />
            </Popover>
          )}
        </>
      )}

      {/* ─── Row action menu ─── */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={handleCloseRowMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { ...menuPaperSx, width: 175, minWidth: 0 } } }}
      >
        <MenuItem onClick={() => runMenuAction(handleEdit)} sx={{ ...menuItemSx, justifyContent: "flex-start" }}>
          <Pencil size={14} color={textMuted} />
          <span>Edit</span>
        </MenuItem>
        <MenuItem onClick={() => runMenuAction(handleDuplicate)} sx={{ ...menuItemSx, justifyContent: "flex-start" }}>
          <Copy size={14} color={textMuted} />
          <span>Make a copy</span>
        </MenuItem>
        <MenuItem onClick={() => runMenuAction(handleMoveProject)} sx={{ ...menuItemSx, justifyContent: "flex-start" }}>
          <FolderInput size={14} color={textMuted} />
          <span>Move to project</span>
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: cardBorder }} />
        <MenuItem
          onClick={() => runMenuAction((d) => handleDelete(d?.id))}
          sx={{
            ...menuItemSx,
            justifyContent: "flex-start",
            color: "#f87171",
            "&:hover": { bgcolor: isDark ? "#2b191c" : "#fee2e2" },
          }}
        >
          <Trash2 size={14} color="#f87171" />
          <span>Delete</span>
        </MenuItem>
      </Menu>

      {/* ─── Create / Edit Draft Modal ─── */}
      <CreateDraftModal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveModalDraft}
        initialData={editingDraft}
        isDark={isDark}
      />

      {/* ─── Toast ─── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: "8px", fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );

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
      pageTitle="Drafts"
      pageIcon={PencilLine}
      titleExtra={titleExtra}
    >
      {pageContent}
    </DashboardLayout>
  );
}