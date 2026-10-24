import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BookOpen,
  Building2,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  LayoutGrid,
  MapPin,
  Microscope,
  Plus,
  Search,
  Star,
  Trash2,
  Trophy,
  UploadCloud,
  Users2,
  X,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";
import ResearchWorkspace from "../components/ResearchWorkspace";
import { SAMPLE_CAPSTONE, SAMPLE_PROJECTS, SAMPLE_RESEARCH, SAMPLE_TEAMS } from "../data/exploreData";
import { addCommunityResources, removeCommunityResource, useCommunityResources } from "../store/communityStore";
import { getDisplayName, getOwnerKey, getUserNames, readSavedProfile, sameAny } from "../store/profileUtils";

/* ------------------------------------------------------------------ */
/* Constants and helpers                                               */
/* ------------------------------------------------------------------ */
const RESOURCE_CATEGORIES = ["Dataset & Code", "Study Material", "Templates"];
const UNIVERSITIES = ["RUPP", "ITC", "CADT"];
const RESEARCH_FIELDS = ["AI & Computer Vision", "Distributed Systems", "Cybersecurity & AI", "Other"];
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_STORED_BYTES = 1024 * 1024; // only files up to 1 MB keep their contents for download

/** Every kind of content a user can publish, and where it shows up in Explore. */
const KIND_META = {
  upload: { label: "Resource", icon: FileText, tab: "resources" },
  repo: { label: "Research lab", icon: FolderGit2, tab: "resources" },
  research: { label: "Research", icon: Microscope, tab: "research" },
  project: { label: "Project", icon: LayoutGrid, tab: "projects" },
  team: { label: "Team", icon: Users2, tab: "teams" },
  capstone: { label: "Capstone", icon: Trophy, tab: "capstone" },
};

/** Where "View in Explore" should take you for a given item. */
const exploreUrl = (item) =>
  item.kind === "research"
    ? `/explore?tab=research&paper=${item.id}`
    : `/explore?tab=${KIND_META[item.kind].tab}&q=${encodeURIComponent(item.title)}`;

const asKind = (kind) => (item) => ({ ...item, kind, title: item.title || item.name, sample: true });
const splitList = (text = "") => text.split(",").map((t) => t.trim()).filter(Boolean);

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const extensionOf = (name) => (name.includes(".") ? name.split(".").pop().toLowerCase() : "file");

const inferType = (file) => {
  const ext = extensionOf(file.name);
  if (["pdf", "doc", "docx", "ppt", "pptx", "md", "txt"].includes(ext)) return "Document";
  if (["csv", "json", "jsonl", "xlsx", "xls"].includes(ext)) return "Dataset";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "Archive";
  if (["py", "js", "jsx", "ts", "tsx", "ipynb", "cpp", "java"].includes(ext)) return "Code";
  if (file.type.startsWith("image/")) return "Image";
  return "Resource";
};

const readAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

const downloadItem = (item) => {
  if (!item.dataUrl) return;
  const link = document.createElement("a");
  link.href = item.dataUrl;
  link.download = item.fileName || item.title;
  link.click();
};

/* ------------------------------------------------------------------ */
/* Publish forms (project, team, capstone, research)                   */
/* ------------------------------------------------------------------ */
const YEAR_NOW = new Date().getFullYear();

