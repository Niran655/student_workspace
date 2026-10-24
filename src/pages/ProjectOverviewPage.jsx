import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Activity, ArrowUpRight, BookOpen, ChevronRight, CircleCheck, Clock3, FolderKanban, Info, PanelRightClose, PanelRightOpen, Settings, Zap } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import TaskDescriptionEditor from "../components/TaskDescriptionEditor";
import { useThemeContext } from "../Context/ThemeContext";

const activityItems = [
    { text: "Project overview created", time: "Just now", icon: BookOpen },
    { text: "Work items are ready to organize", time: "Today", icon: CircleCheck },
    { text: "Project workspace opened", time: "Today", icon: FolderKanban },
    { text: "TerraLink project created", time: "Earlier", icon: Clock3 },
];

const DEFAULT_OVERVIEW = `# 👋 Welcome to your first project

This is your Project Overview — the place where everything about your project comes together.

Use it to track progress, milestones, and key updates — and help your team stay aligned on what’s next.

---

## 🚀 What this project covers

This project helps you explore the core parts of your workspace:

- 🧩 Work items — tasks, tickets, or issues your team works on
- 🕒 Cycles — time-boxed sprints to get focused work done
- 📦 Modules — feature or goal-based groupings of work
- 📄 Pages — documentation and notes to support your work

> 💡 Tip: Start with work items, then group and schedule them as your project grows.

---

## 📦 Modules (Feature Groups)

Modules help you group related work by feature, goal, or focus area. Create a module when a set of work items belongs together.`;

const loadOverview = () => {
    try {
        const stored = localStorage.getItem("terralink-project-overview");
        if (!stored) return DEFAULT_OVERVIEW;
        const saved = JSON.parse(stored);
        if (typeof saved === "string") return saved;
        if (saved && typeof saved === "object") {
            const sections = saved.sections || [];
            return [
                `# ${saved.welcome || "👋 Welcome to your first project"}`,
                saved.intro || "",
                saved.purpose || "",
                "---",
                `## ${saved.coversTitle || "🚀 What this project covers"}`,
                saved.coversIntro || "",
                ...sections.map((section) => `- ${section.icon || ""} ${section.title} — ${section.description}`),
                `> ${saved.tip || "💡 Tip: Start with work items, then group and schedule them as your project grows."}`,
                "---",
                `## ${saved.modulesTitle || "📦 Modules (Feature Groups)"}`,
                saved.modulesBody || "",
            ].join("\n\n");
        }
        return DEFAULT_OVERVIEW;
    } catch {
        return localStorage.getItem("terralink-project-overview") || DEFAULT_OVERVIEW;
    }
};

