import { useState, useEffect } from "react";
import DatePickerCalendar, { parseDateValue } from "../DatePickerCalendar";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Switch,
  Menu,
} from "@mui/material";
import {
  X,
  ChevronRight,
  Network,
  CircleDashed,
  Circle,
  CheckCircle2,
  XCircle,
  Minus,
  AlertCircle,
  ArrowUp,
  Equal,
  ArrowDown,
  User,
  Tag,
  Calendar,
  Disc,
  Grid as GridIcon,
  Bookmark,
  Check,
  Search,
} from "lucide-react";

// States list with icons matching the screenshot
const STATES = [
  {
    id: "Backlog",
    label: "Backlog",
    icon: <CircleDashed size={14} color="#8b949e" />,
  },
  {
    id: "Todo",
    label: "Todo",
    icon: <Circle size={14} color="#6b7280" />,
  },
  {
    id: "In Progress",
    label: "In Progress",
    icon: (
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid #f59e0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#f59e0b" }} />
      </Box>
    ),
  },
  {
    id: "Done",
    label: "Done",
    icon: <CheckCircle2 size={14} color="#22c55e" />,
  },
  {
    id: "Cancelled",
    label: "Cancelled",
    icon: <XCircle size={14} color="#94a3b8" />,
  },
];

const PRIORITIES = [
  { id: "None", label: "None", icon: <Minus size={14} color="#8b949e" /> },
  { id: "Urgent", label: "Urgent", icon: <AlertCircle size={14} color="#ef4444" /> },
  { id: "High", label: "High", icon: <ArrowUp size={14} color="#f97316" /> },
  { id: "Medium", label: "Medium", icon: <Equal size={14} color="#eab308" /> },
  { id: "Low", label: "Low", icon: <ArrowDown size={14} color="#38bdf8" /> },
];

const ASSIGNEES = [
  { id: "Assignees", label: "Unassigned", icon: <User size={14} color="#8b949e" /> },
  { id: "NIRON ROEM", label: "NIRON ROEM", icon: <User size={14} color="#38bdf8" /> },
  { id: "Alex Rivera", label: "Alex Rivera", icon: <User size={14} color="#a855f7" /> },
  { id: "Elena Vance", label: "Elena Vance", icon: <User size={14} color="#10b981" /> },
];

const LABELS = [
  { id: "None", label: "No Label", color: "#8b949e" },
  { id: "Bug", label: "Bug", color: "#ef4444" },
  { id: "Feature", label: "Feature", color: "#a855f7" },
  { id: "Improvement", label: "Improvement", color: "#10b981" },
  { id: "Documentation", label: "Documentation", color: "#38bdf8" },
  { id: "Design", label: "Design", color: "#ec4899" },
  { id: "Refactor", label: "Refactor", color: "#f59e0b" },
  { id: "Research", label: "Research", color: "#6366f1" },
];

const CYCLES = [
  { id: "Cycle", label: "No Cycle", icon: <Disc size={14} color="#8b949e" /> },
  { id: "Cycle 1", label: "Cycle 1 (Sprint 14)", icon: <Disc size={14} color="#38bdf8" /> },
  { id: "Cycle 2", label: "Cycle 2 (Sprint 15)", icon: <Disc size={14} color="#38bdf8" /> },
  { id: "Q4 Roadmap", label: "Q4 Roadmap", icon: <Disc size={14} color="#eab308" /> },
];

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getPresetDates = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const twoWeeks = new Date();
  twoWeeks.setDate(today.getDate() + 14);

  return [
    { label: "Today", value: formatDate(today) },
    { label: "Tomorrow", value: formatDate(tomorrow) },
    { label: "Next week", value: formatDate(nextWeek) },
    { label: "In 2 weeks", value: formatDate(twoWeeks) },
  ];
};

