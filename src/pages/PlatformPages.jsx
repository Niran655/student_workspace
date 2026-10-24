import { useState } from "react";
import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  MessageSquareText,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Star,
  Target,
  Users,
  Wand2,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Button, Card, CardContent, Grid, Stack } from "../components/ui";

function PageLayout({ title, subtitle, defaultTab, actions, children }) {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");

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
      <Box sx={{ maxWidth: 1280, width: "100%", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: "-0.04em" }}>{title}</Typography>
            {subtitle ? (
              <Typography variant="body2" sx={{ mt: 0.8, color: isDark ? "#848d97" : "#636c76" }}>{subtitle}</Typography>
            ) : null}
          </Box>
          {actions ? <Stack direction="row" spacing={1.5}>{actions}</Stack> : null}
        </Stack>
        {children}
      </Box>
    </DashboardLayout>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone = "primary" }) {
  const { isDark } = useThemeContext();
  const toneMap = {
    primary: { bg: isDark ? "rgba(88,166,255,0.12)" : "rgba(9,105,218,0.08)", color: isDark ? "#58a6ff" : "#0969da" },
    success: { bg: isDark ? "rgba(46,160,67,0.12)" : "rgba(31,136,61,0.08)", color: isDark ? "#2ea043" : "#1f883d" },
    warning: { bg: isDark ? "rgba(240,171,0,0.12)" : "rgba(154,103,0,0.08)", color: isDark ? "#d29922" : "#9a6700" },
    accent: { bg: isDark ? "rgba(168,85,247,0.12)" : "rgba(147,51,234,0.08)", color: isDark ? "#c084fc" : "#9333ea" },
  };
  const palette = toneMap[tone] || toneMap.primary;

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? "#848d97" : "#636c76" }}>{label}</Typography>
            <Typography variant="h5" sx={{ mt: 0.8, fontWeight: 700 }}>{value}</Typography>
            {detail ? (
              <Typography variant="caption" sx={{ mt: 0.5, color: isDark ? "#848d97" : "#636c76" }}>{detail}</Typography>
            ) : null}
          </Box>
          <Box sx={{ width: 42, height: 42, borderRadius: 2, backgroundColor: palette.bg, color: palette.color, display: "grid", placeItems: "center" }}>
            <Icon size={18} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, label, action }) {
  const { isDark } = useThemeContext();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box sx={{ width: 28, height: 28, borderRadius: 1, backgroundColor: isDark ? "rgba(88,166,255,0.12)" : "rgba(9,105,218,0.08)", color: isDark ? "#58a6ff" : "#0969da", display: "grid", placeItems: "center" }}>
          <Icon size={15} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{label}</Typography>
      </Stack>
      {action || null}
    </Stack>
  );
}

