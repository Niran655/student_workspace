import { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Popover,
    Button,
} from "@mui/material";
import {
    StickyNote,
    Search,
    Plus,
    Bold,
    Italic,
    List,
    Smile,
    Palette,
    Trash2,
    CheckSquare,
    Square,
    X,
} from "lucide-react";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import DashboardLayout from "../components/Layout/DashboardLayout";

/* ── Sticky card colors palette (first one is the default blank gray) ── */
const STICKY_COLORS = [
    { label: "Gray", bg: "#434447", text: "#e4e4e7" },
    { label: "Brown", bg: "#5a3f2d", text: "#f5e6d3" },
    { label: "Forest", bg: "#1e4d3a", text: "#d1f0e0" },
    { label: "Navy", bg: "#1a2b4a", text: "#ccd9f5" },
    { label: "Purple", bg: "#3a1e5c", text: "#e8d4f5" },
    { label: "Olive", bg: "#3a3a1a", text: "#f0f0c8" },
    { label: "Slate", bg: "#2a3545", text: "#cdd6e8" },
    { label: "Ruby", bg: "#5c1e2a", text: "#f5d0d8" },
    { label: "Teal", bg: "#1a3d3d", text: "#c8efef" },
];

const EMOJIS = ["😀", "😂", "😍", "🥳", "😎", "🤔", "👍", "❤️", "🔥", "⭐", "✅", "📌", "💡", "🎯", "📝", "🚀"];

/* ── Initial demo stickies ── */
const DEMO_STICKIES = [
    { id: 1, title: "Good to see you", done: false, color: STICKY_COLORS[1], checks: [{ text: "", done: false }], bold: false, italic: false },
    { id: 2, title: "Good", done: false, color: STICKY_COLORS[2], checks: [], bold: false, italic: false },
];

const newSticky = () => ({
    id: Date.now(),
    title: "",
    done: false,
    color: STICKY_COLORS[0],
    checks: [],
    bold: false,
    italic: false,
});

/* ── Editable text line (contentEditable with placeholder) ── */
function EditableLine({ value, onCommit, placeholder, sx, inputRef }) {
    return (
        <Typography
            ref={inputRef}
            component="div"
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            onBlur={(e) => onCommit(e.currentTarget.textContent)}
            sx={{
                outline: "none",
                lineHeight: 1.45,
                flex: 1,
                wordBreak: "break-word",
                minHeight: "1.45em",
                "&:empty::before": {
                    content: "attr(data-placeholder)",
                    opacity: 0.55,
                    pointerEvents: "none",
                },
                ...sx,
            }}
        >
            {value}
        </Typography>
    );
}