export default function CreateDraftModal({
  open,
  onClose,
  onSave,
  initialData = null,
  isDark = true,
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.content || "");
  const [parentItem, setParentItem] = useState(
    initialData?.parentItem || "TERRA-6 5. Use Cycles to time box tasks 🗓️"
  );
  const [hasParent, setHasParent] = useState(true);
  const [project, setProject] = useState(initialData?.project || "TerraLink");
  const [state, setState] = useState(initialData?.state || "Backlog");
  const [priority, setPriority] = useState(initialData?.priority || "None");
  const [assignee, setAssignee] = useState(initialData?.assignee || "Assignees");
  const [labels, setLabels] = useState(initialData?.labels || "Labels");
  const [startDate, setStartDate] = useState(initialData?.startDate || "Start date");
  const [endDate, setEndDate] = useState(
    initialData?.endDate || initialData?.dueDate || "End date"
  );
  const [cycle, setCycle] = useState(initialData?.cycle || "Cycle");
  const [module, setModule] = useState(initialData?.module || "Modules");
  const [createMore, setCreateMore] = useState(false);

  // Search queries inside dropdowns
  const [stateSearch, setStateSearch] = useState("");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [cycleSearch, setCycleSearch] = useState("");
  const [labelSearch, setLabelSearch] = useState("");

  // Menu Anchors
  const [anchorState, setAnchorState] = useState(null);
  const [anchorPriority, setAnchorPriority] = useState(null);
  const [anchorAssignee, setAnchorAssignee] = useState(null);
  const [anchorCycle, setAnchorCycle] = useState(null);
  const [anchorLabels, setAnchorLabels] = useState(null);
  const [anchorStartDate, setAnchorStartDate] = useState(null);
  const [anchorEndDate, setAnchorEndDate] = useState(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.content || "");
        setParentItem(initialData.parentItem || "TERRA-6 5. Use Cycles to time box tasks 🗓️");
        setHasParent(Boolean(initialData.parentItem));
        setProject(initialData.project || "TerraLink");
        setState(initialData.state || "Backlog");
        setPriority(initialData.priority || "None");
        setAssignee(initialData.assignee || "Assignees");
        setLabels(initialData.labels || "Labels");
        setStartDate(initialData.startDate || "Start date");
        setEndDate(initialData.endDate || initialData.dueDate || "End date");
        setCycle(initialData.cycle || "Cycle");
      } else {
        setTitle("");
        setDescription("");
        setParentItem("TERRA-6 5. Use Cycles to time box tasks 🗓️");
        setHasParent(true);
        setProject("TerraLink");
        setState("Backlog");
        setPriority("None");
        setAssignee("Assignees");
        setLabels("Labels");
        setStartDate("Start date");
        setEndDate("End date");
        setCycle("Cycle");
      }
    }
  }, [open, initialData]);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setState("Backlog");
    setPriority("None");
    setAssignee("Assignees");
    setLabels("Labels");
    setStartDate("Start date");
    setEndDate("End date");
    setCycle("Cycle");
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const draftItem = {
      id: initialData?.id || `draft-${Date.now()}`,
      title: title.trim(),
      content: description.trim(),
      type: initialData?.type || "work-item",
      project,
      parentItem: hasParent ? parentItem : null,
      state,
      priority: priority === "None" ? "Medium" : priority,
      assignee: assignee !== "Assignees" ? assignee : "Unassigned",
      labels: labels !== "Labels" && labels !== "None" ? labels : null,
      startDate: startDate !== "Start date" ? startDate : null,
      endDate: endDate !== "End date" && endDate !== "Due date" ? endDate : null,
      dueDate: endDate !== "End date" && endDate !== "Due date" ? endDate : null,
      cycle: cycle !== "Cycle" ? cycle : null,
      updatedAt: "Just now",
    };

    if (onSave) {
      onSave(draftItem);
    }

    if (createMore) {
      handleReset();
    } else {
      handleReset();
      onClose();
    }
  };

  const handleDiscard = () => {
    handleReset();
    onClose();
  };

  // Color theme variables matching screenshot
  const modalBg = isDark ? "#14151a" : "#ffffff";
  const innerBg = isDark ? "#0f1013" : "#f8fafc";
  const menuBg = isDark ? "#191a21" : "#ffffff";
  const borderColor = isDark ? "#262832" : "#e2e8f0";
  const textColor = isDark ? "#f0f2f5" : "#0f172a";
  const textMuted = isDark ? "#8b949e" : "#64748b";
  const pillBg = isDark ? "#1a1c23" : "#f1f5f9";
  const pillBorder = isDark ? "#2b2e38" : "#cbd5e1";

  const currentStateObj = STATES.find((s) => s.id === state) || STATES[0];
  const currentPriorityObj = PRIORITIES.find((p) => p.id === priority) || PRIORITIES[0];
  const currentLabelObj = LABELS.find((l) => l.label === labels);

  const filteredStates = STATES.filter((s) =>
    s.label.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredPriorities = PRIORITIES.filter((p) =>
    p.label.toLowerCase().includes(prioritySearch.toLowerCase())
  );
  const filteredAssignees = ASSIGNEES.filter((a) =>
    a.label.toLowerCase().includes(assigneeSearch.toLowerCase())
  );
  const filteredCycles = CYCLES.filter((c) =>
    c.label.toLowerCase().includes(cycleSearch.toLowerCase())
  );
  const filteredLabels = LABELS.filter((l) =>
    l.label.toLowerCase().includes(labelSearch.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: modalBg,
            color: textColor,
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? "0 24px 50px rgba(0,0,0,0.7)"
              : "0 20px 40px rgba(0,0,0,0.12)",
            p: { xs: 2, sm: 2.5, md: 3 },
            backgroundImage: "none",
            maxWidth: 740,
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.0625rem",
            color: textColor,
            letterSpacing: "-0.01em",
            mb: 0.5,
          }}
        >
          Create a draft
        </Typography>

        {/* Project & Hierarchy Breadcrumb Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.2,
              py: 0.45,
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: textColor,
            }}
          >
            <Bookmark size={13} fill="#eab308" color="#eab308" />
            <span>{project}</span>
          </Box>

          <ChevronRight size={14} color={textMuted} />

          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "6px",
              border: `1px solid ${pillBorder}`,
              bgcolor: pillBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textMuted,
            }}
          >
            <Network size={13} />
          </Box>
        </Box>

        {/* Attached Parent Item Pill */}
        {hasParent && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.25, mb: 0.25 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: pillBg,
                border: `1px solid ${pillBorder}`,
                borderRadius: "6px",
                px: 1.2,
                py: 0.5,
                fontSize: "0.8125rem",
                color: textColor,
              }}
            >
              <span>{parentItem}</span>
              <IconButton
                size="small"
                onClick={() => setHasParent(false)}
                sx={{
                  p: 0.2,
                  color: textMuted,
                  "&:hover": { color: textColor },
                }}
              >
                <X size={13} />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Title Input Field with Active Focus Border */}
        <Box
          sx={{
            borderRadius: "7px",
            border: `1px solid ${title ? "#0284c7" : "#2a2d37"}`,
            bgcolor: innerBg,
            transition: "border-color 0.15s ease",
            px: 1.5,
            py: 0.4,
            "&:focus-within": {
              borderColor: "#0284c7",
              boxShadow: "0 0 0 1px #0284c7",
            },
          }}
        >
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: textColor,
                  "& input::placeholder": {
                    color: textMuted,
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Description Box */}
        <Box
          sx={{
            minHeight: 150,
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            bgcolor: innerBg,
            p: 1.5,
            transition: "border-color 0.15s ease",
            "&:focus-within": {
              borderColor: isDark ? "#383c48" : "#cbd5e1",
            },
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="standard"
            placeholder="Click to add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.875rem",
                  color: textColor,
                  "& textarea::placeholder": {
                    color: textMuted,
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Property Action Badges (Backlog, Priority, Assignees, Labels, Dates, Cycle, Modules) */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, alignItems: "center", pt: 0.5 }}>
          {/* ─── Backlog State Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => {
              setStateSearch("");
              setAnchorState(e.currentTarget);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            {currentStateObj.icon}
            <span>{state}</span>
          </Box>

          <Menu
            anchorEl={anchorState}
            open={Boolean(anchorState)}
            onClose={() => setAnchorState(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 220,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 0.5,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${borderColor}`,
                mb: 0.5,
              }}
            >
              <Search size={14} color={textMuted} />
              <input
                autoFocus
                type="text"
                placeholder="Search states..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: textColor,
                  fontSize: "0.8125rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </Box>

            {filteredStates.map((s) => {
              const isSelected = state === s.id;
              return (
                <Box
                  key={s.id}
                  onClick={() => {
                    setState(s.id);
                    setAnchorState(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                    "&:hover": {
                      bgcolor: isDark ? "#252732" : "#f1f5f9",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    {s.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: textColor,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                  {isSelected && <Check size={14} color={textColor} />}
                </Box>
              );
            })}
          </Menu>

          {/* ─── Priority Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => {
              setPrioritySearch("");
              setAnchorPriority(e.currentTarget);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            {currentPriorityObj.icon}
            <span>{priority}</span>
          </Box>

          <Menu
            anchorEl={anchorPriority}
            open={Boolean(anchorPriority)}
            onClose={() => setAnchorPriority(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 210,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 0.5,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${borderColor}`,
                mb: 0.5,
              }}
            >
              <Search size={14} color={textMuted} />
              <input
                autoFocus
                type="text"
                placeholder="Search priority..."
                value={prioritySearch}
                onChange={(e) => setPrioritySearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: textColor,
                  fontSize: "0.8125rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </Box>

            {filteredPriorities.map((p) => {
              const isSelected = priority === p.id;
              return (
                <Box
                  key={p.id}
                  onClick={() => {
                    setPriority(p.id);
                    setAnchorPriority(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    {p.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: textColor,
                      }}
                    >
                      {p.label}
                    </Typography>
                  </Box>
                  {isSelected && <Check size={14} color={textColor} />}
                </Box>
              );
            })}
          </Menu>

          {/* ─── Assignees Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => {
              setAssigneeSearch("");
              setAnchorAssignee(e.currentTarget);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <User size={13} color="#949aa7" />
            <span>{assignee}</span>
          </Box>

          <Menu
            anchorEl={anchorAssignee}
            open={Boolean(anchorAssignee)}
            onClose={() => setAnchorAssignee(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 220,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 0.5,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${borderColor}`,
                mb: 0.5,
              }}
            >
              <Search size={14} color={textMuted} />
              <input
                autoFocus
                type="text"
                placeholder="Search assignees..."
                value={assigneeSearch}
                onChange={(e) => setAssigneeSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: textColor,
                  fontSize: "0.8125rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </Box>

            {filteredAssignees.map((a) => {
              const isSelected = assignee === a.id;
              return (
                <Box
                  key={a.id}
                  onClick={() => {
                    setAssignee(a.id);
                    setAnchorAssignee(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    {a.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: textColor,
                      }}
                    >
                      {a.label}
                    </Typography>
                  </Box>
                  {isSelected && <Check size={14} color={textColor} />}
                </Box>
              );
            })}
          </Menu>

          {/* ─── Labels Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => {
              setLabelSearch("");
              setAnchorLabels(e.currentTarget);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${labels !== "Labels" && labels !== "None" ? (currentLabelObj?.color || "#a855f7") : pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <Tag size={13} color={currentLabelObj?.color || "#949aa7"} />
            <span>{labels}</span>
          </Box>

          <Menu
            anchorEl={anchorLabels}
            open={Boolean(anchorLabels)}
            onClose={() => setAnchorLabels(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 210,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 0.5,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${borderColor}`,
                mb: 0.5,
              }}
            >
              <Search size={14} color={textMuted} />
              <input
                autoFocus
                type="text"
                placeholder="Search labels..."
                value={labelSearch}
                onChange={(e) => setLabelSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: textColor,
                  fontSize: "0.8125rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </Box>

            {filteredLabels.map((l) => {
              const isSelected =
                labels === l.label ||
                (l.id === "None" && (labels === "Labels" || labels === "None"));
              return (
                <Box
                  key={l.id}
                  onClick={() => {
                    setLabels(l.id === "None" ? "Labels" : l.label);
                    setAnchorLabels(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                    "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: l.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: textColor,
                      }}
                    >
                      {l.label}
                    </Typography>
                  </Box>
                  {isSelected && <Check size={14} color={textColor} />}
                </Box>
              );
            })}
          </Menu>

          {/* ─── Start Date Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => setAnchorStartDate(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${startDate !== "Start date" ? "#0284c7" : pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: startDate !== "Start date" ? (isDark ? "#38bdf8" : "#0284c7") : textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <Calendar size={13} color={startDate !== "Start date" ? "#38bdf8" : "#949aa7"} />
            <span>{startDate}</span>
          </Box>

          <Menu
            anchorEl={anchorStartDate}
            open={Boolean(anchorStartDate)}
            onClose={() => setAnchorStartDate(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 370,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 1.25,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: textMuted, fontWeight: 600, px: 0.5, mb: 1, display: "block" }}
            >
              Start Date Presets
            </Typography>
            {getPresetDates().map((preset) => (
              <Box
                key={preset.label}
                onClick={() => {
                  setStartDate(preset.value);
                  setAnchorStartDate(null);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  py: 0.65,
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                }}
              >
                <span>{preset.label}</span>
                <span style={{ fontSize: "0.75rem", color: textMuted }}>{preset.value}</span>
              </Box>
            ))}

            <Box sx={{ borderTop: `1px solid ${borderColor}`, my: 1 }} />

            <Typography
              variant="caption"
              sx={{ color: textMuted, fontWeight: 600, px: 0.5, mb: 0.75, display: "block" }}
            >
              Pick date
            </Typography>
            <DatePickerCalendar
              value={startDate === "Start date" ? "" : startDate}
              isDark={isDark}
              onChange={(value) => {
                const date = parseDateValue(value);
                if (date) setStartDate(formatDate(date));
                setAnchorStartDate(null);
              }}
              onClose={() => setAnchorStartDate(null)}
            />

            {startDate !== "Start date" && (
              <Box
                onClick={() => {
                  setStartDate("Start date");
                  setAnchorStartDate(null);
                }}
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.6,
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  color: "#ef4444",
                  textAlign: "center",
                  "&:hover": { bgcolor: isDark ? "#2b191c" : "#fee2e2" },
                }}
              >
                Clear start date
              </Box>
            )}
          </Menu>

          {/* ─── End Date Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => setAnchorEndDate(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${endDate !== "End date" && endDate !== "Due date" ? "#0284c7" : pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color:
                endDate !== "End date" && endDate !== "Due date"
                  ? isDark
                    ? "#38bdf8"
                    : "#0284c7"
                  : textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <Calendar
              size={13}
              color={
                endDate !== "End date" && endDate !== "Due date" ? "#38bdf8" : "#949aa7"
              }
            />
            <span>{endDate}</span>
          </Box>

          <Menu
            anchorEl={anchorEndDate}
            open={Boolean(anchorEndDate)}
            onClose={() => setAnchorEndDate(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 370,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 1.25,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: textMuted, fontWeight: 600, px: 0.5, mb: 1, display: "block" }}
            >
              End Date Presets
            </Typography>
            {getPresetDates().map((preset) => (
              <Box
                key={preset.label}
                onClick={() => {
                  setEndDate(preset.value);
                  setAnchorEndDate(null);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  py: 0.65,
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                }}
              >
                <span>{preset.label}</span>
                <span style={{ fontSize: "0.75rem", color: textMuted }}>{preset.value}</span>
              </Box>
            ))}

            <Box sx={{ borderTop: `1px solid ${borderColor}`, my: 1 }} />

            <Typography
              variant="caption"
              sx={{ color: textMuted, fontWeight: 600, px: 0.5, mb: 0.75, display: "block" }}
            >
              Pick date
            </Typography>
            <DatePickerCalendar
              value={endDate === "End date" || endDate === "Due date" ? "" : endDate}
              isDark={isDark}
              onChange={(value) => {
                const date = parseDateValue(value);
                if (date) setEndDate(formatDate(date));
                setAnchorEndDate(null);
              }}
              onClose={() => setAnchorEndDate(null)}
            />

            {endDate !== "End date" && endDate !== "Due date" && (
              <Box
                onClick={() => {
                  setEndDate("End date");
                  setAnchorEndDate(null);
                }}
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.6,
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  color: "#ef4444",
                  textAlign: "center",
                  "&:hover": { bgcolor: isDark ? "#2b191c" : "#fee2e2" },
                }}
              >
                Clear end date
              </Box>
            )}
          </Menu>

          {/* ─── Cycle Button & Dropdown ─── */}
          <Box
            component="button"
            onClick={(e) => {
              setCycleSearch("");
              setAnchorCycle(e.currentTarget);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <Disc size={13} color="#949aa7" />
            <span>{cycle}</span>
          </Box>

          <Menu
            anchorEl={anchorCycle}
            open={Boolean(anchorCycle)}
            onClose={() => setAnchorCycle(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  width: 220,
                  bgcolor: menuBg,
                  color: textColor,
                  border: `1px solid ${pillBorder}`,
                  borderRadius: "8px",
                  boxShadow: isDark
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                  p: 0.5,
                  backgroundImage: "none",
                  mt: 0.5,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${borderColor}`,
                mb: 0.5,
              }}
            >
              <Search size={14} color={textMuted} />
              <input
                autoFocus
                type="text"
                placeholder="Search cycles..."
                value={cycleSearch}
                onChange={(e) => setCycleSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: textColor,
                  fontSize: "0.8125rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </Box>

            {filteredCycles.map((c) => {
              const isSelected = cycle === c.id;
              return (
                <Box
                  key={c.id}
                  onClick={() => {
                    setCycle(c.id);
                    setAnchorCycle(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: isDark ? "#252732" : "#f1f5f9" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    {c.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: textColor,
                      }}
                    >
                      {c.label}
                    </Typography>
                  </Box>
                  {isSelected && <Check size={14} color={textColor} />}
                </Box>
              );
            })}
          </Menu>

          {/* Modules */}
          <Box
            component="button"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              bgcolor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: "6px",
              px: 1.1,
              py: 0.45,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: textColor,
              cursor: "pointer",
              "&:hover": { borderColor: isDark ? "#484f58" : "#94a3b8" },
            }}
          >
            <GridIcon size={13} color="#949aa7" />
            <span>{module}</span>
          </Box>
        </Box>

        {/* Extra Tag Pill (TERRA-6) */}
        {hasParent && (
          <Box sx={{ display: "flex", mt: 0.25 }}>
            <Box
              sx={{
                bgcolor: pillBg,
                border: `1px solid ${pillBorder}`,
                borderRadius: "5px",
                px: 1,
                py: 0.25,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: textColor,
              }}
            >
              TERRA-6
            </Box>
          </Box>
        )}

        {/* Footer Row: Create More Toggle + Discard + Save to Drafts */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 2,
            mt: 1,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          {/* Create More toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Switch
              size="small"
              checked={createMore}
              onChange={(e) => setCreateMore(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#38bdf8",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#0284c7",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: textMuted }}>
              Create more
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={handleDiscard}
              size="small"
              sx={{
                color: textMuted,
                bgcolor: isDark ? "#1a1c23" : "#f1f5f9",
                border: `1px solid ${pillBorder}`,
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                borderRadius: "6px",
                px: 2,
                py: 0.6,
                "&:hover": {
                  color: textColor,
                  bgcolor: isDark ? "#242732" : "#e2e8f0",
                },
              }}
            >
              Discard
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!title.trim()}
              size="small"
              sx={{
                
                color: "#ffffff",
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "6px",
                px: 2.2,
                py: 0.6,
                boxShadow: "none",
               
                "&.Mui-disabled": {
                  bgcolor: isDark ? "#1e293b" : "#cbd5e1",
                  color: isDark ? "#475569" : "#94a3b8",
                },
              }}
            >
              Save to Drafts
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