const FORMS = {
  project: {
    title: "Publish a project",
    hint: "Your project will be listed in Explore → Projects. Manage tasks and your team in the Projects workspace.",
    submit: "Publish project",
    initial: { title: "", description: "", type: "Course Project", technology: "AI", status: "In Progress", university: "RUPP", faculty: "Engineering", course: "" },
    fields: [
      { key: "title", label: "Project title", required: true },
      { key: "description", label: "Description", type: "multiline", required: true },
      { key: "type", label: "Project type", type: "select", options: ["Course Project", "Capstone", "Thesis", "Research"], half: true },
      { key: "technology", label: "Main technology", type: "select", options: ["AI", "React JS", "Laravel", "C++"], half: true },
      { key: "status", label: "Status", type: "select", options: ["In Progress", "Completed"], half: true },
      { key: "university", label: "University", type: "select", options: UNIVERSITIES, half: true },
      { key: "faculty", label: "Faculty", type: "select", options: ["Engineering", "GIC", "Computer Science"], half: true },
      { key: "course", label: "Course", half: true },
    ],
  },
  team: {
    title: "Create a team",
    hint: "Your team will be listed in Explore → Teams so students can apply to join.",
    submit: "Create team",
    initial: { name: "", projectTitle: "", type: "Capstone", university: "RUPP", maxMembers: 4, lookingFor: "", techStack: "", description: "" },
    fields: [
      { key: "name", label: "Team name", required: true },
      { key: "projectTitle", label: "Project the team is working on", required: true },
      { key: "type", label: "Type", type: "select", options: ["Course Project", "Capstone", "Research", "Thesis / Capstone"], half: true },
      { key: "university", label: "University", type: "select", options: UNIVERSITIES, half: true },
      { key: "maxMembers", label: "Team size", type: "number", min: 1, max: 12, half: true, required: true },
      { key: "lookingFor", label: "Looking for (roles)", placeholder: "UI/UX Designer, QA Tester", helper: "Separate with commas", half: true },
      { key: "techStack", label: "Tech stack", placeholder: "React JS, Node.js", helper: "Separate with commas" },
      { key: "description", label: "Description", type: "multiline", required: true },
    ],
  },
  capstone: {
    title: "Create a capstone",
    hint: "Showcase your graduation project in Explore → Capstone.",
    submit: "Create capstone",
    initial: { title: "", university: "RUPP", year: YEAR_NOW, sponsor: "", advisor: "", grade: "In progress", team: "", techStack: "", demoUrl: "", summary: "" },
    fields: [
      { key: "title", label: "Capstone title", required: true },
      { key: "university", label: "University", type: "select", options: UNIVERSITIES, half: true },
      { key: "year", label: "Year", type: "number", min: 2015, max: 2100, half: true, required: true },
      { key: "advisor", label: "Advisor", half: true },
      { key: "sponsor", label: "Industry sponsor", half: true },
      { key: "grade", label: "Grade", type: "select", options: ["In progress", "Grade A", "Distinction (A+)"], half: true },
      { key: "team", label: "Other team members", placeholder: "Sokha Chan, Dara Sam", helper: "Separate with commas. You are added automatically.", half: true },
      { key: "techStack", label: "Tech stack", placeholder: "Python, React" },
      { key: "demoUrl", label: "Live demo URL (optional)", placeholder: "https://…", validate: (v) => (v.demoUrl && !/^https?:\/\//.test(v.demoUrl) ? "Start with http:// or https://" : "") },
      { key: "summary", label: "Summary", type: "multiline", required: true },
    ],
  },
  research: {
    title: "Create research",
    hint: "Creates a research workspace with a file tree you can edit. It is listed in Explore → Research.",
    submit: "Create research",
    initial: { title: "", field: RESEARCH_FIELDS[0], university: "RUPP", journal: "", year: YEAR_NOW, status: "Pre-print", supervisor: "", coAuthors: "", abstract: "" },
    fields: [
      { key: "title", label: "Research title", required: true },
      { key: "field", label: "Field", type: "select", options: RESEARCH_FIELDS, half: true },
      { key: "university", label: "University", type: "select", options: UNIVERSITIES, half: true },
      { key: "status", label: "Status", type: "select", options: ["Pre-print", "Under Review", "Published"], half: true },
      { key: "year", label: "Year", type: "number", min: 2000, max: 2100, half: true, required: true },
      { key: "journal", label: "Journal / venue", half: true },
      { key: "supervisor", label: "Supervisor", half: true },
      { key: "coAuthors", label: "Co-authors", placeholder: "Dara Sam, Prof. Khem Sok", helper: "Separate with commas. You are added as first author." },
      { key: "abstract", label: "Abstract", type: "multiline", required: true },
    ],
  },
};

function FormDialog({ kind, onClose, onSubmit }) {
  const config = kind ? FORMS[kind] : null;
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (config) {
      setValues(config.initial);
      setErrors({});
    }
  }, [kind]);

  if (!config) return null;
  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    config.fields.forEach((f) => {
      const value = String(values[f.key] ?? "").trim();
      if (f.required && !value) next[f.key] = `${f.label} is required`;
      else if (f.type === "number" && value && (Number(value) < f.min || Number(value) > f.max)) next[f.key] = `Enter a number from ${f.min} to ${f.max}`;
      else if (f.validate) {
        const message = f.validate(values);
        if (message) next[f.key] = message;
      }
    });
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(kind, values);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={submit} noValidate>
        <DialogTitle sx={{ fontWeight: 700 }}>{config.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{config.hint}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            {config.fields.map((f) => (
              <TextField
                key={f.key}
                size="small"
                label={f.label}
                placeholder={f.placeholder}
                required={f.required}
                select={f.type === "select"}
                multiline={f.type === "multiline"}
                rows={f.type === "multiline" ? 3 : undefined}
                type={f.type === "number" ? "number" : "text"}
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                error={Boolean(errors[f.key])}
                helperText={errors[f.key] || f.helper}
                slotProps={{ htmlInput: f.type === "number" ? { min: f.min, max: f.max } : undefined }}
                sx={{ gridColumn: { sm: f.half ? "auto" : "1 / -1" } }}
              >
                {f.type === "select" && f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ textTransform: "none", fontWeight: 600 }}>{config.submit}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Upload dialog                                                       */
/* ------------------------------------------------------------------ */
function UploadDialog({ open, onClose, onSubmit }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("Study Material");
  const [university, setUniversity] = useState("RUPP");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => { setFiles([]); setDescription(""); setError(""); setBusy(false); setDragOver(false); };
  const close = () => { reset(); onClose(); };

  const addFiles = (list) => {
    const incoming = Array.from(list || []);
    const tooBig = incoming.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 25 MB.`);
      return;
    }
    setError("");
    setFiles((prev) => [...prev, ...incoming].slice(0, 10));
  };

  const submit = async () => {
    if (files.length === 0) {
      setError("Choose at least one file to upload.");
      return;
    }
    setBusy(true);
    await onSubmit({ files, category, university, description: description.trim() });
    reset();
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Upload resources</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Uploaded files appear in Explore → Resources so other students can find and download them.
        </Typography>
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          sx={{ border: "2px dashed", borderColor: dragOver ? "primary.main" : "divider", borderRadius: 2, p: 3, textAlign: "center", cursor: "pointer", bgcolor: dragOver ? "action.selected" : "action.hover", transition: "all 0.15s" }}
        >
          <UploadCloud size={28} />
          <Typography fontWeight={600} sx={{ mt: 1 }}>Drop files here or click to browse</Typography>
          <Typography variant="caption" color="text.secondary">Up to 10 files, 25 MB each</Typography>
        </Box>
        {files.length > 0 && (
          <Stack spacing={0.75} sx={{ mt: 2 }}>
            {files.map((f, i) => (
              <Box key={`${f.name}-${i}`} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 1.5, bgcolor: "action.hover" }}>
                <FileText size={16} />
                <Typography variant="body2" noWrap sx={{ flex: 1 }}>{f.name}</Typography>
                <Typography variant="caption" color="text.secondary">{formatSize(f.size)}</Typography>
                <IconButton size="small" aria-label={`Remove ${f.name}`} onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}><X size={14} /></IconButton>
              </Box>
            ))}
          </Stack>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2.5 }}>
          <TextField select fullWidth size="small" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {RESOURCE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select fullWidth size="small" label="University" value={university} onChange={(e) => setUniversity(e.target.value)}>
            {UNIVERSITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Stack>
        <TextField fullWidth size="small" multiline rows={3} label="Description" placeholder="What is this resource and who is it for?" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt: 2 }} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={busy} sx={{ textTransform: "none", fontWeight: 600 }}>
          {busy ? "Uploading…" : `Upload${files.length ? ` ${files.length} file${files.length > 1 ? "s" : ""}` : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Create research lab dialog                                          */
/* ------------------------------------------------------------------ */
const EMPTY_LAB = { name: "", description: "", field: RESEARCH_FIELDS[0], university: "RUPP", tags: "", visibility: "Public", readme: true };

function RepoDialog({ open, onClose, onSubmit, existingNames }) {
  const [form, setForm] = useState(EMPTY_LAB);
  const [errors, setErrors] = useState({});
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const close = () => { setForm(EMPTY_LAB); setErrors({}); onClose(); };

  const submit = () => {
    const next = {};
    const name = form.name.trim();
    if (!name) next.name = "Lab name is required";
    else if (!/^[a-zA-Z0-9._-]{3,60}$/.test(name)) next.name = "Use 3–60 letters, numbers, dots, dashes or underscores (no spaces)";
    else if (existingNames.includes(name.toLowerCase())) next.name = "You already have a research lab with this name";
    if (!form.description.trim()) next.description = "Add a short description so others can find it";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ ...form, name, description: form.description.trim() });
    close();
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Create research lab</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your research lab will be listed in Explore → Resources so others can discover and contribute.
        </Typography>
        <Stack spacing={2}>
          <TextField autoFocus size="small" fullWidth label="Lab name" placeholder="khmer-ocr-research" value={form.name} onChange={(e) => set("name", e.target.value)} error={Boolean(errors.name)} helperText={errors.name} />
          <TextField size="small" fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} error={Boolean(errors.description)} helperText={errors.description} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField select size="small" fullWidth label="Research field" value={form.field} onChange={(e) => set("field", e.target.value)}>
              {RESEARCH_FIELDS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField select size="small" fullWidth label="University" value={form.university} onChange={(e) => set("university", e.target.value)}>
              {UNIVERSITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Stack>
          <TextField size="small" fullWidth label="Topics" placeholder="nlp, khmer, ocr" helperText="Separate with commas" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Visibility</Typography>
            <RadioGroup row value={form.visibility} onChange={(e) => set("visibility", e.target.value)}>
              <FormControlLabel value="Public" control={<Radio size="small" />} label="Public" />
              <FormControlLabel value="University" control={<Radio size="small" />} label="University only" />
            </RadioGroup>
          </Box>
          <FormControlLabel control={<Switch checked={form.readme} onChange={(e) => set("readme", e.target.checked)} />} label="Add a README to get started" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button variant="contained" onClick={submit} sx={{ textTransform: "none", fontWeight: 600 }}>Create research lab</Button>
      </DialogActions>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */
function Topic({ label }) {
  return <Box sx={{ px: 1.25, py: 0.2, borderRadius: 999, fontSize: 12, fontWeight: 500, color: "primary.main", bgcolor: "rgba(56,139,253,0.15)" }}>{label}</Box>;
}

function Meta({ item }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mt: 1.5, fontSize: 12, color: "text.secondary" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.kind === "upload" ? "#4493f8" : "#f78166" }} />
        {item.kind === "repo" || item.kind === "research" ? item.field : item.type || KIND_META[item.kind].label}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Star size={14} /> {item.stars || 0}</Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Building2 size={14} /> {item.university}</Box>
      <span>Updated {item.updatedAt}</span>
    </Box>
  );
}

/* A bordered "pinned" card, like on a GitHub profile */
function PinnedCard({ item, onView }) {
  const { icon: Icon, label } = KIND_META[item.kind];
  return (
    <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: "6px", bgcolor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 132 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ color: "text.secondary", display: "flex" }}><Icon size={16} /></Box>
          <Typography onClick={onView} noWrap sx={{ fontSize: 14, fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>{item.title}</Typography>
          <Chip label={label} size="small" variant="outlined" sx={{ height: 20, fontSize: 11, ml: "auto" }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography>
      </Box>
      <Meta item={item} />
    </Box>
  );
}

/* A list row for uploads and research labs, like the GitHub "Repositories" tab */
function ListRow({ item, onView, onRemove }) {
  const isRepo = item.kind === "repo";
  return (
    <Box sx={{ py: 3, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography onClick={onView} sx={{ fontSize: 20, fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>{item.title}</Typography>
          <Chip label={isRepo ? item.visibility : item.category} size="small" variant="outlined" sx={{ height: 22, fontSize: 12 }} />
        </Box>
        {item.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 640 }}>{item.description}</Typography>}
        {isRepo && item.tags?.length > 0 && <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1.25 }}>{item.tags.map((t) => <Topic key={t} label={t} />)}</Box>}
        {!isRepo && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>{item.format}{item.size ? ` · ${item.size}` : ""}</Typography>}
        <Meta item={item} />
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        {!isRepo && (
          <Tooltip title={item.dataUrl ? "Download file" : "File contents were not stored (over 1 MB)"}>
            <span><Button size="small" variant="outlined" startIcon={<Download size={14} />} disabled={!item.dataUrl} onClick={() => downloadItem(item)}>Download</Button></span>
          </Tooltip>
        )}
        <Button size="small" variant="outlined" startIcon={<ExternalLink size={14} />} onClick={onView}>Explore</Button>
        <Tooltip title="Remove"><IconButton size="small" aria-label="Remove" onClick={onRemove} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "6px" }}><Trash2 size={15} /></IconButton></Tooltip>
      </Box>
    </Box>
  );
}

/* Card used for projects, teams, capstone and research */
function EntityCard({ item, badges, subtitle, children, onExplore, onRemove, extraActions }) {
  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75, flexWrap: "wrap" }}>
            <Typography onClick={onExplore} sx={{ fontSize: 15, fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>{item.title}</Typography>
            {badges.filter(Boolean).map((b) => <Chip key={b} label={b} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />)}
            {!item.sample && <Chip label="Yours" size="small" color="primary" sx={{ fontSize: 11, height: 20 }} />}
          </Box>
          {subtitle && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>{subtitle}</Typography>}
          {children}
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {extraActions}
          <Button size="small" variant="outlined" startIcon={<ExternalLink size={13} />} onClick={onExplore}>Explore</Button>
          {!item.sample && (
            <Tooltip title="Remove"><IconButton size="small" aria-label="Remove" onClick={onRemove} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "6px" }}><Trash2 size={15} /></IconButton></Tooltip>
          )}
        </Box>
      </Box>
    </Card>
  );
}

const Tags = ({ list }) => (
  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1 }}>
    {list.map((t) => <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 11, height: 18 }} />)}
  </Box>
);

