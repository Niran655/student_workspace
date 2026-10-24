import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Flame,
  Network,
  Palette,
  Shield,
  Terminal,
  Clock3,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Button, Card, CardContent, Grid, SearchField, Stack } from "../components/ui";
import courses from "../data/courses";

const categories = ["All", "Programming", "Computer Science", "Database", "Networking", "Cybersecurity", "Cloud & DevOps", "Design", "IT Tools"];
const categoryIcons = {
  All: BookOpen,
  Programming: Code2,
  "Computer Science": BrainCircuit,
  Database,
  Networking: Network,
  Cybersecurity: Shield,
  "Cloud & DevOps": Cloud,
  Design: Palette,
  "IT Tools": Terminal,
};

export default function LearningHubPage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("learning-hub");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visibleCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = category === "All"
        || course.category === category
        || (category === "Computer Science" && ["Programming", "Database", "Networking"].includes(course.category))
        || (category === "Cybersecurity" && course.title === "Network Essentials")
        || (category === "Cloud & DevOps" && course.title === "Node.js & Express")
        || (category === "IT Tools" && ["Node.js & Express", "Network Essentials"].includes(course.title));
      const matchesSearch = !query || `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, searchQuery]);

  const content = (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack spacing={2}>
          

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Box
                  component="nav"
                  aria-label="Course categories"
                  sx={{
                    borderRight: { xs: "none", sm: 1 },
                    borderBottom: { xs: 1, sm: "none" },
                    borderColor: "divider",
                    pr: { sm: 1.5 },
                    pb: { xs: 1, sm: 0 },
                  }}
                >
                  <Stack spacing={0.5}>
                    {categories.map((item) => {
                      const Icon = categoryIcons[item];
                      const isSelected = category === item;
                      return (
                        <Button
                          key={item}
                          fullWidth
                          startIcon={<Icon size={18} />}
                          onClick={() => setCategory(item)}
                          aria-current={isSelected ? "page" : undefined}
                          sx={{
                            justifyContent: "flex-start",
                            minHeight: 42,
                            px: 1.25,
                            borderLeft: 3,
                            borderColor: isSelected ? "primary.main" : "transparent",
                            borderRadius: 1,
                            color: "text.primary",
                            fontWeight: isSelected ? 600 : 400,
                            textTransform: "none",
                            backgroundColor: isSelected ? "action.selected" : "transparent",
                            "&:hover": { backgroundColor: "action.hover" },
                            "& .MuiButton-startIcon": { color: "text.secondary" },
                          }}
                        >
                          {item}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 10 }}>
                <Stack spacing={2}>
                  <SearchField
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search courses"
                  />

                  <Box component="section">
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Box>
                        <Typography variant="h5"><Flame size={18} /> Featured Courses</Typography>
                        <Typography variant="body2">Most popular and recommended for IT students</Typography>
                      </Box>
                      <Button onClick={() => { setCategory("All"); setSearchQuery(""); }} endIcon={<ArrowRight size={16} />}>View All</Button>
                    </Stack>
                    {visibleCourses.length ? (
                      <Grid container spacing={2}>
                        {visibleCourses.slice(0, 4).map((course) => {
                          const Icon = course.icon;
                          return (
                            <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={course.title}>
                              <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                  <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Icon size={32} />
                                      <Chip size="small" label={course.level} />
                                    </Stack>
                                    <Typography variant="subtitle1">{course.title}</Typography>
                                    <Typography variant="body1">{course.description}</Typography>
                                    <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                                      <Typography variant="body2"><Clock3 size={16} /> {course.duration}</Typography>
                                      <Typography variant="body2"><BookOpen size={16} /> {course.lessons} lessons</Typography>
                                    </Stack>
                                    <Typography variant="body2">Rating: {course.rating}</Typography>
                                    <LinearProgress variant="determinate" value={course.progress} />
                                    <Typography variant="body2">{course.progress ? `${course.progress}% completed` : "Not started"}</Typography>
                                    <Button variant="contained" onClick={() => navigate(`/learning/${course.id}`)}>
                                      {course.progress ? "Continue Learning" : "Start Course"}
                                    </Button>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Typography variant="body1">No courses match this search. Try a different category or keyword.</Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>

          </Stack>
        </Grid>

      </Grid>

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
      {content}
    </DashboardLayout>
  );
}
