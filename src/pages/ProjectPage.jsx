import { useState, useRef, useEffect, useMemo } from "react";
import DatePickerCalendar, { parseDateValue } from "../components/DatePickerCalendar";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  Dialog,
  DialogContent,
  TextField,
  Button,
  Switch,
} from "@mui/material";
import {
  Briefcase,
  Search,
  Plus,
  X,
  Settings,
  ListFilter,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Calendar,
  Globe,
  Lock,
  Minus,
} from "lucide-react";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import DashboardLayout from "../components/Layout/DashboardLayout";

/* ───────────────────────── Constants ───────────────────────── */

const ACCENT = "#2b8fd1";
const ACCENT_HOVER = "#2380bd";
const DAY = 24 * 60 * 60 * 1000;

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #3b3b3f 0%, #8a8a90 50%, #c9c9cd 100%)",
  "linear-gradient(135deg, #5a4632 0%, #8c6a46 50%, #b99467 100%)",
  "linear-gradient(135deg, #1e3a5f 0%, #2f6690 50%, #6aa6c9 100%)",
  "linear-gradient(135deg, #3a1e5c 0%, #6b3fa0 50%, #a98bd6 100%)",
  "linear-gradient(135deg, #1e4d3a 0%, #2f7d5b 50%, #7fc4a3 100%)",
];

const SORT_OPTIONS = [
  { id: "createdAt", label: "Created date" },
  { id: "name", label: "Name" },
  { id: "identifier", label: "Identifier" },
];

const ACCESS = [
  { id: "Public", label: "Public", icon: <Globe size={14} color="#38bdf8" /> },
  { id: "Private", label: "Private", icon: <Lock size={14} color="#f59e0b" /> },
];

const PEOPLE = [
  { id: "NIRON ROEM", label: "NIRON ROEM", icon: <User size={14} color="#38bdf8" /> },
  { id: "Alex Rivera", label: "Alex Rivera", icon: <User size={14} color="#a855f7" /> },
  { id: "Elena Vance", label: "Elena Vance", icon: <User size={14} color="#10b981" /> },
];

const LEAD_OPTIONS = [
  { id: "No lead", label: "No lead", icon: <Minus size={14} color="#8b949e" /> },
  ...PEOPLE,
];

const DATE_FILTERS = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
];

const FILTER_SECTIONS = ["Access", "Lead", "Members", "Created date"];

const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const getPresetDates = () => {
  const offsets = [
    ["Today", 0],
    ["Tomorrow", 1],
    ["Next week", 7],
    ["In 2 weeks", 14],
  ];
  return offsets.map(([label, n]) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return { label, value: formatDate(d) };
  });
};

/* ── Demo data (replace with API data) ── */
const DEMO_PROJECTS = [
  {
    id: 1,
    name: "TerraLink",
    identifier: "TERRA",
    description: "",
    icon: "gear",
    cover: null,
    lead: null,
    members: [],
    access: "Public",
    joined: true,
    createdAt: Date.now() - 12 * DAY,
  },
  {
    id: 2,
    name: "HR Management",
    identifier: "HRMANAGEME",
    description: "",
    icon: "😜",
    cover: null,
    lead: null,
    members: [],
    access: "Private",
    joined: true,
    createdAt: Date.now() - 3 * DAY,
  },
];

/* ───────────────────────── Theme tokens ───────────────────────── */

const getTokens = (isDark) => ({
  pageBg: isDark ? "#0f0f10" : "#f4f5f7",
  barBg: isDark ? "#0f0f10" : "#ffffff",
  cardBg: isDark ? "#1c1d20" : "#ffffff",
  modalBg: isDark ? "#14151a" : "#ffffff",
  innerBg: isDark ? "#0f1013" : "#f8fafc",
  menuBg: isDark ? "#191a21" : "#ffffff",
  borderColor: isDark ? "#262832" : "#e2e8f0",
  text: isDark ? "#f0f2f5" : "#0f172a",
  muted: isDark ? "#8b949e" : "#64748b",
  pillBg: isDark ? "#1a1c23" : "#f1f5f9",
  pillBorder: isDark ? "#2b2e38" : "#cbd5e1",
  rowHover: isDark ? "#252732" : "#f1f5f9",
  pillHover: isDark ? "#484f58" : "#94a3b8",
});