export default function ProjectOverviewPage() {
    const { isDark } = useThemeContext();
    const [coverIndex, setCoverIndex] = useState(0);
    const [overview, setOverview] = useState(loadOverview);
    const [isActivitySidebarVisible, setIsActivitySidebarVisible] = useState(true);
    const [activeSidebarTab, setActiveSidebarTab] = useState(2);
    const palette = {
        bg: isDark ? "#121315" : "#ffffff",
        surface: isDark ? "#191a1d" : "#f8fafc",
        text: isDark ? "#f1f3f5" : "#111827",
        muted: isDark ? "#a0a4ad" : "#64748b",
        border: isDark ? "#292b30" : "#e2e8f0",
        accent: isDark ? "#58b9ef" : "#1479b8",
    };
    const covers = [
        `radial-gradient(ellipse at 20% 130%, transparent 0 26%, rgba(20,22,25,0.26) 26.2% 26.7%, transparent 27%), radial-gradient(ellipse at 70% -40%, transparent 0 38%, rgba(20,22,25,0.2) 38.2% 38.7%, transparent 39%), repeating-linear-gradient(174deg, transparent 0 24px, rgba(255,255,255,0.14) 25px, transparent 27px), linear-gradient(115deg, #c8c8c5, #777a7b 48%, #d8d7d2)`,
        "linear-gradient(120deg, #143249, #2b8fd1 55%, #85d2e7)",
        "linear-gradient(120deg, #33204a, #7752a8 55%, #d19abc)",
    ];

    const breadcrumb = (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
            <ChevronRight size={14} color={palette.muted} />
            <Typography noWrap sx={{ color: palette.text, fontSize: "0.8125rem", fontWeight: 600 }}>Overview</Typography>
        </Box>
    );

    return (
        <DashboardLayout
            pageTitle="TerraLink"
            pageIcon={Settings}
            titleExtra={breadcrumb}
            headerRight={(
                <IconButton
                    size="small"
                    aria-label={isActivitySidebarVisible ? "Hide activity sidebar" : "Show activity sidebar"}
                    title={isActivitySidebarVisible ? "Hide activity sidebar" : "Show activity sidebar"}
                    onClick={() => setIsActivitySidebarVisible((visible) => !visible)}
                    sx={{ color: palette.muted, borderRadius: "8px", bgcolor: palette.surface }}
                >
                    {isActivitySidebarVisible ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
                </IconButton>
            )}
        >
            <Box sx={{ display: "flex", flex: 1, minHeight: 0, bgcolor: palette.bg, color: palette.text }}>
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    <Box
                        sx={{
                            height: { xs: 120, md: 150 },
                            position: "relative",
                            overflow: "hidden",
                            backgroundColor: isDark ? "#777a7b" : "#d1d5d6",
                            backgroundImage: covers[coverIndex],
                        }}
                    >
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.24))" }} />
                        <Box
                            component="button"
                            sx={{
                                position: "absolute",
                                top: 16,
                                right: 18,
                                border: 0,
                                borderRadius: "6px",
                                px: 1.25,
                                py: 0.6,
                                bgcolor: "rgba(15,16,18,0.82)",
                                color: "#f4f4f5",
                                fontWeight: 600,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(15,16,18,0.96)" },
                            }}
                        onClick={() => setCoverIndex((index) => (index + 1) % covers.length)}
                        >
                            Change cover
                        </Box>
                    </Box>

                    <Box sx={{ px: { xs: 2.5, md: 5 }, pb: 5 }}>
                        <Box
                            sx={{
                                mt: -2.5,
                                width: 52,
                                height: 52,
                                display: "grid",
                                placeItems: "center",
                                position: "relative",
                                zIndex: 1,
                                borderRadius: "8px",
                                bgcolor: isDark ? "#202226" : "#fff",
                                boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Settings size={30} color={palette.muted} />
                        </Box>

                        <Typography sx={{ mt: 3.5, fontSize: "1.25rem", fontWeight: 700, color: palette.text }}>
                            TerraLink
                        </Typography>

                        <Box sx={{ maxWidth: 1000, mt: 2.5 }}>
                            <TaskDescriptionEditor
                                value={overview}
                                isDark={isDark}
                                onChange={(value) => {
                                    setOverview(value);
                                    localStorage.setItem("terralink-project-overview", JSON.stringify(value));
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {isActivitySidebarVisible && <Box
                    component="aside"
                    sx={{
                        width: 320,
                        flexShrink: 0,
                        display: { xs: "none", lg: "flex" },
                        flexDirection: "column",
                        borderLeft: `1px solid ${palette.border}`,
                        px: 2.25,
                        py: 2,
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    <Box sx={{ display: "flex", gap: 0.75, p: 0.5, borderRadius: "9px", bgcolor: palette.surface, mb: 3 }}>
                        {[
                            { Icon: Info, label: "Project states" },
                            { Icon: Zap, label: "Updates" },
                            { Icon: Activity, label: "Activity" },
                        ].map(({ Icon, label }, index) => (
                            <IconButton
                                key={label}
                                size="small"
                                aria-label={label}
                                aria-pressed={activeSidebarTab === index}
                                onClick={() => setActiveSidebarTab(index)}
                                sx={{ flex: 1, borderRadius: "7px", color: activeSidebarTab === index ? palette.text : palette.muted, bgcolor: activeSidebarTab === index ? palette.bg : "transparent" }}
                            >
                                <Icon size={17} />
                            </IconButton>
                        ))}
                    </Box>
                    {activeSidebarTab === 0 ? (
                        <Box sx={{ mt: 1 }}>
                            <Typography sx={{ color: palette.text, fontWeight: 700, fontSize: "1rem", mb: 1 }}>Enable project states</Typography>
                            <Typography sx={{ color: palette.muted, fontSize: "0.875rem", lineHeight: 1.6 }}>
                                Enable Project States to view and manage properties like state, priority, due dates and more.
                            </Typography>
                        </Box>
                    ) : activeSidebarTab === 1 ? (
                        <Box sx={{ mt: 1 }}>
                            <Typography sx={{ color: palette.text, fontWeight: 700, fontSize: "1rem", mb: 1 }}>Updates</Typography>
                            <Typography sx={{ color: palette.muted, fontSize: "0.875rem", lineHeight: 1.6 }}>
                                Feature is disabled, you can enable it in settings.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                <Typography sx={{ color: palette.accent, fontWeight: 700, fontSize: "1rem" }}>Activity</Typography>
                                <IconButton size="small" aria-label="Activity options" sx={{ color: palette.muted }}><ArrowUpRight size={16} /></IconButton>
                            </Box>
                            <Box sx={{ position: "relative", flex: 1, "&::before": { content: '""', position: "absolute", top: 12, bottom: 12, left: 14, width: "1px", bgcolor: palette.border } }}>
                                {activityItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Box key={item.text} sx={{ position: "relative", display: "flex", gap: 1.25, mb: 2.25 }}>
                                            <Box sx={{ width: 30, height: 30, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "8px", bgcolor: palette.surface, zIndex: 1 }}>
                                                <Icon size={14} color={palette.muted} />
                                            </Box>
                                            <Box sx={{ pt: 0.25 }}>
                                                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.4 }}>{item.text}</Typography>
                                                <Typography sx={{ mt: 0.25, fontSize: "0.75rem", color: palette.muted }}>{item.time}</Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    )}
                </Box>}
            </Box>

        </DashboardLayout>
    );
}
