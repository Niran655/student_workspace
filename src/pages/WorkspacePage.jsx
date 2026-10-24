import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Download,
  Eye,
  File,
  FileText,
  FolderClosed,
  FolderGit2,
  History,
  LayoutGrid,
  Microscope,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Trophy,
  Users2,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";

const SECTION_META = {
  research:     { label: "Research",      icon: Microscope,  color: "#7c3aed" },
  projects:     { label: "Projects",      icon: LayoutGrid,  color: "#2563eb" },
  teams:        { label: "Teams",         icon: Users2,      color: "#0891b2" },
  capstone:     { label: "Capstone",      icon: Trophy,      color: "#d97706" },
  resources:    { label: "Resources",     icon: FileText,    color: "#16a34a" },
  repositories: { label: "Research Lab",  icon: FolderGit2,  color: "#db2777" },
};

const FILE_TREE = {
  research:     { configs: ["model.yaml","training.yaml"], data: ["dataset.csv","labels.json"], docs: ["README.md","paper.pdf","references.bib"] },
  projects:     { src: ["App.jsx","index.js","utils.js"], docs: ["README.md","CONTRIBUTING.md"], config: ["package.json",".env.example"] },
  teams:        { docs: ["README.md","ROLES.md","MEETING_NOTES.md"], tasks: ["sprint-1.md","sprint-2.md"], members: ["roster.json"] },
  capstone:     { docs: ["README.md","PROPOSAL.md","FINAL_REPORT.pdf"], src: ["main.py","utils.py"], demo: ["slides.pdf","demo.mp4"] },
  resources:    { files: ["main_resource.pdf","slides.pptx"], supplementary: ["references.bib","dataset_sample.csv"], docs: ["README.md"] },
  repositories: { configs: ["model.yaml","training.yaml"], data: ["dataset.csv","labels.json"], docs: ["README.md","paper.pdf"] },
};

const README_CONTENT = {
  research: "# Research Blueprint\n\n## Overview\nThis research workspace contains all materials, datasets, and code for this study.\n\n## Objectives\n- Conduct a systematic literature review\n- Design and implement the experimental methodology\n- Validate results across multiple benchmarks\n- Prepare manuscript for journal submission\n\n## Structure\n| Folder | Purpose |\n|--------|--------|\n| configs/ | Training and model configuration files |\n| data/ | Datasets and annotation labels |\n| docs/ | Paper drafts, references, and README |\n\n## Status\n🟡 In Progress — Manuscript under revision",
  projects: "# Project Workspace\n\n## Overview\nFull source code, documentation, and task history.\n\n## Tech Stack\n| Layer | Technology |\n|-------|----------|\n| Frontend | React 18, MUI v5 |\n| Backend | FastAPI, PostgreSQL |\n| DevOps | Docker, GitHub Actions |\n\n## Tasks\n- [x] Project setup\n- [x] Authentication module\n- [ ] API integration\n- [ ] Deployment pipeline\n\n## Status\n🔵 In Progress",
  teams: "# Team Workspace\n\n## Overview\nOrganizes collaboration, meeting notes, and sprint tasks for this team.\n\n## Roles\n| Member | Role |\n|--------|-----|\n| Leader | Architecture & Research Direction |\n| Developer | Implementation & Testing |\n| Designer | UI/UX & Visualization |\n\n## Sprints\n- Sprint 1 — Environment setup ✅\n- Sprint 2 — Data collection 🔄\n- Sprint 3 — Model training 📅\n\n## Status\n🟢 Active — Recruiting",
  capstone: "# Capstone Project\n\n## Deliverables\n| Item | Status |\n|------|-------|\n| Proposal | ✅ Approved |\n| Mid-term Report | ✅ Submitted |\n| Final Presentation | ✅ Defended |\n| Source Code | ✅ Archived |\n\n## Grade\n🏆 Distinction (A+)\n\n## Tech Stack\nPython · Docker · React · FastAPI",
  resources: "# Resource Package\n\n## Contents\n| File | Type | Size |\n|------|------|-----|\n| main_resource.pdf | Lecture Notes | 2.4 MB |\n| slides.pptx | Presentation | 5.1 MB |\n| dataset_sample.csv | Dataset | 890 KB |\n\n## License\nFree to use for academic and research purposes. Cite the original author.\n\n## Tags\nAI · Machine Learning · Khmer NLP",
  repositories: "# Research Lab\n\n## Overview\nAll code, datasets, and documentation for collaborative research.\n\n## Structure\n| Folder | Description |\n|--------|------------|\n| configs/ | Hyperparameter and training configs |\n| data/ | Raw and preprocessed datasets |\n| docs/ | Paper drafts and bibliography |\n\n## Visibility\n🔓 Public — Open for collaboration and contribution.",
};