const menuPaperSx = (t, isDark, width = 220, p = 0.5) => ({
  width,
  bgcolor: t.menuBg,
  color: t.text,
  border: `1px solid ${t.pillBorder}`,
  borderRadius: "8px",
  boxShadow: isDark ? "0 14px 30px rgba(0,0,0,0.6)" : "0 10px 25px rgba(0,0,0,0.1)",
  p,
  backgroundImage: "none",
  mt: 0.5,
});

/* ───────────────────────── Shared building blocks ───────────────────────── */

/* Row inside a dropdown */
function MenuRow({ t, active, onClick, children, danger = false, space = true }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: space ? "space-between" : "flex-start",
        px: 1.25,
        py: 0.7,
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.8125rem",
        fontWeight: active ? 600 : 500,
        color: danger ? "#ef4444" : t.text,
        transition: "all 0.12s ease",
        "&:hover": { bgcolor: t.rowHover },
      }}
    >
      {children}
      {active && <Check size={14} color={t.text} />}
    </Box>
  );
}

/* Search field at the top of a dropdown */
function MenuSearch({ t, value, onChange, placeholder }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderBottom: `1px solid ${t.borderColor}`,
        mb: 0.5,
      }}
    >
      <Search size={14} color={t.muted} />
      <input
        autoFocus
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          color: t.text,
          fontSize: "0.8125rem",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </Box>
  );
}

/* Dropdown with search + single select (state / priority style) */
function OptionMenu({ anchorEl, onClose, t, isDark, options, value, onSelect, placeholder, width = 220 }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (anchorEl) setQ("");
  }, [anchorEl]);

  const list = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{ paper: { sx: menuPaperSx(t, isDark, width) } }}
    >
      <MenuSearch t={t} value={q} onChange={setQ} placeholder={placeholder} />
      {list.map((o) => (
        <MenuRow
          key={o.id}
          t={t}
          active={value === o.id}
          onClick={() => {
            onSelect(o.id);
            onClose();
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {o.icon}
            <span>{o.label}</span>
          </Box>
        </MenuRow>
      ))}
    </Menu>
  );
}

/* Date presets + MUI calendar + clear */
function DateMenu({ anchorEl, onClose, t, isDark, title, value, hasValue, onPick, onClear, clearLabel }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{ paper: { sx: menuPaperSx(t, isDark, 370, 1.25) } }}
    >
      <Typography variant="caption" sx={{ color: t.muted, fontWeight: 600, px: 0.5, mb: 1, display: "block" }}>
        {title}
      </Typography>
      {getPresetDates().map((p) => (
        <Box
          key={p.label}
          onClick={() => {
            onPick(p.value);
            onClose();
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
            "&:hover": { bgcolor: t.rowHover },
          }}
        >
          <span>{p.label}</span>
          <span style={{ fontSize: "0.75rem", color: t.muted }}>{p.value}</span>
        </Box>
      ))}

      <Box sx={{ borderTop: `1px solid ${t.borderColor}`, my: 1 }} />

      <Typography variant="caption" sx={{ color: t.muted, fontWeight: 600, px: 0.5, mb: 0.75, display: "block" }}>
        Pick date
      </Typography>
      <DatePickerCalendar
        value={value || ""}
        isDark={isDark}
        theme={{ text: t.text, muted: t.muted, hover: t.rowHover, surface: t.innerBg, border: t.borderColor, accent: ACCENT }}
        onChange={(value) => {
          const date = parseDateValue(value);
          if (!date) return;
          onPick(formatDate(date));
          onClose();
        }}
        onClose={onClose}
      />

      {hasValue && (
        <Box
          onClick={() => {
            onClear();
            onClose();
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
          {clearLabel}
        </Box>
      )}
    </Menu>
  );
}

