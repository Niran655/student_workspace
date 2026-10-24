import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Button,
    Divider,
    Tooltip,
    Drawer,
    Chip,
    Popover,
    Checkbox,
} from "@mui/material";
import {
    Pencil,
    UserCheck,
    Bell,
    Layers,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Search,
    CircleDashed,
    Circle,
    CheckCircle2,
    CircleDot,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    Calendar,
    Sparkles,
    BarChart2,
    Minus,
    Tag,
    Home,
    X,
    List,
    Columns,
    Table,
    Filter,
    Download,
    Copy,
    Trash2,
    ExternalLink,
    Link2,
    Plus,
    Users,
    AlignLeft,
    CalendarClock,
    Minimize2,
    Maximize2,
    Check,
    SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import TaskDetailDrawer from "../components/TaskDetailDrawer";

/* ───────────── constants ───────────── */
const STORAGE_KEY = "uniforge_work_items_v4";
const STATES = [
    { k: "Backlog", c: "#858b98" },
    { k: "Todo", c: "#3b82f6" },
    { k: "In Progress", c: "#f59e0b" },
    { k: "Done", c: "#10b981" },
    { k: "Cancelled", c: "#ef4444" },
];
const PRIORITIES = [
    { k: "Urgent", c: "#ef4444", Icon: AlertCircle },
    { k: "High", c: "#f97316", Icon: BarChart2 },
    { k: "Medium", c: "#eab308", Icon: BarChart2 },
    { k: "Low", c: "#3b82f6", Icon: BarChart2 },
    { k: "None", c: "#858b98", Icon: Minus },
];
const prio = (k) => PRIORITIES.find((p) => p.k === k) || PRIORITIES[4];
const stateOf = (k) => STATES.find((s) => s.k === k) || STATES[0];

const PROPS = [
    "ID",
    "Assignee",
    "Start date",
    "Due date",
    "Labels",
    "Priority",
    "State",
    "Cycle",
    "Module",
];
const DEFAULT_PROPS = Object.fromEntries(
    PROPS.map((p) => [p, !["Cycle", "Module"].includes(p)]),
);

const ME = "NIRON ROEM";
const L = {
    admin: { name: "admin", color: "#0ea5e9" },
    concepts: { name: "concepts", color: "#a855f7" },
    docs: { name: "docs", color: "#22c55e" },
    bug: { name: "bug", color: "#ef4444" },
    feature: { name: "feature", color: "#3b82f6" },
    design: { name: "design", color: "#ec4899" },
    backend: { name: "backend", color: "#f59e0b" },
    frontend: { name: "frontend", color: "#06b6d4" },
};

const INITIAL_ITEMS = [
    {
        id: "TERRA-9",
        title: "Hello",
        project: "TerraLink",
        state: "Backlog",
        priority: "Urgent",
        start: "2026-10-19",
        due: "2026-10-28",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.admin, L.docs],
        cycle: "Cycle 1",
        module: "Workspace Setup",
        updated: 5,
    },
    {
        id: "TERRA-8",
        title: "Create View",
        project: "TerraLink",
        state: "In Progress",
        priority: "High",
        start: "2026-10-18",
        due: "2026-10-25",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.feature, L.frontend],
        cycle: "Cycle 1",
        module: "Design System",
        updated: 4,
    },
    {
        id: "TERRA-7",
        title: "Refactor authentication middleware and JWT rotation",
        project: "TerraLink",
        state: "Todo",
        priority: "Urgent",
        start: "2026-10-20",
        due: "2026-10-24",
        assignees: [ME],
        creator: "Alex Chen",
        subscribed: true,
        labels: [L.backend, L.bug],
        cycle: "Cycle 2",
        module: "User Auth",
        updated: 7,
    },
    {
        id: "TERRA-6",
        title: "Optimize horizontal board scroll performance on mobile",
        project: "TerraLink",
        state: "In Progress",
        priority: "High",
        start: "2026-10-21",
        due: "2026-10-27",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.frontend, L.design],
        cycle: "Cycle 2",
        module: "Workspace Setup",
        updated: 8,
    },
    {
        id: "TERRA-5",
        title: "4. Visualize your work 🔮",
        project: "TerraLink",
        state: "Backlog",
        priority: "Medium",
        start: "2026-10-22",
        due: "2026-11-02",
        assignees: [ME],
        creator: "Plane",
        subscribed: true,
        labels: [L.concepts],
        cycle: "Cycle 1",
        module: "Analytics Engine",
        updated: 3,
    },
    {
        id: "TERRA-4",
        title: "3. Create and assign Work Items ✏️",
        project: "TerraLink",
        state: "In Progress",
        priority: "High",
        start: "2026-10-17",
        due: "2026-10-18",
        assignees: [ME],
        creator: "Plane",
        subscribed: true,
        labels: [L.concepts, L.docs],
        cycle: "Cycle 1",
        module: "Workspace Setup",
        updated: 2,
    },
    {
        id: "TERRA-3",
        title: "Database migration for custom issue fields",
        project: "TerraLink",
        state: "Done",
        priority: "Medium",
        start: "2026-10-14",
        due: "2026-10-18",
        assignees: [ME],
        creator: ME,
        subscribed: false,
        labels: [L.backend],
        cycle: "Cycle 1",
        module: "User Auth",
        updated: 9,
    },
    {
        id: "TERRA-2",
        title: "1. Create Projects 🎯",
        project: "TerraLink",
        state: "Done",
        priority: "Medium",
        start: "2026-10-16",
        due: "2026-10-17",
        assignees: ["Sarah Connor"],
        creator: ME,
        subscribed: true,
        labels: [L.concepts, L.docs],
        cycle: "Cycle 1",
        module: "Workspace Setup",
        updated: 1,
    },
    {
        id: "TERRA-1",
        title: "Setup workspace environment and theme system",
        project: "TerraLink",
        state: "Done",
        priority: "Low",
        start: "2026-10-12",
        due: "2026-10-15",
        assignees: ["David Kim"],
        creator: ME,
        subscribed: true,
        labels: [L.admin, L.design],
        cycle: "Cycle 1",
        module: "Workspace Setup",
        updated: 10,
    },
    {
        id: "TERRA-10",
        title: "Build webhook notifications and Slack integration",
        project: "TerraLink",
        state: "Todo",
        priority: "High",
        start: "2026-10-23",
        due: "2026-10-30",
        assignees: ["Alex Chen"],
        creator: ME,
        subscribed: true,
        labels: [L.feature, L.backend],
        cycle: "Cycle 2",
        module: "Integrations",
        updated: 11,
    },
    {
        id: "TERRA-11",
        title: "Security audit and penetration testing fixes",
        project: "TerraLink",
        state: "Backlog",
        priority: "Urgent",
        start: "2026-10-25",
        due: "2026-11-05",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.bug, L.admin],
        cycle: "Cycle 2",
        module: "User Auth",
        updated: 12,
    },
    {
        id: "TERRA-12",
        title: "Export issues to CSV and Excel format",
        project: "TerraLink",
        state: "Todo",
        priority: "Low",
        start: "2026-10-26",
        due: "2026-11-03",
        assignees: ["David Kim"],
        creator: ME,
        subscribed: false,
        labels: [L.feature],
        cycle: "Cycle 2",
        module: "Analytics Engine",
        updated: 13,
    },
    {
        id: "HRMANAGEME-1",
        title: "Design UI for employee attendance and leave management",
        project: "HR Management",
        state: "In Progress",
        priority: "High",
        start: "2026-10-20",
        due: "2026-10-31",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.admin, L.design],
        cycle: "HR Sprint 1",
        module: "Attendance",
        updated: 6,
    },
    {
        id: "HR-2",
        title: "Implement payroll tax calculation algorithms",
        project: "HR Management",
        state: "Todo",
        priority: "Urgent",
        start: "2026-10-21",
        due: "2026-10-29",
        assignees: [ME],
        creator: "Sarah Connor",
        subscribed: true,
        labels: [L.backend, L.feature],
        cycle: "HR Sprint 1",
        module: "Payroll",
        updated: 14,
    },
    {
        id: "HR-3",
        title: "Employee onboarding automated email sequence",
        project: "HR Management",
        state: "Backlog",
        priority: "Medium",
        start: "2026-10-24",
        due: "2026-11-04",
        assignees: ["Sarah Connor"],
        creator: ME,
        subscribed: true,
        labels: [L.admin, L.docs],
        cycle: "HR Sprint 1",
        module: "Onboarding",
        updated: 15,
    },
    {
        id: "HR-4",
        title: "Recruitment pipeline Kanban board customization",
        project: "HR Management",
        state: "Done",
        priority: "Low",
        start: "2026-10-10",
        due: "2026-10-18",
        assignees: [ME],
        creator: ME,
        subscribed: true,
        labels: [L.design, L.feature],
        cycle: "HR Sprint 1",
        module: "Recruitment",
        updated: 16,
    },
    {
        id: "HR-5",
        title: "Annual performance review rubric template",
        project: "HR Management",
        state: "Todo",
        priority: "None",
        start: "2026-10-28",
        due: "2026-11-10",
        assignees: ["David Kim"],
        creator: "Plane",
        subscribed: true,
        labels: [L.docs],
        cycle: "HR Sprint 1",
        module: "Reviews",
        updated: 17,
    },
];

const ACTIVITIES = [
    {
        id: 1,
        text: "set the priority to",
        bold: "Urgent",
        on: "TERRA-9 Hello",
        when: "about 9 hours ago",
        icon: BarChart2,
    },
    {
        id: 2,
        text: "added",
        bold: "TERRA-9 Hello",
        on: "to the module Workspace Setup (Area)",
        when: "about 9 hours ago",
        icon: Layers,
    },
    {
        id: 3,
        text: "added a new assignee",
        bold: "niron.camdoc",
        on: "to TERRA-9 Hello",
        when: "about 9 hours ago",
        icon: Users,
    },
    {
        id: 4,
        text: "created",
        bold: "TERRA-9 Hello",
        on: "",
        when: "about 9 hours ago",
        avatar: true,
    },
    {
        id: 5,
        text: "set the state to",
        bold: "Backlog",
        on: "for TERRA-5 4. Visualize your work",
        when: "about 12 hours ago",
        icon: Layers,
    },
    {
        id: 6,
        text: "set the state to",
        bold: "In Progress",
        on: "for TERRA-8 Create View",
        when: "about 12 hours ago",
        icon: Layers,
    },
    {
        id: 7,
        text: "created",
        bold: "TERRA-8 Create View",
        on: "",
        when: "about 12 hours ago",
        avatar: true,
    },
    {
        id: 8,
        text: "set the start date to",
        bold: "Oct 17, 2026",
        on: "for TERRA-4 3. Create and assign Work Items",
        when: "about 13 hours ago",
        icon: Calendar,
    },
    {
        id: 9,
        text: "set the due date to",
        bold: "Oct 18, 2026",
        on: "for TERRA-4 3. Create and assign Work Items",
        when: "about 13 hours ago",
        icon: Calendar,
    },
];