export function MyPlanPage() {
  const planStats = [
    { label: "Tasks today", value: "08", detail: "3 high priority", icon: Target, tone: "warning" },
    { label: "Study hours", value: "13.5h", detail: "+2.1h vs last week", icon: BookOpen, tone: "primary" },
    { label: "Assignments due", value: "04", detail: "2 in 48 hours", icon: FileText, tone: "accent" },
    { label: "Goals complete", value: "72%", detail: "12 milestones hit", icon: CheckCircle2, tone: "success" },
  ];

  const taskRows = [
    { title: "Finish database ERD", course: "Database Systems", priority: "High", due: "Today, 3:30 PM", status: "In progress" },
    { title: "Prepare React lab demo", course: "UI Engineering", priority: "Medium", due: "Tomorrow, 10:00 AM", status: "Planned" },
    { title: "Submit AI project brief", course: "AI Studio", priority: "High", due: "Thu, 5:00 PM", status: "Pending" },
    { title: "Review cybersecurity notes", course: "Network Security", priority: "Low", due: "Fri, 9:00 AM", status: "Backlog" },
  ];

  return (
    <PageLayout title="My Plan" subtitle="Track assignments, study blocks, team work, and deadlines across your semester." defaultTab="my-plan" actions={<Button variant="contained" endIcon={<ArrowRight size={16} />}>Add task</Button>}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {planStats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <MetricCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Target} label="Today’s plan" action={<Button size="small">View all tasks</Button>} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Task</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Due</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taskRows.map((row) => (
                      <TableRow key={row.title}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                        <TableCell>{row.course}</TableCell>
                        <TableCell>
                          <Chip label={row.priority} size="small" color={row.priority === "High" ? "warning" : row.priority === "Medium" ? "info" : "default"} />
                        </TableCell>
                        <TableCell>{row.due}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Sparkles} label="Study focus" />
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.8 }}>Deep work block</Typography>
                  <Typography variant="h6">2:00 PM – 3:30 PM</Typography>
                  <Typography variant="body2">Database modeling + query optimization</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.8 }}>Pomodoro streak</Typography>
                  <Typography variant="h6">6 consecutive sessions</Typography>
                  <Typography variant="body2">Total focus today: 3h 20m</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export function CalendarPage() {
  const events = [
    { title: "Database lab", type: "Class", day: "Mon", time: "09:00" },
    { title: "AI team review", type: "Meeting", day: "Tue", time: "14:00" },
    { title: "Web app milestone", type: "Project", day: "Wed", time: "16:00" },
    { title: "Exam preparation", type: "Study", day: "Fri", time: "18:00" },
  ];

  return (
    <PageLayout title="Calendar" subtitle="Academic schedule, project milestones, and team meetings in one place." defaultTab="calendar" actions={<Button variant="contained">Create event</Button>}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={CalendarDays} label="This week" />
              <Grid container spacing={2}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="body2" sx={{ color: "#848d97" }}>Mon</Typography>
                        <Typography variant="h5" sx={{ my: 1, fontWeight: 700 }}>{index + 8}</Typography>
                        <Stack spacing={1}>
                          <Chip label={index % 2 === 0 ? "Class" : "Review"} size="small" color={index % 2 === 0 ? "primary" : "secondary"} />
                          <Typography variant="caption">Project milestone</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Bell} label="Upcoming" />
              <Stack spacing={2}>
                {events.map((event) => (
                  <Box key={event.title} sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                      <Chip label={event.type} size="small" color={event.type === "Meeting" ? "success" : "info"} />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.8 }}>{event.day} · {event.time}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export function CoursesPage() {
  const courses = [
    { title: "React Foundations", code: "CS-401", progress: 64, status: "In progress" },
    { title: "Database Systems", code: "DB-210", progress: 82, status: "On track" },
    { title: "Network Security", code: "CY-322", progress: 41, status: "Needs review" },
    { title: "Cloud Infrastructure", code: "CC-115", progress: 53, status: "In progress" },
  ];

  return (
    <PageLayout title="Courses" subtitle="Course overview, deadlines, learning outcomes, and connected project work." defaultTab="course" actions={<Button variant="contained">Add course</Button>}>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} key={course.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{course.title}</Typography>
                  <Chip label={course.status} size="small" color="primary" />
                </Stack>
                <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>{course.code}</Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Course progress</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{course.progress}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={course.progress} />
                  <Typography variant="body2">Upcoming deadline: 12 Oct</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function ProjectsPage() {
  const projects = [
    { name: "UniForge Dashboard", status: "In review", progress: 78, team: "5 members", due: "18 Oct" },
    { name: "Smart Study Planner", status: "In progress", progress: 62, team: "3 members", due: "12 Nov" },
    { name: "AI Research Assistant", status: "Planning", progress: 41, team: "4 members", due: "02 Dec" },
  ];

  return (
    <PageLayout title="Projects" subtitle="Build real software, organize milestones, and connect evidence to your portfolio." defaultTab="project" actions={<Button variant="contained">New project</Button>}>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} xl={4} key={project.name}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{project.name}</Typography>
                  <Chip label={project.status} size="small" color="success" />
                </Stack>
                <Typography variant="body2" sx={{ mb: 2 }}>{project.team}</Typography>
                <LinearProgress variant="determinate" value={project.progress} sx={{ mb: 2 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{project.progress}%</Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>Next milestone: {project.due}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function TeamsPage() {
  const teams = [
    { name: "CyberNetwork Lab", members: 6, focus: "Research and network security" },
    { name: "Frontend Guild", members: 4, focus: "UX research and design systems" },
    { name: "AI Builders", members: 5, focus: "ML feature experimentation" },
  ];

  return (
    <PageLayout title="Teams" subtitle="Collaborate with project teammates, assign work, and track contribution." defaultTab="team" actions={<Button variant="contained">Create team</Button>}>
      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={4} key={team.name}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{team.name}</Typography>
                  <Users size={18} />
                </Stack>
                <Typography variant="body2" sx={{ mb: 2 }}>{team.focus}</Typography>
                <Chip label={`${team.members} members`} size="small" color="info" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function DocumentsPage() {
  const documents = [
    { name: "SWD-Project-Plan.pdf", type: "PDF", updated: "Today" },
    { name: "Research-Notes.md", type: "Markdown", updated: "Yesterday" },
    { name: "Team-Meeting-Agenda.docx", type: "DOCX", updated: "2 days ago" },
  ];

  return (
    <PageLayout title="Documents" subtitle="Organize project files, course materials, and shared notes from one workspace." defaultTab="document" actions={<Button variant="contained">Upload file</Button>}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={FolderOpen} label="Recent files" />
              <List>
                {documents.map((doc) => (
                  <ListItem key={doc.name} divider sx={{ px: 0 }}>
                    <ListItemText primary={doc.name} secondary={`${doc.type} • Updated ${doc.updated}`} />
                    <Button size="small">Open</Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={FileText} label="Storage" />
              <Typography variant="h4" sx={{ mb: 1 }}>7.4 GB</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>of 20 GB used</Typography>
              <LinearProgress variant="determinate" value={36} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export function NotesPage() {
  const notes = [
    { title: "Database normalization", topic: "Core concepts" },
    { title: "Research interview themes", topic: "UX study" },
    { title: "AI experiment log", topic: "Machine learning" },
  ];

  return (
    <PageLayout title="Notes" subtitle="Capture learning reflections, ideas, and technical knowledge as they happen." defaultTab="notes" actions={<Button variant="contained">New note</Button>}>
      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} md={4} key={note.title}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{note.title}</Typography>
                <Chip label={note.topic} size="small" sx={{ mb: 2 }} />
                <Typography variant="body2">Summarize key takeaways, references, and linked resources from this topic.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function ResearchPage() {
  const milestones = [
    { title: "Literature review", date: "12 Oct" },
    { title: "Prototype evaluation", date: "24 Oct" },
    { title: "Final report", date: "06 Nov" },
  ];

  return (
    <PageLayout title="Research" subtitle="Organize questions, evidence, references, and writing progress for academic work." defaultTab="research" actions={<Button variant="contained">New project</Button>}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Search} label="Current research" />
              <Typography variant="h5" sx={{ mb: 1 }}>AI-assisted learning in CS education</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Research question: How do student study patterns change when AI tools support learning workflows?</Typography>
              <LinearProgress variant="determinate" value={68} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Target} label="Milestones" />
              <Stack spacing={2}>
                {milestones.map((item) => (
                  <Box key={item.title} sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    <Typography variant="body2">{item.date}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export function AIAssistantPage() {
  const prompts = [
    "Explain the difference between SQL joins and query optimization.",
    "Break this assignment into a realistic study plan.",
    "Review this technical draft for clarity and structure.",
  ];

  return (
    <PageLayout title="AI Assistant" subtitle="Use contextual help for assignments, coding, learning, and project planning." defaultTab="ai-assistant" actions={<Button variant="contained">New conversation</Button>}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={Wand2} label="Context-aware guidance" />
              <Typography variant="body1" sx={{ mb: 2 }}>
                “Summarize the key concepts in my database assignment and give me a 3-step study plan for the next 48 hours.”
              </Typography>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.2)" }}>
                <Typography variant="body2">AI response would explain the assignment, identify learning objectives, and turn them into a structured plan while keeping claims grounded in the available course materials.</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle icon={MessageSquareText} label="Suggested prompts" />
              <Stack spacing={1.5}>
                {prompts.map((prompt) => (
                  <Button key={prompt} variant="outlined" sx={{ justifyContent: "flex-start", textTransform: "none", whiteSpace: "normal" }}>{prompt}</Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export function SkillMapPage() {
  const skills = [
    { name: "Frontend Development", level: 82 },
    { name: "Backend APIs", level: 74 },
    { name: "Database Design", level: 68 },
    { name: "Cybersecurity", level: 54 },
  ];

  return (
    <PageLayout title="Skill Map" subtitle="Track technical and professional growth with evidence-based skill assessment." defaultTab="skill-map" actions={<Button variant="contained">Add evidence</Button>}>
      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid item xs={12} md={6} key={skill.name}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{skill.name}</Typography>
                  <Typography variant="body2">{skill.level}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={skill.level} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function CareerPathPage() {
  const goals = [
    { title: "Frontend Developer", progress: 76 },
    { title: "Product-minded Engineer", progress: 61 },
  ];

  return (
    <PageLayout title="Career Path" subtitle="Connect study, projects, evidence, and portfolio work to your career goals." defaultTab="career" actions={<Button variant="contained">Set goal</Button>}>
      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} key={goal.title}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{goal.title}</Typography>
                  <Briefcase size={18} />
                </Stack>
                <LinearProgress variant="determinate" value={goal.progress} sx={{ mb: 2 }} />
                <Typography variant="body2">Career readiness: {goal.progress}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export { default as PortfolioPage } from "./PortfolioPage";

export function SettingsPage() {
  const settings = [
    "Language and date format",
    "Theme and sidebar preferences",
    "Academic profile and goals",
    "Privacy and account security",
  ];

  return (
    <PageLayout title="Settings" subtitle="Adjust preferences, privacy, profile details, and platform integrations." defaultTab="settings" actions={<Button variant="contained">Save changes</Button>}>
      <Grid container spacing={3}>
        {settings.map((item) => (
          <Grid item xs={12} md={6} key={item}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item}</Typography>
                  <Settings size={18} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function ProfilePage() {
  return (
    <PageLayout title="Profile" subtitle="Manage academic identity, interests, achievements, and public portfolio details." defaultTab="profile" actions={<Button variant="contained">Edit profile</Button>}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Student overview</Typography>
          <Typography variant="body2">University: Royal University of Phnom Penh</Typography>
          <Typography variant="body2">Faculty: Computer Science</Typography>
          <Typography variant="body2">Career goal: Full-stack developer</Typography>
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export function NotificationsPage() {
  const alerts = [
    "AI project brief due in 2 hours",
    "New team comment on your database task",
    "Course announcement: Network Security seminar",
  ];

  return (
    <PageLayout title="Notifications" subtitle="Keep track of deadlines, updates, team messages, and reminders." defaultTab="notifications" actions={<Button variant="contained">Mark all read</Button>}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {alerts.map((alert) => (
              <Box key={alert} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="body1">{alert}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export function FindTeammatesPage() {
  const matches = [
    { name: "Vannak S." },
    { name: "Mina R." },
    { name: "Sophea T." },
  ];

  return (
    <PageLayout title="Find Teammates" subtitle="Discover collaborators based on skills, interests, and available project roles." defaultTab="find-teammates" actions={<Button variant="contained">Create opportunity</Button>}>
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} md={4} key={match.name}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{match.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Frontend • Design • React</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function EventsPage() {
  const events = [
    { title: "Hackathon Bootcamp", date: "14 Oct" },
    { title: "Cloud Careers Fair", date: "22 Oct" },
    { title: "Research Seminar", date: "30 Oct" },
  ];

  return (
    <PageLayout title="Events" subtitle="Discover university events, workshops, competitions, and career opportunities." defaultTab="events" actions={<Button variant="contained">Browse events</Button>}>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={4} key={event.title}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{event.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export function DiscussionsPage() {
  return (
    <PageLayout title="Discussions" subtitle="Ask questions, share knowledge, and build community around learning and projects." defaultTab="discussions" actions={<Button variant="contained">New post</Button>}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body1">Trending topics: React state patterns, AI ethics, cybersecurity labs, portfolio feedback.</Typography>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