function EmptyBox({ icon, title, text, action }) {
  return (
    <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: "6px", textAlign: "center", py: 6, px: 2 }}>
      <Box sx={{ opacity: 0.5, mb: 1.5 }}>{icon}</Box>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: action ? 2 : 0 }}>{text}</Typography>
      {action}
    </Box>
  );
}

const SectionTitle = ({ children, action }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
    <Typography sx={{ fontSize: 16, fontWeight: 400 }}>{children}</Typography>
    {action}
  </Box>
);

const TabHeader = ({ left, right }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 1 }}>
    <Typography variant="body2">{left}</Typography>
    <Box sx={{ display: "flex", gap: 1 }}>{right}</Box>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const communityItems = useCommunityResources();
  const saved = readSavedProfile();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [repoOpen, setRepoOpen] = useState(false);
  const [formKind, setFormKind] = useState(null); // project | team | capstone | research
  const [repoQuery, setRepoQuery] = useState("");
  const [repoType, setRepoType] = useState("All");
  const [snack, setSnack] = useState({ open: false, message: "", link: null });

  const displayName = getDisplayName(user);
  const username = saved.username || user?.username || "Niran655";
  const ownerKey = getOwnerKey(user);
  const names = getUserNames(user);

  /* ----- everything this user owns or is credited on ----- */
  const mine = communityItems.filter((item) => item.ownerKey === ownerKey);
  const myUploads = mine.filter((i) => i.kind === "upload");
  const myRepos = mine.filter((i) => i.kind === "repo");
  const myProjects = [
    ...mine.filter((i) => i.kind === "project"),
    ...SAMPLE_PROJECTS.filter((p) => sameAny(p.author?.name, names)).map(asKind("project")),
  ];
  const myTeams = [
    ...mine.filter((i) => i.kind === "team"),
    ...SAMPLE_TEAMS.filter((t) => t.members.some((m) => sameAny(m.name, names))).map(asKind("team")),
  ];
  const myCapstone = [
    ...mine.filter((i) => i.kind === "capstone"),
    ...SAMPLE_CAPSTONE.filter((c) => c.team.some((n) => sameAny(n, names))).map(asKind("capstone")),
  ];
  const myResearch = [
    ...mine.filter((i) => i.kind === "research"),
    ...SAMPLE_RESEARCH.filter((p) => p.authors.some((a) => sameAny(a, names))).map(asKind("research")),
  ];

  /* ----- tabs + research workspace selected through the URL ----- */
  const TAB_IDS = ["overview", "projects", "teams", "repositories", "resources", "research", "capstone"];
  const requestedTab = searchParams.get("tab");
  const tab = TAB_IDS.includes(requestedTab) ? requestedTab : "overview";
  const setTab = (value) => setSearchParams(value === "overview" ? {} : { tab: value }, { replace: true });

  const paperId = searchParams.get("paper");
  const allResearch = [...communityItems.filter((i) => i.kind === "research"), ...SAMPLE_RESEARCH];
  const openPaper = tab === "research" && paperId ? allResearch.find((p) => String(p.id) === paperId) || null : null;
  const openPaperEditable = Boolean(openPaper) && (openPaper.ownerKey === ownerKey || openPaper.authors.some((a) => sameAny(a, names)));
  const openWorkspace = (paper) => setSearchParams({ tab: "research", paper: String(paper.id) });
  const closeWorkspace = () => setSearchParams({ tab: "research" });

  const notify = (message, link = null) => setSnack({ open: true, message, link });
  const goExplore = (tabId) => navigate(`/explore?tab=${tabId}`);

  /* ----- create / remove ----- */
  const handleUpload = async ({ files, category, university, description }) => {
    const created = [];
    for (const file of files) {
      const ext = extensionOf(file.name);
      created.push({
        id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind: "upload", ownerKey,
        title: file.name.replace(/\.[^.]+$/, ""), fileName: file.name,
        description: description || `Shared by ${displayName}`,
        category, type: inferType(file), format: `${ext.toUpperCase()} file`,
        size: formatSize(file.size), bytes: file.size, university, author: displayName,
        downloads: 0, stars: 0, updatedAt: "Just now",
        dataUrl: file.size <= MAX_STORED_BYTES ? await readAsDataUrl(file) : null,
        downloadable: file.size <= MAX_STORED_BYTES,
      });
    }
    addCommunityResources(created);
    setUploadOpen(false);
    setTab("resources");
    notify(`${created.length} resource${created.length > 1 ? "s" : ""} uploaded`, "/explore?tab=resources");
  };

  const handleCreateLab = (form) => {
    addCommunityResources([{
      id: `repo-${Date.now()}`, kind: "repo", ownerKey,
      title: form.name, description: form.description, category: "Dataset & Code",
      type: "Research Repository", format: "Research repository",
      field: form.field, visibility: form.visibility, tags: splitList(form.tags),
      readme: form.readme, university: form.university, author: displayName,
      bytes: 0, downloads: 0, stars: 0, updatedAt: "Just now",
    }]);
    setTab("repositories");
    notify(`Research lab “${form.name}” created`, `/explore?tab=resources&q=${encodeURIComponent(form.name)}`);
  };

  const handleCreateKind = (kind, v) => {
    const stamp = `${kind}-${Date.now()}`;
    const base = { id: stamp, kind, ownerKey, updatedAt: "Just now" };
    let item;
    if (kind === "project") {
      item = { ...base, title: v.title.trim(), description: v.description.trim(), university: v.university, faculty: v.faculty, major: "Computer Science", course: v.course || "General", year: "Year 4", technology: v.technology, status: v.status, type: v.type, stars: 0, forks: 0, author: { name: displayName, avatar: "" } };
    } else if (kind === "team") {
      const max = Number(v.maxMembers);
      item = { ...base, title: v.name.trim(), name: v.name.trim(), projectTitle: v.projectTitle.trim(), description: v.description.trim(), university: v.university, type: v.type, leader: displayName, members: [{ name: displayName }], maxMembers: max, lookingFor: splitList(v.lookingFor), techStack: splitList(v.techStack), status: max <= 1 ? "Team Full" : "Recruiting" };
    } else if (kind === "capstone") {
      item = { ...base, title: v.title.trim(), description: v.summary.trim(), summary: v.summary.trim(), university: v.university, sponsor: v.sponsor || "Independent", advisor: v.advisor || "To be assigned", grade: v.grade, year: Number(v.year), demoUrl: v.demoUrl, techStack: splitList(v.techStack), team: [displayName, ...splitList(v.team)] };
    } else {
      item = { ...base, title: v.title.trim(), description: v.abstract.trim(), abstract: v.abstract.trim(), field: v.field, university: v.university, journal: v.journal || "Not yet published", year: Number(v.year), status: v.status, authors: [displayName, ...splitList(v.coAuthors)], supervisor: v.supervisor || "To be assigned", citations: 0, downloads: 0 };
    }
    addCommunityResources([item]);
    setFormKind(null);
    setTab(KIND_META[kind].tab === "resources" ? "repositories" : KIND_META[kind].tab);
    notify(`${KIND_META[kind].label} “${item.title}” created`, exploreUrl(item));
    if (kind === "research") openWorkspace(item);
  };

  const handleRemove = (item) => {
    removeCommunityResource(item.id);
    if (item.kind === "research") {
      try { localStorage.removeItem(`uniforge.research.workspace.${item.id}`); } catch { /* ignore */ }
    }
    notify(`Removed “${item.title}”`);
  };

  /* ----- data for the page ----- */
  const quickActions = [
    { title: "Upload resources", description: "Share notes, datasets or guides. They appear in Explore → Resources.", icon: UploadCloud, action: () => setUploadOpen(true) },
    { title: "Create research lab", description: "Publish a research lab others can discover and contribute to.", icon: FolderGit2, action: () => setRepoOpen(true) },
    { title: "Create research", description: "Start a research workspace with files you can edit.", icon: Microscope, action: () => setFormKind("research") },
    { title: "Publish a project", description: "List your project in Explore → Projects.", icon: LayoutGrid, action: () => setFormKind("project") },
    { title: "Explore capstone", description: "Browse capstone projects and find teams or mentors.", icon: GraduationCap, action: () => goExplore("capstone") },
    { title: "Explore thesis", description: "Discover thesis work and related research directions.", icon: FlaskConical, action: () => goExplore("thesis") },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "projects", label: "Projects", icon: LayoutGrid, count: myProjects.length },
    { id: "teams", label: "Teams", icon: Users2, count: myTeams.length },
    { id: "repositories", label: "Research Labs", icon: FolderGit2, count: myRepos.length },
    { id: "resources", label: "Resources", icon: FileText, count: myUploads.length },
    { id: "research", label: "Research", icon: Microscope, count: myResearch.length },
    { id: "capstone", label: "Capstone", icon: Trophy, count: myCapstone.length },
  ];

  const pinned = mine.slice(0, 6);
  const visibleRepos = myRepos.filter(
    (r) => (repoType === "All" || r.visibility === repoType) && (!repoQuery || `${r.title} ${r.description}`.toLowerCase().includes(repoQuery.toLowerCase()))
  );
  const dialogs = (
    <>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onSubmit={handleUpload} />
      <RepoDialog open={repoOpen} onClose={() => setRepoOpen(false)} onSubmit={handleCreateLab} existingNames={myRepos.map((r) => r.title.toLowerCase())} />
      <FormDialog kind={formKind} onClose={() => setFormKind(null)} onSubmit={handleCreateKind} />
      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          severity="success" variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}
          action={snack.link ? <Button color="inherit" size="small" onClick={() => { setSnack((s) => ({ ...s, open: false })); navigate(snack.link); }}>View in Explore</Button> : undefined}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );

  /* ----- research workspace takes over the page, exactly like Explore ----- */
  if (openPaper) {
    return (
      <DashboardLayout user={user} logout={logout} language={language} changeLanguage={changeLanguage} toggleColorMode={toggleColorMode} isDark={isDark}>
        <Box component="main" sx={{ bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0d1117" : "background.default"), color: "text.primary" }}>
          <ResearchWorkspace key={openPaper.id} paper={openPaper} onClose={closeWorkspace} editable={openPaperEditable} />
        </Box>
        {dialogs}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} logout={logout} language={language} changeLanguage={changeLanguage} toggleColorMode={toggleColorMode} isDark={isDark}>
      <Box component="main" sx={{ minHeight: "calc(100vh - 62px)", bgcolor: "background.default", color: "text.primary" }}>
        {/* TAB STRIP */}
        <Box sx={{ bgcolor: isDark ? "#010409" : "background.paper", borderBottom: "1px solid", borderColor: "divider", px: { xs: 2, md: 4 } }}>
          <Box sx={{ maxWidth: 1280, mx: "auto" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 56 }}>
              {tabs.map(({ id, label, icon: Icon, count }) => (
                <Tab
                  key={id} value={id} icon={<Icon size={16} />} iconPosition="start"
                  sx={{ minHeight: 56, fontSize: 14, textTransform: "none", fontWeight: tab === id ? 600 : 400, color: "text.primary", "&.Mui-selected": { color: "text.primary" } }}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {label}
                      {count !== undefined && <Box sx={{ px: 1, borderRadius: 999, fontSize: 12, fontWeight: 600, bgcolor: "action.selected" }}>{count}</Box>}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, py: 4, display: "grid", gridTemplateColumns: { xs: "1fr", md: "296px minmax(0, 1fr)" }, gap: 4 }}>
          {/* SIDEBAR */}
          <Box>
            <Avatar src={user?.avatar} sx={{ width: { xs: 120, md: 260 }, height: { xs: 120, md: 260 }, fontSize: { xs: 44, md: 90 }, fontWeight: 700, bgcolor: "primary.dark", border: "1px solid", borderColor: "divider" }}>
              {displayName.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
            </Avatar>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25 }}>{displayName}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 300, color: "text.secondary", lineHeight: 1.25 }}>{username}</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>{saved.bio || "Student researcher building AI tools for Khmer language and sharing what I learn."}</Typography>
            <Button fullWidth variant="outlined" onClick={() => navigate("/settings?section=account")} sx={{ mb: 2 }}>Edit profile</Button>
            <Stack spacing={1} sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><MapPin size={16} /> {saved.location || "Phnom Penh, Cambodia"}</Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Building2 size={16} /> {saved.university || "RUPP"}</Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Focus</Typography>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2.5 }}>{["AI / ML", "Full-stack", "Research"].map((t) => <Topic key={t} label={t} />)}</Box>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Contributions</Typography>
            <Stack spacing={0.75} sx={{ fontSize: 14, color: "text.secondary" }}>
              <Box><strong>{myProjects.length}</strong> projects</Box>
              <Box><strong>{myTeams.length}</strong> teams</Box>
              <Box><strong>{myRepos.length}</strong> research labs</Box>
              <Box><strong>{myUploads.length}</strong> resources</Box>
              <Box><strong>{myResearch.length}</strong> research papers</Box>
              <Box><strong>{myCapstone.length}</strong> capstone projects</Box>
              <Box><strong>{mine.reduce((s, i) => s + (i.stars || 0), 0)}</strong> stars earned</Box>
            </Stack>
          </Box>

          {/* CONTENT */}
          <Box sx={{ minWidth: 0 }}>
            {tab === "overview" && (
              <Stack spacing={4}>
                <Box>
                  <SectionTitle>Create and publish</SectionTitle>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
                    {quickActions.map(({ title, description, icon: Icon, action }) => (
                      <Box
                        key={title} onClick={action} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && action()}
                        sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: "6px", bgcolor: "background.paper", cursor: "pointer", display: "flex", gap: 1.5, "&:hover": { borderColor: "text.secondary" } }}
                      >
                        <Box sx={{ color: "text.secondary", mt: 0.25 }}><Icon size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "primary.main" }}>{title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>{description}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <SectionTitle>Pinned</SectionTitle>
                  {pinned.length === 0 ? (
                    <EmptyBox icon={<UploadCloud size={32} />} title="Nothing shared yet" text="Upload a resource, create a research lab or publish a project. It will show up here and in Explore." action={<Button variant="contained" onClick={() => setUploadOpen(true)}>Upload a resource</Button>} />
                  ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
                      {pinned.map((item) => <PinnedCard key={item.id} item={item} onView={() => navigate(exploreUrl(item))} />)}
                    </Box>
                  )}
                </Box>

                <Box>
                  <SectionTitle>Recent activity</SectionTitle>
                  {mine.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
                  ) : (
                    <Box sx={{ position: "relative", pl: 3, "&::before": { content: '""', position: "absolute", left: 7, top: 8, bottom: 8, width: 2, bgcolor: "divider" } }}>
                      {mine.slice(0, 6).map((item) => (
                        <Box key={item.id} sx={{ position: "relative", pb: 2 }}>
                          <Box sx={{ position: "absolute", left: -24, top: 4, width: 16, height: 16, borderRadius: "50%", bgcolor: "background.default", border: "2px solid", borderColor: "divider" }} />
                          <Typography variant="body2">
                            {item.kind === "upload" ? "Uploaded " : "Created " + KIND_META[item.kind].label.toLowerCase() + " "}
                            <Box component="span" onClick={() => navigate(exploreUrl(item))} sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}>{item.title}</Box>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{item.updatedAt}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Stack>
            )}

            {tab === "repositories" && (
              <Box>
                <Box sx={{ display: "flex", gap: 1.5, pb: 2, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap" }}>
                  <OutlinedInput size="small" placeholder="Find a research lab…" value={repoQuery} onChange={(e) => setRepoQuery(e.target.value)} startAdornment={<InputAdornment position="start"><Search size={16} /></InputAdornment>} sx={{ flex: 1, minWidth: 220 }} />
                  <TextField select size="small" value={repoType} onChange={(e) => setRepoType(e.target.value)} sx={{ minWidth: 130 }} aria-label="Visibility filter">
                    <MenuItem value="All">Type: All</MenuItem>
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="University">University only</MenuItem>
                  </TextField>
                  <Button size="small" variant="contained" startIcon={<FolderGit2 size={16} />} onClick={() => setRepoOpen(true)}>New Lab</Button>
                </Box>
                {visibleRepos.length === 0 ? (
                  <Box sx={{ pt: 3 }}>
                    <EmptyBox icon={<FolderGit2 size={32} />} title={myRepos.length ? "No research labs match" : "No research labs yet"} text={myRepos.length ? "Try a different search or type." : "Create a research lab to publish your work and invite collaborators."} action={myRepos.length ? null : <Button variant="contained" onClick={() => setRepoOpen(true)}>Create research lab</Button>} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ pt: 2 }}><strong>{visibleRepos.length}</strong> {visibleRepos.length === 1 ? "research lab" : "research labs"}</Typography>
                    {visibleRepos.map((item) => <ListRow key={item.id} item={item} onView={() => navigate(exploreUrl(item))} onRemove={() => handleRemove(item)} />)}
                  </>
                )}
              </Box>
            )}

            {tab === "resources" && (
              <Box>
                <TabHeader
                  left={<><strong>{myUploads.length}</strong> {myUploads.length === 1 ? "resource" : "resources"}</>}
                  right={<Button size="small" variant="contained" startIcon={<Plus size={16} />} onClick={() => setUploadOpen(true)}>Upload Resource</Button>}
                />
                {myUploads.length === 0 ? (
                  <Box sx={{ pt: 3 }}><EmptyBox icon={<FileText size={32} />} title="No uploads yet" text="Share notes, datasets and guides to help other students." action={<Button variant="contained" onClick={() => setUploadOpen(true)}>Upload resource</Button>} /></Box>
                ) : (
                  myUploads.map((item) => <ListRow key={item.id} item={item} onView={() => navigate(exploreUrl(item))} onRemove={() => handleRemove(item)} />)
                )}
              </Box>
            )}

            {tab === "research" && (
              <Box>
                <TabHeader
                  left={<><strong>{myResearch.length}</strong> {myResearch.length === 1 ? "paper" : "papers"} you authored</>}
                  right={<Button size="small" variant="contained" startIcon={<Plus size={15} />} onClick={() => setFormKind("research")}>Create Research</Button>}
                />
                {myResearch.length === 0 ? (
                  <Box sx={{ pt: 3 }}>
                    <EmptyBox icon={<Microscope size={32} />} title="No research yet" text="Create a research workspace, or get listed as an author in Explore → Research." action={<Button variant="contained" onClick={() => setFormKind("research")}>Create Research</Button>} />
                  </Box>
                ) : (
                  <Stack spacing={2} sx={{ pt: 2 }}>
                    {myResearch.map((paper) => (
                      <EntityCard
                        key={paper.id} item={paper} badges={[paper.field, paper.status, paper.university]}
                        subtitle={`Authors: ${paper.authors.join(", ")} · Supervisor: ${paper.supervisor} · ${paper.journal} (${paper.year})`}
                        onExplore={() => navigate(exploreUrl(paper))} onRemove={() => handleRemove(paper)}
                        extraActions={<Button size="small" variant="contained" startIcon={<FolderGit2 size={13} />} onClick={() => openWorkspace(paper)}>Open workspace</Button>}
                      >
                        <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: "6px", mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>ABSTRACT</Typography>
                          <Typography variant="body2" sx={{ fontSize: 13, fontStyle: "italic" }}>"{paper.abstract}"</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">Citations: <strong>{paper.citations}</strong> • Downloads: <strong>{paper.downloads}</strong></Typography>
                      </EntityCard>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {tab === "projects" && (
              <Box>
                <TabHeader
                  left={<><strong>{myProjects.length}</strong> {myProjects.length === 1 ? "project" : "projects"}</>}
                  right={
                    <>
                      <Button size="small" variant="outlined" startIcon={<LayoutGrid size={15} />} onClick={() => navigate("/projects")}>Projects workspace</Button>
                      <Button size="small" variant="contained" startIcon={<Plus size={15} />} onClick={() => setFormKind("project")}>Publish Project</Button>
                    </>
                  }
                />
                {myProjects.length === 0 ? (
                  <Box sx={{ pt: 3 }}>
                    <EmptyBox icon={<LayoutGrid size={32} />} title="No projects yet" text="Publish a project to Explore, or plan one in the Projects workspace." action={<Button variant="contained" onClick={() => setFormKind("project")}>Publish Project</Button>} />
                  </Box>
                ) : (
                  <Stack spacing={2} sx={{ pt: 2 }}>
                    {myProjects.map((proj) => (
                      <EntityCard
                        key={proj.id} item={proj} badges={[proj.type, proj.status]} onExplore={() => navigate(exploreUrl(proj))} onRemove={() => handleRemove(proj)}
                        extraActions={proj.sample && proj.id <= 4 ? <Button size="small" variant="outlined" onClick={() => navigate(`/projects?project=${proj.id}&tab=overview`)}>Workspace</Button> : null}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1 }}>{proj.description}</Typography>
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", fontSize: 12, color: "text.secondary", alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Star size={13} /> {proj.stars}</Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Building2 size={13} /> {proj.university}</Box>
                          <Chip label={proj.technology} size="small" variant="outlined" sx={{ fontSize: 11, height: 18 }} />
                          <span>Updated {proj.updatedAt}</span>
                        </Box>
                      </EntityCard>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {tab === "teams" && (
              <Box>
                <TabHeader
                  left={<><strong>{myTeams.length}</strong> {myTeams.length === 1 ? "team" : "teams"} you belong to</>}
                  right={<Button size="small" variant="contained" startIcon={<Plus size={15} />} onClick={() => setFormKind("team")}>Create Team</Button>}
                />
                {myTeams.length === 0 ? (
                  <Box sx={{ pt: 3 }}>
                    <EmptyBox icon={<Users2 size={32} />} title="Not part of any team yet" text="Create a team, or apply to one in Explore → Teams." action={<Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}><Button variant="contained" onClick={() => setFormKind("team")}>Create Team</Button><Button variant="outlined" onClick={() => goExplore("teams")}>Browse teams</Button></Box>} />
                  </Box>
                ) : (
                  <Stack spacing={2} sx={{ pt: 2 }}>
                    {myTeams.map((team) => (
                      <EntityCard
                        key={team.id} item={team} badges={[team.type, team.status]}
                        subtitle={`${team.projectTitle} · Led by ${team.leader} · ${team.university}`}
                        onExplore={() => navigate(exploreUrl(team))} onRemove={() => handleRemove(team)}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1 }}>{team.description}</Typography>
                        <Tags list={team.techStack} />
                        <Typography variant="caption" color="text.secondary">
                          {team.members.length}/{team.maxMembers} members{team.lookingFor.length > 0 && ` · Looking for: ${team.lookingFor.join(", ")}`}
                        </Typography>
                      </EntityCard>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {tab === "capstone" && (
              <Box>
                <TabHeader
                  left={<><strong>{myCapstone.length}</strong> capstone project{myCapstone.length !== 1 ? "s" : ""}</>}
                  right={<Button size="small" variant="contained" startIcon={<Plus size={15} />} onClick={() => setFormKind("capstone")}>Create Capstone</Button>}
                />
                {myCapstone.length === 0 ? (
                  <Box sx={{ pt: 3 }}>
                    <EmptyBox icon={<Trophy size={32} />} title="No capstone projects yet" text="Create your capstone and showcase your graduation work." action={<Button variant="contained" onClick={() => setFormKind("capstone")}>Create Capstone</Button>} />
                  </Box>
                ) : (
                  <Stack spacing={2} sx={{ pt: 2 }}>
                    {myCapstone.map((cap) => (
                      <EntityCard
                        key={cap.id} item={cap} badges={[cap.grade]}
                        subtitle={`${cap.university} · ${cap.year} · Advisor: ${cap.advisor} · Sponsor: ${cap.sponsor}`}
                        onExplore={() => navigate(exploreUrl(cap))} onRemove={() => handleRemove(cap)}
                        extraActions={cap.demoUrl ? <Button size="small" variant="outlined" onClick={() => window.open(cap.demoUrl, "_blank", "noopener")}>Live demo</Button> : null}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>{cap.summary}</Typography>
                        <Tags list={cap.techStack} />
                        <Typography variant="caption" color="text.secondary">Team: {cap.team.join(", ")}</Typography>
                      </EntityCard>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {dialogs}
    </DashboardLayout>
  );
}