/* ───────────── date helpers ───────────── */
const D = (iso) => new Date(iso + "T00:00:00");
const MON = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const fmt = (iso) => {
    const d = D(iso);
    return `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
const fmtRange = (s, e) => {
    const a = D(s),
        b = D(e);
    if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear())
        return `${MON[a.getMonth()]} ${a.getDate()} - ${b.getDate()}, ${b.getFullYear()}`;
    return `${MON[a.getMonth()]} ${a.getDate()} - ${fmt(e)}`;
};
const isoOf = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ───────────── small UI pieces ───────────── */
function StateIcon({ state, size = 13 }) {
    const c = stateOf(state).c;
    if (state === "Backlog") return <CircleDashed size={size} color={c} />;
    if (state === "Todo") return <Circle size={size} color={c} />;
    if (state === "Done") return <CheckCircle2 size={size} color={c} />;
    if (state === "Cancelled") return <XCircle size={size} color={c} />;
    return (
        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid ${c}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <Box
                sx={{
                    width: size / 3.5,
                    height: size / 3.5,
                    borderRadius: "50%",
                    bgcolor: c,
                }}
            />
        </Box>
    );
}
function PrioIcon({ k, size = 13 }) {
    const p = prio(k);
    if (k === "Urgent") {
        return (
            <Box
                sx={{
                    width: size + 2,
                    height: size + 2,
                    borderRadius: "3px",
                    bgcolor: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        color: "#fff",
                        fontSize: size * 0.75,
                        fontWeight: 900,
                        lineHeight: 1,
                    }}
                >
                    !
                </Typography>
            </Box>
        );
    }
    return (
        <p.Icon size={size} color={p.c} strokeWidth={k === "None" ? 2.5 : 2} />
    );
}
function Avatar({ size = 20 }) {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 35% 35%, #7e22ce, #3b0764 70%, #000)",
                boxShadow: "0 0 6px rgba(168,85,247,.4)",
            }}
        >
            <Sparkles size={size * 0.5} color="#e9d5ff" />
        </Box>
    );
}

/* ───────────── inline property editor menu ───────────── */
function PropertyMenu({ editAnchor, onClose, onUpdateItem, c }) {
    if (!editAnchor?.anchor || !editAnchor?.item) return null;

    if (editAnchor.type === "priority") {
        return (
            <Menu
                anchorEl={editAnchor.anchor}
                open={Boolean(editAnchor.anchor)}
                onClose={onClose}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: c.card,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                            minWidth: 160,
                            py: 0.5,
                        },
                    },
                }}
            >
                {PRIORITIES.map((p) => {
                    const isSelected = editAnchor.item.priority === p.k;
                    return (
                        <MenuItem
                            key={p.k}
                            dense
                            onClick={() => {
                                onUpdateItem?.(editAnchor.item.id, {
                                    priority: p.k,
                                });
                                onClose();
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                px: 1.5,
                                py: 0.8,
                                fontSize: "0.8125rem",
                                fontWeight: isSelected ? 600 : 400,
                                "&:hover": { bgcolor: c.hover },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.25,
                                }}
                            >
                                <PrioIcon k={p.k} size={14} />
                                <span>{p.k}</span>
                            </Box>
                            {isSelected && <Check size={14} color={c.text} />}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    }

    if (editAnchor.type === "state") {
        return (
            <Menu
                anchorEl={editAnchor.anchor}
                open={Boolean(editAnchor.anchor)}
                onClose={onClose}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: c.card,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                            minWidth: 160,
                            py: 0.5,
                        },
                    },
                }}
            >
                {STATES.map((s) => {
                    const isSelected = editAnchor.item.state === s.k;
                    return (
                        <MenuItem
                            key={s.k}
                            dense
                            onClick={() => {
                                onUpdateItem?.(editAnchor.item.id, {
                                    state: s.k,
                                });
                                onClose();
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                px: 1.5,
                                py: 0.8,
                                fontSize: "0.8125rem",
                                fontWeight: isSelected ? 600 : 400,
                                "&:hover": { bgcolor: c.hover },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.25,
                                }}
                            >
                                <StateIcon state={s.k} size={14} />
                                <span>{s.k}</span>
                            </Box>
                            {isSelected && <Check size={14} color={c.text} />}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    }

    return null;
}

/* ───────────── property pills for an item ───────────── */
function Pills({ item, show, c, onMenu, onOpenEdit, wrap = false }) {
    const pill = c.pill;
    const muted = { ...pill, color: c.muted };
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.9,
                flexShrink: wrap ? 1 : 0,
                minWidth: 0,
                flexWrap: "wrap",
                justifyContent: wrap ? "flex-start" : "flex-end",
            }}
        >
            {show["State"] && (
                <Box
                    sx={{
                        ...pill,
                        cursor: onOpenEdit ? "pointer" : "default",
                        "&:hover": onOpenEdit
                            ? { bgcolor: c.hover, borderColor: c.muted }
                            : {},
                    }}
                    onClick={(e) => {
                        if (onOpenEdit) {
                            e.stopPropagation();
                            onOpenEdit(e.currentTarget, "state", item);
                        }
                    }}
                    title={onOpenEdit ? "Click to change state" : undefined}
                >
                    <StateIcon state={item.state} />
                    <span>{item.state}</span>
                </Box>
            )}
            {show["Priority"] && (
                <Box
                    sx={{
                        ...pill,
                        cursor: onOpenEdit ? "pointer" : "default",
                        "&:hover": onOpenEdit
                            ? { bgcolor: c.hover, borderColor: c.muted }
                            : {},
                    }}
                    onClick={(e) => {
                        if (onOpenEdit) {
                            e.stopPropagation();
                            onOpenEdit(e.currentTarget, "priority", item);
                        }
                    }}
                    title={onOpenEdit ? "Click to change priority" : undefined}
                >
                    <PrioIcon k={item.priority} />
                    <span>{item.priority}</span>
                </Box>
            )}
            {(show["Start date"] || show["Due date"]) &&
                (item.start && item.due ? (
                    <Box sx={pill}>
                        <Calendar size={13} color={c.muted} />
                        <span>{fmtRange(item.start, item.due)}</span>
                    </Box>
                ) : (
                    <>
                        {show["Start date"] && (
                            <Box sx={muted}>
                                <CalendarClock size={13} />
                                <span>
                                    {item.start
                                        ? fmt(item.start)
                                        : "Start date"}
                                </span>
                            </Box>
                        )}
                        {show["Due date"] && (
                            <Box sx={muted}>
                                <Calendar size={13} />
                                <span>
                                    {item.due ? fmt(item.due) : "Due date"}
                                </span>
                            </Box>
                        )}
                    </>
                ))}
            {show["Assignee"] &&
                (item.assignees.length ? (
                    <Avatar />
                ) : (
                    <Box sx={{ ...muted, px: 0.8 }}>
                        <Users size={13} />
                    </Box>
                ))}
            {show["Cycle"] && item.cycle && <Box sx={pill}>{item.cycle}</Box>}
            {show["Module"] && item.module && (
                <Box sx={pill}>{item.module}</Box>
            )}
            {show["Labels"] &&
                (item.labels.length ? (
                    <>
                        <Box sx={pill}>
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: item.labels[0].color,
                                }}
                            />
                            <span>{item.labels[0].name}</span>
                        </Box>
                        {item.labels.length > 1 && (
                            <Box sx={muted}>
                                +{item.labels.length - 1} label
                            </Box>
                        )}
                    </>
                ) : (
                    <Box sx={{ ...muted, px: 0.8 }}>
                        <Tag size={13} />
                    </Box>
                ))}
            {onMenu && (
                <IconButton
                    size="small"
                    onClick={(e) => onMenu(e.currentTarget, item)}
                    sx={{ color: c.muted, p: 0.5 }}
                >
                    <MoreHorizontal size={15} />
                </IconButton>
            )}
        </Box>
    );
}

/* ───────────── LAYOUT 1: list ───────────── */
function ListLayout({ groups, show, c, onMenu, onOpenEdit, onSelectTask, selectedIds = new Set(), onToggleSelect }) {
    return groups.map((g) => (
        <Box key={g.key}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.1,
                    bgcolor: c.sub,
                    borderTop: `1px solid ${c.border}`,
                    borderBottom: `1px solid ${c.border}`,
                }}
            >
                {g.icon}
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: c.text,
                    }}
                >
                    {g.label}
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: c.muted }}>
                    {g.items.length}
                </Typography>
            </Box>
            {g.items.map((item) => (
                <Box
                    key={item.id}
                    onClick={() => onSelectTask?.(item)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 2,
                        py: 1.1,
                        borderBottom: `1px solid ${c.border}`,
                        cursor: "pointer",
                        "&:hover": { bgcolor: c.hover },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2.5,
                            minWidth: 0,
                        }}
                    >
                        {onToggleSelect && <Checkbox
                            size="small"
                            checked={selectedIds.has(item.id)}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => onToggleSelect?.(item.id)}
                            sx={{ p: 0.25, ml: -0.5 }}
                        />}
                        {show["ID"] && (
                            <Typography
                                sx={{
                                    fontSize: "0.8125rem",
                                    color: c.muted,
                                    minWidth: 100,
                                    flexShrink: 0,
                                }}
                            >
                                {item.id}
                            </Typography>
                        )}
                        <Typography
                            noWrap
                            sx={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: c.text,
                            }}
                        >
                            {item.title}
                        </Typography>
                    </Box>
                    <Pills
                        item={item}
                        show={show}
                        c={c}
                        onMenu={onMenu}
                        onOpenEdit={onOpenEdit}
                    />
                </Box>
            ))}
        </Box>
    ));
}

/* ───────────── LAYOUT 2: board ───────────── */
function BoardLayout({ groups, show, c, onMenu, onOpenEdit, onSelectTask, selectedIds = new Set(), onToggleSelect }) {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            const saved = localStorage.getItem("uniforge_board_collapsed");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const toggleCollapse = (key) => {
        setCollapsed((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            try {
                localStorage.setItem(
                    "uniforge_board_collapsed",
                    JSON.stringify(next),
                );
            } catch {
                // ignore
            }
            return next;
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                overflowX: "auto",
                minHeight: 480,
                "&::-webkit-scrollbar": {
                    height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    bgcolor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    bgcolor: c.border,
                    borderRadius: "4px",
                    "&:hover": {
                        bgcolor: c.muted,
                    },
                },
            }}
        >
            {groups.map((g) => {
                const isCollapsed = !!collapsed[g.key];

                if (isCollapsed) {
                    return (
                        <Box
                            key={g.key}
                            onClick={() => toggleCollapse(g.key)}
                            title={`Click to expand ${g.label}`}
                            sx={{
                                width: 44,
                                minWidth: 44,
                                flexShrink: 0,
                                bgcolor: c.sub,
                                border: `1px solid ${c.border}`,
                                borderRadius: "8px",
                                py: 1.5,
                                px: 0.5,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                userSelect: "none",
                                alignSelf: "stretch",
                                minHeight: 380,
                                transition: "all 0.15s ease",
                                "&:hover": {
                                    bgcolor: c.hover,
                                    borderColor: c.muted,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 1.5,
                                }}
                            >
                                {g.icon}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        color: c.text,
                                        writingMode: "vertical-rl",
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    {g.label}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        color: c.muted,
                                        fontWeight: 500,
                                    }}
                                >
                                    {g.items.length}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCollapse(g.key);
                                    }}
                                    title="Expand group"
                                    sx={{
                                        color: c.muted,
                                        p: 0.5,
                                        mt: 0.5,
                                        borderRadius: "6px",
                                        "&:hover": {
                                            color: c.text,
                                            bgcolor: c.active,
                                        },
                                    }}
                                >
                                    <Maximize2 size={13} />
                                </IconButton>
                            </Box>
                        </Box>
                    );
                }

                return (
                    <Box
                        key={g.key}
                        sx={{
                            width: 350,
                            minWidth: 350,
                            maxWidth: 360,
                            flexShrink: 0,
                            bgcolor: c.sub,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            p: 1.25,
                            display: "flex",
                            flexDirection: "column",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1.25,
                                px: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    minWidth: 0,
                                }}
                            >
                                {g.icon}
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        color: c.text,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {g.label}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        color: c.muted,
                                    }}
                                >
                                    {g.items.length}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={() => toggleCollapse(g.key)}
                                title="Collapse group"
                                sx={{
                                    color: c.muted,
                                    p: 0.5,
                                    borderRadius: "6px",
                                    "&:hover": {
                                        color: c.text,
                                        bgcolor: c.hover,
                                    },
                                }}
                            >
                                <Minimize2 size={14} />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            {g.items.map((item) => (
                                <Box
                                    key={item.id}
                                    onClick={() => onSelectTask?.(item)}
                                    sx={{
                                        bgcolor: c.card,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: "8px",
                                        p: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        cursor: "pointer",
                                        transition:
                                            "border-color 0.15s ease, box-shadow 0.15s ease",
                                        "&:hover": {
                                            borderColor: c.muted,
                                        },
                                    }}
                                >
                                    {onToggleSelect && <Checkbox
                                        size="small"
                                        checked={selectedIds.has(item.id)}
                                        onClick={(event) => event.stopPropagation()}
                                        onChange={() => onToggleSelect?.(item.id)}
                                        sx={{ alignSelf: "flex-start", p: 0.25, mt: -0.25, mb: -0.5 }}
                                    />}
                                    {show["ID"] && (
                                        <Typography
                                            sx={{
                                                fontSize: "0.72rem",
                                                color: c.muted,
                                            }}
                                        >
                                            {item.id}
                                        </Typography>
                                    )}
                                    <Typography
                                        sx={{
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            color: c.text,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Pills
                                        item={item}
                                        show={show}
                                        c={c}
                                        onMenu={onMenu}
                                        onOpenEdit={onOpenEdit}
                                        wrap
                                    />
                                </Box>
                            ))}
                            {g.items.length === 0 && (
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: c.muted,
                                        px: 0.5,
                                        py: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    No work items
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

/* ───────────── LAYOUT 3: calendar ───────────── */
function CalendarLayout({ items, c, onSelectTask, selectedIds = new Set(), onToggleSelect }) {
    const [cursor, setCursor] = useState(() => new Date(2026, 9, 1));
    const [layoutType, setLayoutType] = useState("month"); // "month" | "week"
    const [showWeekends, setShowWeekends] = useState(true);
    const [optionsAnchor, setOptionsAnchor] = useState(null);

    const y = cursor.getFullYear(),
        m = cursor.getMonth();

    const ALL_DAYS = [
        { name: "Sun", day: 0 },
        { name: "Mon", day: 1 },
        { name: "Tue", day: 2 },
        { name: "Wed", day: 3 },
        { name: "Thu", day: 4 },
        { name: "Fri", day: 5 },
        { name: "Sat", day: 6 },
    ];

    const daysHeader = showWeekends
        ? ALL_DAYS
        : ALL_DAYS.filter((d) => d.day !== 0 && d.day !== 6);

    const numCols = daysHeader.length;

    let cells;
    if (layoutType === "month") {
        const first = new Date(y, m, 1);
        const allMonthCells = Array.from(
            { length: 42 },
            (_, i) => new Date(y, m, 1 - first.getDay() + i),
        );
        cells = showWeekends
            ? allMonthCells
            : allMonthCells.filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
    } else {
        const dayOfWeek = cursor.getDay();
        const weekStart = new Date(
            cursor.getFullYear(),
            cursor.getMonth(),
            cursor.getDate() - dayOfWeek,
        );
        const allWeekCells = Array.from(
            { length: 7 },
            (_, i) =>
                new Date(
                    weekStart.getFullYear(),
                    weekStart.getMonth(),
                    weekStart.getDate() + i,
                ),
        );
        cells = showWeekends
            ? allWeekCells
            : allWeekCells.filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
    }

    const prev = () => {
        if (layoutType === "month") {
            setCursor(new Date(y, m - 1, 1));
        } else {
            setCursor(
                new Date(
                    cursor.getFullYear(),
                    cursor.getMonth(),
                    cursor.getDate() - 7,
                ),
            );
        }
    };

    const next = () => {
        if (layoutType === "month") {
            setCursor(new Date(y, m + 1, 1));
        } else {
            setCursor(
                new Date(
                    cursor.getFullYear(),
                    cursor.getMonth(),
                    cursor.getDate() + 7,
                ),
            );
        }
    };

    const onDay = (d) => {
        const iso = isoOf(d);
        return items.filter(
            (i) =>
                (i.start || i.due) &&
                iso >= (i.start || i.due) &&
                iso <= (i.due || i.start),
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={prev}
                        sx={{ color: c.muted }}
                    >
                        <ChevronLeft size={16} />
                    </IconButton>
                    <Typography
                        sx={{
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            color: c.text,
                            minWidth: 130,
                            textAlign: "center",
                        }}
                    >
                        {MON[cells[0]?.getMonth() ?? m]} {cells[0]?.getFullYear() ?? y}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={next}
                        sx={{ color: c.muted }}
                    >
                        <ChevronRight size={16} />
                    </IconButton>
                    <Button
                        size="small"
                        onClick={() => setCursor(new Date(2026, 9, 1))}
                        sx={{ textTransform: "none", color: c.muted }}
                    >
                        Today
                    </Button>
                    <Button
                        size="small"
                        onClick={(e) => setOptionsAnchor(e.currentTarget)}
                        endIcon={
                            optionsAnchor ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )
                        }
                        sx={{
                            textTransform: "none",
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "6px",
                            px: 1.25,
                            py: 0.35,
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            bgcolor: optionsAnchor ? c.active : "transparent",
                            "&:hover": {
                                bgcolor: c.hover,
                                borderColor: c.muted,
                            },
                        }}
                    >
                        Options
                    </Button>
                </Box>
            </Box>

            <Menu
                anchorEl={optionsAnchor}
                open={Boolean(optionsAnchor)}
                onClose={() => setOptionsAnchor(null)}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: c.card,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.55)",
                            minWidth: 175,
                            py: 0.5,
                            mt: 0.5,
                        },
                    },
                }}
            >
                <MenuItem
                    dense
                    onClick={() => {
                        setLayoutType("month");
                        setOptionsAnchor(null);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 0.8,
                        fontSize: "0.8125rem",
                        fontWeight: layoutType === "month" ? 600 : 400,
                        "&:hover": { bgcolor: c.hover },
                    }}
                >
                    <span>Month layout</span>
                    {layoutType === "month" && (
                        <Check size={14} color={c.text} />
                    )}
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        setLayoutType("week");
                        setOptionsAnchor(null);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 0.8,
                        fontSize: "0.8125rem",
                        fontWeight: layoutType === "week" ? 600 : 400,
                        "&:hover": { bgcolor: c.hover },
                    }}
                >
                    <span>Week layout</span>
                    {layoutType === "week" && (
                        <Check size={14} color={c.text} />
                    )}
                </MenuItem>
                <Box
                    sx={{
                        my: 0.5,
                        borderTop: `1px solid ${c.border}`,
                    }}
                />
                <MenuItem
                    dense
                    onClick={() => setShowWeekends((v) => !v)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1.5,
                        py: 0.8,
                        fontSize: "0.8125rem",
                        "&:hover": { bgcolor: c.hover },
                    }}
                >
                    <Checkbox
                        size="small"
                        checked={showWeekends}
                        sx={{
                            p: 0,
                            color: c.muted,
                            "&.Mui-checked": {
                                color: "#38bdf8",
                            },
                        }}
                    />
                    <span>Show weekends</span>
                </MenuItem>
            </Menu>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
                    border: `1px solid ${c.border}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "100%",
                }}
            >
                {daysHeader.map((d) => (
                    <Box
                        key={d.name}
                        sx={{
                            p: 0.75,
                            fontSize: "0.75rem",
                            color: c.muted,
                            bgcolor: c.sub,
                            borderBottom: `1px solid ${c.border}`,
                            textAlign: "center",
                            minWidth: 0,
                        }}
                    >
                        {d.name}
                    </Box>
                ))}
                {cells.map((d, i) => (
                    <Box
                        key={i}
                        sx={{
                            minHeight: layoutType === "week" ? 320 : 96,
                            p: 0.75,
                            borderRight:
                                (i + 1) % numCols !== 0
                                    ? `1px solid ${c.border}`
                                    : "none",
                            borderBottom:
                                layoutType === "month" &&
                                    i < cells.length - numCols
                                    ? `1px solid ${c.border}`
                                    : "none",
                            opacity: d.getMonth() === m ? 1 : 0.4,
                            minWidth: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.72rem",
                                color: c.muted,
                                mb: 0.5,
                            }}
                        >
                            {d.getDate()}
                        </Typography>
                        {onDay(d).map((it) => (
                            <Box
                                key={it.id}
                                title={it.title}
                                onClick={() => onSelectTask?.(it)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.4,
                                    px: 0.6,
                                    height: 24,
                                    boxSizing: "border-box",
                                    borderRadius: "4px",
                                    bgcolor: c.pillBg,
                                    border: `1px solid ${c.pillBorder}`,
                                    fontSize: "0.7rem",
                                    color: c.text,
                                    minWidth: 0,
                                    width: "100%",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    "&:hover": {
                                        borderColor: c.muted,
                                        bgcolor: c.hover,
                                    },
                                }}
                            >
                                {onToggleSelect && <Checkbox
                                    size="small"
                                    checked={selectedIds.has(it.id)}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={() => onToggleSelect(it.id)}
                                    sx={{ p: 0, mr: 0.25, "& .MuiSvgIcon-root": { fontSize: 15 } }}
                                />}
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <StateIcon state={it.state} size={10} />
                                </Box>
                                <Typography
                                    component="span"
                                    noWrap
                                    sx={{
                                        fontSize: "0.7rem",
                                        color: "inherit",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        minWidth: 0,
                                        flex: 1,
                                    }}
                                >
                                    {it.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
            {items.some((i) => !i.start && !i.due) && (
                <Typography
                    sx={{ fontSize: "0.75rem", color: c.muted, mt: 1.5 }}
                >
                    {items.filter((i) => !i.start && !i.due).length} work
                    item(s) without dates are not shown.
                </Typography>
            )}
        </Box>
    );
}

/* ───────────── LAYOUT 4: table ───────────── */
function TableLayout({ items, show, c, onMenu, onOpenEdit, onSelectTask, selectedIds = new Set(), onToggleSelect }) {
    const cols = PROPS.filter((p) => show[p] && p !== "ID");
    const cell = {
        px: 1.5,
        py: 1.1,
        fontSize: "0.8125rem",
        color: c.text,
        borderBottom: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
    };
    const val = (it, p) =>
        ({
            Assignee: it.assignees.join(", ") || "—",
            "Start date": it.start ? fmt(it.start) : "—",
            "Due date": it.due ? fmt(it.due) : "—",
            Labels: it.labels.map((l) => l.name).join(", ") || "—",
            Priority: it.priority,
            State: it.state,
            Cycle: it.cycle || "—",
            Module: it.module || "—",
        })[p];
    return (
        <Box sx={{ overflowX: "auto", width: "100%", maxWidth: "100%" }}>
            <Box
                component="table"
                sx={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                }}
            >
                <thead>
                    <tr>
                        {/* Sticky Left: Work items (ID + Title) */}
                        <Box
                            component="th"
                            sx={{
                                ...cell,
                                position: "sticky",
                                left: 0,
                                zIndex: 3,
                                bgcolor: c.sub,
                                color: c.text,
                                fontWeight: 600,
                                textAlign: "left",
                                borderRight: `1px solid ${c.border}`,
                                minWidth: { xs: 260, md: 340 },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {onToggleSelect && <Checkbox
                                    size="small"
                                    checked={items.length > 0 && items.every((item) => selectedIds.has(item.id))}
                                    indeterminate={items.some((item) => selectedIds.has(item.id)) && !items.every((item) => selectedIds.has(item.id))}
                                    onChange={() => {
                                        const allSelected = items.every((item) => selectedIds.has(item.id));
                                        items.forEach((item) => {
                                            if (selectedIds.has(item.id) === allSelected) onToggleSelect?.(item.id);
                                        });
                                    }}
                                    sx={{ p: 0.25 }}
                                />}
                                Work items
                            </Box>
                        </Box>
                        {cols.map((p) => {
                            const propIcon =
                                p === "Assignee" ? (
                                    <Users size={13} color={c.muted} />
                                ) : p === "Labels" ? (
                                    <Tag size={13} color={c.muted} />
                                ) : p === "Module" ? (
                                    <Layers size={13} color={c.muted} />
                                ) : null;

                            const propLabel =
                                p === "Assignee"
                                    ? "Assignees"
                                    : p === "Module"
                                        ? "Modules"
                                        : p;

                            return (
                                <Box
                                    component="th"
                                    key={p}
                                    sx={{
                                        ...cell,
                                        color: c.muted,
                                        textAlign: "left",
                                        bgcolor: c.sub,
                                        fontWeight: 500,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.6,
                                            cursor: "pointer",
                                            userSelect: "none",
                                            "&:hover": { color: c.text },
                                        }}
                                    >
                                        {propIcon}
                                        <span>{propLabel}</span>
                                        <ChevronDown size={12} color={c.muted} />
                                    </Box>
                                </Box>
                            );
                        })}
                        {/* Sticky Right: option column header */}
                        <Box
                            component="th"
                            sx={{
                                ...cell,
                                position: "sticky",
                                right: 0,
                                zIndex: 3,
                                bgcolor: c.sub,
                                width: 48,
                                minWidth: 48,
                                textAlign: "center",
                                borderLeft: `1px solid ${c.border}`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: c.muted,
                                }}
                            >
                                <SlidersHorizontal size={14} />
                            </Box>
                        </Box>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it) => (
                        <Box
                            component="tr"
                            key={it.id}
                            sx={{
                                "&:hover": { bgcolor: c.hover },
                                "&:hover td": { bgcolor: c.hover },
                            }}
                        >
                            {/* Sticky Left: Work items (ID + Title) */}
                            <Box
                                component="td"
                                onClick={() => onSelectTask?.(it)}
                                sx={{
                                    ...cell,
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 2,
                                    bgcolor: c.bg,
                                    borderRight: `1px solid ${c.border}`,
                                    minWidth: { xs: 260, md: 340 },
                                    maxWidth: 420,
                                    cursor: "pointer",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        minWidth: 0,
                                    }}
                                >
                                    {onToggleSelect && <Checkbox
                                        size="small"
                                        checked={selectedIds.has(it.id)}
                                        onClick={(event) => event.stopPropagation()}
                                        onChange={() => onToggleSelect?.(it.id)}
                                        sx={{ p: 0.25, ml: -0.5 }}
                                    />}
                                    {show["ID"] && (
                                        <Typography
                                            sx={{
                                                fontSize: "0.8125rem",
                                                color: c.muted,
                                                minWidth: 68,
                                                flexShrink: 0,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {it.id}
                                        </Typography>
                                    )}
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontSize: "0.8125rem",
                                            fontWeight: 600,
                                            color: c.text,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                        title={it.title}
                                    >
                                        {it.title}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Middle scrolling columns */}
                            {cols.map((p) => {
                                const isInteractive =
                                    p === "Priority" || p === "State";
                                return (
                                    <Box
                                        component="td"
                                        key={p}
                                        sx={{
                                            ...cell,
                                            cursor: isInteractive
                                                ? "pointer"
                                                : "default",
                                        }}
                                        onClick={(e) => {
                                            if (isInteractive && onOpenEdit) {
                                                e.stopPropagation();
                                                onOpenEdit(
                                                    e.currentTarget,
                                                    p.toLowerCase(),
                                                    it,
                                                );
                                            }
                                        }}
                                    >
                                        {p === "Priority" ? (
                                            <Box
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.8,
                                                    px: 0.75,
                                                    py: 0.35,
                                                    borderRadius: "6px",
                                                    transition: "all 0.15s ease",
                                                    "&:hover": {
                                                        bgcolor: c.active,
                                                    },
                                                }}
                                            >
                                                <PrioIcon k={it.priority} />
                                                <span>{it.priority}</span>
                                            </Box>
                                        ) : p === "State" ? (
                                            <Box
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.8,
                                                    px: 0.75,
                                                    py: 0.35,
                                                    borderRadius: "6px",
                                                    transition: "all 0.15s ease",
                                                    "&:hover": {
                                                        bgcolor: c.active,
                                                    },
                                                }}
                                            >
                                                <StateIcon state={it.state} />
                                                <span>{it.state}</span>
                                            </Box>
                                        ) : p === "Labels" ? (
                                            it.labels && it.labels.length ? (
                                                <Box
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.75,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: "50%",
                                                            bgcolor:
                                                                it.labels[0].color,
                                                        }}
                                                    />
                                                    <span>
                                                        {it.labels
                                                            .map((l) => l.name)
                                                            .join(", ")}
                                                    </span>
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        color: c.muted,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.6,
                                                    }}
                                                >
                                                    <Tag size={13} />
                                                    <span>Labels</span>
                                                </Box>
                                            )
                                        ) : p === "Assignee" ? (
                                            it.assignees && it.assignees.length ? (
                                                <Box
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.75,
                                                    }}
                                                >
                                                    <Users
                                                        size={13}
                                                        color={c.muted}
                                                    />
                                                    <span>
                                                        {it.assignees.join(", ")}
                                                    </span>
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        color: c.muted,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.6,
                                                    }}
                                                >
                                                    <Users size={13} />
                                                    <span>Assignees</span>
                                                </Box>
                                            )
                                        ) : p === "Module" ? (
                                            it.module ? (
                                                <Box
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.75,
                                                    }}
                                                >
                                                    <Layers
                                                        size={13}
                                                        color={c.muted}
                                                    />
                                                    <span>{it.module}</span>
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        color: c.muted,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.6,
                                                    }}
                                                >
                                                    <Layers size={13} />
                                                    <span>Select module</span>
                                                </Box>
                                            )
                                        ) : (
                                            val(it, p)
                                        )}
                                    </Box>
                                );
                            })}

                            {/* Sticky Right: option column cell */}
                            <Box
                                component="td"
                                sx={{
                                    ...cell,
                                    position: "sticky",
                                    right: 0,
                                    zIndex: 2,
                                    bgcolor: c.bg,
                                    width: 48,
                                    minWidth: 48,
                                    textAlign: "center",
                                    borderLeft: `1px solid ${c.border}`,
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={(e) => onMenu(e.currentTarget, it)}
                                    sx={{
                                        color: c.muted,
                                        p: 0.5,
                                        "&:hover": {
                                            color: c.text,
                                            bgcolor: c.active,
                                        },
                                    }}
                                >
                                    <MoreHorizontal size={15} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </tbody>
            </Box>
        </Box>
    );
}

