import { useState, useEffect, useRef } from "react";
import TaskDescriptionEditor from "./TaskDescriptionEditor";
import DatePickerCalendar from "./DatePickerCalendar";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Drawer,
    Dialog,
    Menu,
    MenuItem,
    TextField,
    Popover,
    Chip,
    Divider,
    Tooltip,
} from "@mui/material";
import {
    ArrowRight,
    ArrowUp,
    ArrowDown,
    Maximize2,
    Minimize2,
    PanelRight,
    Square,
    Maximize,
    ChevronDown,
    ChevronRight,
    GitBranch,
    Link2,
    Paperclip,
    FileText,
    SmilePlus,
    Plus,
    MoreHorizontal,
    Sparkles,
    Calendar,
    CalendarClock,
    Users,
    Check,
    Layers,
    Tag,
    CircleDashed,
    Circle,
    CircleDot,
    CheckCircle2,
    XCircle,
    AlertCircle,
    BarChart2,
    Minus,
    Quote,
    ExternalLink,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ListOrdered,
    List,
    ListChecks,
    Code,
    Image,
    Copy,
    LayoutGrid,
    Bell,
    BellOff,
    ScanLine,
    Network,
    ArrowUpDown,
    Contrast,
} from "lucide-react";

/* ───────────── constants & helpers ───────────── */

// Possible task states and their colors
const STATES = [
    { k: "Backlog", c: "#858b98" },
    { k: "Todo", c: "#8a8f9c" },
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

const DEFAULT_LABELS = [
    { name: "admin", color: "#0ea5e9" },
    { name: "concepts", color: "#a855f7" },
    { name: "bug", color: "#ef4444" },
    { name: "feature", color: "#22c55e" },
    { name: "design", color: "#f59e0b" },
];
const DEFAULT_MODULES = ["Workspace Setup (Area)", "Onboarding Flow (Feature)"];
const DEFAULT_CYCLES = ["Cycle 1: Getting Started with Plane", "Cycle 2"];
const RELATION_TYPES = ["Relates to", "Blocking", "Blocked by", "Duplicate of"];

const prio = (k) => PRIORITIES.find((p) => p.k === k) || PRIORITIES[4];
const stateOf = (k) => STATES.find((s) => s.k === k) || STATES[0];

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

// "27 minutes ago", "about 2 hours ago", "1 day ago"
const ago = (ts) => {
    const mins = Math.floor(Math.max(0, Date.now() - ts) / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (mins < 1) return "less than a minute ago";
    if (mins < 60) return `${plural(mins, "minute")} ago`;
    if (hrs < 24) return `about ${plural(hrs, "hour")} ago`;
    return `${plural(days, "day")} ago`;
};

// Short duration badge: "1m", "3h", "1d"
const shortDur = (ms) => {
    const mins = Math.floor(Math.max(0, ms) / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days >= 1) return `${days}d`;
    if (hrs >= 1) return `${hrs}h`;
    return `${Math.max(1, mins)}m`;
};

const normLabel = (l) =>
    typeof l === "string"
        ? DEFAULT_LABELS.find((x) => x.name === l) || { name: l, color: "#3b82f6" }
        : l;

const stateIconFor = (state, size) => <StateIcon state={state} size={size} />;

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
            <Box sx={{ width: size / 3.5, height: size / 3.5, borderRadius: "50%", bgcolor: c }} />
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
                <Typography sx={{ color: "#fff", fontSize: size * 0.75, fontWeight: 900, lineHeight: 1 }}>!</Typography>
            </Box>
        );
    }
    return <p.Icon size={size} color={p.c} strokeWidth={k === "None" ? 2.5 : 2} />;
}

function TaskAvatar({ size = 20, name = "" }) {
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
                background: "radial-gradient(circle at 35% 35%, #7e22ce, #3b0764 70%, #000)",
                boxShadow: "0 0 6px rgba(168,85,247,.4)",
            }}
            title={name}
        >
            <Sparkles size={size * 0.55} color="#e9d5ff" />
        </Box>
    );
}

/* Icon + text for one side of a History diff row */
function DiffValue({ type, value, muted, c }) {
    const iconColor = c.muted;
    let icon = null;
    switch (type) {
        case "state":
            icon = stateIconFor(value, 14);
            break;
        case "priority":
            icon = <PrioIcon k={value} size={14} />;
            break;
        case "subscribe":
            icon = value === "None" ? <BellOff size={14} color={iconColor} /> : <Bell size={14} color={iconColor} />;
            break;
        case "label":
            icon = <Tag size={14} color={iconColor} />;
            break;
        case "assignee":
            icon = <Users size={14} color={iconColor} />;
            break;
        case "module":
            icon = <LayoutGrid size={14} color={iconColor} />;
            break;
        case "cycle":
            icon = <Contrast size={14} color={iconColor} />;
            break;
        case "date":
            icon = <Calendar size={14} color={iconColor} />;
            break;
        default:
            icon = <Layers size={14} color={iconColor} />;
    }
    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: muted ? c.muted : c.text,
                fontWeight: muted ? 500 : 600,
                fontSize: "0.8125rem",
            }}
        >
            {icon}
            <span>{value}</span>
        </Box>
    );
}

function EventIcon({ type, c }) {
    const col = c.muted;
    switch (type) {
        case "created":
            return <Copy size={14} color={col} />;
        case "state":
            return <CircleDot size={14} color={col} />;
        case "priority":
            return <BarChart2 size={14} color={col} />;
        case "subscribe":
            return <Bell size={14} color={col} />;
        case "label":
            return <Tag size={14} color={col} />;
        case "assignee":
            return <Users size={14} color={col} />;
        case "module":
            return <LayoutGrid size={14} color={col} />;
        case "cycle":
            return <Contrast size={14} color={col} />;
        case "date":
            return <CalendarClock size={14} color={col} />;
        default:
            return <Layers size={14} color={col} />;
    }
}

/* Generic checkable menu used by assignees / labels / modules / cycles / parent / relations */
function PickMenu({ anchor, onClose, items, onPick, paperSx, empty = "Nothing to choose" }) {
    return (
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={onClose} slotProps={{ paper: { sx: paperSx } }}>
            {items.length === 0 && (
                <MenuItem dense disabled sx={{ fontSize: "0.8125rem" }}>
                    {empty}
                </MenuItem>
            )}
            {items.map((it) => (
                <MenuItem
                    key={it.key}
                    dense
                    onClick={() => onPick(it)}
                    sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, fontSize: "0.8125rem" }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {it.icon}
                        <span>{it.label}</span>
                    </Box>
                    {it.checked && <Check size={14} />}
                </MenuItem>
            ))}
        </Menu>
    );
}

