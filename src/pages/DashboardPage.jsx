import { useState } from "react";
import { alpha, Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MessageSquareText,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Button, Card, CardContent, SearchField, Stack } from "../components/ui";

const activities = [
  {
    kind: "submission",
    label: "Assignment submitted",
    title: "Database Systems · Query Optimization",
    description: "You submitted your indexing strategy and benchmark results.",
    time: "18 min ago",
    initials: "ME",
    icon: FileCheck2,
    action: "View submission",
    path: "/courses",
  },
  {
    kind: "question",
    label: "Q&A activity",
    title: "How should we normalize this event schema?",
    description: "Mina replied to your question in Software Architecture.",
    time: "2 hours ago",
    initials: "MK",
    icon: MessageSquareText,
    action: "Read reply",
    path: "/discussions",
  },
  {
    kind: "review",
    label: "Peer review requested",
    title: "Thesis draft · Accessible learning tools",
    description: "Arun invited you to review chapter two before Friday.",
    time: "Yesterday",
    initials: "AP",
    icon: FileText,
    action: "Open request",
    path: "/research",
  },
];

const activityKinds = ["All activity", "Courses", "Research"];
const heatmapCells = Array.from({ length: 91 }, (_, index) => {
  const value = (index * 7 + Math.floor(index / 6) * 3 + 4) % 10;
  return value < 3 ? 0 : value < 5 ? 1 : value < 7 ? 2 : value < 9 ? 3 : 4;
});
const heatmapOpacity = [0, 0.14, 0.3, 0.52, 0.82];
const weekDays = ["Mon", "Wed", "Fri"];