/* ── A single sticky note card ── */
function StickyCard({ sticky, autoFocus, onUpdate, onDelete }) {
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [colorAnchor, setColorAnchor] = useState(null);
    const titleRef = useRef(null);
    const colorObj = sticky.color;
    const hasList = Boolean(sticky.title) || sticky.checks.length > 0;

    useEffect(() => {
        if (autoFocus) titleRef.current?.focus();
    }, [autoFocus]);

    const textSx = {
        fontSize: "0.9375rem",
        fontWeight: sticky.bold ? 700 : 500,
        fontStyle: sticky.italic ? "italic" : "normal",
        color: colorObj.text,
    };

    const updateCheck = (idx, patch) =>
        onUpdate({ ...sticky, checks: sticky.checks.map((c, i) => (i === idx ? { ...c, ...patch } : c)) });

    const addCheck = () => onUpdate({ ...sticky, checks: [...sticky.checks, { text: "", done: false }] });

    const iconBtnSx = (active = false) => ({
        color: colorObj.text,
        opacity: active ? 1 : 0.7,
        p: 0.5,
        borderRadius: "4px",
        bgcolor: active ? "rgba(255,255,255,0.15)" : "transparent",
        "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.1)" },
    });

    const checkIcon = (done, onClick) => {
        const Icon = done ? CheckSquare : Square;
        return (
            <Box onClick={onClick} sx={{ cursor: "pointer", display: "flex", mt: "3px", flexShrink: 0 }}>
                <Icon size={18} color={colorObj.text} style={{ opacity: done ? 0.95 : 0.85 }} />
            </Box>
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                minHeight: 300,
                borderRadius: "8px",
                bgcolor: colorObj.bg,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "background-color 0.2s ease",
                "&:hover .sticky-toolbar": { opacity: 1 },
            }}
        >
            {/* Body */}
            <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                    {hasList && checkIcon(sticky.done, () => onUpdate({ ...sticky, done: !sticky.done }))}
                    <EditableLine
                        inputRef={titleRef}
                        value={sticky.title}
                        placeholder="Click to type here"
                        onCommit={(v) => onUpdate({ ...sticky, title: v })}
                        sx={{
                            ...textSx,
                            fontSize: sticky.title || hasList ? "0.9375rem" : "1.0625rem",
                            textDecoration: sticky.done ? "line-through" : "none",
                        }}
                    />
                </Box>

                {sticky.checks.map((c, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                        {checkIcon(c.done, () => updateCheck(idx, { done: !c.done }))}
                        <EditableLine
                            value={c.text}
                            placeholder=""
                            onCommit={(v) => updateCheck(idx, { text: v })}
                            sx={{ ...textSx, textDecoration: c.done ? "line-through" : "none" }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Toolbar */}
            <Box
                className="sticky-toolbar"
                sx={{
                    px: 1.25,
                    py: 0.75,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "rgba(0,0,0,0.15)",
                    opacity: 0.85,
                    transition: "opacity 0.15s ease",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                    <Tooltip title="Emoji">
                        <IconButton size="small" onClick={(e) => setEmojiAnchor(e.currentTarget)} sx={iconBtnSx()}>
                            <Smile size={14} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Bold">
                        <IconButton size="small" onClick={() => onUpdate({ ...sticky, bold: !sticky.bold })} sx={iconBtnSx(sticky.bold)}>
                            <Bold size={13} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                        <IconButton size="small" onClick={() => onUpdate({ ...sticky, italic: !sticky.italic })} sx={iconBtnSx(sticky.italic)}>
                            <Italic size={13} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add checklist">
                        <IconButton size="small" onClick={addCheck} sx={iconBtnSx()}>
                            <List size={14} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Color">
                        <IconButton size="small" onClick={(e) => setColorAnchor(e.currentTarget)} sx={iconBtnSx()}>
                            <Palette size={14} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(sticky.id)}
                        sx={{ ...iconBtnSx(), opacity: 0.6, "&:hover": { opacity: 1, color: "#ff6b6b", bgcolor: "rgba(255,107,107,0.12)" } }}
                    >
                        <Trash2 size={14} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Emoji popover */}
            <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: { bgcolor: "#1c1e26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", p: 1, display: "flex", flexWrap: "wrap", gap: 0.5, width: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", backgroundImage: "none" },
                    },
                }}
            >
                {EMOJIS.map((em) => (
                    <Box
                        key={em}
                        onClick={() => {
                            onUpdate({ ...sticky, title: sticky.title + em });
                            setEmojiAnchor(null);
                        }}
                        sx={{ fontSize: "1.1rem", cursor: "pointer", p: 0.5, borderRadius: "6px", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                    >
                        {em}
                    </Box>
                ))}
            </Popover>

            {/* Color popover */}
            <Popover
                open={Boolean(colorAnchor)}
                anchorEl={colorAnchor}
                onClose={() => setColorAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: { bgcolor: "#1c1e26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", p: 1.25, display: "flex", flexWrap: "wrap", gap: 0.75, width: 168, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", backgroundImage: "none" },
                    },
                }}
            >
                {STICKY_COLORS.map((col) => (
                    <Box
                        key={col.label}
                        onClick={() => {
                            onUpdate({ ...sticky, color: col });
                            setColorAnchor(null);
                        }}
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "6px",
                            bgcolor: col.bg,
                            cursor: "pointer",
                            border: colorObj.label === col.label ? "2px solid #fff" : "2px solid transparent",
                            "&:hover": { opacity: 0.85 },
                        }}
                    />
                ))}
            </Popover>
        </Box>
    );
}

