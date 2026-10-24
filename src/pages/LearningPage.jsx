import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { ArrowDown, BookOpen, Clock3, GraduationCap, Star } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Button, Grid, Stack } from "../components/ui";
import courses from "../data/courses";

export default function LearningPage() {
  const { lessonId } = useParams();
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const [currentTab, setCurrentTab] = useState("learning-hub");
  const [searchQuery, setSearchQuery] = useState("");
  const course = courses.find((item) => item.id === lessonId);

  if (!course) return <Navigate to="/learning-hub" replace />;

  const CourseIcon = course.icon;
  const pageColor = isDark ? "#0d1117" : "#ffffff";
  const borderColor = isDark ? "#30363d" : "#d0d7de";

  const content = (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 }, maxWidth: 1600, mx: "auto" }}>
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
          pb: 3,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              border: `1px solid ${borderColor}`,
              borderRadius: 1,
              backgroundColor: isDark ? "#161b22" : "#f6f8fa",
              color: isDark ? "#79c0ff" : "#0969da",
            }}
          >
            <CourseIcon size={60} strokeWidth={1.6} />
          </Box>
          <Stack spacing={1.25}>
            <Typography variant="h3" sx={{ fontSize: { xs: "1.8rem", sm: "2.1rem" }, fontWeight: 600 }}>
              {course.title}
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 900, color: "text.secondary" }}>
              {course.description}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Stack direction="row" spacing={0.75} alignItems="center"><BookOpen size={17} /><Typography variant="body2">{course.lessons} lessons</Typography></Stack>
              <Stack direction="row" spacing={0.75} alignItems="center"><Clock3 size={17} /><Typography variant="body2">{course.duration}</Typography></Stack>
              <Stack direction="row" spacing={0.75} alignItems="center"><GraduationCap size={17} /><Typography variant="body2">{course.level}</Typography></Stack>
              <Stack direction="row" spacing={0.75} alignItems="center"><Star size={17} /><Typography variant="body2">{course.rating}</Typography></Stack>
            </Stack>
          </Stack>
        </Stack>
        <Button
          variant="outlined"
          endIcon={<ArrowDown size={16} />}
          onClick={() => document.getElementById("course-overview")?.scrollIntoView({ behavior: "smooth" })}
          sx={{ flexShrink: 0, display: { xs: "none", md: "inline-flex" } }}
        >
          Course overview
        </Button>
      </Box>

      <Grid container spacing={{ xs: 3, md: 5 }} sx={{ pt: 4 }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            component="article"
            id="course-overview"
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: 1,
              p: { xs: 2, md: 3.5 },
              backgroundColor: pageColor,
            }}
          >
            <Typography variant="caption" sx={{ display: "block", mb: 2, color: "text.secondary" }}>
              COURSE.md
            </Typography>
            <Typography variant="h4" sx={{ pb: 1, mb: 2, borderBottom: `1px solid ${borderColor}`, fontWeight: 600 }}>
              {course.title} - Learning Guide
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
              {course.description} This course includes {course.lessons} lessons designed for {course.level.toLowerCase()} learners.
            </Typography>

            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>Overview</Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              Explore the core ideas behind {course.title}, follow a structured learning sequence, and track your progress as you develop practical skills in {course.category.toLowerCase()}.
            </Typography>

            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>Your progress</Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Course completion</Typography>
                <Typography variant="body2">{course.progress}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={course.progress} />
            </Stack>

            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>Course details</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip label={course.category} variant="outlined" />
              <Chip label={course.level} variant="outlined" />
              <Chip label={`${course.lessons} lessons`} variant="outlined" />
              <Chip label={course.duration} variant="outlined" />
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box component="aside" sx={{ pt: 0.5 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Course information</Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">Category</Typography>
              <Typography variant="body1" sx={{ mt: "-8px !important" }}>{course.category}</Typography>
              <Typography variant="body2" color="text.secondary">Level</Typography>
              <Typography variant="body1" sx={{ mt: "-8px !important" }}>{course.level}</Typography>
              <Typography variant="body2" color="text.secondary">Lesson ID</Typography>
              <Typography variant="body1" sx={{ mt: "-8px !important", overflowWrap: "anywhere" }}>{course.id}</Typography>
            </Stack>
          </Box>
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