const CREATE_FIELDS = {
  research: [
    { key: "title",    label: "Research title",       placeholder: "e.g. Deep Transformer for Khmer OCR" },
    { key: "field",    label: "Research field",       placeholder: "e.g. AI & Computer Vision" },
    { key: "abstract", label: "Abstract",              placeholder: "Brief description of the research problem…", multiline: true, rows: 4 },
    { key: "journal",  label: "Target journal / venue",placeholder: "e.g. IEEE ASEAN Computing & Tech Transactions" },
    { key: "status",   label: "Status", select: true, options: ["In Progress","Under Review","Published","Pre-print"] },
  ],
  projects: [
    { key: "title",       label: "Project title",  placeholder: "e.g. AI Study Assistant" },
    { key: "description", label: "Description",    placeholder: "What does this project do?", multiline: true, rows: 3 },
    { key: "technology",  label: "Primary tech",   placeholder: "e.g. React, Python, Flutter" },
    { key: "type",        label: "Project type",   select: true, options: ["Capstone","Course Project","Research","Personal"] },
    { key: "status",      label: "Status",         select: true, options: ["Planning","In Progress","Completed","On Hold"] },
  ],
  teams: [
    { key: "name",         label: "Team name",      placeholder: "e.g. Khmer Vision AI Lab" },
    { key: "projectTitle", label: "Project focus",  placeholder: "e.g. Khmer OCR & Historical Manuscript Scanner" },
    { key: "description",  label: "Description",    placeholder: "What is your team working on?", multiline: true, rows: 3 },
    { key: "type",         label: "Type",           select: true, options: ["Thesis / Capstone","Course Project","Research","Hackathon"] },
    { key: "lookingFor",   label: "Looking for",    placeholder: "e.g. UI/UX Designer, Backend Dev" },
  ],
  capstone: [
    { key: "title",     label: "Capstone title", placeholder: "e.g. AI-Powered Code Reviewer" },
    { key: "summary",   label: "Summary",        placeholder: "Describe your capstone project…", multiline: true, rows: 3 },
    { key: "sponsor",   label: "Sponsor",        placeholder: "e.g. Khmer Coders Guild" },
    { key: "advisor",   label: "Advisor",        placeholder: "e.g. Dr. Khem Sovann" },
    { key: "techStack", label: "Tech stack",     placeholder: "e.g. Python, Docker, React, FastAPI" },
  ],
  resources: [
    { key: "title",       label: "Resource title", placeholder: "e.g. Introduction to Deep Learning Notes" },
    { key: "description", label: "Description",    placeholder: "What does this resource contain?", multiline: true, rows: 3 },
    { key: "category",    label: "Category", select: true, options: ["Study Material","Dataset & Code","Templates","Presentation","Other"] },
  ],
  repositories: [
    { key: "title",       label: "Lab name",       placeholder: "e.g. khmer-ocr-research" },
    { key: "description", label: "Description",    placeholder: "Short description of the research lab…", multiline: true, rows: 3 },
    { key: "field",       label: "Research field", placeholder: "e.g. AI & Computer Vision" },
    { key: "visibility",  label: "Visibility", select: true, options: ["Public","University","Private"] },
  ],
};

function sectionLabel(section) { return SECTION_META[section]?.label ?? section; }
function SectionIcon({ section, size = 18 }) {
  const Icon = SECTION_META[section]?.icon ?? FileText;
  return <Icon size={size} />;
}