/* ── Main page ── */
export default function StickiesPage() {
    const { isDark } = useThemeContext();
    const { user } = useAuth();

    const [stickies, setStickies] = useState(DEMO_STICKIES);
    const [focusId, setFocusId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (showSearch) searchRef.current?.focus();
    }, [showSearch]);

    const filtered = stickies.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
            s.title.toLowerCase().includes(q) ||
            s.checks.some((c) => c.text.toLowerCase().includes(q))
        );
    });

    const handleUpdate = (updated) =>
        setStickies((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

    const handleDelete = (id) =>
        setStickies((prev) => prev.filter((s) => s.id !== id));

    // New sticky is created blank and focused, newest first
    const handleAddNew = () => {
        const s = newSticky();
        setStickies((prev) => [s, ...prev]);
        setFocusId(s.id);
    };

    /* Header content — rendered by DashboardLayout next to the page title,
       so the page no longer draws its own "Stickies" title bar. */
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
                {stickies.length}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {showSearch ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
                            borderRadius: "8px",
                            px: 1.25,
                            py: 0.5,
                        }}
                    >
                        <Search size={13} color={isDark ? "#888" : "#666"} />
                        <input
                            ref={searchRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search stickies…"
                            style={{ background: "none", border: "none", outline: "none", color: isDark ? "#e4e4e4" : "#1a1a1a", fontSize: "0.8125rem", width: 160 }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => {
                                setShowSearch(false);
                                setSearchQuery("");
                            }}
                            sx={{ p: 0.25, color: isDark ? "#666" : "#999", "&:hover": { color: isDark ? "#fff" : "#000" } }}
                        >
                            <X size={12} />
                        </IconButton>
                    </Box>
                ) : (
                    <Tooltip title="Search">
                        <IconButton
                            size="small"
                            onClick={() => setShowSearch(true)}
                            sx={{ color: isDark ? "#aaa" : "#666", p: 0.75, "&:hover": { color: isDark ? "#fff" : "#000", bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" } }}
                        >
                            <Search size={16} />
                        </IconButton>
                    </Tooltip>
                )}

                <Button
                    variant="outlined"
                    onClick={handleAddNew}
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
                    Add sticky
                </Button>
            </Box>
        </Box>
    );

    return (
        <DashboardLayout titleExtra={titleExtra}>
            <Box sx={{ minHeight: "100%", bgcolor: isDark ? "#0d0e12" : "#f4f5f7", display: "flex", flexDirection: "column" }}>
                {/* Board */}
                <Box
                    sx={{
                        flex: 1,
                        p: 3,
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            md: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(4, minmax(0, 1fr))",
                        },
                        gap: 2.5,
                        alignContent: "flex-start",
                    }}
                >
                    {filtered.length === 0 ? (
                        <Box sx={{ gridColumn: "1 / -1", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pt: 12, gap: 2 }}>
                            <StickyNote size={40} color={isDark ? "#333" : "#ccc"} />
                            <Typography sx={{ color: isDark ? "#444" : "#bbb", fontSize: "0.9rem" }}>
                                {searchQuery ? "No stickies match your search" : "No stickies yet — click \"Add sticky\" to start!"}
                            </Typography>
                        </Box>
                    ) : (
                        filtered.map((s) => (
                            <StickyCard
                                key={s.id}
                                sticky={s}
                                autoFocus={s.id === focusId}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </Box>
            </Box>
        </DashboardLayout>
    );
}