function getTodayLabel() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export default function DashboardPage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark, primaryColor } = useThemeContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("my-plan");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All activity");
  const [mentorshipJoined, setMentorshipJoined] = useState(false);
  const [joinedRequests, setJoinedRequests] = useState([]);
  const [savedCapstones, setSavedCapstones] = useState([]);

  const displayName = user?.nameEn?.split(" ")[0] || "there";
  const query = searchQuery.trim().toLowerCase();
  const visibleActivities = activities.filter((activity) => {
    const matchesQuery = !query || `${activity.title} ${activity.description}`.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "All activity"
      || (activeFilter === "Courses" && activity.kind !== "review")
      || (activeFilter === "Research" && activity.kind === "review");
    return matchesQuery && matchesFilter;
  });

  const goTo = (path) => navigate(path);
  const toggleJoined = (request) => {
    setJoinedRequests((current) => current.includes(request)
      ? current.filter((item) => item !== request)
      : [...current, request]);
  };
  const toggleSaved = (name) => {
    setSavedCapstones((current) => current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]);
  };

  const dashboardContent = (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 62px)",
        px: { xs: 2, md: 3, xl: 5 },
        py: { xs: 3, md: 4 },
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) minmax(260px, 290px)",
            xl: "minmax(420px, 1fr) minmax(260px, 290px)",
          },
          gap: { xs: 2.5, lg: 3, xl: 4 },
          maxWidth: 1540,
          mx: "auto",
          alignItems: "start",
        }}
      >
        <Box component="section" aria-label="Academic activity feed" sx={{ minWidth: 0, gridColumn: { xs: "1", lg: "1", xl: "1" } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            gap={2}
            sx={{ mb: 2.5, width: "100%" }}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%" }} />
                <Typography variant="body2">{getTodayLabel()}</Typography>
              </Stack>
              <Typography variant="h3" sx={{ mt: 0.75 }}>
                Good morning, {displayName}.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Your learning community is moving. Here’s what’s happening.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={17} />}
              onClick={() => goTo("/projects")}
              sx={{ ml: { sm: "auto" }, alignSelf: { xs: "flex-end", sm: "center" } }}
            >
              Create
            </Button>
          </Stack>

          <Card component="section" aria-labelledby="contributions-heading" sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="flex-end" justifyContent="flex-start" spacing={2} sx={{ flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Your momentum</Typography>
                  <Typography id="contributions-heading" variant="h5">Academic activity</Typography>
                </Box>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Typography variant="h5">128</Typography>
                  <Typography variant="body2">contributions this year</Typography>
                  <ArrowUpRight size={16} />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Stack justifyContent="space-around" sx={{ color: "text.secondary" }} aria-hidden="true">
                  {weekDays.map((day) => <Typography key={day} variant="caption">{day}</Typography>)}
                </Stack>
                <Box
                  role="img"
                  aria-label="Contribution activity over the last 13 weeks"
                  sx={{
                    display: "grid",
                    flex: 1,
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(7, 11px)",
                    gridAutoColumns: "minmax(5px, 1fr)",
                    gap: 0.5,
                  }}
                >
                  {heatmapCells.map((level, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: level === 0 ? "action.hover" : alpha(primaryColor, heatmapOpacity[level]),
                        borderRadius: "2px",
                        "&:hover": { outline: "1px solid", outlineColor: "divider" },
                      }}
                    />
                  ))}
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.5} sx={{ mt: 1.25 }}>
                <Typography variant="caption">Less</Typography>
                {heatmapOpacity.map((opacity) => (
                  <Box key={opacity} sx={{ width: 10, height: 10, bgcolor: opacity ? alpha(primaryColor, opacity) : "action.hover", borderRadius: "2px" }} />
                ))}
                <Typography variant="caption">More</Typography>
              </Stack>
            </CardContent>
          </Card>

          <Box component="section" aria-labelledby="updates-heading">
            <Stack
              direction="row"
              alignItems="flex-end"
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 1.5, width: "100%", flexWrap: "wrap" }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">In your community</Typography>
                <Typography id="updates-heading" variant="h5">Recent updates</Typography>
              </Box>
              <Button variant="text" endIcon={<ChevronRight size={16} />} onClick={() => goTo("/notifications")}>
                View all
              </Button>
            </Stack>

            <Stack      direction="row"
              alignItems="flex-end"
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 1.5, width: "100%", flexWrap: "wrap" }}>
              <Stack direction="row" spacing={0.75} role="group" aria-label="Filter activity">
                {activityKinds.map((filter) => (
                  <Button
                    key={filter}
                    size="small"
                    variant={activeFilter === filter ? "contained" : "text"}
                    color={activeFilter === filter ? "secondary" : "inherit"}
                    aria-pressed={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </Stack>
              <SearchField
                size="small"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search activity"
                aria-label="Search activity"
                sx={{ width: { xs: "100%", sm: 220 } }}
              />
            </Stack>

            <Box>
              {visibleActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Box component="article" key={activity.kind}>
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={1.5} sx={{ py: 2 }}>
                      <Box sx={{ width: 38, height: 38, flex: "0 0 auto", display: "grid", placeItems: "center", bgcolor: "action.hover", color: "text.secondary", borderRadius: 1 }}>
                        <Icon size={19} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={600}>{activity.label}</Typography>
                          <Box sx={{ width: 3, height: 3, bgcolor: "text.disabled", borderRadius: "50%" }} />
                          <Typography variant="caption">{activity.time}</Typography>
                        </Stack>
                        <Typography variant="subtitle1" sx={{ mt: 0.25 }}>{activity.title}</Typography>
                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                          <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: "action.selected", color: "text.primary" }}>{activity.initials}</Avatar>
                          <Typography variant="body2">{activity.description}</Typography>
                        </Stack>
                      </Box>
                      <Button variant="text" size="small" endIcon={<ChevronRight size={15} />} onClick={() => goTo(activity.path)}>
                        {activity.action}
                      </Button>
                    </Stack>
                    {index < visibleActivities.length - 1 && <Divider />}
                  </Box>
                );
              })}
              {visibleActivities.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  No activity matches “{searchQuery}”. Try another search.
                </Typography>
              )}
            </Box>
            <Button variant="text" endIcon={<ArrowDownRight size={16} />} onClick={() => goTo("/notifications")} sx={{ display: "flex", mx: "auto", mt: 1 }}>
              Explore all activity
            </Button>
          </Box>
        </Box>

        <Box
          component="aside"
          aria-label="Community widgets"
          sx={{
            minWidth: 0,
            gridColumn: { xs: "1", lg: "2", xl: "2" },
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: { xs: 2, xl: 0 },
            alignItems: "start",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ gridColumn: { xs: "1", sm: "1 / -1", xl: "1" }, mb: 1 }}>
            <Typography variant="overline" color="text.secondary">Your next steps</Typography>
            <IconButton aria-label="Notifications" onClick={() => goTo("/notifications")} size="small">
              <Bell size={18} />
            </IconButton>
          </Stack>

          <Card component="section" sx={{ gridColumn: { xs: "1", sm: "1 / -1", xl: "1" }, borderTop: 2, borderTopColor: "warning.main" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Clock3 size={17} />
                <Typography variant="overline" color="text.secondary">Upcoming mentorship</Typography>
              </Stack>
              <Typography variant="h6" sx={{ mt: 1.5, color: "text.primary" }}>
                Research methods, without the overwhelm
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: "action.selected", color: "text.primary", fontSize: 11 }}>JL</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>Dr. Jordan Lee</Typography>
                  <Typography variant="caption">Faculty mentor · 1:1</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, py: 1.25, borderTop: 1, borderColor: "divider" }}>
                <Clock3 size={15} />
                <Typography variant="body2">Tomorrow, 10:30 AM</Typography>
                <Typography variant="caption" sx={{ ml: "auto" }}>Local</Typography>
              </Stack>
              <Button
                fullWidth
                variant={mentorshipJoined ? "contained" : "outlined"}
                color={mentorshipJoined ? "secondary" : "primary"}
                startIcon={mentorshipJoined ? <Check size={16} /> : undefined}
                endIcon={mentorshipJoined ? undefined : <ChevronRight size={16} />}
                onClick={() => setMentorshipJoined((joined) => !joined)}
              >
                {mentorshipJoined ? "Added to your schedule" : "View session"}
              </Button>
            </CardContent>
          </Card>

          <Box component="section" sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6">Open team requests</Typography>
              <IconButton aria-label="See all team requests" onClick={() => goTo("/find-teammates")} size="small"><ChevronRight size={17} /></IconButton>
            </Stack>
            {[
              { id: "air", title: "Campus air quality map", detail: "2 of 4 members · Research", icon: FlaskConical },
              { id: "study", title: "Study buddy matching", detail: "3 of 5 members · Product", icon: LayoutDashboard },
            ].map(({ id, title, detail, icon: Icon }) => {
              const isJoined = joinedRequests.includes(id);
              return (
                <Stack key={id} direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
                  <Box sx={{ width: 32, height: 32, flex: "0 0 auto", display: "grid", placeItems: "center", bgcolor: "action.hover", borderRadius: 1 }}>
                    <Icon size={17} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{title}</Typography>
                    <Typography variant="caption" noWrap>{detail}</Typography>
                  </Box>
                  <IconButton aria-label={isJoined ? `Leave ${title}` : `Join ${title}`} onClick={() => toggleJoined(id)} size="small">
                    {isJoined ? <Check size={16} /> : <Plus size={16} />}
                  </IconButton>
                </Stack>
              );
            })}
            <Button variant="text" size="small" endIcon={<ArrowUpRight size={15} />} onClick={() => goTo("/find-teammates")}>
              Browse all requests
            </Button>
          </Box>

          <Box component="section" sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1} sx={{ mb: 1 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Built by students</Typography>
                <Typography variant="h6">Trending capstones</Typography>
              </Box>
              <IconButton aria-label="See all capstones" onClick={() => goTo("/projects")} size="small"><ChevronRight size={17} /></IconButton>
            </Stack>
            {[
              { id: "quiet", rank: "01", title: "Quiet spaces, mapped", detail: "Design · 14 contributors", trend: "+32% this week" },
              { id: "lab", rank: "02", title: "Open-source lab notes", detail: "Engineering · 9 contributors", trend: "+18% this week" },
            ].map(({ id, rank, title, detail, trend }) => {
              const isSaved = savedCapstones.includes(id);
              return (
                <Stack key={id} direction="row" spacing={1} alignItems="flex-start" sx={{ py: 1, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="body2" color="text.secondary">{rank}</Typography>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{title}</Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.25 }}>{detail}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                      <ArrowUpRight size={13} />
                      <Typography variant="caption">{trend}</Typography>
                    </Stack>
                  </Box>
                  <IconButton aria-label={isSaved ? `Unsave ${title}` : `Save ${title}`} onClick={() => toggleSaved(id)} size="small">
                    {isSaved ? <Check size={16} /> : <Plus size={16} />}
                  </IconButton>
                </Stack>
              );
            })}
            <Button variant="text" size="small" endIcon={<ChevronRight size={15} />} onClick={() => goTo("/projects")}>
              Explore capstones
            </Button>
          </Box>

          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ gridColumn: { xs: "1", sm: "1 / -1", xl: "1" }, pt: 1 }}>
            <CircleHelp size={17} />
            <Box>
              <Typography variant="body2">Need a hand finding your way?</Typography>
              <Button variant="text" size="small" onClick={() => goTo("/ai-assistant")} sx={{ px: 0 }}>
                Ask UniForge
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
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
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {dashboardContent}
    </DashboardLayout>
  );
}