function FileTree({ section, activeFile, onSelect }) {
  const tree = FILE_TREE[section] ?? FILE_TREE.research;
  return (
    <Box sx={{ width: 220, flexShrink: 0, borderRight: "1px solid", borderColor: "divider", overflowY: "auto" }}>
      {Object.entries(tree).map(([folder, files]) => (
        <Box key={folder}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.75, fontSize: 13, fontWeight: 600, color: "text.secondary" }}>
            <FolderClosed size={14} />{folder}
          </Box>
          {files.map((file) => (
            <Box key={file} onClick={() => onSelect(file)}
              sx={{ display: "flex", alignItems: "center", gap: 0.75, pl: 3, pr: 1.5, py: 0.6, fontSize: 13, cursor: "pointer",
                bgcolor: activeFile === file ? "action.selected" : "transparent",
                color: activeFile === file ? "text.primary" : "text.secondary",
                "&:hover": { bgcolor: "action.hover" } }}>
              <File size={13} />{file}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

function ContentView({ section, activeFile, viewMode }) {
  if (activeFile !== "README.md") {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        <Code2 size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
        <Typography variant="body2">Select README.md to preview content.</Typography>
      </Box>
    );
  }
  const content = README_CONTENT[section] ?? README_CONTENT.research;
  if (viewMode !== "preview") {
    return <Box sx={{ p: 2.5, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{content}</Box>;
  }
  return (
    <Box sx={{ p: 3, maxWidth: 860, fontSize: 14, lineHeight: 1.8 }}>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <Typography key={i} sx={{ fontSize: 17, fontWeight: 700, mt: 2.5, mb: 0.5 }}>{line.slice(3)}</Typography>;
        if (line.startsWith("# "))  return <Typography key={i} sx={{ fontSize: 22, fontWeight: 800, mb: 1 }}>{line.slice(2)}</Typography>;
        if (line.startsWith("| "))  return <Box key={i} sx={{ fontFamily: "monospace", fontSize: 12, bgcolor: "action.hover", px: 1.5, py: 0.25, borderBottom: "1px solid", borderColor: "divider" }}>{line}</Box>;
        if (line.startsWith("- ") || line.startsWith("- [")) return <Typography key={i} component="li" sx={{ ml: 2, fontSize: 13 }}>{line.slice(2)}</Typography>;
        if (line === "") return <Box key={i} sx={{ height: 8 }} />;
        return <Typography key={i} sx={{ fontSize: 13 }}>{line}</Typography>;
      })}
    </Box>
  );
}

function CreateView({ section, username }) {
  const navigate = useNavigate();
  const fields = CREATE_FIELDS[section] ?? CREATE_FIELDS.research;
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const color = SECTION_META[section]?.color ?? "#2563eb";

  const handleCreate = () => {
    setSaving(true);
    const fakeId = Math.floor(Math.random() * 9000) + 1000;
    setTimeout(() => navigate(`/users/${username}/${section}/${fakeId}/views/1`), 1000);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate(`/profile?tab=${section}`)}
        sx={{ mb: 3, textTransform: "none", color: "text.secondary" }}>Back to profile</Button>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <Box sx={{ color, p: 1, borderRadius: "8px", bgcolor: `${color}18`, display: "flex" }}>
          <SectionIcon section={section} size={22} />
        </Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Create new {sectionLabel(section).toLowerCase()}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Fill in the details below. You will be taken to your personal {sectionLabel(section).toLowerCase()} workspace after saving.
      </Typography>
      <Stack spacing={2.5}>
        {fields.map(({ key, label, placeholder, multiline, rows, select, options }) =>
          select ? (
            <TextField key={key} select fullWidth size="small" label={label} value={form[key] ?? ""} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}>
              {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          ) : (
            <TextField key={key} fullWidth size="small" label={label} placeholder={placeholder}
              value={form[key] ?? ""} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
              multiline={multiline} rows={rows} />
          )
        )}
        <Divider />
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate(`/profile?tab=${section}`)}>Cancel</Button>
          <Button variant="contained" startIcon={<Save size={16} />} onClick={handleCreate} disabled={saving} sx={{ minWidth: 180 }}>
            {saving ? "Creating workspace…" : `Create ${sectionLabel(section)}`}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

function BlueprintView({ section, id, username, displayName }) {
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState("README.md");
  const [viewMode, setViewMode] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [snack, setSnack] = useState(false);
  const color = SECTION_META[section]?.color ?? "#2563eb";
  const tree = FILE_TREE[section] ?? FILE_TREE.research;
  const totalFiles = Object.values(tree).flat().length;

  const handleCopy = () => { setCopied(true); setSnack(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 62px)", overflow: "hidden" }}>
      {/* Top breadcrumb bar */}
      <Box sx={{ px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, bgcolor: "background.paper" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
          <Button size="small" startIcon={<ArrowLeft size={14} />} onClick={() => navigate(`/profile?tab=${section}`)}
            sx={{ textTransform: "none", fontSize: 13, color: "text.secondary", minWidth: 0, px: 0.5, mr: 0.5 }}>
            Profile
          </Button>
          <ChevronRight size={14} style={{ opacity: 0.4 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color, fontWeight: 600, fontSize: 13 }}>
            <SectionIcon section={section} size={14} />{sectionLabel(section)}
          </Box>
          <ChevronRight size={14} style={{ opacity: 0.4 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{activeFile}</Typography>
          <Tooltip title="Copy path">
            <Box onClick={handleCopy} sx={{ ml: 0.5, cursor: "pointer", color: "text.secondary", display: "flex" }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </Box>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label="main" size="small" variant="outlined" icon={<FolderGit2 size={12} />} sx={{ fontSize: 12, height: 26 }} />
          <Tooltip title="Add file"><Box sx={{ cursor: "pointer", color: "text.secondary" }}><Plus size={16} /></Box></Tooltip>
          <Tooltip title="More"><Box sx={{ cursor: "pointer", color: "text.secondary" }}><MoreHorizontal size={16} /></Box></Tooltip>
        </Box>
      </Box>

      {/* Commit bar */}
      <Box sx={{ px: 3, py: 1.25, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, bgcolor: "background.default" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 22, height: 22, fontSize: 11, bgcolor: color, fontWeight: 700 }}>
            {displayName.split(" ").slice(0,2).map(p => p[0]).join("").toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{displayName}</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            docs: publish {sectionLabel(section).toLowerCase()} overview <Box component="span" sx={{ color: "success.main" }}>✓</Box>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="caption" sx={{ fontFamily: "monospace", bgcolor: "action.selected", px: 0.75, py: 0.25, borderRadius: "4px" }}>
            {Number(id).toString(16).padStart(7,"0").slice(0,7)}f0
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary" }}>
            <Clock size={12} /><Typography variant="caption">2 hours ago</Typography>
          </Box>
          <Button size="small" startIcon={<History size={13} />} variant="outlined" sx={{ textTransform: "none", fontSize: 12, height: 26, borderRadius: "6px" }}>History</Button>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <FileTree section={section} activeFile={activeFile} onSelect={setActiveFile} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tab bar */}
          <Box sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", gap: 0 }}>
              {[["preview","Preview",Eye],["code","Code",Code2],["blame","Blame",null]].map(([mode, lbl, Icon]) => (
                <Button key={mode} size="small" onClick={() => setViewMode(mode)}
                  sx={{ textTransform: "none", fontSize: 13, px: 1.5, py: 0.5,
                    borderBottom: viewMode === mode ? "2px solid" : "2px solid transparent",
                    borderBottomColor: viewMode === mode ? "primary.main" : "transparent",
                    fontWeight: viewMode === mode ? 600 : 400,
                    color: viewMode === mode ? "text.primary" : "text.secondary",
                    borderRadius: "6px 6px 0 0" }}>
                  {Icon && <Icon size={13} style={{ marginRight: 4 }} />}{lbl}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "text.secondary" }}>
              <Typography variant="caption">{totalFiles} files · 12 KB</Typography>
              <Tooltip title="Raw"><Box sx={{ cursor: "pointer" }}><FileText size={14} /></Box></Tooltip>
              <Tooltip title="Copy"><Box onClick={handleCopy} sx={{ cursor: "pointer" }}>{copied ? <Check size={14}/> : <Copy size={14}/>}</Box></Tooltip>
              <Tooltip title="Download"><Box sx={{ cursor: "pointer" }}><Download size={14} /></Box></Tooltip>
              <Tooltip title="Edit"><Box sx={{ cursor: "pointer" }}><Pencil size={14} /></Box></Tooltip>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <ContentView section={section} activeFile={activeFile} viewMode={viewMode} />
          </Box>
        </Box>
      </Box>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" onClose={() => setSnack(false)}>Path copied to clipboard</Alert>
      </Snackbar>
    </Box>
  );
}

export default function WorkspacePage() {
  const { username, section, id } = useParams();
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const saved = (() => { try { return JSON.parse(localStorage.getItem("unifforge_profile") ?? "{}"); } catch { return {}; } })();
  const displayName = saved.name || user?.name || "Rim Narong";
  const resolvedUsername = username ?? (saved.username || user?.username || "Niran655");

  return (
    <DashboardLayout user={user} logout={logout} language={language} changeLanguage={changeLanguage} toggleColorMode={toggleColorMode} isDark={isDark}>
      {id === "new"
        ? <CreateView section={section} username={resolvedUsername} />
        : <BlueprintView section={section} id={id} username={resolvedUsername} displayName={displayName} />
      }
    </DashboardLayout>
  );
}