/* Property pill used inside the modal */
function PillButton({ t, onClick, icon, label, active = false, isDark }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.7,
        bgcolor: t.pillBg,
        border: `1px solid ${active ? "#0284c7" : t.pillBorder}`,
        borderRadius: "6px",
        px: 1.1,
        py: 0.45,
        fontSize: "0.75rem",
        fontWeight: 500,
        fontFamily: "inherit",
        color: active ? (isDark ? "#38bdf8" : "#0284c7") : t.text,
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { borderColor: t.pillHover },
      }}
    >
      {icon}
      <span>{label}</span>
    </Box>
  );
}

/* ───────────────────────── Project card ───────────────────────── */

function ProjectCard({ project, t, isDark, onJoin }) {
  const cover = COVER_GRADIENTS[project.id % COVER_GRADIENTS.length];

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "10px",
        bgcolor: t.cardBg,
        border: `1px solid ${t.borderColor}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: t.pillHover,
          boxShadow: isDark ? "0 6px 24px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Cover with fade */}
      <Box
        sx={{
          position: "relative",
          height: 132,
          backgroundImage: project.cover ? `url(${project.cover})` : cover,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 55%, ${t.cardBg} 100%)`,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 1,
            width: 45,
            height: 45,
            borderRadius: "8px",
            bgcolor: t.cardBg,
            border: `1px solid ${t.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.35rem",
          }}
        >
          {project.icon === "gear" ? <Settings size={22} color={t.muted} /> : project.icon}
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ px: 2, pt: 0.5, pb: 1.75, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 500, color: t.text, lineHeight: 1.3 }}>
          {project.name}
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: t.muted }}>{project.identifier}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25 }}>
          <User size={15} color={t.muted} />
          <Typography sx={{ fontSize: "0.8125rem", color: t.muted }}>{project.lead || "No lead"}</Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: "auto", px: 2, py: 1.5, borderTop: `1px solid ${t.borderColor}` }}>
        {project.joined ? (
          <Box
            sx={{
              display: "inline-block",
              px: 1.25,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: "rgba(34,197,94,0.14)",
              color: "#4ade80",
              fontSize: "0.8125rem",
              fontWeight: 500,
            }}
          >
            Joined
          </Box>
        ) : (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              onJoin(project.id);
            }}
            sx={{
              display: "inline-block",
              px: 1.25,
              py: 0.5,
              borderRadius: "6px",
              border: `1px solid ${t.pillBorder}`,
              bgcolor: t.pillBg,
              color: t.text,
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { borderColor: t.pillHover },
            }}
          >
            Join
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ───────────────────────── Filter dropdown ───────────────────────── */

function FilterMenu({ anchorEl, onClose, t, isDark, filters, setFilters }) {
  const [section, setSection] = useState(null);

  useEffect(() => {
    if (anchorEl) setSection(null);
  }, [anchorEl]);

  const toggleIn = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  let body;
  if (!section) {
    body = (
      <>
        {/* My projects checkbox */}
        <Box
          onClick={() => setFilters((f) => ({ ...f, mine: !f.mine }))}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.25,
            py: 0.9,
            borderRadius: "6px",
            cursor: "pointer",
            borderBottom: `1px solid ${t.borderColor}`,
            mb: 0.5,
            "&:hover": { bgcolor: t.rowHover },
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "4px",
              border: `1.5px solid ${filters.mine ? ACCENT : t.muted}`,
              bgcolor: filters.mine ? ACCENT : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {filters.mine && <Check size={11} color="#fff" strokeWidth={3} />}
          </Box>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: t.text }}>My projects</Typography>
        </Box>

        {FILTER_SECTIONS.map((s) => (
          <MenuRow key={s} t={t} onClick={() => setSection(s)}>
            <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s}</span>
            <ChevronRight size={15} color={t.muted} />
          </MenuRow>
        ))}
      </>
    );
  } else {
    let rows;
    if (section === "Access")
      rows = ACCESS.map((o) => (
        <MenuRow key={o.id} t={t} active={filters.access.includes(o.id)} onClick={() => toggleIn("access", o.id)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {o.icon}
            <span>{o.label}</span>
          </Box>
        </MenuRow>
      ));
    if (section === "Lead")
      rows = PEOPLE.map((o) => (
        <MenuRow key={o.id} t={t} active={filters.lead.includes(o.id)} onClick={() => toggleIn("lead", o.id)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {o.icon}
            <span>{o.label}</span>
          </Box>
        </MenuRow>
      ));
    if (section === "Members")
      rows = PEOPLE.map((o) => (
        <MenuRow key={o.id} t={t} active={filters.members.includes(o.id)} onClick={() => toggleIn("members", o.id)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {o.icon}
            <span>{o.label}</span>
          </Box>
        </MenuRow>
      ));
    if (section === "Created date")
      rows = DATE_FILTERS.map((o) => (
        <MenuRow
          key={o.id}
          t={t}
          active={filters.date === o.id}
          onClick={() => setFilters((f) => ({ ...f, date: f.date === o.id ? null : o.id }))}
        >
          <span>{o.label}</span>
        </MenuRow>
      ));

    body = (
      <>
        <Box
          onClick={() => setSection(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.25,
            py: 0.9,
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: t.text,
            borderBottom: `1px solid ${t.borderColor}`,
            mb: 0.5,
            "&:hover": { bgcolor: t.rowHover },
          }}
        >
          <ChevronLeft size={15} />
          {section}
        </Box>
        {rows}
      </>
    );
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { sx: menuPaperSx(t, isDark, 250) } }}
    >
      {body}
    </Menu>
  );
}

/* ───────────────────────── Create project modal ───────────────────────── */

function CreateProjectModal({ open, onClose, onSave, t, isDark }) {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState("Public");
  const [lead, setLead] = useState("No lead");
  const [startDate, setStartDate] = useState("Start date");
  const [endDate, setEndDate] = useState("End date");
  const [createMore, setCreateMore] = useState(false);

  const [anchorAccess, setAnchorAccess] = useState(null);
  const [anchorLead, setAnchorLead] = useState(null);
  const [anchorStart, setAnchorStart] = useState(null);
  const [anchorEnd, setAnchorEnd] = useState(null);

  const reset = () => {
    setName("");
    setIdentifier("");
    setDescription("");
    setAccess("Public");
    setLead("No lead");
    setStartDate("Start date");
    setEndDate("End date");
  };

  useEffect(() => {
    if (open) reset();
  }, [open]);

  const handleName = (v) => {
    setName(v);
    setIdentifier(v.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10));
  };

  const canSave = name.trim() && identifier.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: Date.now(),
      name: name.trim(),
      identifier: identifier.trim(),
      description: description.trim(),
      icon: "gear",
      cover: null,
      lead: lead !== "No lead" ? lead : null,
      members: [],
      access,
      startDate: startDate !== "Start date" ? startDate : null,
      endDate: endDate !== "End date" ? endDate : null,
      joined: true,
      createdAt: Date.now(),
    });
    reset();
    if (!createMore) onClose();
  };

  const handleDiscard = () => {
    reset();
    onClose();
  };

  const accessObj = ACCESS.find((a) => a.id === access);
  const startSet = startDate !== "Start date";
  const endSet = endDate !== "End date";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: t.modalBg,
            color: t.text,
            borderRadius: "12px",
            border: `1px solid ${t.borderColor}`,
            boxShadow: isDark ? "0 24px 50px rgba(0,0,0,0.7)" : "0 20px 40px rgba(0,0,0,0.12)",
            p: { xs: 2, sm: 2.5, md: 3 },
            backgroundImage: "none",
            maxWidth: 640,
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "1.0625rem", color: t.text, letterSpacing: "-0.01em", mb: 0.5 }}
        >
          Create project
        </Typography>

        {/* Name */}
        <Box
          sx={{
            borderRadius: "7px",
            border: `1px solid ${name ? "#0284c7" : t.pillBorder}`,
            bgcolor: t.innerBg,
            transition: "border-color 0.15s ease",
            px: 1.5,
            py: 0.4,
            "&:focus-within": { borderColor: "#0284c7", boxShadow: "0 0 0 1px #0284c7" },
          }}
        >
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            placeholder="Project name"
            value={name}
            onChange={(e) => handleName(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: t.text,
                  "& input::placeholder": { color: t.muted, opacity: 1 },
                },
              },
            }}
          />
        </Box>

        {/* Identifier */}
        <Box
          sx={{
            borderRadius: "7px",
            border: `1px solid ${t.borderColor}`,
            bgcolor: t.innerBg,
            px: 1.5,
            py: 0.4,
            "&:focus-within": { borderColor: isDark ? "#383c48" : "#cbd5e1" },
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Identifier (e.g. TERRA)"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.toUpperCase().slice(0, 10))}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.8125rem",
                  color: t.text,
                  "& input::placeholder": { color: t.muted, opacity: 1 },
                },
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box
          sx={{
            minHeight: 110,
            borderRadius: "8px",
            border: `1px solid ${t.borderColor}`,
            bgcolor: t.innerBg,
            p: 1.5,
            transition: "border-color 0.15s ease",
            "&:focus-within": { borderColor: isDark ? "#383c48" : "#cbd5e1" },
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="standard"
            placeholder="Click to add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.875rem",
                  color: t.text,
                  "& textarea::placeholder": { color: t.muted, opacity: 1 },
                },
              },
            }}
          />
        </Box>

        {/* Property pills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, alignItems: "center", pt: 0.5 }}>
          <PillButton t={t} isDark={isDark} onClick={(e) => setAnchorAccess(e.currentTarget)} icon={accessObj.icon} label={access} />
          <PillButton
            t={t}
            isDark={isDark}
            onClick={(e) => setAnchorLead(e.currentTarget)}
            icon={<User size={13} color="#949aa7" />}
            label={lead}
          />
          <PillButton
            t={t}
            isDark={isDark}
            active={startSet}
            onClick={(e) => setAnchorStart(e.currentTarget)}
            icon={<Calendar size={13} color={startSet ? "#38bdf8" : "#949aa7"} />}
            label={startDate}
          />
          <PillButton
            t={t}
            isDark={isDark}
            active={endSet}
            onClick={(e) => setAnchorEnd(e.currentTarget)}
            icon={<Calendar size={13} color={endSet ? "#38bdf8" : "#949aa7"} />}
            label={endDate}
          />
        </Box>

        <OptionMenu
          anchorEl={anchorAccess}
          onClose={() => setAnchorAccess(null)}
          t={t}
          isDark={isDark}
          options={ACCESS}
          value={access}
          onSelect={setAccess}
          placeholder="Search access..."
          width={200}
        />
        <OptionMenu
          anchorEl={anchorLead}
          onClose={() => setAnchorLead(null)}
          t={t}
          isDark={isDark}
          options={LEAD_OPTIONS}
          value={lead}
          onSelect={setLead}
          placeholder="Search leads..."
        />
        <DateMenu
          anchorEl={anchorStart}
          onClose={() => setAnchorStart(null)}
          t={t}
          isDark={isDark}
          title="Start Date Presets"
          value={startDate === "Start date" ? "" : startDate}
          hasValue={startSet}
          onPick={setStartDate}
          onClear={() => setStartDate("Start date")}
          clearLabel="Clear start date"
        />
        <DateMenu
          anchorEl={anchorEnd}
          onClose={() => setAnchorEnd(null)}
          t={t}
          isDark={isDark}
          title="End Date Presets"
          value={endDate === "End date" ? "" : endDate}
          hasValue={endSet}
          onPick={setEndDate}
          onClear={() => setEndDate("End date")}
          clearLabel="Clear end date"
        />

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 2,
            mt: 1,
            borderTop: `1px solid ${t.borderColor}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Switch
              size="small"
              checked={createMore}
              onChange={(e) => setCreateMore(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#38bdf8" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0284c7" },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: t.muted }}>
              Create more
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={handleDiscard}
              size="small"
              sx={{
                color: t.muted,
                bgcolor: t.pillBg,
                border: `1px solid ${t.pillBorder}`,
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                borderRadius: "6px",
                px: 2,
                py: 0.6,
                "&:hover": { color: t.text, bgcolor: isDark ? "#242732" : "#e2e8f0" },
              }}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!canSave}
              size="small"
              sx={{
                bgcolor: ACCENT,
                color: "#ffffff",
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "6px",
                px: 2.2,
                py: 0.6,
                boxShadow: "none",
                "&:hover": { bgcolor: ACCENT_HOVER, boxShadow: "none" },
                "&.Mui-disabled": {
                  bgcolor: isDark ? "#1e293b" : "#cbd5e1",
                  color: isDark ? "#475569" : "#94a3b8",
                },
              }}
            >
              Create project
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Main page ───────────────────────── */

export default function ProjectPage() {
  const { isDark } = useThemeContext();
  const { user } = useAuth();
  const t = getTokens(isDark);

  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [showCreate, setShowCreate] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const [sortKey, setSortKey] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(true);
  const [anchorSort, setAnchorSort] = useState(null);

  const [anchorFilter, setAnchorFilter] = useState(null);
  const [filters, setFilters] = useState({ mine: false, access: [], lead: [], members: [], date: null });

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const activeFilterCount =
    (filters.mine ? 1 : 0) +
    filters.access.length +
    filters.lead.length +
    filters.members.length +
    (filters.date ? 1 : 0);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const dateOpt = DATE_FILTERS.find((d) => d.id === filters.date);

    const list = projects.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.identifier.toLowerCase().includes(q)) return false;
      if (filters.mine && !p.joined) return false;
      if (filters.access.length && !filters.access.includes(p.access)) return false;
      if (filters.lead.length && !filters.lead.includes(p.lead)) return false;
      if (filters.members.length && !filters.members.some((m) => p.members.includes(m))) return false;
      if (dateOpt && Date.now() - p.createdAt > dateOpt.days * DAY) return false;
      return true;
    });

    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [projects, searchQuery, filters, sortKey, sortAsc]);

  const joinProject = (id) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, joined: true } : p)));

  const sortLabel = SORT_OPTIONS.find((s) => s.id === sortKey)?.label;

  return (
    <DashboardLayout>
      <Box sx={{ minHeight: "100%", bgcolor: t.pageBg, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <Box
          sx={{
            height: 54,
            px: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${t.borderColor}`,
            bgcolor: t.barBg,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Briefcase size={17} color={t.muted} />
            <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: t.text }}>Projects</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Search */}
            {showSearch ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: t.pillBg,
                  border: `1px solid ${t.pillBorder}`,
                  borderRadius: "8px",
                  px: 1.25,
                  py: 0.5,
                }}
              >
                <Search size={13} color={t.muted} />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects…"
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: t.text,
                    fontSize: "0.8125rem",
                    width: 160,
                    fontFamily: "inherit",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  sx={{ p: 0.25, color: t.muted, "&:hover": { color: t.text } }}
                >
                  <X size={12} />
                </IconButton>
              </Box>
            ) : (
              <Tooltip title="Search">
                <IconButton
                  size="small"
                  onClick={() => setShowSearch(true)}
                  sx={{ color: t.muted, p: 0.75, "&:hover": { color: t.text, bgcolor: t.pillBg } }}
                >
                  <Search size={16} />
                </IconButton>
              </Tooltip>
            )}

            {/* Sort pill */}
            <Box
              component="button"
              type="button"
              onClick={(e) => setAnchorSort(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                bgcolor: t.pillBg,
                border: `1px solid ${t.pillBorder}`,
                borderRadius: "8px",
                px: 1.5,
                py: 0.6,
                fontSize: "0.8125rem",
                fontWeight: 500,
                fontFamily: "inherit",
                color: t.text,
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": { borderColor: t.pillHover },
              }}
            >
              {sortAsc ? <ArrowUpNarrowWide size={15} /> : <ArrowDownWideNarrow size={15} />}
              {sortLabel}
            </Box>

            {/* Filter */}
            <Tooltip title="Filters">
              <IconButton
                size="small"
                onClick={(e) => setAnchorFilter(e.currentTarget)}
                sx={{
                  position: "relative",
                  color: t.muted,
                  p: 0.9,
                  borderRadius: "8px",
                  "&:hover": { color: t.text, bgcolor: t.pillBg },
                }}
              >
                <ListFilter size={17} />
                {activeFilterCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#ec4899",
                      border: `1.5px solid ${t.barBg}`,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

            {/* Add project */}
            <Button
              variant="outlined"
              onClick={() => setShowCreate(true)}
              startIcon={<Plus size={14} />}
              size="small"
              sx={{

                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "8px",
                px: 1.75,
                py: 0.6,


              }}
            >
              Add Project
            </Button>

            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "#ec4899",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#fff",
                ml: 0.5,
                flexShrink: 0,
              }}
            >
              {(user?.nameEn || user?.name || "U").charAt(0).toUpperCase()}
            </Box>
          </Box>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2.5,
            alignContent: "start",
          }}
        >
          {visible.length === 0 ? (
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 12,
                gap: 2,
              }}
            >
              <Briefcase size={40} color={isDark ? "#333" : "#ccc"} />
              <Typography sx={{ color: isDark ? "#555" : "#aaa", fontSize: "0.9rem" }}>
                {searchQuery || activeFilterCount
                  ? "No projects match your search or filters"
                  : "No projects yet — click \"Add Project\" to start!"}
              </Typography>
            </Box>
          ) : (
            visible.map((p) => <ProjectCard key={p.id} project={p} t={t} isDark={isDark} onJoin={joinProject} />)
          )}
        </Box>
      </Box>

      {/* Sort dropdown */}
      <Menu
        anchorEl={anchorSort}
        open={Boolean(anchorSort)}
        onClose={() => setAnchorSort(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: menuPaperSx(t, isDark, 200) } }}
      >
        {SORT_OPTIONS.map((o) => (
          <MenuRow
            key={o.id}
            t={t}
            active={sortKey === o.id}
            onClick={() => {
              setSortKey(o.id);
              setAnchorSort(null);
            }}
          >
            <span>{o.label}</span>
          </MenuRow>
        ))}
        <Box sx={{ borderTop: `1px solid ${t.borderColor}`, my: 0.5 }} />
        <MenuRow t={t} active={sortAsc} onClick={() => setSortAsc(true)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <ArrowUpNarrowWide size={14} color={t.muted} />
            <span>Ascending</span>
          </Box>
        </MenuRow>
        <MenuRow t={t} active={!sortAsc} onClick={() => setSortAsc(false)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <ArrowDownWideNarrow size={14} color={t.muted} />
            <span>Descending</span>
          </Box>
        </MenuRow>
      </Menu>

      {/* Filter dropdown */}
      <FilterMenu
        anchorEl={anchorFilter}
        onClose={() => setAnchorFilter(null)}
        t={t}
        isDark={isDark}
        filters={filters}
        setFilters={setFilters}
      />

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={(p) => setProjects((prev) => [...prev, p])}
        t={t}
        isDark={isDark}
      />
    </DashboardLayout>
  );
}