/* ───────────── toolbar: layout switch + Filter + Display ───────────── */
function TimelineLayout({ items, c, onSelectTask, selectedIds = new Set(), onToggleSelect }) {
    const datedItems = items.filter((item) => item.start || item.due);
    const earliest = datedItems.length
        ? new Date(`${datedItems.map((item) => item.start || item.due).sort()[0]}T12:00:00`)
        : new Date();
    earliest.setDate(earliest.getDate() - 3);
    const dayWidth = 32;
    const totalDays = 42;
    const dayOffset = (value) => Math.round((new Date(`${value}T12:00:00`) - earliest) / 86400000);
    const timelineWidth = dayWidth * totalDays;
    const weeks = Array.from({ length: 6 }, (_, index) => {
        const start = new Date(earliest);
        start.setDate(start.getDate() + index * 7);
        return start;
    });

    return (
        <Box sx={{ overflow: "auto", width: "100%", height: "100%" }}>
            <Box sx={{ display: "flex", minWidth: 760, width: "max-content" }}>
                <Box sx={{ width: 350, flexShrink: 0, position: "sticky", left: 0, zIndex: 3, bgcolor: c.bg, borderRight: `1px solid ${c.border}` }}>
                    <Box sx={{ height: 60, display: "flex", alignItems: "center", px: 2, borderBottom: `1px solid ${c.border}`, bgcolor: c.sub }}>
                        <Typography sx={{ flex: 1, fontSize: "0.8rem", color: c.muted, fontWeight: 600 }}>Work items</Typography>
                        <Typography sx={{ width: 90, textAlign: "right", fontSize: "0.8rem", color: c.muted, fontWeight: 600 }}>Duration</Typography>
                    </Box>
                    {items.map((item) => {
                        const days = item.start && item.due ? Math.max(1, dayOffset(item.due) - dayOffset(item.start) + 1) : null;
                        return (
                            <Box key={item.id} sx={{ height: 48, display: "flex", alignItems: "center", px: 1.5, gap: 1, borderBottom: `1px solid ${c.border}`, "&:hover": { bgcolor: c.hover } }}>
                                {onToggleSelect && <Checkbox size="small" checked={selectedIds.has(item.id)} onChange={() => onToggleSelect(item.id)} sx={{ p: 0.25 }} />}
                                <Box onClick={() => onSelectTask?.(item)} sx={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
                                    <Typography sx={{ color: c.muted, fontSize: "0.72rem", flexShrink: 0 }}>{item.id}</Typography>
                                    <Typography noWrap sx={{ color: c.text, fontSize: "0.82rem", fontWeight: 600 }}>{item.title}</Typography>
                                </Box>
                                <Typography sx={{ width: 90, textAlign: "right", color: c.muted, fontSize: "0.75rem" }}>{days ? `${days} days` : "—"}</Typography>
                            </Box>
                        );
                    })}
                </Box>
                <Box sx={{ width: timelineWidth, flexShrink: 0 }}>
                    <Box sx={{ height: 60, display: "flex", borderBottom: `1px solid ${c.border}`, bgcolor: c.sub }}>
                        {weeks.map((week, index) => (
                            <Box key={index} sx={{ width: dayWidth * 7, flexShrink: 0, borderRight: `1px solid ${c.border}`, px: 1, py: 0.75 }}>
                                <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>{week.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</Typography>
                                <Typography sx={{ fontSize: "0.68rem", color: c.muted }}>Week {index + 1} · {week.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Typography>
                            </Box>
                        ))}
                    </Box>
                    {items.map((item) => {
                        const begin = item.start || item.due;
                        const finish = item.due || item.start;
                        const start = begin ? Math.max(0, Math.min(totalDays - 1, dayOffset(begin))) : null;
                        const end = finish ? Math.max(start ?? 0, Math.min(totalDays - 1, dayOffset(finish))) : null;
                        const stateColor = stateOf(item.state).c;
                        return (
                            <Box key={item.id} sx={{ height: 48, position: "relative", borderBottom: `1px solid ${c.border}`, backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent ${dayWidth - 1}px, ${c.border} ${dayWidth - 1}px, ${c.border} ${dayWidth}px)` }}>
                                {start !== null && <Box onClick={() => onSelectTask?.(item)} title={`${item.title}: ${begin}${finish !== begin ? ` – ${finish}` : ""}`} sx={{ position: "absolute", left: start * dayWidth, top: 11, width: Math.max(dayWidth * 0.65, ((end ?? start) - start + 1) * dayWidth - 6), height: 26, px: 1, display: "flex", alignItems: "center", overflow: "hidden", bgcolor: `${stateColor}55`, borderRadius: "6px", borderLeft: `3px solid ${stateColor}`, cursor: "pointer" }}><Typography noWrap sx={{ fontSize: "0.72rem", fontWeight: 600 }}>{item.title}</Typography></Box>}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}

const LAYOUTS = [
    { k: "list", Icon: List, label: "List" },
    { k: "board", Icon: Columns, label: "Board" },
    { k: "calendar", Icon: Calendar, label: "Calendar" },
    { k: "table", Icon: Table, label: "Table" },
    { k: "timeline", Icon: CalendarClock, label: "Timeline" },
];

function FilterMenu({ anchor, onClose, filters, setFilters, c }) {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(null);
    const toggle = (key, v) =>
        setFilters((f) => ({
            ...f,
            [key]: f[key].includes(v)
                ? f[key].filter((x) => x !== v)
                : [...f[key], v],
        }));
    const entries = [
        { id: "text", label: "Title", Icon: AlignLeft, type: "text" },
        {
            id: "states",
            label: "State Group",
            Icon: Circle,
            type: "sub",
            opts: STATES.map((s) => s.k),
        },
        {
            id: "priorities",
            label: "Priority",
            Icon: BarChart2,
            type: "sub",
            opts: PRIORITIES.map((p) => p.k),
        },
        {
            id: "labels",
            label: "Label",
            Icon: Tag,
            type: "sub",
            opts: Object.values(L).map((l) => l.name),
        },
        {
            id: "hasStart",
            label: "Start date",
            Icon: CalendarClock,
            type: "flag",
        },
        { id: "hasDue", label: "Due date", Icon: Calendar, type: "flag" },
    ].filter((e) => e.label.toLowerCase().includes(q.toLowerCase()));
    const row = {
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 1.5,
        py: 0.9,
        cursor: "pointer",
        fontSize: "0.875rem",
        color: c.text,
        "&:hover": { bgcolor: c.hover },
    };
    return (
        <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: c.card,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        borderRadius: "10px",
                        width: 275,
                        mt: 0.5,
                        maxHeight: 480,
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderBottom: `1px solid ${c.border}`,
                }}
            >
                <Search size={15} color={c.muted} />
                <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                    style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "inherit",
                        fontSize: "0.875rem",
                        width: "100%",
                    }}
                />
            </Box>
            {entries.map((e) => (
                <Box key={e.id}>
                    <Box
                        sx={row}
                        onClick={() =>
                            e.type === "flag"
                                ? setFilters((f) => ({
                                    ...f,
                                    [e.id]: !f[e.id],
                                }))
                                : setOpen(open === e.id ? null : e.id)
                        }
                    >
                        <e.Icon size={15} color={c.muted} />
                        <Box sx={{ flex: 1 }}>{e.label}</Box>
                        {e.type === "flag" && (
                            <Checkbox
                                size="small"
                                checked={filters[e.id]}
                                sx={{ p: 0 }}
                            />
                        )}
                        {e.type !== "flag" && (
                            <ChevronRight
                                size={14}
                                color={c.muted}
                                style={{
                                    transform:
                                        open === e.id
                                            ? "rotate(90deg)"
                                            : "none",
                                }}
                            />
                        )}
                    </Box>
                    {open === e.id && e.type === "text" && (
                        <Box sx={{ px: 1.5, pb: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                autoFocus
                                placeholder="Filter by title or ID"
                                value={filters.text}
                                onChange={(ev) =>
                                    setFilters((f) => ({
                                        ...f,
                                        text: ev.target.value,
                                    }))
                                }
                            />
                        </Box>
                    )}
                    {open === e.id &&
                        e.type === "sub" &&
                        e.opts.map((o) => (
                            <Box
                                key={o}
                                sx={{ ...row, pl: 4.5 }}
                                onClick={() => toggle(e.id, o)}
                            >
                                <Checkbox
                                    size="small"
                                    checked={filters[e.id].includes(o)}
                                    sx={{ p: 0 }}
                                />
                                {o}
                            </Box>
                        ))}
                </Box>
            ))}
            <Box sx={{ p: 1, borderTop: `1px solid ${c.border}` }}>
                <Button
                    size="small"
                    fullWidth
                    onClick={() =>
                        setFilters({
                            text: "",
                            states: [],
                            priorities: [],
                            labels: [],
                            hasStart: false,
                            hasDue: false,
                        })
                    }
                    sx={{ textTransform: "none", color: c.muted }}
                >
                    Clear all
                </Button>
            </Box>
        </Popover>
    );
}

function DisplayMenu({ anchor, onClose, display, setDisplay, c }) {
    const chip = (on) => ({
        px: 1.2,
        py: 0.5,
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.8125rem",
        bgcolor: on ? c.active : c.pillBg,
        color: on ? c.text : c.muted,
        border: `1px solid ${on ? c.muted : c.pillBorder}`,
    });
    const cycle = (key, opts) =>
        setDisplay((d) => ({
            ...d,
            [key]: opts[(opts.indexOf(d[key]) + 1) % opts.length],
        }));
    const sel = (label, key, opts) => (
        <Box
            onClick={() => cycle(key, opts)}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.9,
                cursor: "pointer",
                fontSize: "0.875rem",
            }}
        >
            <span>{label}</span>
            <Box sx={{ color: c.muted }}>{display[key]} ›</Box>
        </Box>
    );
    return (
        <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: c.card,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        borderRadius: "10px",
                        width: 360,
                        p: 2,
                        mt: 0.5,
                    },
                },
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: c.muted,
                    mb: 1,
                }}
            >
                Display Properties
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
                {PROPS.map((p) => (
                    <Box
                        key={p}
                        sx={chip(display.props[p])}
                        onClick={() =>
                            setDisplay((d) => ({
                                ...d,
                                props: { ...d.props, [p]: !d.props[p] },
                            }))
                        }
                    >
                        {p}
                    </Box>
                ))}
            </Box>
            <Box sx={{ borderTop: `1px solid ${c.border}`, pt: 0.5 }}>
                {sel("Group by", "groupBy", ["Priority", "State", "None"])}
                {sel("Order by", "orderBy", [
                    "Manual - Rank",
                    "Updated at",
                    "Priority",
                    "Title",
                ])}
            </Box>
            <Box
                sx={{
                    borderTop: `1px solid ${c.border}`,
                    pt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }}
                onClick={() =>
                    setDisplay((d) => ({ ...d, showEmpty: !d.showEmpty }))
                }
            >
                <Checkbox
                    size="small"
                    checked={display.showEmpty}
                    sx={{ p: 0 }}
                />{" "}
                Show empty groups
            </Box>
        </Popover>
    );
}

/* ───────────── WorkToolbar: flexed in header with "Your work" ───────────── */
function WorkToolbar({
    layout,
    setLayout,
    filters,
    setFilters,
    display,
    setDisplay,
    c,
}) {
    const [fAnchor, setFAnchor] = useState(null);
    const [dAnchor, setDAnchor] = useState(null);

    const iconBtn = (on) => ({
        p: 0.5,
        borderRadius: "6px",
        color: on ? c.text : c.muted,
        bgcolor: on ? c.active : "transparent",
        "&:hover": {
            bgcolor: c.hover,
            color: c.text,
        },
    });

    const activeFilters =
        filters.states.length +
        filters.priorities.length +
        filters.labels.length +
        (filters.text ? 1 : 0) +
        (filters.hasStart ? 1 : 0) +
        (filters.hasDue ? 1 : 0);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    p: 0.25,
                    border: `1px solid ${c.border}`,
                    borderRadius: "6px",
                    bgcolor: c.card,
                }}
            >
                {LAYOUTS.map(({ k, Icon, label }) => (
                    <IconButton
                        key={k}
                        title={label}
                        size="small"
                        onClick={() => setLayout(k)}
                        sx={iconBtn(layout === k)}
                    >
                        <Icon size={14} />
                    </IconButton>
                ))}
            </Box>
            <IconButton
                size="small"
                title="Filters"
                onClick={(e) => setFAnchor(e.currentTarget)}
                sx={{
                    ...iconBtn(activeFilters > 0),
                    height: 28,
                    px: 1,
                    border: `1px solid ${c.border}`,
                    borderRadius: "6px",
                }}
            >
                <Filter size={14} />
                {activeFilters > 0 && (
                    <Typography sx={{ fontSize: "0.7rem", ml: 0.5 }}>
                        {activeFilters}
                    </Typography>
                )}
            </IconButton>
            <Button
                size="small"
                onClick={(e) => setDAnchor(e.currentTarget)}
                sx={{
                    height: 28,
                    textTransform: "none",
                    color: c.text,
                    border: `1px solid ${c.border}`,
                    borderRadius: "6px",
                    px: 1.25,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    "&:hover": {
                        bgcolor: c.hover,
                        borderColor: c.muted,
                    },
                }}
            >
                Display
            </Button>

            <FilterMenu
                anchor={fAnchor}
                onClose={() => setFAnchor(null)}
                filters={filters}
                setFilters={setFilters}
                c={c}
            />
            <DisplayMenu
                anchor={dAnchor}
                onClose={() => setDAnchor(null)}
                display={display}
                setDisplay={setDisplay}
                c={c}
            />
        </Box>
    );
}

/* ───────────── WorkView: one tab body (Assigned / Created / Subscribed) ───────────── */
function WorkView({
    items,
    filters,
    display,
    layout,
    c,
    onMenu,
    onUpdateItem,
    onSelectTask,
    selectedIds,
    onToggleSelect,
}) {
    const [editAnchor, setEditAnchor] = useState({
        anchor: null,
        type: null,
        item: null,
    });

    const openEdit = (anchor, type, item) => {
        setEditAnchor({ anchor, type, item });
    };
    const closeEdit = () => {
        setEditAnchor({ anchor: null, type: null, item: null });
    };

    const filtered = useMemo(() => {
        const t = filters.text.toLowerCase();
        let r = items.filter(
            (i) =>
                (!t ||
                    i.title.toLowerCase().includes(t) ||
                    i.id.toLowerCase().includes(t)) &&
                (!filters.states.length || filters.states.includes(i.state)) &&
                (!filters.priorities.length ||
                    filters.priorities.includes(i.priority)) &&
                (!filters.labels.length ||
                    i.labels.some((l) => filters.labels.includes(l.name))) &&
                (!filters.hasStart || i.start) &&
                (!filters.hasDue || i.due),
        );
        const pr = (i) => PRIORITIES.findIndex((p) => p.k === i.priority);
        if (display.orderBy === "Updated at")
            r = [...r].sort((a, b) => b.updated - a.updated);
        if (display.orderBy === "Priority")
            r = [...r].sort((a, b) => pr(a) - pr(b));
        if (display.orderBy === "Title")
            r = [...r].sort((a, b) => a.title.localeCompare(b.title));
        return r;
    }, [items, filters, display.orderBy]);

    const groups = useMemo(() => {
        let defs;
        if (display.groupBy === "Priority")
            defs = PRIORITIES.map((p) => ({
                key: p.k,
                label: p.k,
                icon: <PrioIcon k={p.k} size={14} />,
                match: (i) => i.priority === p.k,
            }));
        else if (display.groupBy === "State")
            defs = STATES.map((s) => ({
                key: s.k,
                label: s.k,
                icon: <StateIcon state={s.k} size={14} />,
                match: (i) => i.state === s.k,
            }));
        else
            defs = [
                {
                    key: "all",
                    label: "All work items",
                    icon: <Layers size={14} color={c.muted} />,
                    match: () => true,
                },
            ];
        return defs
            .map((d) => ({ ...d, items: filtered.filter(d.match) }))
            .filter((g) => display.showEmpty || g.items.length);
    }, [filtered, display.groupBy, display.showEmpty, c.muted]);

    return (
        <Box
            sx={{
                border: `1px solid ${c.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: c.bg,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
            }}
        >

            {filtered.length === 0 ? (
                <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 600, color: c.text }}>
                        No work items found
                    </Typography>
                    <Typography sx={{ fontSize: "0.8125rem", color: c.muted }}>
                        Try clearing your filters.
                    </Typography>
                </Box>
            ) : layout === "list" ? (
                <ListLayout
                    groups={groups}
                    show={display.props}
                    c={c}
                    onMenu={onMenu}
                    onOpenEdit={openEdit}
                    onSelectTask={onSelectTask}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                />
            ) : layout === "board" ? (
                <BoardLayout
                    groups={groups}
                    show={display.props}
                    c={c}
                    onMenu={onMenu}
                    onOpenEdit={openEdit}
                    onSelectTask={onSelectTask}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                />
            ) : layout === "calendar" ? (
                <CalendarLayout
                    items={filtered}
                    c={c}
                    onSelectTask={onSelectTask}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                />
            ) : layout === "timeline" ? (
                <TimelineLayout items={filtered} c={c} onSelectTask={onSelectTask} selectedIds={selectedIds} onToggleSelect={onToggleSelect} />
            ) : (
                <TableLayout
                    items={filtered}
                    show={display.props}
                    c={c}
                    onMenu={onMenu}
                    onOpenEdit={openEdit}
                    onSelectTask={onSelectTask}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                />
            )}

            <PropertyMenu
                editAnchor={editAnchor}
                onClose={closeEdit}
                onUpdateItem={onUpdateItem}
                c={c}
            />
        </Box>
    );
}

/* ───────────── Activity tab ───────────── */
function ActivityView({ c }) {
    const download = () => {
        const txt = ACTIVITIES.map(
            (a) => `niron.camdoc ${a.text} ${a.bold} ${a.on} - ${a.when}`,
        ).join("\n");
        const url = URL.createObjectURL(
            new Blob([txt], { type: "text/plain" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "todays-activity.txt";
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <Box sx={{ px: 2, py: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        color: c.text,
                    }}
                >
                    Recent activity
                </Typography>
                <Button
                    size="small"
                    startIcon={<Download size={14} />}
                    onClick={download}
                    sx={{
                        textTransform: "none",
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        borderRadius: "6px",
                    }}
                >
                    Download today's activity
                </Button>
            </Box>
            {ACTIVITIES.map((a) => (
                <Box
                    key={a.id}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        py: 1.75,
                        borderBottom: `1px solid ${c.border}`,
                    }}
                >
                    <Box
                        sx={{
                            width: 24,
                            display: "flex",
                            justifyContent: "center",
                            color: c.muted,
                        }}
                    >
                        {a.avatar ? <Avatar size={24} /> : <a.icon size={14} />}
                    </Box>
                    <Typography sx={{ fontSize: "0.875rem", color: c.text }}>
                        <b>niron.camdoc</b> {a.text} <b>{a.bold}</b> {a.on}{" "}
                        <span style={{ color: c.muted }}>{a.when}</span>
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

/* ───────────── Summary tab ───────────── */
function SummaryView({ items, c, isAssignedToMe, isCreatedByMe }) {
    const mine = items.filter((i) =>
        isAssignedToMe ? isAssignedToMe(i) : i.assignees.includes(ME),
    );
    const count = (arr, key, k) => arr.filter((i) => i[key] === k).length;
    const stat = (Icon, label, n) => (
        <Box
            sx={{
                bgcolor: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: "8px",
                p: 2,
            }}
        >
            <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}
            >
                <Icon size={15} color={c.muted} />
                <Typography sx={{ fontSize: "0.8125rem", color: c.muted }}>
                    {label}
                </Typography>
            </Box>
            <Typography
                sx={{ fontSize: "1.375rem", fontWeight: 700, color: c.text }}
            >
                {n}
            </Typography>
        </Box>
    );
    const total = mine.length || 1;
    let offset = 0;
    const R = 35,
        CIRC = 2 * Math.PI * R;
    const maxP = Math.max(
        1,
        ...PRIORITIES.map((p) => count(mine, "priority", p.k)),
    );
    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 600, color: c.text, mb: 1.25 }}>
                Overview
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
                    gap: 1.75,
                    mb: 3,
                }}
            >
                {stat(
                    Layers,
                    "Work items created",
                    items.filter((i) =>
                        isCreatedByMe ? isCreatedByMe(i) : i.creator === ME,
                    ).length,
                )}
                {stat(UserCheck, "Work items assigned", mine.length)}
                {stat(
                    Bell,
                    "Work items subscribed",
                    items.filter((i) => i.subscribed).length,
                )}
            </Box>
            <Typography sx={{ fontWeight: 600, color: c.text, mb: 1.25 }}>
                Workload
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2,1fr)",
                        sm: "repeat(5,1fr)",
                    },
                    gap: 1.5,
                    mb: 3,
                }}
            >
                {STATES.map((s) => (
                    <Box
                        key={s.k}
                        sx={{
                            bgcolor: c.card,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.9,
                                mb: 1.2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "2px",
                                    bgcolor: s.c,
                                }}
                            />
                            <Typography
                                noWrap
                                sx={{ fontSize: "0.8125rem", color: c.muted }}
                            >
                                {s.k}
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                color: c.text,
                            }}
                        >
                            {count(mine, "state", s.k)}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        bgcolor: c.card,
                        border: `1px solid ${c.border}`,
                        borderRadius: "8px",
                        p: 2.5,
                        minHeight: 280,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: c.text,
                            mb: 2,
                        }}
                    >
                        Work items by Priority
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-around",
                            height: 190,
                            borderBottom: `1px solid ${c.border}`,
                        }}
                    >
                        {PRIORITIES.map((p) => (
                            <Box key={p.k} sx={{ textAlign: "center" }}>
                                <Box
                                    sx={{
                                        width: 22,
                                        height: `${(count(mine, "priority", p.k) / maxP) * 170}px`,
                                        bgcolor: p.c,
                                        borderRadius: "3px 3px 0 0",
                                        mx: "auto",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            mt: 0.75,
                        }}
                    >
                        {PRIORITIES.map((p) => (
                            <Typography
                                key={p.k}
                                sx={{ fontSize: "0.72rem", color: c.muted }}
                            >
                                {p.k}
                            </Typography>
                        ))}
                    </Box>
                </Box>
                <Box
                    sx={{
                        bgcolor: c.card,
                        border: `1px solid ${c.border}`,
                        borderRadius: "8px",
                        p: 2.5,
                        minHeight: 280,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: c.text,
                            mb: 2,
                        }}
                    >
                        Work items by state
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <svg
                            width="140"
                            height="140"
                            viewBox="0 0 100 100"
                            style={{ transform: "rotate(-90deg)" }}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r={R}
                                fill="none"
                                stroke={c.border}
                                strokeWidth="18"
                            />
                            {STATES.map((s) => {
                                const len =
                                    (count(mine, "state", s.k) / total) * CIRC;
                                const el = len > 0 && (
                                    <circle
                                        key={s.k}
                                        cx="50"
                                        cy="50"
                                        r={R}
                                        fill="none"
                                        stroke={s.c}
                                        strokeWidth="18"
                                        strokeDasharray={`${len} ${CIRC - len}`}
                                        strokeDashoffset={-offset}
                                    />
                                );
                                offset += len;
                                return el;
                            })}
                        </svg>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.25,
                                minWidth: 130,
                            }}
                        >
                            {STATES.map((s) => (
                                <Box
                                    key={s.k}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        fontSize: "0.8125rem",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            color: c.text,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "2px",
                                                bgcolor: s.c,
                                            }}
                                        />
                                        {s.k}
                                    </Box>
                                    <Box sx={{ color: c.muted }}>
                                        {count(mine, "state", s.k)}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

/* ───────────── Profile side card (shown on every tab) ───────────── */
function ProfileCard({ user, c, navigate, isDark }) {
    const proj = (emoji, name, to) => (
        <Box
            onClick={() => navigate(to)}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.25,
                cursor: "pointer",
                borderTop: `1px solid ${c.border}`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    alignItems: "center",
                    fontSize: "0.8125rem",
                    color: c.text,
                }}
            >
                <span>{emoji}</span>
                {name}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box
                    sx={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#ef4444",
                        bgcolor: "rgba(239,68,68,.12)",
                        px: 0.8,
                        borderRadius: "4px",
                    }}
                >
                    0%
                </Box>
                <ChevronRight size={14} color={c.muted} />
            </Box>
        </Box>
    );
    return (
        <Box
            sx={{
                width: { xs: "100%", lg: 290 },
                flexShrink: 0,
                height: "100%",
                borderLeft: { lg: `1px solid ${c.border}` },
                pl: { lg: 0 },
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                bgcolor: c.bg,
            }}
        >
            <Box
                sx={{
                    height: 90,
                    position: "relative",
                    background: isDark
                        ? "radial-gradient(ellipse at 80% 20%, #3a3f50 0%, #17181f 70%)"
                        : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => navigate("/profile")}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#f0f2f5",
                        bgcolor: "rgba(0,0,0,.4)",
                        p: 0.6,
                    }}
                >
                    <Pencil size={13} />
                </IconButton>
            </Box>
            <Box sx={{ px: 2.25, pb: 2 }}>
                <Box
                    sx={{
                        mt: -3.5,
                        mb: 1.5,
                        width: 52,
                        height: 52,
                        border: `3px solid ${c.bg}`,
                        borderRadius: "50%",
                    }}
                >
                    <Avatar size={46} />
                </Box>
                <Typography
                    sx={{ fontSize: "1rem", fontWeight: 700, color: c.text }}
                >
                    {user?.nameEn || ME}
                </Typography>
                <Typography
                    sx={{ fontSize: "0.8125rem", color: c.muted, mb: 2 }}
                >
                    (niron.camdoc)
                </Typography>
                {[
                    ["Joined on", "Oct 19, 2026"],
                    ["Timezone", "23:22 UTC"],
                ].map(([a, b]) => (
                    <Box
                        key={a}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1.25,
                            fontSize: "0.8125rem",
                        }}
                    >
                        <Box sx={{ color: c.muted }}>{a}</Box>
                        <Box sx={{ color: c.text, fontWeight: 500 }}>{b}</Box>
                    </Box>
                ))}
                <Box sx={{ mt: 2 }}>
                    {proj("🙂", "HR Management", "/projects")}
                    {proj("👇", "TerraLink", "/dashboard")}
                </Box>
            </Box>
        </Box>
    );
}