/* A property cell that opens the MUI date picker */
function DateCell({ value, placeholder, icon, onChange, sx, isDark }) {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <>
            <Box sx={{ ...sx, cursor: "pointer" }} onClick={(event) => setAnchorEl(event.currentTarget)}>
                {icon}
                <span>{value ? fmt(value) : placeholder}</span>
            </Box>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { sx: { p: 0, bgcolor: isDark ? "#1c1e22" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`, borderRadius: "10px" } }}}
            >
                <DatePickerCalendar
                    value={value || ""}
                    isDark={isDark}
                    onChange={onChange}
                    onClose={() => setAnchorEl(null)}
                    onClear={() => {
                        onChange("");
                        setAnchorEl(null);
                    }}
                />
            </Popover>
        </>
    );
}

const TAB_OPTIONS = ["All", "Activity", "Comments", "Updates", "Transition", "History"];

const initialActivity = (task, authorName) =>
    task.activity && task.activity.length
        ? task.activity
        : [
            {
                id: "created",
                ts: task.createdTs || Date.now(),
                author: authorName,
                type: "created",
                action: "created the work item.",
            },
        ];

/* ───────────── Task Detail Content Component ───────────── */
// Renders the full task detail UI (used inside the drawer / modal / full screen)
function TaskDetailContent({
    task,
    onClose,
    peekMode,
    setPeekMode,
    onUpdateItem,
    onDeleteItem,
    allItems = [],
    c,
    isDark,
    user,
    notify,
    labelOptions = DEFAULT_LABELS,
    moduleOptions = DEFAULT_MODULES,
    cycleOptions = DEFAULT_CYCLES,
}) {
    const authorName = task.creator || user?.nameEn || "niron.camdoc";

    /* ── state ── */
    const [title, setTitle] = useState(task.title || "");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [description, setDescription] = useState(task.description || "");
    const [detailsOpen, setDetailsOpen] = useState(true);
    const [projectStructureOpen, setProjectStructureOpen] = useState(true);
    const [relationsOpen, setRelationsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [sortDesc, setSortDesc] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [commentsList, setCommentsList] = useState(task.comments || []);
    const [updatesList, setUpdatesList] = useState(task.updates || []);
    const [subTasks, setSubTasks] = useState(task.subTasks || []);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
    const [showAddSubTask, setShowAddSubTask] = useState(false);
    const [showDoneSubTasks, setShowDoneSubTasks] = useState(true);
    const [reactions, setReactions] = useState(task.reactions || []);
    const [attachments, setAttachments] = useState(task.attachments || []);
    const [links, setLinks] = useState(task.links || []);
    const [activity, setActivity] = useState(() => initialActivity(task, authorName));
    const [lastEdited, setLastEdited] = useState(task.lastEditedTs || task.createdTs || Date.now());
    const [votes, setVotes] = useState({
        up: task.upvotes || 0,
        down: task.downvotes || 0,
        mine: task.myVote || null,
    });
    const [, setTick] = useState(0);

    // menu anchors
    const [peekMenuAnchor, setPeekMenuAnchor] = useState(null);
    const [stateAnchor, setStateAnchor] = useState(null);
    const [prioAnchor, setPrioAnchor] = useState(null);
    const [assigneeAnchor, setAssigneeAnchor] = useState(null);
    const [labelAnchor, setLabelAnchor] = useState(null);
    const [moduleAnchor, setModuleAnchor] = useState(null);
    const [cycleAnchor, setCycleAnchor] = useState(null);
    const [parentAnchor, setParentAnchor] = useState(null);
    const [relTypeAnchor, setRelTypeAnchor] = useState(null);
    const [relPickAnchor, setRelPickAnchor] = useState(null);
    const [relType, setRelType] = useState("Relates to");
    const [subOptsAnchor, setSubOptsAnchor] = useState(null);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [linkDialog, setLinkDialog] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [newLinkTitle, setNewLinkTitle] = useState("");

    const fileInputRef = useRef(null);
    const descRef = useRef(null);
    const editorRef = useRef(null);

    const subscribed = task.subscribed ?? true;
    const assignees = task.assignees || [];
    const labels = (task.labels || []).map(normLabel);
    const modules = task.modules || [];
    const relations = task.relations || [];
    const state = task.state || "Backlog";
    const priority = task.priority || "None";

    /* reset local state when another task is shown */
    useEffect(() => {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setCommentsList(task.comments || []);
        setUpdatesList(task.updates || []);
        setSubTasks(task.subTasks || []);
        setReactions(task.reactions || []);
        setAttachments(task.attachments || []);
        setLinks(task.links || []);
        setActivity(initialActivity(task, authorName));
        setLastEdited(task.lastEditedTs || task.createdTs || Date.now());
        setVotes({ up: task.upvotes || 0, down: task.downvotes || 0, mine: task.myVote || null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task.id]);

    /* refresh the "x minutes ago" labels */
    useEffect(() => {
        const t = setInterval(() => setTick((n) => n + 1), 30000);
        return () => clearInterval(t);
    }, []);

    /* ── activity logging ── */
    const createdTs = activity.find((e) => e.type === "created")?.ts ?? Date.now();

    const commit = (patch, ev) => {
        const full = ev
            ? {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ts: Date.now(),
                author: authorName,
                ...ev,
            }
            : null;
        const next = full ? [...activity, full] : activity;
        if (full) setActivity(next);
        onUpdateItem?.(task.id, { ...patch, ...(full ? { activity: next } : {}) });
    };

    /* ── handlers ── */
    const handleSaveTitle = () => {
        setIsEditingTitle(false);
        if (title.trim() && title !== task.title) {
            onUpdateItem?.(task.id, { title: title.trim() });
            notify?.("Title updated");
        }
    };

    const handleSaveDescription = (val) => {
        if (val === (task.description || "")) return;
        const ts = Date.now();
        setLastEdited(ts);
        onUpdateItem?.(task.id, { description: val, lastEditedTs: ts });
    };

    const changeState = (s) => {
        setStateAnchor(null);
        if (s === state) return;
        const lastStateTs = [...activity].reverse().find((e) => e.type === "state")?.ts ?? createdTs;
        commit(
            { state: s },
            {
                type: "state",
                action: "set the state to",
                target: `${s}.`,
                from: state,
                to: s,
                dur: shortDur(Date.now() - lastStateTs),
            }
        );
    };

    const changePriority = (p) => {
        setPrioAnchor(null);
        if (p === priority) return;
        commit(
            { priority: p },
            { type: "priority", action: "set the priority to", target: `${p}.`, from: priority, to: p }
        );
    };

    const handleToggleSubscribe = () => {
        const next = !subscribed;
        commit(
            { subscribed: next },
            next
                ? { type: "subscribe", action: "subscribed to this work item.", from: "None", to: authorName }
                : { type: "subscribe", action: "unsubscribed from this work item.", from: authorName, to: "None" }
        );
        notify?.(next ? "Subscribed to work item" : "Unsubscribed from work item");
    };

    const toggleAssignee = (name) => {
        const has = assignees.includes(name);
        const next = has ? assignees.filter((a) => a !== name) : [...assignees, name];
        commit(
            { assignees: next },
            has
                ? { type: "assignee", action: "removed the assignee", target: `${name}.`, from: name, to: "None" }
                : { type: "assignee", action: "added a new assignee", target: `${name}.`, from: "None", to: name }
        );
    };

    const toggleLabel = (lbl) => {
        const has = labels.some((l) => l.name === lbl.name);
        const next = has ? labels.filter((l) => l.name !== lbl.name) : [...labels, lbl];
        commit(
            { labels: next },
            has
                ? { type: "label", action: "removed the label", target: `${lbl.name}.`, from: lbl.name, to: "None" }
                : { type: "label", action: "added a new label", target: `${lbl.name}.`, from: "None", to: lbl.name }
        );
    };

    const toggleModule = (m) => {
        const has = modules.includes(m);
        const next = has ? modules.filter((x) => x !== m) : [...modules, m];
        commit(
            { modules: next },
            has
                ? { type: "module", action: "removed this work item from the module", target: `${m}.`, from: m, to: "None" }
                : { type: "module", action: "added this work item to the module", target: `${m}.`, from: "None", to: m }
        );
    };

    const changeCycle = (cy) => {
        setCycleAnchor(null);
        const next = cy === task.cycle ? null : cy;
        commit(
            { cycle: next },
            next
                ? { type: "cycle", action: "added this work item to the cycle", target: `${next}.`, from: task.cycle || "None", to: next }
                : { type: "cycle", action: "removed this work item from the cycle", target: `${task.cycle}.`, from: task.cycle, to: "None" }
        );
    };

    const changeDate = (key, label, val) => {
        const prev = task[key];
        if ((prev || "") === val) return;
        commit(
            { [key]: val || null },
            {
                type: "date",
                action: val ? `set the ${label} to` : `removed the ${label}`,
                target: val ? `${fmt(val)}.` : "",
                from: prev ? fmt(prev) : "None",
                to: val ? fmt(val) : "None",
            }
        );
    };

    const changeParent = (it) => {
        setParentAnchor(null);
        onUpdateItem?.(task.id, { parent: it ? `${it.id} ${it.title}` : null });
    };

    const addRelation = (it) => {
        setRelPickAnchor(null);
        const rel = { id: Date.now(), type: relType, taskId: it.id, title: it.title, state: it.state };
        onUpdateItem?.(task.id, { relations: [...relations, rel] });
        notify?.("Relation added");
    };

    const handleVote = (dir) => {
        let { up, down, mine } = votes;
        if (mine === dir) {
            dir === "up" ? (up -= 1) : (down -= 1);
            mine = null;
        } else {
            if (mine === "up") up -= 1;
            if (mine === "down") down -= 1;
            dir === "up" ? (up += 1) : (down += 1);
            mine = dir;
        }
        setVotes({ up, down, mine });
        onUpdateItem?.(task.id, { upvotes: up, downvotes: down, myVote: mine });
    };

    const handleCopyBranch = () => {
        const branchName = `feature/${String(task.id).toLowerCase()}-${(task.title || "task")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`;
        navigator.clipboard?.writeText(branchName);
        notify?.(`Branch copied: ${branchName}`);
    };

    const handleCopyLink = () => {
        navigator.clipboard?.writeText(`${window.location.origin}/work-items/${task.id}`);
        notify?.("Link copied to clipboard");
    };

    const handlePostComment = () => {
        if (!commentInput.trim()) return;
        const next = [
            ...commentsList,
            { id: Date.now(), author: authorName, text: commentInput.trim(), ts: Date.now() },
        ];
        setCommentsList(next);
        onUpdateItem?.(task.id, { comments: next });
        setCommentInput("");
        notify?.("Comment added");
    };

    const insertCommentFormat = (prefix, suffix = "") => setCommentInput((prev) => prev + prefix + suffix);

    const handleAddSubTask = () => {
        if (!newSubTaskTitle.trim()) return;
        const next = [
            ...subTasks,
            { id: `${task.id}-${subTasks.length + 1}`, title: newSubTaskTitle.trim(), done: false },
        ];
        setSubTasks(next);
        onUpdateItem?.(task.id, { subTasks: next });
        setNewSubTaskTitle("");
        setShowAddSubTask(false);
        notify?.("Sub-work item added");
    };

    const handleToggleSubTask = (subId) => {
        const next = subTasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
        setSubTasks(next);
        onUpdateItem?.(task.id, { subTasks: next });
    };

    const handleAddReaction = (emoji) => {
        if (!reactions.includes(emoji)) {
            const next = [...reactions, emoji];
            setReactions(next);
            onUpdateItem?.(task.id, { reactions: next });
        }
        setEmojiAnchor(null);
    };

    const handleAddLink = () => {
        if (!newLinkUrl.trim()) return;
        const next = [
            ...links,
            { id: Date.now(), title: newLinkTitle.trim() || newLinkUrl.trim(), url: newLinkUrl.trim() },
        ];
        setLinks(next);
        onUpdateItem?.(task.id, { links: next });
        setNewLinkUrl("");
        setNewLinkTitle("");
        setLinkDialog(false);
        notify?.("Link added");
    };

    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const next = [
            ...attachments,
            ...files.map((f) => ({
                id: Date.now() + Math.random(),
                name: f.name,
                size: `${(f.size / 1024).toFixed(1)} KB`,
            })),
        ];
        setAttachments(next);
        onUpdateItem?.(task.id, { attachments: next });
        notify?.(`Attached ${files.length} file(s)`);
        e.target.value = "";
    };

    /* ── styles ── */

    // Paper (menus / popovers)
    const paperSx = {
        bgcolor: c.card,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: "8px",
        minWidth: 180,
        py: 0.5,
        backgroundImage: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        "& .MuiMenuItem-root": {
            fontSize: "0.8125rem",
        },
    };

    // Icon buttons with a border (top bar)
    const iconBtn = {
        color: c.muted,
        p: 0.8,
        borderRadius: "8px",
        border: `1px solid ${c.pillBorder}`,
        "&:hover": { color: c.text, bgcolor: c.hover },
    };

    // Plain icon buttons (no border)
    const plainIconBtn = {
        color: c.muted,
        p: 0.65,
        "&:hover": { color: c.text, bgcolor: c.hover },
    };

    // Cells in the property row under the title
    const cellSx = (first) => ({
        position: "relative",
        flex: "1 1 0",
        minWidth: 125,
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.85,
        pl: first ? 0 : 1.75,
        pr: 1.5,
        cursor: "pointer",
        userSelect: "none",
        color: c.text,
        fontSize: "0.8125rem",
        fontWeight: 500,
        borderLeft: first ? "none" : `1px solid ${c.border}`,
        "&:hover": { bgcolor: c.hover },
    });

    // Property rows (label / value pairs)
    const propRowSx = {
        display: "grid",
        gridTemplateColumns: { xs: "120px 1fr", md: "30% 1fr" },
        alignItems: "center",
        fontSize: "0.8125rem",
        minHeight: 28,
    };
    const propLabelSx = { display: "flex", alignItems: "center", gap: 1.25, color: c.text, opacity: 0.85 };
    const propValueSx = {
        color: c.muted,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        flexWrap: "wrap",
        "&:hover": { color: c.text },
    };
    const chipSx = {
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        bgcolor: c.pillBg,
        border: `1px solid ${c.pillBorder}`,
        borderRadius: "6px",
        px: 1,
        py: 0.2,
        fontSize: "0.75rem",
        fontWeight: 500,
        color: c.text,
    };

    const iconBoxSx = {
        width: 28,
        height: 28,
        borderRadius: "8px",
        bgcolor: c.sub || (isDark ? "#14151a" : "#f8fafc"),
        border: `1px solid ${c.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        flexShrink: 0,
    };

    /* time in current state (badge next to state) */
    const lastStateTs = [...activity].reverse().find((e) => e.type === "state")?.ts ?? createdTs;
    const stateAge = shortDur(Date.now() - lastStateTs);

    /* ── timeline ── */
    // Filters for the timeline tabs (All, Activity, Transition, History)
    const filterFor = {
        All: () => true,
        Activity: () => true,
        Transition: (e) => e.type === "state",
        History: (e) => e.type !== "created",
    };
    const visibleEvents = [...activity]
        .filter(filterFor[activeTab] || (() => false))
        .sort((a, b) => (sortDesc ? b.ts - a.ts : a.ts - b.ts));

    const renderTimeline = (events, extra = []) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {events.map((ev, idx) => (
                <Box key={ev.id} sx={{ display: "flex", gap: 1.5, position: "relative" }}>
                    {idx < events.length - 1 && (
                        <Box
                            sx={{
                                position: "absolute",
                                left: 13.5,
                                top: 30,
                                bottom: -20,
                                width: "1px",
                                bgcolor: c.border,
                            }}
                        />
                    )}
                    <Box sx={iconBoxSx}>
                        <EventIcon type={ev.type} c={c} />
                    </Box>
                    <Box sx={{ flex: 1, pt: 0.2 }}>
                        <Typography sx={{ fontSize: "0.8125rem", color: c.text, lineHeight: 1.45 }}>
                            <b>{ev.author}</b> {ev.action} {ev.target && <b>{ev.target}</b>}
                            <span style={{ color: c.muted, marginLeft: 6, fontSize: "0.72rem" }}>• {ago(ev.ts)}</span>
                        </Typography>
                        {ev.from !== undefined && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.75,
                                    fontSize: "0.8125rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <DiffValue type={ev.type} value={ev.from} muted c={c} />
                                {ev.dur && (
                                    <Box
                                        sx={{
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            color: c.muted,
                                            bgcolor: c.pillBg,
                                            borderRadius: "4px",
                                            px: 0.75,
                                            py: 0.1,
                                        }}
                                    >
                                        {ev.dur}
                                    </Box>
                                )}
                                <ArrowRight size={13} color={c.muted} />
                                <DiffValue type={ev.type} value={ev.to} c={c} />
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
            {extra}
        </Box>
    );

    // Single comment block (comments tab / all tab / updates tab)
    const renderComment = (cm) => (
        <Box
            key={cm.id}
            sx={{
                p: 1.25,
                bgcolor: c.sub || (isDark ? "#14151a" : "#f8fafc"),
                border: `1px solid ${c.border}`,
                borderRadius: "8px",
                display: "flex",
                gap: 1.25,
            }}
        >
            <TaskAvatar size={22} name={cm.author} />
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: c.text }}>{cm.author}</Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: c.muted }}>• {cm.ts ? ago(cm.ts) : cm.when}</Typography>
                </Box>
                <Typography sx={{ fontSize: "0.8125rem", color: c.text, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    {cm.text}
                </Typography>
            </Box>
        </Box>
    );

    const memberNames = Array.from(
        new Set([authorName, ...assignees, ...allItems.flatMap((it) => it.assignees || [])])
    );

    const visibleSubTasks = showDoneSubTasks ? subTasks : subTasks.filter((s) => !s.done);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: c.card,
                color: c.text,
                overflow: "hidden",
            }}
        >
            {/* ───────────── TOP BAR ───────────── */}
            <Box
                sx={{
                    height: 56,
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Close (Esc)">
                        <IconButton size="small" onClick={onClose} sx={plainIconBtn}>
                            <ArrowRight size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={peekMode === "full" ? "Restore view" : "Open work item in full screen"}>
                        <IconButton
                            size="small"
                            onClick={() => setPeekMode?.(peekMode === "full" ? "side" : "full")}
                            sx={plainIconBtn}
                        >
                            {peekMode === "full" ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Peek view layout">
                        <IconButton size="small" onClick={(e) => setPeekMenuAnchor(e.currentTarget)} sx={plainIconBtn}>
                            <PanelRight size={17} fill="currentColor" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* votes */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mr: 0.5 }}>
                        <IconButton
                            size="small"
                            onClick={() => handleVote("up")}
                            sx={{
                                width: 30,
                                height: 30,
                                bgcolor: votes.mine === "up" ? "rgba(16,185,129,.2)" : c.pillBg,
                                color: votes.mine === "up" ? "#10b981" : c.text,
                                "&:hover": { bgcolor: c.hover },
                            }}
                        >
                            <ArrowUp size={16} />
                        </IconButton>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, minWidth: 8 }}>{votes.up}</Typography>
                        <IconButton
                            size="small"
                            onClick={() => handleVote("down")}
                            sx={{
                                width: 28,
                                height: 28,
                                bgcolor: votes.mine === "down" ? "rgba(239,68,68,.2)" : c.pillBg,
                                color: votes.mine === "down" ? "#ef4444" : c.text,
                                "&:hover": { bgcolor: c.hover },
                            }}
                        >
                            <ArrowDown size={15} />
                        </IconButton>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, minWidth: 8 }}>{votes.down}</Typography>
                    </Box>

                    {/* subscribe split button */}
                    <Box
                        onClick={handleToggleSubscribe}
                        sx={{
                            display: "flex",
                            alignItems: "stretch",
                            border: `1px solid ${c.pillBorder}`,
                            borderRadius: "8px",
                            overflow: "hidden",
                            cursor: "pointer",
                            bgcolor: c.pillBg,
                            "&:hover": { bgcolor: c.hover },
                        }}
                    >
                        <Box sx={{ px: 1, display: "flex", alignItems: "center" }}>
                            <TaskAvatar size={18} name={authorName} />
                        </Box>
                        <Box sx={{ width: "1px", bgcolor: c.pillBorder }} />
                        <Typography sx={{ px: 1.25, py: 0.6, fontSize: "0.8rem", fontWeight: 600, color: c.text }}>
                            {subscribed ? "Unsubscribe" : "Subscribe"}
                        </Typography>
                    </Box>

                    <Tooltip title="Copy git branch name">
                        <IconButton size="small" onClick={handleCopyBranch} sx={iconBtn}>
                            <GitBranch size={15} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy link">
                        <IconButton size="small" onClick={handleCopyLink} sx={iconBtn}>
                            <Link2 size={15} />
                        </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={(e) => setMoreAnchor(e.currentTarget)} sx={iconBtn}>
                        <MoreHorizontal size={15} />
                    </IconButton>
                </Box>
            </Box>

            {/* ───────────── SCROLLABLE MAIN CONTENT ───────────── */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    px: { xs: 2.5, md: 5 },
                    pt: 2,
                    pb: 4,
                }}
            >
                {/* ID */}
                <Typography
                    onClick={() => {
                        navigator.clipboard?.writeText(String(task.id));
                        notify?.(`Copied ID: ${task.id}`);
                    }}
                    sx={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: c.muted,
                        mb: 1,
                        cursor: "pointer",
                        display: "inline-block",
                        "&:hover": { color: c.text },
                    }}
                >
                    {task.id}
                </Typography>

                {/* Title */}
                {isEditingTitle ? (
                    <TextField
                        fullWidth
                        autoFocus
                        variant="standard"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "1.25rem", fontWeight: 600, color: c.text, p: 0, mb: 2 },
                        }}
                    />
                ) : (
                    <Typography
                        onClick={() => setIsEditingTitle(true)}
                        sx={{
                            fontWeight: 600,
                            fontSize: "1.25rem",
                            lineHeight: 1.35,
                            color: c.text,
                            cursor: "text",
                            mb: 2,
                        }}
                    >
                        {task.title || "Untitled work item"}
                    </Typography>
                )}

                {/* Property cells row */}
                <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", mb: 3 }}>
                    <Box sx={cellSx(true)} onClick={(e) => setStateAnchor(e.currentTarget)}>
                        <StateIcon state={state} size={14} />
                        <span>{state}</span>
                        <Box
                            sx={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: c.muted,
                                bgcolor: c.pillBg,
                                borderRadius: "4px",
                                px: 0.75,
                                py: 0.1,
                            }}
                        >
                            {stateAge}
                        </Box>
                    </Box>

                    <Box sx={cellSx(false)} onClick={(e) => setPrioAnchor(e.currentTarget)}>
                        <PrioIcon k={priority} size={14} />
                        <span>{priority}</span>
                    </Box>

                    <Box
                        sx={{ ...cellSx(false), color: assignees.length ? c.text : c.muted, fontWeight: assignees.length ? 600 : 500 }}
                        onClick={(e) => setAssigneeAnchor(e.currentTarget)}
                    >
                        {assignees.length ? <TaskAvatar size={18} name={assignees[0]} /> : <Users size={14} />}
                        <span>{assignees.length ? assignees.join(", ") : "Add assignees"}</span>
                    </Box>

                    <DateCell
                        value={task.start}
                        placeholder="Start date"
                        icon={<CalendarClock size={14} />}
                        onChange={(v) => changeDate("start", "start date", v)}
                        isDark={isDark}
                        sx={{ ...cellSx(false), color: task.start ? c.text : c.muted, fontWeight: task.start ? 600 : 500 }}
                    />

                    <DateCell
                        value={task.due}
                        placeholder="Due date"
                        icon={<Calendar size={14} />}
                        onChange={(v) => changeDate("due", "due date", v)}
                        isDark={isDark}
                        sx={{ ...cellSx(false), color: task.due ? c.text : c.muted, fontWeight: task.due ? 600 : 500 }}
                    />
                </Box>

                {/* ───────────── DESCRIPTION ───────────── */}
                <Box ref={descRef} sx={{ mb: 2.5, minHeight: 48 }}>
                    <TaskDescriptionEditor
                        ref={editorRef}
                        value={description}
                        onChange={(val) => {
                            setDescription(val);
                            handleSaveDescription(val);
                        }}
                        onLastEditedChange={() => setLastEdited(Date.now())}
                        isDark={isDark}
                        authorName={authorName}
                    />
                </Box>

                {/* Reaction row + last edited */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <IconButton
                            size="small"
                            onClick={(e) => setEmojiAnchor(e.currentTarget)}
                            sx={{ ...plainIconBtn, p: 0.5 }}
                            title="Add reaction"
                        >
                            <SmilePlus size={16} />
                        </IconButton>
                        {reactions.map((em) => (
                            <Box
                                key={em}
                                sx={{ ...chipSx, borderRadius: "12px", px: 0.75, py: 0.1, fontSize: "0.8rem" }}
                            >
                                {em}
                            </Box>
                        ))}
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            color: c.muted,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                        }}
                    >
                        Last edited by {authorName} {ago(lastEdited)}
                        <ChevronDown size={13} />
                    </Typography>
                </Box>

                {/* Action toolbar */}
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        border: `1px solid ${c.border}`,
                        borderRadius: "8px",
                        px: 0.75,
                        py: 0.5,
                        mb: 2.5,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        size="small"
                        startIcon={<Plus size={14} />}
                        onClick={() => setShowAddSubTask(!showAddSubTask)}
                        sx={{
                            textTransform: "none",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: c.text,
                            px: 1,
                            py: 0.25,
                            "&:hover": { bgcolor: c.hover },
                        }}
                    >
                        Add sub-work item
                    </Button>

                    <Box sx={{ width: "1px", height: 20, bgcolor: c.border, mx: 0.75 }} />

                    <Button
                        size="small"
                        onClick={(e) => setRelTypeAnchor(e.currentTarget)}
                        sx={{ minWidth: 0, color: c.text, px: 1, gap: 0.5, "&:hover": { bgcolor: c.hover } }}
                        title="Add relation"
                    >
                        <ScanLine size={16} />
                        <ChevronDown size={14} color={c.muted} />
                    </Button>
                    <Button
                        size="small"
                        onClick={(e) => setSubOptsAnchor(e.currentTarget)}
                        sx={{ minWidth: 0, color: c.text, px: 1, gap: 0.5, "&:hover": { bgcolor: c.hover } }}
                        title="Sub-work item options"
                    >
                        <Network size={16} />
                        <ChevronDown size={14} color={c.muted} />
                    </Button>

                    <Box sx={{ width: "1px", height: 20, bgcolor: c.border, mx: 0.75 }} />

                    <IconButton size="small" onClick={() => setLinkDialog(true)} sx={plainIconBtn} title="Add link">
                        <Link2 size={16} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        sx={plainIconBtn}
                        title="Attach file"
                    >
                        <Paperclip size={16} />
                    </IconButton>
                    {/* Opens the editor's slash menu: Basics, Layout, Advanced, Inline, Media */}
                    <IconButton
                        size="small"
                        onClick={() => editorRef.current?.openSlashMenu()}
                        sx={plainIconBtn}
                        title="Insert block into description (/)"
                    >
                        <FileText size={16} />
                    </IconButton>
                    <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleFileAttach} />
                </Box>

                {/* Sub-work items */}
                {(showAddSubTask || subTasks.length > 0) && (
                    <Box
                        sx={{
                            mb: 3,
                            p: 1.5,
                            bgcolor: c.sub,
                            border: `1px solid ${c.border}`,
                            borderRadius: "8px",
                        }}
                    >
                        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: c.text, mb: 1 }}>
                            Sub-work items ({subTasks.length})
                        </Typography>
                        {visibleSubTasks.map((st) => (
                            <Box key={st.id} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
                                <Box
                                    onClick={() => handleToggleSubTask(st.id)}
                                    sx={{ cursor: "pointer", color: st.done ? "#10b981" : c.muted, display: "flex" }}
                                >
                                    {st.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.8125rem",
                                        color: st.done ? c.muted : c.text,
                                        textDecoration: st.done ? "line-through" : "none",
                                    }}
                                >
                                    {st.title}
                                </Typography>
                            </Box>
                        ))}
                        {showAddSubTask && (
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    placeholder="Sub-work item title..."
                                    value={newSubTaskTitle}
                                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
                                    inputProps={{ sx: { fontSize: "0.8125rem", py: 0.6 } }}
                                />
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleAddSubTask}
                                    sx={{ textTransform: "none", whiteSpace: "nowrap", fontSize: "0.75rem", px: 1.5 }}
                                >
                                    Add
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Attachments / links */}
                {(attachments.length > 0 || links.length > 0) && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                        {attachments.map((att) => (
                            <Chip
                                key={att.id}
                                icon={<Paperclip size={12} />}
                                label={`${att.name} (${att.size})`}
                                size="small"
                                onDelete={() => {
                                    const next = attachments.filter((a) => a.id !== att.id);
                                    setAttachments(next);
                                    onUpdateItem?.(task.id, { attachments: next });
                                }}
                                sx={{ bgcolor: c.pillBg, border: `1px solid ${c.pillBorder}`, color: c.text, fontSize: "0.75rem" }}
                            />
                        ))}
                        {links.map((lk) => (
                            <Chip
                                key={lk.id}
                                icon={<ExternalLink size={12} />}
                                label={lk.title}
                                size="small"
                                component="a"
                                href={lk.url}
                                target="_blank"
                                clickable
                                onDelete={() => {
                                    const next = links.filter((l) => l.id !== lk.id);
                                    setLinks(next);
                                    onUpdateItem?.(task.id, { links: next });
                                }}
                                sx={{ bgcolor: c.pillBg, border: `1px solid ${c.pillBorder}`, color: c.text, fontSize: "0.75rem" }}
                            />
                        ))}
                    </Box>
                )}

                {/* Relations (only when some exist) */}
                {relations.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Box
                            onClick={() => setRelationsOpen(!relationsOpen)}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            <span>Relations {relations.length}</span>
                            <ChevronRight
                                size={14}
                                style={{
                                    transform: relationsOpen ? "rotate(90deg)" : "none",
                                    transition: "transform 0.2s ease",
                                }}
                            />
                        </Box>
                        {relationsOpen && (
                            <Box
                                sx={{
                                    p: 1.5,
                                    bgcolor: c.sub,
                                    border: `1px solid ${c.border}`,
                                    borderRadius: "8px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                {relations.map((r) => (
                                    <Box key={r.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={r.type.toLowerCase()}
                                                size="small"
                                                sx={{ fontSize: "0.7rem", height: 18, bgcolor: c.pillBg, color: c.muted }}
                                            />
                                            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: c.text }}>
                                                {r.taskId} {r.title}
                                            </Typography>
                                        </Box>
                                        <StateIcon state={r.state} size={13} />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}

                {/* ───────────── PROPERTIES ───────────── */}
                <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: c.text, mb: 2 }}>Properties</Typography>

                    {/* Details */}
                    <Box sx={{ mb: 2 }}>
                        <Box
                            onClick={() => setDetailsOpen(!detailsOpen)}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                cursor: "pointer",
                                userSelect: "none",
                                color: c.text,
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                mb: 1.25,
                            }}
                        >
                            <span>Details</span>
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    transform: detailsOpen ? "none" : "rotate(-90deg)",
                                    display: "inline-block",
                                }}
                            >
                                ▼
                            </span>
                        </Box>

                        {detailsOpen && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Box sx={propRowSx}>
                                    <Box sx={propLabelSx}>
                                        <Layers size={15} />
                                        <span>Parent</span>
                                    </Box>
                                    <Box sx={propValueSx} onClick={(e) => setParentAnchor(e.currentTarget)}>
                                        {task.parent || "Add parent"}
                                    </Box>
                                </Box>

                                <Box sx={propRowSx}>
                                    <Box sx={propLabelSx}>
                                        <Tag size={15} />
                                        <span>Labels</span>
                                    </Box>
                                    <Box sx={{ ...propValueSx, gap: 1 }} onClick={(e) => setLabelAnchor(e.currentTarget)}>
                                        {labels.length === 0 && <span>Add labels</span>}
                                        {labels.map((l) => (
                                            <Box key={l.name} sx={chipSx}>
                                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: l.color || "#3b82f6" }} />
                                                <span>{l.name}</span>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ borderColor: c.border, mb: 2 }} />

                    {/* Project structure */}
                    <Box sx={{ mb: 2 }}>
                        <Box
                            onClick={() => setProjectStructureOpen(!projectStructureOpen)}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                cursor: "pointer",
                                userSelect: "none",
                                color: c.text,
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                mb: 1.25,
                            }}
                        >
                            <span>Project structure</span>
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    transform: projectStructureOpen ? "none" : "rotate(-90deg)",
                                    display: "inline-block",
                                }}
                            >
                                ▼
                            </span>
                        </Box>

                        {projectStructureOpen && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Box sx={propRowSx}>
                                    <Box sx={propLabelSx}>
                                        <Contrast size={15} />
                                        <span>Cycle</span>
                                    </Box>
                                    <Box
                                        sx={{ ...propValueSx, color: task.cycle ? c.text : c.muted }}
                                        onClick={(e) => setCycleAnchor(e.currentTarget)}
                                    >
                                        {task.cycle ? (
                                            <>
                                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                                                <span>{task.cycle}</span>
                                            </>
                                        ) : (
                                            "No cycle"
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={propRowSx}>
                                    <Box sx={propLabelSx}>
                                        <LayoutGrid size={15} />
                                        <span>Modules</span>
                                    </Box>
                                    <Box sx={{ ...propValueSx, gap: 1 }} onClick={(e) => setModuleAnchor(e.currentTarget)}>
                                        {modules.length === 0 && <span>Add modules</span>}
                                        {modules.map((m) => (
                                            <Box key={m} sx={chipSx}>
                                                <LayoutGrid size={12} color={c.muted} />
                                                <span>{m}</span>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* ───────────── ACTIVITY ───────────── */}
                <Box sx={{ pt: 0.5 }}>
                    {/* Tabs row + sort */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",

                            mb: 2.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, overflowX: "auto" }}>
                            {TAB_OPTIONS.map((t) => {
                                const isActive = activeTab === t;
                                return (
                                    <Box
                                        key={t}
                                        onClick={() => setActiveTab(t)}
                                        sx={{
                                            position: "relative",
                                            px: 1.5,
                                            py: 0.75,
                                            cursor: "pointer",
                                            userSelect: "none",
                                            borderRadius: "6px 6px 0 0",
                                            bgcolor: isActive ? c.pillBg : "transparent",
                                            "&:hover": { color: c.text },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "0.8125rem",
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? c.text : c.muted,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {t}
                                        </Typography>
                                        {isActive && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    bottom: -1,
                                                    left: 0,
                                                    right: 0,
                                                    height: "2px",
                                                    bgcolor: c.text,
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                        <Tooltip title={sortDesc ? "Newest first" : "Oldest first"}>
                            <IconButton
                                size="small"
                                onClick={() => setSortDesc(!sortDesc)}
                                sx={{
                                    mb: 0.5,
                                    bgcolor: c.pillBg,
                                    borderRadius: "6px",
                                    color: c.text,
                                    p: 0.75,
                                    "&:hover": { bgcolor: c.hover },
                                }}
                            >
                                <ArrowUpDown size={15} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* All */}
                    {activeTab === "All" && renderTimeline(visibleEvents, commentsList.map(renderComment))}

                    {/* Activity / Transition / History */}
                    {(activeTab === "Activity" || activeTab === "Transition" || activeTab === "History") &&
                        renderTimeline(visibleEvents)}

                    {/* Comments */}
                    {activeTab === "Comments" && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box
                                sx={{
                                    border: `1px solid ${c.border}`,
                                    borderRadius: "10px",
                                    bgcolor: c.sub,
                                    p: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.25,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    variant="standard"
                                    placeholder="Add comment"
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { fontSize: "0.85rem", color: c.text, p: 0 },
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        pt: 1,
                                        borderTop: `1px solid ${c.border}`,
                                        flexWrap: "wrap",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, flexWrap: "wrap" }}>
                                        {[
                                            { t: "Bold", I: Bold, f: () => insertCommentFormat("**", "**") },
                                            { t: "Italic", I: Italic, f: () => insertCommentFormat("*", "*") },
                                            { t: "Underline", I: Underline, f: () => insertCommentFormat("<u>", "</u>") },
                                            { t: "Strikethrough", I: Strikethrough, f: () => insertCommentFormat("~~", "~~") },
                                            "sep",
                                            { t: "Align left", I: AlignLeft },
                                            { t: "Align center", I: AlignCenter },
                                            { t: "Align right", I: AlignRight },
                                            "sep",
                                            { t: "Numbered list", I: ListOrdered, f: () => insertCommentFormat("\n1. ") },
                                            { t: "Bullet list", I: List, f: () => insertCommentFormat("\n- ") },
                                            { t: "Task list", I: ListChecks, f: () => insertCommentFormat("\n- [ ] ") },
                                            "sep",
                                            { t: "Quote", I: Quote, f: () => insertCommentFormat("\n> ") },
                                            { t: "Code block", I: Code, f: () => insertCommentFormat("\n```\n\n```") },
                                            { t: "Image", I: Image, f: () => insertCommentFormat("![Image](url)") },
                                            { t: "Attach file", I: Paperclip, f: () => fileInputRef.current?.click() },
                                        ].map((b, i) =>
                                            b === "sep" ? (
                                                <Box key={`s${i}`} sx={{ width: "1px", height: 16, bgcolor: c.border, mx: 0.5 }} />
                                            ) : (
                                                <IconButton
                                                    key={b.t}
                                                    size="small"
                                                    onClick={b.f}
                                                    title={b.t}
                                                    sx={{ color: c.muted, p: 0.5, "&:hover": { color: c.text } }}
                                                >
                                                    <b.I size={14} />
                                                </IconButton>
                                            )
                                        )}
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disabled={!commentInput.trim()}
                                        onClick={handlePostComment}
                                        sx={{
                                            textTransform: "none",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            px: 1.5,
                                            py: 0.4,
                                            borderRadius: "6px",
                                        }}
                                    >
                                        Comment
                                    </Button>
                                </Box>
                            </Box>
                            {commentsList.map(renderComment)}
                        </Box>
                    )}

                    {/* Updates */}
                    {activeTab === "Updates" && (
                        <Box
                            sx={{
                                minHeight: 240,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                                alignItems: updatesList.length ? "stretch" : "flex-end",
                                justifyContent: updatesList.length ? "flex-start" : "flex-end",
                                pr: updatesList.length ? 0 : 3,
                                pb: 2,
                            }}
                        >
                            {updatesList.length > 0 ? (
                                updatesList.map((u) =>
                                    renderComment({ id: u.id, author: u.user, text: u.text, when: u.when, ts: u.ts })
                                )
                            ) : (
                                <svg width="120" height="110" viewBox="0 0 100 90" fill="none">
                                    <rect
                                        x="16" y="12" width="44" height="56" rx="8"
                                        transform="rotate(14 16 12)"
                                        fill={isDark ? "#121318" : "#cbd5e1"}
                                        stroke={isDark ? "#20222a" : "#94a3b8"}
                                        strokeWidth="1.5"
                                    />
                                    <rect
                                        x="26" y="18" width="44" height="56" rx="8"
                                        transform="rotate(7 26 18)"
                                        fill={isDark ? "#17181f" : "#e2e8f0"}
                                        stroke={isDark ? "#2a2d37" : "#cbd5e1"}
                                        strokeWidth="1.5"
                                    />
                                    <rect
                                        x="38" y="24" width="44" height="56" rx="8"
                                        fill={isDark ? "#1e2028" : "#f1f5f9"}
                                        stroke={isDark ? "#353945" : "#94a3b8"}
                                        strokeWidth="1.5"
                                    />
                                    <circle
                                        cx="60" cy="52" r="13"
                                        stroke={isDark ? "#434756" : "#94a3b8"}
                                        strokeWidth="2"
                                        fill={isDark ? "#16171d" : "#e2e8f0"}
                                    />
                                    <path d="M61 44 L56 52 L60 52 L59 60 L65 51 L61 51 Z" fill={isDark ? "#676d80" : "#64748b"} />
                                </svg>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Metadata footer */}
                <Box
                    sx={{
                        mt: 3.5,
                        pt: 2,
                        borderTop: `1px solid ${c.border}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        fontSize: "0.75rem",
                        color: c.muted,
                    }}
                >
                    <Box>
                        Created by <span style={{ color: c.text, fontWeight: 500 }}>{authorName}</span>
                    </Box>
                    <Box>
                        Created on{" "}
                        <span style={{ color: c.text, fontWeight: 500 }}>
                            {task.createdOn || new Date(createdTs).toLocaleString()}
                        </span>
                    </Box>
                    <Box>
                        Updated on{" "}
                        <span style={{ color: c.text, fontWeight: 500 }}>
                            {task.updatedOn || new Date(lastEdited).toLocaleString()}
                        </span>
                    </Box>
                </Box>
            </Box>

            {/* ───────────── MENUS & POPOVERS ───────────── */}

            {/* Peek layout */}
            <Menu
                anchorEl={peekMenuAnchor}
                open={Boolean(peekMenuAnchor)}
                onClose={() => setPeekMenuAnchor(null)}
                slotProps={{ paper: { sx: paperSx } }}
            >
                {[
                    { k: "side", label: "Side peek", I: PanelRight },
                    { k: "modal", label: "Modal", I: Square },
                    { k: "full", label: "Full screen", I: Maximize },
                ].map(({ k, label, I }) => (
                    <MenuItem
                        key={k}
                        dense
                        onClick={() => {
                            setPeekMode?.(k);
                            setPeekMenuAnchor(null);
                        }}
                        sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <I size={15} color={c.muted} />
                            <span>{label}</span>
                        </Box>
                        {peekMode === k && <Check size={14} />}
                    </MenuItem>
                ))}
            </Menu>

            {/* State */}
            <PickMenu
                anchor={stateAnchor}
                onClose={() => setStateAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => changeState(it.key)}
                items={STATES.map((s) => ({
                    key: s.k,
                    label: s.k,
                    icon: <StateIcon state={s.k} size={14} />,
                    checked: state === s.k,
                }))}
            />

            {/* Priority */}
            <PickMenu
                anchor={prioAnchor}
                onClose={() => setPrioAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => changePriority(it.key)}
                items={PRIORITIES.map((p) => ({
                    key: p.k,
                    label: p.k,
                    icon: <PrioIcon k={p.k} size={14} />,
                    checked: priority === p.k,
                }))}
            />

            {/* Assignees */}
            <PickMenu
                anchor={assigneeAnchor}
                onClose={() => setAssigneeAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => toggleAssignee(it.key)}
                items={memberNames.map((n) => ({
                    key: n,
                    label: n,
                    icon: <TaskAvatar size={18} name={n} />,
                    checked: assignees.includes(n),
                }))}
            />

            {/* Labels */}
            <PickMenu
                anchor={labelAnchor}
                onClose={() => setLabelAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => toggleLabel(it.raw)}
                items={labelOptions.map((l) => ({
                    key: l.name,
                    raw: l,
                    label: l.name,
                    icon: <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: l.color }} />,
                    checked: labels.some((x) => x.name === l.name),
                }))}
            />

            {/* Modules */}
            <PickMenu
                anchor={moduleAnchor}
                onClose={() => setModuleAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => toggleModule(it.key)}
                items={moduleOptions.map((m) => ({
                    key: m,
                    label: m,
                    icon: <LayoutGrid size={14} color={c.muted} />,
                    checked: modules.includes(m),
                }))}
            />

            {/* Cycle */}
            <PickMenu
                anchor={cycleAnchor}
                onClose={() => setCycleAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => changeCycle(it.key)}
                items={cycleOptions.map((cy) => ({
                    key: cy,
                    label: cy,
                    icon: <Contrast size={14} color={c.muted} />,
                    checked: task.cycle === cy,
                }))}
            />

            {/* Parent */}
            <PickMenu
                anchor={parentAnchor}
                onClose={() => setParentAnchor(null)}
                paperSx={paperSx}
                empty="No other work items"
                onPick={(it) => (it.key === "__none" ? changeParent(null) : changeParent(it.raw))}
                items={[
                    ...(task.parent ? [{ key: "__none", label: "No parent", icon: <Minus size={14} /> }] : []),
                    ...allItems
                        .filter((it) => it.id !== task.id)
                        .map((it) => ({
                            key: it.id,
                            raw: it,
                            label: `${it.id} ${it.title}`,
                            icon: <StateIcon state={it.state} size={14} />,
                        })),
                ]}
            />

            {/* Relation type → relation target */}
            <PickMenu
                anchor={relTypeAnchor}
                onClose={() => setRelTypeAnchor(null)}
                paperSx={paperSx}
                onPick={(it) => {
                    setRelType(it.key);
                    setRelPickAnchor(relTypeAnchor);
                    setRelTypeAnchor(null);
                }}
                items={RELATION_TYPES.map((t) => ({ key: t, label: t, icon: <ScanLine size={14} color={c.muted} /> }))}
            />
            <PickMenu
                anchor={relPickAnchor}
                onClose={() => setRelPickAnchor(null)}
                paperSx={paperSx}
                empty="No other work items"
                onPick={(it) => addRelation(it.raw)}
                items={allItems
                    .filter((it) => it.id !== task.id)
                    .map((it) => ({
                        key: it.id,
                        raw: it,
                        label: `${it.id} ${it.title}`,
                        icon: <StateIcon state={it.state} size={14} />,
                    }))}
            />

            {/* Sub-work item options */}
            <PickMenu
                anchor={subOptsAnchor}
                onClose={() => setSubOptsAnchor(null)}
                paperSx={paperSx}
                onPick={() => {
                    setShowDoneSubTasks(!showDoneSubTasks);
                    setSubOptsAnchor(null);
                }}
                items={[
                    {
                        key: "done",
                        label: "Show completed sub-work items",
                        icon: <CheckCircle2 size={14} color={c.muted} />,
                        checked: showDoneSubTasks,
                    },
                ]}
            />

            {/* More */}
            <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                slotProps={{ paper: { sx: paperSx } }}
            >
                <MenuItem
                    dense
                    onClick={() => {
                        navigator.clipboard?.writeText(String(task.id));
                        notify?.("Task ID copied");
                        setMoreAnchor(null);
                    }}
                >
                    Copy ID
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        handleCopyLink();
                        setMoreAnchor(null);
                    }}
                >
                    Copy link
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        handleCopyBranch();
                        setMoreAnchor(null);
                    }}
                >
                    Copy git branch
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: c.border }} />
                <MenuItem
                    dense
                    onClick={() => {
                        onDeleteItem?.(task.id);
                        setMoreAnchor(null);
                        onClose();
                    }}
                    sx={{ color: "#ef4444" }}
                >
                    Delete work item
                </MenuItem>
            </Menu>

            {/* Emoji reactions popover */}
            <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            ...paperSx,
                            borderRadius: "20px",
                            p: 0.5,
                            display: "flex",
                            gap: 0.5,
                            minWidth: 0,
                        },
                    },
                }}
            >
                {["👍", "❤️", "🚀", "🎉", "👀", "🔥", "🙌"].map((em) => (
                    <Box
                        key={em}
                        onClick={() => handleAddReaction(em)}
                        sx={{
                            p: 0.4,
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "transform 0.1s ease",
                            "&:hover": { bgcolor: c.hover, transform: "scale(1.15)" },
                        }}
                    >
                        {em}
                    </Box>
                ))}
            </Popover>

            {/* Add link dialog */}
            <Dialog
                open={linkDialog}
                onClose={() => setLinkDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: c.card,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        borderRadius: "10px",
                        p: 2,
                        backgroundImage: "none",
                    },
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 1.5 }}>Add link</Typography>
                <TextField
                    size="small"
                    fullWidth
                    label="Title"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    sx={{ mb: 1.5 }}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="URL"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button size="small" onClick={() => setLinkDialog(false)} sx={{ color: c.muted, textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button size="small" variant="contained" onClick={handleAddLink} sx={{ textTransform: "none" }}>
                        Add
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}

/* ───────────── MAIN EXPORT: TaskDetailDrawer ───────────── */
export default function TaskDetailDrawer({
    task,
    open,
    onClose,
    peekMode = "side",
    setPeekMode,
    onUpdateItem,
    onDeleteItem,
    allItems = [],
    onSelectTask,
    c,
    isDark,
    user,
    notify,
    labelOptions,
    moduleOptions,
    cycleOptions,
    topOffset = 52,
    drawerWidth = { xs: "100%", sm: "92%", md: 920, lg: 1040, xl: 1180 },
}) {
    if (!open || !task) return null;

    const headerOffset = typeof topOffset === "number" ? `${topOffset}px` : topOffset;

    const content = (
        <TaskDetailContent
            key={task.id}
            task={task}
            onClose={onClose}
            peekMode={peekMode}
            setPeekMode={setPeekMode}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
            allItems={allItems}
            onSelectTask={onSelectTask}
            c={c}
            isDark={isDark}
            user={user}
            notify={notify}
            labelOptions={labelOptions}
            moduleOptions={moduleOptions}
            cycleOptions={cycleOptions}
        />
    );

    if (peekMode === "side") {
        return (
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                sx={{
                    zIndex: 1100,
                    top: headerOffset,
                    height: `calc(100vh - ${headerOffset})`,
                    "& .MuiBackdrop-root": {
                        top: headerOffset,
                        height: `calc(100vh - ${headerOffset})`,
                        backgroundColor: "transparent !important",
                        backdropFilter: "none !important",
                        WebkitBackdropFilter: "none !important",
                    },
                    "& .MuiDrawer-paper": {
                        top: `${headerOffset} !important`,
                        height: `calc(100vh - ${headerOffset}) !important`,
                        width: drawerWidth,
                        maxWidth: "100vw",
                        bgcolor: c.card,
                        color: c.text,
                        borderLeft: `1px solid ${c.border}`,
                        borderTop: `1px solid ${c.border}`,
                        backgroundImage: "none",
                        boxShadow: "none",
                    },
                }}
                slotProps={{
                    backdrop: {
                        sx: {
                            top: headerOffset,
                            height: `calc(100vh - ${headerOffset})`,
                            backgroundColor: "transparent !important",
                            backdropFilter: "none !important",
                            WebkitBackdropFilter: "none !important",
                        },
                    },
                    paper: {
                        sx: {
                            top: `${headerOffset} !important`,
                            height: `calc(100vh - ${headerOffset}) !important`,
                            width: drawerWidth,
                            maxWidth: "100vw",
                            bgcolor: c.card,
                            color: c.text,
                            borderLeft: `1px solid ${c.border}`,
                            borderTop: `1px solid ${c.border}`,
                            backgroundImage: "none",
                            boxShadow: "none",
                        },
                    },
                }}
            >
                {content}
            </Drawer>
        );
    }

    if (peekMode === "modal") {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: c.card,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                            borderRadius: "12px",
                            height: "85vh",
                            maxHeight: "85vh",
                            backgroundImage: "none",
                            boxShadow: "0 24px 48px rgba(0,0,0,0.65)",
                            overflow: "hidden",
                        },
                    },
                }}
            >
                {content}
            </Dialog>
        );
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            sx={{
                zIndex: 1100,
                top: headerOffset,
                height: `calc(100vh - ${headerOffset})`,
                "& .MuiBackdrop-root": {
                    top: headerOffset,
                    height: `calc(100vh - ${headerOffset})`,
                },
                "& .MuiDialog-paper": {
                    top: `${headerOffset} !important`,
                    height: `calc(100vh - ${headerOffset}) !important`,
                },
            }}
            slotProps={{
                paper: {
                    sx: {
                        top: `${headerOffset} !important`,
                        height: `calc(100vh - ${headerOffset}) !important`,
                        bgcolor: c.card,
                        color: c.text,
                        backgroundImage: "none",
                    },
                },
            }}
        >
            {content}
        </Dialog>
    );
}