/* ───────────── Page ───────────── */
const TABS = ["Summary", "Assigned", "Created", "Subscribed", "Activity"];
const EMPTY_FILTERS = {
    text: "",
    states: [],
    priorities: [],
    labels: [],
    hasStart: false,
    hasDue: false,
};

export default function PortfolioPage({ projectName = null } = {}) {
    const navigate = useNavigate();
    const { user, logout, language, changeLanguage } = useAuth();
    const { toggleColorMode, isDark = true } = useThemeContext();

    const [activeTab, setActiveTab] = useState(projectName ? "Project" : "Assigned");
    const [searchQuery, setSearchQuery] = useState("");
    const [layout, setLayout] = useState("list");
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [display, setDisplay] = useState({
        props: DEFAULT_PROPS,
        groupBy: projectName ? "State" : "Priority",
        orderBy: "Manual - Rank",
        showEmpty: false,
    });
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [menu, setMenu] = useState({ anchor: null, item: null });
    const [projectActionsAnchor, setProjectActionsAnchor] = useState(null);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(false);
    const [analyticsSearch, setAnalyticsSearch] = useState("");
    const [insightColumns, setInsightColumns] = useState(["Work item", "Priority"]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedWorkItemIds, setSelectedWorkItemIds] = useState(() => new Set());
    const [bulkMenu, setBulkMenu] = useState({ anchor: null, type: null });
    const [peekMode, setPeekMode] = useState("side");

    const [workItems, setWorkItems] = useState(() => {
        try {
            const s = localStorage.getItem(STORAGE_KEY);
            return s ? JSON.parse(s) : INITIAL_ITEMS;
        } catch {
            return INITIAL_ITEMS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(workItems));
        } catch (e) {
            console.error(e);
        }
    }, [workItems]);

    useEffect(() => {
        const sync = (e) => {
            if (e.key !== STORAGE_KEY || !e.newValue) return;
            try {
                const p = JSON.parse(e.newValue);
                if (Array.isArray(p)) setWorkItems(p);
            } catch (err) {
                console.error(err);
            }
        };
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    const c = useMemo(() => {
        const border = isDark ? "#22242c" : "#e2e8f0";
        const pillBg = isDark ? "#14151a" : "#f1f5f9";
        const pillBorder = isDark ? "#282a32" : "#e2e8f0";
        const text = isDark ? "#f0f2f5" : "#0f172a";
        const muted = isDark ? "#858b98" : "#64748b";
        return {
            bg: isDark ? "#0c0d10" : "#ffffff",
            card: isDark ? "#16171b" : "#ffffff",
            sub: isDark ? "#121317" : "#f8fafc",
            hover: isDark ? "#14151a" : "#f8fafc",
            active: isDark ? "#22242c" : "#e2e8f0",
            border,
            text,
            muted,
            pillBg,
            pillBorder,
            pill: {
                display: "flex",
                alignItems: "center",
                gap: 0.65,
                bgcolor: pillBg,
                border: `1px solid ${pillBorder}`,
                borderRadius: "6px",
                px: 1,
                py: 0.35,
                fontSize: "0.75rem",
                fontWeight: 500,
                color: text,
                whiteSpace: "nowrap",
            },
        };
    }, [isDark]);

    const me = user?.nameEn || ME;

    const myIdentifiers = useMemo(() => {
        const list = [
            ME,
            "NIRON ROEM",
            "niron.camdoc",
            me,
            user?.nameEn,
            user?.nameKh,
            user?.email,
            user?.email?.split?.("@")?.[0],
        ].filter(Boolean);
        return new Set(list.map((s) => String(s).toLowerCase().trim()));
    }, [me, user]);

    const isAssignedToMe = useCallback(
        (i) => {
            if (!i.assignees || !Array.isArray(i.assignees) || !i.assignees.length)
                return false;
            return i.assignees.some((a) => {
                const val = String(typeof a === "object" ? a?.name || "" : a)
                    .toLowerCase()
                    .trim();
                if (!val) return false;
                if (myIdentifiers.has(val)) return true;
                return Array.from(myIdentifiers).some(
                    (m) => val.includes(m) || m.includes(val),
                );
            });
        },
        [myIdentifiers],
    );

    const isCreatedByMe = useCallback(
        (i) => {
            if (!i.creator) return false;
            const val = String(
                typeof i.creator === "object" ? i.creator?.name || "" : i.creator,
            )
                .toLowerCase()
                .trim();
            if (!val) return false;
            if (myIdentifiers.has(val)) return true;
            return Array.from(myIdentifiers).some(
                (m) => val.includes(m) || m.includes(val),
            );
        },
        [myIdentifiers],
    );

    const tabItems = useMemo(() => {
        const g = searchQuery.toLowerCase();
        const projectItems = projectName
            ? workItems.filter((item) => item.project === projectName)
            : workItems;
        const base = projectItems.filter(
            (i) =>
                !g ||
                i.title.toLowerCase().includes(g) ||
                i.id.toLowerCase().includes(g),
        );
        return {
            Project: base,
            Assigned: base.filter((i) => isAssignedToMe(i)),
            Created: base.filter((i) => isCreatedByMe(i)),
            Subscribed: base.filter((i) => i.subscribed),
        };
    }, [workItems, projectName, searchQuery, isAssignedToMe, isCreatedByMe]);

    const notify = (message, severity = "success") =>
        setToast({ open: true, message, severity });
    const openMenu = (anchor, item) => setMenu({ anchor, item });
    const closeMenu = () => setMenu({ anchor: null, item: null });
    const setState = (id, state) => {
        setWorkItems((p) => p.map((i) => (i.id === id ? {
            ...i,
            state,
            resolvedAt: state === "Done" ? (i.resolvedAt || new Date().toISOString()) : "",
        } : i)));
        notify(`Updated state to "${state}"`);
        closeMenu();
    };
    const updateItem = (id, patch) => {
        setWorkItems((p) =>
            p.map((i) => i.id === id
                ? {
                    ...i,
                    ...patch,
                    ...(patch.state === "Done" && !i.resolvedAt ? { resolvedAt: new Date().toISOString() } : {}),
                    ...(patch.state && patch.state !== "Done" ? { resolvedAt: "" } : {}),
                }
                : i),
        );
        if (patch.priority) notify(`Updated priority to "${patch.priority}"`);
        else if (patch.state) notify(`Updated state to "${patch.state}"`);
        else notify("Work item updated");
        closeMenu();
    };
    const remove = (id) => {
        setWorkItems((p) => p.filter((i) => i.id !== id));
        notify("Work item removed", "info");
        closeMenu();
    };
    const toggleWorkItemSelection = (id) => setSelectedWorkItemIds((current) => {
        const next = new Set(current);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    const clearWorkItemSelection = () => setSelectedWorkItemIds(new Set());
    const bulkUpdate = (patch) => {
        setWorkItems((items) => items.map((item) => selectedWorkItemIds.has(item.id)
            ? { ...item, ...patch, ...(patch.state === "Done" ? { resolvedAt: item.resolvedAt || new Date().toISOString() } : {}), ...(patch.state && patch.state !== "Done" ? { resolvedAt: "" } : {}) }
            : item));
        clearWorkItemSelection();
        setBulkMenu({ anchor: null, type: null });
    };
    const duplicateSelectedWorkItems = () => {
        const chosen = workItems.filter((item) => selectedWorkItemIds.has(item.id));
        const projectItems = workItems.filter((item) => item.project === projectName);
        const baseNumber = projectItems.reduce((max, item) => Math.max(max, Number(item.id.match(/(\d+)$/)?.[1] || 0)), 0);
        const prefix = projectItems[0]?.id.replace(/-\d+$/, "") || (projectName === "TerraLink" ? "TERRA" : "WORK");
        const copies = chosen.map((item, index) => ({ ...item, id: `${prefix}-${baseNumber + index + 1}`, title: `${item.title} (copy)`, createdAt: new Date().toISOString() }));
        setWorkItems((items) => [...copies, ...items]);
        clearWorkItemSelection();
        notify(`Duplicated ${copies.length} work item${copies.length === 1 ? "" : "s"}`);
    };

    const createProjectWorkItem = () => {
        const projectItems = workItems.filter((item) => item.project === projectName);
        const nextNumber = projectItems.reduce((max, item) => {
            const number = Number(item.id.match(/(\d+)$/)?.[1] || 0);
            return Math.max(max, number);
        }, 0) + 1;
        const item = {
            id: `${projectName === "TerraLink" ? "TERRA" : projectName.toUpperCase().replace(/[^A-Z0-9]+/g, "")}-${nextNumber}`,
            title: "New work item",
            project: projectName,
            state: "Backlog",
            priority: "None",
            start: "",
            due: "",
            assignees: [],
            creator: user?.nameEn || ME,
            subscribed: false,
            labels: [],
            cycle: "",
            module: "",
            updated: Date.now(),
            createdAt: new Date().toISOString(),
        };
        setWorkItems((items) => [item, ...items]);
        setSelectedTask(item);
    };

    const exportProjectItems = () => {
        const rows = workItems.filter((item) => item.project === projectName);
        const columns = ["id", "title", "state", "priority", "start", "due", "cycle", "module"];
        const csv = [columns.join(","), ...rows.map((item) => columns.map((key) => `"${String(item[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-work-items.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
        setProjectActionsAnchor(null);
    };

    const analyticsItems = projectName ? workItems.filter((item) => item.project === projectName) : [];
    const analyticsStateCounts = {
        total: analyticsItems.length,
        started: analyticsItems.filter((item) => item.state === "In Progress").length,
        backlog: analyticsItems.filter((item) => item.state === "Backlog").length,
        unstarted: analyticsItems.filter((item) => item.state === "Todo").length,
        completed: analyticsItems.filter((item) => item.state === "Done").length,
    };
    const priorityCounts = PRIORITIES.map(({ k }) => ({ priority: k, count: analyticsItems.filter((item) => item.priority === k).length }));
    const localDateKey = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };
    const analyticsDays = Array.from({ length: 10 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (9 - index));
        const key = localDateKey(date);
        return {
            date,
            created: analyticsItems.filter((item) => localDateKey(item.createdAt || item.created_at) === key).length,
            resolved: analyticsItems.filter((item) => localDateKey(item.resolvedAt || item.completedAt) === key).length,
        };
    });
    const assigneeAnalytics = Object.values(analyticsItems.reduce((rows, item) => {
        const names = item.assignees?.length ? item.assignees.map((assignee) => typeof assignee === "string" ? assignee : assignee?.name).filter(Boolean) : ["Unassigned"];
        names.forEach((name) => {
            const key = name.toLowerCase();
            const row = rows[key] || (rows[key] = { name, Backlog: 0, Started: 0, Unstarted: 0, Completed: 0, Cancelled: 0 });
            const status = { "In Progress": "Started", Todo: "Unstarted", Done: "Completed" }[item.state] || item.state;
            if (Object.hasOwn(row, status)) row[status] += 1;
        });
        return rows;
    }, {})).filter((row) => row.name.toLowerCase().includes(analyticsSearch.toLowerCase()));
    const exportAnalyticsCsv = (filename, columns, rows) => {
        const csv = [columns.join(","), ...rows.map((row) => columns.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
    };

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
            showSubHeader={false}
        >
            <Box
                sx={{
                    bgcolor: c.bg,
                    color: c.text,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    overflow: "hidden",
                }}
            >
                {/* Left Column: Work area */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {/* Top subheader row: "Your work" on left + WorkToolbar on right */}
                    <Box
                        sx={{
                            height: 44,
                            px: { xs: 2, md: 3 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: `1px solid ${c.border}`,
                            flexShrink: 0,
                            bgcolor: c.bg,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {projectName ? <Layers size={15} color={c.muted} /> : <Home size={15} color={c.muted} />}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.8125rem",
                                    color: c.text,
                                }}
                            >
                                {projectName ? "TerraLink  ›  Work items" : "Your work"}
                            </Typography>
                            {projectName && (
                                <Chip
                                    size="small"
                                    label={workItems.filter((item) => item.project === projectName).length}
                                    sx={{ height: 22, bgcolor: isDark ? "#102d3c" : "#e0f2fe", color: isDark ? "#38bdf8" : "#0369a1", fontSize: "0.75rem" }}
                                />
                            )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                            <WorkToolbar
                                layout={layout}
                                setLayout={setLayout}
                                filters={filters}
                                setFilters={setFilters}
                                display={display}
                                setDisplay={setDisplay}
                                c={c}
                            />
                            {projectName && (
                            <>
                                <Button
                                    size="small"
                                    startIcon={<BarChart2 size={15} />}
                                    onClick={() => setIsAnalyticsOpen(true)}
                                    sx={{ height: 34, color: c.text, border: `1px solid ${c.border}`, borderRadius: "7px", textTransform: "none", whiteSpace: "nowrap" }}
                                >Analytics</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<Plus size={15} />}
                                    onClick={createProjectWorkItem}
                                    sx={{ height: 34, bgcolor: "#2496cf", color: "#07131a", borderRadius: "7px", textTransform: "none", whiteSpace: "nowrap", boxShadow: "none", "&:hover": { bgcolor: "#36a8df", boxShadow: "none" } }}
                                >Add work item</Button>
                                <IconButton size="small" aria-label="Project actions" onClick={(event) => setProjectActionsAnchor(event.currentTarget)} sx={{ color: c.muted }}>
                                    <MoreHorizontal size={18} />
                                </IconButton>
                            </>
                            )}
                        </Box>
                    </Box>

                    {/* Your work tabs are hidden in the project scoped view. */}
                    {!projectName && <Box
                        sx={{
                            display: "flex",
                            gap: 0.75,
                            px: { xs: 2, md: 3 },
                            py: 1,
                            borderBottom: `1px solid ${c.border}`,
                            overflowX: "auto",
                            flexShrink: 0,
                        }}
                    >
                        {TABS.map((t) => (
                            <Box
                                key={t}
                                onClick={() => setActiveTab(t)}
                                sx={{
                                    px: 1.6,
                                    py: 0.55,
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.8125rem",
                                    whiteSpace: "nowrap",
                                    userSelect: "none",
                                    fontWeight: activeTab === t ? 600 : 500,
                                    color:
                                        activeTab === t ? c.text : c.muted,
                                    bgcolor:
                                        activeTab === t
                                            ? c.active
                                            : "transparent",
                                    "&:hover": { color: c.text },
                                }}
                            >
                                {t}
                            </Box>
                        ))}
                    </Box>}

                    {/* body: scrollable content */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "hidden",
                            p:
                                activeTab === "Summary" ||
                                    activeTab === "Activity"
                                    ? 0
                                    : { xs: 1.5, md: 2 },
                        }}
                    >
                        {!projectName && activeTab === "Summary" && (
                            <SummaryView
                                items={workItems}
                                c={c}
                                isAssignedToMe={isAssignedToMe}
                                isCreatedByMe={isCreatedByMe}
                            />
                        )}
                        {!projectName && activeTab === "Activity" && <ActivityView c={c} />}
                        {(projectName ? activeTab === "Project" : ["Assigned", "Created", "Subscribed"].includes(
                            activeTab,
                        )) && (
                                <WorkView
                                    key={activeTab}
                                    items={tabItems[projectName ? "Project" : activeTab]}
                                    filters={filters}
                                    display={display}
                                    layout={layout}
                                    c={c}
                                    onMenu={openMenu}
                                    onUpdateItem={updateItem}
                                    onSelectTask={setSelectedTask}
                                    selectedIds={selectedWorkItemIds}
                                    onToggleSelect={projectName ? toggleWorkItemSelection : undefined}
                                />
                            )}
                    </Box>
                </Box>

                {/* Right Column: ProfileCard attached flush to top header */}
                {!projectName && <ProfileCard
                    user={user}
                    c={c}
                    navigate={navigate}
                    isDark={isDark}
                />}
            </Box>

            {projectName && selectedWorkItemIds.size > 0 && (
                <Box sx={{ position: "fixed", zIndex: 1050, left: "50%", bottom: 16, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.75, bgcolor: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: "10px", boxShadow: "0 10px 32px rgba(0,0,0,0.35)", maxWidth: "calc(100vw - 24px)", overflowX: "auto" }}>
                    <Typography sx={{ whiteSpace: "nowrap", fontSize: "0.8rem", px: 0.5 }}>{selectedWorkItemIds.size} selected</Typography>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: c.border }} />
                    <Tooltip title="Subscribe selected">
                        <IconButton size="small" onClick={() => bulkUpdate({ subscribed: true })} sx={{ color: c.muted }}><Bell size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate selected">
                        <IconButton size="small" onClick={duplicateSelectedWorkItems} sx={{ color: c.muted }}><Copy size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Mark completed">
                        <IconButton size="small" onClick={() => bulkUpdate({ state: "Done" })} sx={{ color: c.muted }}><CheckCircle2 size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete selected">
                        <IconButton size="small" onClick={() => { setWorkItems((items) => items.filter((item) => !selectedWorkItemIds.has(item.id))); notify("Selected work items deleted", "info"); clearWorkItemSelection(); }} sx={{ color: "#ef4444" }}><Trash2 size={16} /></IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: c.border }} />
                    <Tooltip title="Set state">
                        <IconButton size="small" onClick={(event) => setBulkMenu({ anchor: event.currentTarget, type: "state" })} sx={{ color: c.muted }}><CircleDot size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Set priority">
                        <IconButton size="small" onClick={(event) => setBulkMenu({ anchor: event.currentTarget, type: "priority" })} sx={{ color: c.muted }}><BarChart2 size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Clear selection">
                        <IconButton size="small" onClick={clearWorkItemSelection} sx={{ color: c.muted }}><X size={16} /></IconButton>
                    </Tooltip>
                </Box>
            )}

            <Menu anchorEl={bulkMenu.anchor} open={Boolean(bulkMenu.anchor)} onClose={() => setBulkMenu({ anchor: null, type: null })} slotProps={{ paper: { sx: { bgcolor: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: "8px" } } }}>
                {(bulkMenu.type === "state" ? STATES.map(({ k }) => ({ label: k, patch: { state: k } })) : PRIORITIES.map(({ k }) => ({ label: k, patch: { priority: k } }))).map(({ label, patch }) => <MenuItem key={label} onClick={() => bulkUpdate(patch)}>{label}</MenuItem>)}
            </Menu>

            {/* row menu */}
            {projectName && <>
                <Menu
                    anchorEl={projectActionsAnchor}
                    open={Boolean(projectActionsAnchor)}
                    onClose={() => setProjectActionsAnchor(null)}
                    slotProps={{ paper: { sx: { bgcolor: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: "8px", minWidth: 190 } } }}
                >
                    <MenuItem onClick={() => { window.open(window.location.href, "_blank", "noopener,noreferrer"); setProjectActionsAnchor(null); }}>
                        <ExternalLink size={16} style={{ marginRight: 10 }} /> Open in new tab
                    </MenuItem>
                    <MenuItem onClick={() => { navigator.clipboard?.writeText(window.location.href); notify("Project link copied"); setProjectActionsAnchor(null); }}>
                        <Link2 size={16} style={{ marginRight: 10 }} /> Copy link
                    </MenuItem>
                    <MenuItem onClick={exportProjectItems}>
                        <Download size={16} style={{ marginRight: 10 }} /> Export
                    </MenuItem>
                </Menu>
                <Drawer
                    anchor="right"
                    open={isAnalyticsOpen}
                    onClose={() => { setIsAnalyticsOpen(false); setIsAnalyticsExpanded(false); }}
                    sx={{
                        zIndex: 1100,
                        top: 52,
                        height: "calc(100vh - 52px)",
                        "& .MuiBackdrop-root": { top: 52, height: "calc(100vh - 52px)" },
                        "& .MuiDrawer-paper": {
                            top: "52px !important",
                            height: "calc(100vh - 52px) !important",
                            width: isAnalyticsExpanded ? "100vw" : { xs: "100%", md: 900 },
                            maxWidth: "100vw",
                            bgcolor: c.bg,
                            color: c.text,
                            colorScheme: isDark ? "dark" : "light",
                            borderLeft: `1px solid ${c.border}`,
                            borderTop: `1px solid ${c.border}`,
                            transition: "width 180ms ease",
                        },
                    }}
                >
                    <Box sx={{ height: 48, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.25, bgcolor: c.bg, color: c.text, borderBottom: `1px solid ${c.border}` }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>Analytics for {projectName}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton aria-label={isAnalyticsExpanded ? "Restore analytics panel" : "Expand analytics panel"} onClick={() => setIsAnalyticsExpanded((expanded) => !expanded)} sx={{ color: c.muted }}>
                                {isAnalyticsExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </IconButton>
                            <IconButton aria-label="Close analytics" onClick={() => { setIsAnalyticsOpen(false); setIsAnalyticsExpanded(false); }} sx={{ color: c.muted }}><X size={18} /></IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ p: { xs: 2, md: 3 }, overflowY: "auto", flex: 1 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" }, gap: 1.25, mb: 2.5 }}>
                            {[
                                ["Total Work items", analyticsStateCounts.total],
                                ["Started Work items", analyticsStateCounts.started],
                                ["Backlog Work items", analyticsStateCounts.backlog],
                                ["Unstarted Work items", analyticsStateCounts.unstarted],
                                ["Completed Work items", analyticsStateCounts.completed],
                            ].map(([label, value]) => (
                                <Box key={label} sx={{ p: 1.5, minHeight: 84, bgcolor: c.card, border: `1px solid ${c.border}`, borderRadius: "9px" }}>
                                    <Typography sx={{ color: c.muted, fontSize: "0.72rem", lineHeight: 1.4 }}>{label}</Typography>
                                    <Typography sx={{ mt: 0.75, fontSize: "1.35rem", fontWeight: 700 }}>{value}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ p: 2, mb: 2.5, bgcolor: c.card, border: `1px solid ${c.border}`, borderRadius: "10px" }}>
                            <Typography sx={{ fontWeight: 700, mb: 0.25 }}>Created vs Resolved</Typography>
                            <Typography sx={{ color: c.muted, fontSize: "0.75rem", mb: 1.5 }}>Date</Typography>
                            <Box sx={{ display: "flex", gap: 2, mb: 1, fontSize: "0.75rem" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: c.muted }}><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2d9cdb" }} />Created</Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: c.muted }}><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#8b5cf6" }} />Resolved</Box>
                            </Box>
                            <Box sx={{ display: "flex", height: 190 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", color: c.muted, fontSize: "0.65rem", pr: 1, pb: 2.5 }}>
                                    {[9, 6, 3, 0].map((value) => <span key={value}>{value}</span>)}
                                </Box>
                                <Box sx={{ flex: 1, position: "relative", display: "flex", alignItems: "stretch", justifyContent: "space-around", borderBottom: `1px solid ${c.border}` }}>
                                    {["25%", "50%", "75%"].map((top) => <Box key={top} sx={{ position: "absolute", top, left: 0, right: 0, borderTop: `1px dashed ${c.border}` }} />)}
                                    {analyticsDays.map((day) => (
                                        <Box key={day.date.toISOString()} title={`${day.date.toLocaleDateString()}: ${day.created} created, ${day.resolved} resolved`} sx={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "2px", px: "2px" }}>
                                            <Box sx={{ width: "35%", maxWidth: 16, height: `${Math.max(2, Math.min(100, day.created / 9 * 100))}%`, bgcolor: "#2d9cdb", borderRadius: "3px 3px 0 0", opacity: day.created ? 1 : 0.12 }} />
                                            <Box sx={{ width: "35%", maxWidth: 16, height: `${Math.max(2, Math.min(100, day.resolved / 9 * 100))}%`, bgcolor: "#8b5cf6", borderRadius: "3px 3px 0 0", opacity: day.resolved ? 1 : 0.12 }} />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", ml: 3.5, mt: 0.7, color: c.muted, fontSize: "0.65rem" }}>
                                {analyticsDays.filter((_, index) => index % 3 === 0 || index === 9).map((day) => <span key={day.date.toISOString()}>{day.date.toLocaleDateString(undefined, { month: "short", day: "2-digit" })}</span>)}
                            </Box>
                            {!analyticsDays.some((day) => day.created || day.resolved) && <Typography sx={{ color: c.muted, fontSize: "0.72rem", mt: 1 }}>Date history will appear as work items are created or completed.</Typography>}
                        </Box>

                        <Box sx={{ p: 2, mb: 2.5, bgcolor: c.card, border: `1px solid ${c.border}`, borderRadius: "10px" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                                <Box><Typography sx={{ fontWeight: 700 }}>Customized Insights</Typography><Typography sx={{ color: c.muted, fontSize: "0.75rem", mt: 0.3 }}>Work item properties</Typography></Box>
                                <Button size="small" onClick={() => setInsightColumns((columns) => {
                                    const available = ["State", "Assignee", "Due date", "Labels", "Cycle", "Module"];
                                    const next = available.find((property) => !columns.includes(property));
                                    return next ? [...columns, next] : columns;
                                })} sx={{ color: c.text, border: `1px solid ${c.border}`, textTransform: "none", whiteSpace: "nowrap" }}>Add Property</Button>
                            </Box>
                            <Box sx={{ overflowX: "auto" }}>
                                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", textAlign: "left", "& th, & td": { p: 1, borderBottom: `1px solid ${c.border}`, fontSize: "0.78rem", whiteSpace: "nowrap" }, "& th": { color: c.muted, fontWeight: 600 } }}>
                                    <thead><tr>{insightColumns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
                                    <tbody>{analyticsItems.slice(0, 10).map((item) => <tr key={item.id}>{insightColumns.map((column) => {
                                        const value = { "Work item": `${item.id}  ${item.title}`, Priority: item.priority, State: item.state, Assignee: item.assignees?.map((assignee) => typeof assignee === "string" ? assignee : assignee?.name).join(", ") || "Unassigned", "Due date": item.due || "—", Labels: item.labels?.map((label) => label.name).join(", ") || "—", Cycle: item.cycle || "—", Module: item.module || "—" }[column];
                                        return <td key={column}>{value || "—"}</td>;
                                    })}</tr>)}</tbody>
                                </Box>
                            </Box>
                            <Typography sx={{ color: c.muted, fontSize: "0.72rem", mt: 1 }}>Showing {analyticsItems.length ? 1 : 0}-{Math.min(10, analyticsItems.length)} of {analyticsItems.length}</Typography>
                        </Box>

                        <Box sx={{ p: 2, mb: 2.5, bgcolor: c.card, border: `1px solid ${c.border}`, borderRadius: "10px" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 1.5 }}>
                                <Box><Typography sx={{ fontWeight: 700 }}>Priority</Typography><Typography sx={{ color: c.muted, fontSize: "0.75rem" }}>Number of Work items</Typography></Box>
                                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportAnalyticsCsv("terralink-priority.csv", ["Priority", "Count"], priorityCounts.map(({ priority, count }) => ({ Priority: priority, Count: count })))} sx={{ color: c.text, textTransform: "none" }}>Export as csv</Button>
                            </Box>
                            <Box sx={{ display: "flex", height: 130, alignItems: "flex-end", gap: 1, px: 1, borderBottom: `1px solid ${c.border}` }}>
                                {priorityCounts.map(({ priority, count }) => <Box key={priority} sx={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}><Typography sx={{ color: c.muted, fontSize: "0.68rem" }}>{count}</Typography><Box sx={{ width: "55%", maxWidth: 28, height: `${Math.max(3, count / Math.max(1, ...priorityCounts.map((entry) => entry.count)) * 78)}%`, bgcolor: prio(priority).c, borderRadius: "4px 4px 0 0", opacity: count ? 1 : 0.15 }} /><Typography sx={{ color: c.muted, fontSize: "0.65rem", pb: 0.7 }}>{priority}</Typography></Box>)}
                            </Box>
                            <Box sx={{ overflowX: "auto", mt: 1.5 }}>
                                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", textAlign: "left", "& th, & td": { p: 0.9, borderBottom: `1px solid ${c.border}`, fontSize: "0.78rem" }, "& th": { color: c.muted, fontWeight: 600 } }}>
                                    <thead><tr><th>Priority</th><th>Count</th></tr></thead>
                                    <tbody>{priorityCounts.filter((row) => row.count > 0).map(({ priority, count }) => <tr key={priority}><td>{priority}</td><td>{count}</td></tr>)}</tbody>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: c.card, border: `1px solid ${c.border}`, borderRadius: "10px" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                                <Typography sx={{ fontWeight: 700 }}>Work items by assignee</Typography>
                                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportAnalyticsCsv("terralink-assignees.csv", ["Assignee", "Backlog", "Started", "Unstarted", "Completed", "Cancelled"], assigneeAnalytics.map((row) => ({ Assignee: row.name, Backlog: row.Backlog, Started: row.Started, Unstarted: row.Unstarted, Completed: row.Completed, Cancelled: row.Cancelled })))} sx={{ color: c.text, textTransform: "none", whiteSpace: "nowrap" }}>Export as csv</Button>
                            </Box>
                            <TextField size="small" fullWidth placeholder="Search assignees" value={analyticsSearch} onChange={(event) => setAnalyticsSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} color={c.muted} /></InputAdornment> }} sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { color: c.text, bgcolor: c.bg, "& fieldset": { borderColor: c.border } }, "& input::placeholder": { color: c.muted, opacity: 1 } }} />
                            <Box sx={{ overflowX: "auto" }}>
                                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", textAlign: "left", "& th, & td": { p: 0.9, borderBottom: `1px solid ${c.border}`, fontSize: "0.75rem", whiteSpace: "nowrap" }, "& th": { color: c.muted, fontWeight: 600 } }}>
                                    <thead><tr>{["Assignee", "Backlog", "Started", "Unstarted", "Completed", "Cancelled"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
                                    <tbody>{assigneeAnalytics.map((row) => <tr key={row.name}>{["name", "Backlog", "Started", "Unstarted", "Completed", "Cancelled"].map((key) => <td key={key}>{row[key]}</td>)}</tr>)}</tbody>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Drawer>
            </>}

            <Menu
                anchorEl={menu.anchor}
                open={Boolean(menu.anchor)}
                onClose={closeMenu}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: c.card,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                            minWidth: 180,
                        },
                    },
                }}
            >
                {STATES.map((s) => (
                    <MenuItem
                        key={s.k}
                        dense
                        onClick={() => setState(menu.item?.id, s.k)}
                        sx={{ gap: 1 }}
                    >
                        <StateIcon state={s.k} /> Mark as {s.k}
                    </MenuItem>
                ))}
                <MenuItem
                    dense
                    onClick={() => {
                        navigator.clipboard?.writeText(menu.item?.id || "");
                        notify("ID copied");
                        closeMenu();
                    }}
                >
                    Copy ID
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => remove(menu.item?.id)}
                    sx={{ color: "#ef4444" }}
                >
                    Delete
                </MenuItem>
            </Menu>

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={toast.severity}
                    variant="filled"
                    onClose={() => setToast((p) => ({ ...p, open: false }))}
                    sx={{ borderRadius: "8px", fontWeight: 600 }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            {/* Task Detail Peek View (Side Peek, Modal, Full Screen) */}
            <TaskDetailDrawer
                task={selectedTask}
                open={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
                peekMode={peekMode}
                setPeekMode={setPeekMode}
                topOffset={52}
                onUpdateItem={(id, patch) => {
                    updateItem(id, patch);
                    setSelectedTask((prev) =>
                        prev && prev.id === id ? { ...prev, ...patch } : prev,
                    );
                }}
                onDeleteItem={(id) => {
                    remove(id);
                    setSelectedTask(null);
                }}
                allItems={workItems}
                onSelectTask={setSelectedTask}
                c={c}
                isDark={isDark}
                user={user}
                notify={notify}
            />
        </DashboardLayout>
    );
}
