import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  File,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  History as HistoryIcon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

/**
 * GitHub-style research workspace: file tree, breadcrumb, commit bar and a
 * Code / Blame / Preview viewer. Used by Explore (read-only unless you are an
 * author) and by Profile → Research (editable). Edits and new files are saved
 * in localStorage per paper.
 */

const isDarkTheme = (theme) => theme.palette.mode === "dark";
const surfaceBg = (theme) => (isDarkTheme(theme) ? "#0d1117" : "background.paper");
const raisedBg = (theme) => (isDarkTheme(theme) ? "#161b22" : "#f6f8fa");
const lineColor = (theme) => (isDarkTheme(theme) ? "#30363d" : "divider");
const subtleLine = (theme) => (isDarkTheme(theme) ? "#21262d" : "divider");
const monoFont = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

const formatBytes = (bytes) => (bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`);

// --- RESEARCH REPOSITORY HELPERS ---

const BINARY_FILE_TYPES = ["pdf", "docx", "xlsx", "png", "pt"];

const getResearchRepositoryFiles = (paper) => {
  if (!paper) return [];
  return [
    { name: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" },
    { name: "paper.pdf", type: "pdf", size: "1.8 MB", updated: "2 hours ago" },
    { name: "supplementary.docx", type: "docx", size: "420 KB", updated: "1 day ago" },
    { name: "evaluation-results.xlsx", type: "xlsx", size: "96 KB", updated: "3 days ago" },
    { name: "requirements.txt", type: "txt", size: "1 KB", updated: "1 week ago" },
    {
      name: "configs",
      type: "folder",
      children: [{ name: "default.yaml", type: "yaml", size: "3 KB", updated: "5 days ago" }],
    },
    {
      name: "data",
      type: "folder",
      children: [
        {
          name: "raw",
          type: "folder",
          children: [
            { name: "inscriptions.csv", type: "csv", size: "4.2 MB", updated: "2 weeks ago" },
            { name: "source-catalog.json", type: "json", size: "180 KB", updated: "2 weeks ago" },
          ],
        },
        {
          name: "processed",
          type: "folder",
          children: [
            { name: "train.jsonl", type: "jsonl", size: "22 MB", updated: "1 week ago" },
            { name: "validation.jsonl", type: "jsonl", size: "3.4 MB", updated: "1 week ago" },
            { name: "test.jsonl", type: "jsonl", size: "3.1 MB", updated: "1 week ago" },
          ],
        },
      ],
    },
    {
      name: "docs",
      type: "folder",
      children: [
        { name: "dataset-notes.md", type: "md", size: "8 KB", updated: "1 week ago" },
        { name: "methodology.md", type: "md", size: "11 KB", updated: "5 days ago" },
        { name: "citation.bib", type: "bib", size: "2 KB", updated: "3 days ago" },
      ],
    },
    {
      name: "figures",
      type: "folder",
      children: [
        { name: "architecture.png", type: "png", size: "640 KB", updated: "4 days ago" },
        { name: "accuracy-by-noise.svg", type: "svg", size: "42 KB", updated: "3 days ago" },
      ],
    },
    {
      name: "notebooks",
      type: "folder",
      children: [
        { name: "01_dataset_review.ipynb", type: "ipynb", size: "1.2 MB", updated: "2 weeks ago" },
        { name: "02_model_evaluation.ipynb", type: "ipynb", size: "860 KB", updated: "4 days ago" },
      ],
    },
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "models",
          type: "folder",
          children: [
            {
              name: "transformer",
              type: "folder",
              children: [
                { name: "encoder.py", type: "py", size: "14 KB", updated: "1 week ago" },
                { name: "decoder.py", type: "py", size: "12 KB", updated: "1 week ago" },
                { name: "attention.py", type: "py", size: "8 KB", updated: "1 week ago" },
              ],
            },
            { name: "ocr_model.py", type: "py", size: "18 KB", updated: "1 week ago" },
          ],
        },
        {
          name: "utils",
          type: "folder",
          children: [
            { name: "preprocessing.py", type: "py", size: "9 KB", updated: "1 week ago" },
            { name: "tokenizer.py", type: "py", size: "6 KB", updated: "6 days ago" },
          ],
        },
        { name: "train.py", type: "py", size: "11 KB", updated: "5 days ago" },
        { name: "evaluate.py", type: "py", size: "8 KB", updated: "4 days ago" },
      ],
    },
    {
      name: "tests",
      type: "folder",
      children: [
        { name: "test_preprocessing.py", type: "py", size: "5 KB", updated: "6 days ago" },
        { name: "test_ocr_model.py", type: "py", size: "7 KB", updated: "4 days ago" },
      ],
    },
    {
      name: "outputs",
      type: "folder",
      children: [
        {
          name: "checkpoints",
          type: "folder",
          children: [
            { name: "best_model.pt", type: "pt", size: "420 MB", updated: "2 days ago" },
            { name: "config.yaml", type: "yaml", size: "3 KB", updated: "2 days ago" },
          ],
        },
        { name: "metrics-summary.json", type: "json", size: "12 KB", updated: "2 days ago" },
      ],
    },
    { name: "dataset-notes.md", type: "md", size: "8 KB", updated: "1 week ago" },
  ];
};

// Folders first, then files, both alphabetical (same as GitHub)
const sortRepositoryEntries = (files) =>
  [...files].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

const buildReadmeSource = (paper) => `# ${paper.title}

${paper.authors.join(", ")} · ${paper.university} · ${paper.year}

## Project Overview

This repository accompanies the research published in ${paper.journal}. It brings together the project notes, source code, data-processing assets, and evaluation materials used to support the study.

## Abstract

${paper.abstract}

## Research Goals

- Define a reproducible approach to the problem described in the paper.
- Document the assumptions, data preparation, and evaluation choices used in the study.
- Make supporting materials understandable and reusable by other student research teams.

## Repository Structure

configs/        Experiment configuration files
data/           Original and processed research data
docs/           Methodology, dataset notes, and citation details
figures/        Diagrams and visual summaries
notebooks/      Exploratory analysis and evaluation notebooks
requirements.txt Python dependencies
src/            Research implementation and model code
tests/          Data and implementation checks
outputs/        Experiment summaries and model checkpoints

## Methodology

The workflow is divided into four stages: source review, data preparation, implementation, and evaluation. Raw inputs are kept separate from processed artifacts so that transformations can be inspected.

1. Review source material and define inclusion criteria before preparing data.
2. Apply documented cleaning and normalization steps.
3. Run the implementation using the checked-in configuration.
4. Compare results against the stated baseline and inspect representative errors.

## Environment and Reproduction

python -m venv .venv
pip install -r requirements.txt
python src/train.py --config configs/default.yaml
python src/evaluate.py --checkpoint outputs/checkpoints/best_model.pt

## Evaluation and Findings

The paper reports the primary findings and their evaluation protocol. Use the same data splits and preprocessing configuration for a fair comparison.

## Limitations and Future Work

Results depend on the coverage and quality of the available data, the selected evaluation protocol, and the assumptions documented by the authors.

## Authors

${paper.authors.map((a) => `- ${a}`).join("\n")}

## Citation

${paper.authors.join(", ")}. (${paper.year}). ${paper.title}. ${paper.journal}.
`;

const buildResearchFileContent = (file, paper) => {
  if (!file || !paper) return "";
  const { name, type } = file;
  switch (type) {
    case "md":
      return name === "README.md"
        ? buildReadmeSource(paper)
        : `# ${name.replace(".md", "")}\n\nNotes for "${paper.title}".\n\n## Summary\n\nThis document records decisions, assumptions, and open questions for the study.\n\n## Next steps\n\n- Review the data preparation steps\n- Re-run the evaluation with the latest checkpoint\n- Update the citation details\n`;
    case "py":
      return `# ${name}\n# Part of: ${paper.title}\n\nimport argparse\nimport json\nfrom pathlib import Path\n\n\ndef load_config(path: str) -> dict:\n    with open(path, "r", encoding="utf-8") as handle:\n        return json.load(handle)\n\n\ndef main() -> None:\n    parser = argparse.ArgumentParser(description="${name}")\n    parser.add_argument("--config", type=str, default="configs/default.yaml")\n    args = parser.parse_args()\n\n    config_path = Path(args.config)\n    print(f"Using config: {config_path}")\n\n\nif __name__ == "__main__":\n    main()\n`;
    case "yaml":
      return `# ${name}\nseed: 42\nmodel:\n  name: transformer-ocr\n  layers: 6\n  heads: 8\n  hidden_size: 512\ntraining:\n  batch_size: 32\n  epochs: 40\n  learning_rate: 0.0003\ndata:\n  train: data/processed/train.jsonl\n  validation: data/processed/validation.jsonl\n  test: data/processed/test.jsonl\n`;
    case "json":
      return `{\n  "project": "${paper.title.replace(/"/g, "'")}",\n  "university": "${paper.university}",\n  "year": ${paper.year},\n  "metrics": {\n    "accuracy": 0.942,\n    "samples": 12840\n  }\n}\n`;
    case "jsonl":
      return `{"id": 1, "text": "sample inscription line 1", "label": "ok"}\n{"id": 2, "text": "sample inscription line 2", "label": "ok"}\n{"id": 3, "text": "sample inscription line 3", "label": "noisy"}\n{"id": 4, "text": "sample inscription line 4", "label": "ok"}\n`;
    case "csv":
      return `id,source,century,condition,notes\n1,Angkor-A,10,good,clear carving\n2,Angkor-B,10,degraded,partial erosion\n3,Roluos-C,9,degraded,heavy lichen\n4,Banteay-D,12,good,high contrast\n`;
    case "txt":
      return `torch>=2.2\nnumpy>=1.26\npandas>=2.1\nopencv-python>=4.9\nscikit-learn>=1.4\nPyYAML>=6.0\npytest>=8.0\n`;
    case "bib":
      return `@article{${paper.authors[0].split(" ").pop().toLowerCase()}${paper.year},\n  title   = {${paper.title}},\n  author  = {${paper.authors.join(" and ")}},\n  journal = {${paper.journal}},\n  year    = {${paper.year}}\n}\n`;
    case "ipynb":
      return `{\n  "cells": [\n    { "cell_type": "markdown", "source": ["# ${name}"] },\n    { "cell_type": "code", "source": ["import pandas as pd"] }\n  ],\n  "nbformat": 4,\n  "nbformat_minor": 5\n}\n`;
    case "svg":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">\n  <rect width="320" height="120" fill="#f6f8fa" />\n  <text x="16" y="64" font-size="14">${name}</text>\n</svg>\n`;
    default:
      return `# ${name}\n# New file in ${paper.title}\n`;
  }
};

const countLines = (content) => {
  const lines = content.replace(/\n$/, "").split("\n");
  const loc = lines.filter((line) => line.trim() !== "").length;
  return { lines: lines.length, loc };
};

const downloadTextFile = (name, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const openRawText = (text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// Small joined icon-button group used in the file toolbar
const groupBtnSx = {
  borderRadius: 0,
  px: 1.1,
  color: "text.primary",
  "&:not(:last-of-type)": { borderRight: "1px solid", borderColor: lineColor },
};


const README_FILE = { name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" };

export default function ResearchWorkspace({ paper, onClose, editable = false }) {
  const selectedResearchPaper = paper;
  const closeResearchPaper = onClose;
  const storageKey = `uniforge.research.workspace.${paper.id}`;

  const loadWorkspace = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };

  const [selectedResearchFile, setSelectedResearchFile] = useState(README_FILE);
  const [expandedResearchFolders, setExpandedResearchFolders] = useState({ src: true });
  const [isResearchFileTreeOpen, setIsResearchFileTreeOpen] = useState(true);
  const [researchFileSearch, setResearchFileSearch] = useState("");
  const [isAddingResearchFile, setIsAddingResearchFile] = useState(false);
  const [newResearchFileName, setNewResearchFileName] = useState("");
  const [additionalResearchFiles, setAdditionalResearchFiles] = useState(() => loadWorkspace().extra || []);
  const [edits, setEdits] = useState(() => loadWorkspace().edits || {});
  const [fileViewMode, setFileViewMode] = useState("preview"); // preview | code | blame
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const researchFileSearchRef = useRef(null);

  // Persist new files and edits
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ extra: additionalResearchFiles, edits }));
    } catch {
      /* storage unavailable */
    }
  }, [storageKey, additionalResearchFiles, edits]);

  // Reset view mode (and leave edit mode) whenever another file is opened
  useEffect(() => {
    setEditing(false);
    setFileViewMode(selectedResearchFile.type === "md" ? "preview" : "code");
  }, [selectedResearchFile.path]);

  // GitHub-style "T" shortcut: jump to the file search box
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;
      if (event.key.toLowerCase() === "t" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setIsResearchFileTreeOpen(true);
        setTimeout(() => researchFileSearchRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const saveEdit = (path, text) => {
    setEdits((current) => ({ ...current, [path]: text }));
    setEditing(false);
  };
  const discardEdit = (path) =>
    setEdits((current) => {
      const next = { ...current };
      delete next[path];
      return next;
    });

  const filterResearchFileTree = (files, parentPath = "") => {
    const query = researchFileSearch.trim().toLowerCase();
    if (!query) return files;

    return files.flatMap((file) => {
      const path = parentPath ? `${parentPath}/${file.name}` : file.name;
      const matches = path.toLowerCase().includes(query);
      if (file.type === "folder") {
        if (matches) return [file];
        const children = filterResearchFileTree(file.children || [], path);
        return children.length > 0 ? [{ ...file, children }] : [];
      }
      return matches ? [file] : [];
    });
  };

  const handleAddResearchFile = () => {
    const name = newResearchFileName.trim();
    if (!name || name.includes("/") || name.includes("\\")) return;

    const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "file";
    const file = { name, type: extension, size: "0 KB", updated: "Just now", path: name };
    setAdditionalResearchFiles((current) => (current.some((item) => item.name === name) ? current : [...current, file]));
    setSelectedResearchFile(file);
    setNewResearchFileName("");
    setIsAddingResearchFile(false);
  };

  const renderResearchFileTree = (files, parentPath = "", depth = 0) =>
    sortRepositoryEntries(files).map((file) => {
      const path = parentPath ? `${parentPath}/${file.name}` : file.name;
      const isFolder = file.type === "folder";
      const isSelected = !isFolder && selectedResearchFile?.path === path;
      const isExpanded = isFolder && (Boolean(expandedResearchFolders[path]) || Boolean(researchFileSearch.trim()));

      return (
        <Box key={path}>
          <Box
            role="treeitem"
            aria-expanded={isFolder ? isExpanded : undefined}
            aria-selected={isSelected}
            onClick={() => {
              if (isFolder) {
                setExpandedResearchFolders((current) => ({ ...current, [path]: !current[path] }));
              } else {
                setSelectedResearchFile({ ...file, path });
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              pl: 1.5 + depth * 1.75,
              pr: 1.5,
              height: 34,
              mr: 1.5,
              cursor: "pointer",
              position: "relative",
              borderRadius: "6px",
              fontSize: 14,
              bgcolor: isSelected ? (theme) => (isDarkTheme(theme) ? "#262c36" : "action.selected") : "transparent",
              color: "text.primary",
              "&::before": isSelected
                ? {
                    content: '""',
                    position: "absolute",
                    left: -12,
                    top: 4,
                    bottom: 4,
                    width: "4px",
                    bgcolor: "#4493f8",
                    borderRadius: "2px",
                  }
                : {},
              "&:hover": { bgcolor: (theme) => (isDarkTheme(theme) ? "#21262d" : "action.hover") },
            }}
          >
            {isFolder ? (
              isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <Box sx={{ width: 14, flexShrink: 0 }} />
            )}
            {isFolder ? (
              isExpanded ? (
                <FolderOpen size={18} color="#9198a1" fill="#9198a1" fillOpacity={0.85} />
              ) : (
                <Folder size={18} color="#9198a1" fill="#9198a1" fillOpacity={0.85} />
              )
            ) : file.type === "md" ? (
              <FileText size={18} color="#9198a1" />
            ) : (
              <File size={18} color="#9198a1" />
            )}
            <Typography noWrap sx={{ fontSize: 14, fontWeight: isSelected ? 600 : 400 }}>
              {file.name}
            </Typography>
          </Box>
          {isFolder && isExpanded && file.children?.length > 0 && renderResearchFileTree(file.children, path, depth + 1)}
        </Box>
      );
    });

  // Rendered README (markdown preview)
  const renderReadmePreview = (paper) => (
    <Box
      sx={{
        px: { xs: 2.5, md: 4 },
        py: { xs: 3, md: 4 },
        "& h1": { fontSize: { xs: 28, md: 34 }, lineHeight: 1.2, mb: 1.5 },
        "& h2": { fontSize: { xs: 20, md: 24 }, mt: 4, mb: 1.5, pb: 1, borderBottom: "1px solid", borderColor: lineColor },
        "& p": { fontSize: 15.5, lineHeight: 1.75 },
      }}
    >
      <Typography component="h1" variant="h3" fontWeight={700}>{paper.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {paper.authors.join(", ")} · {paper.university} · {paper.year}
      </Typography>
      <Typography component="h2" variant="h5" fontWeight={700}>Project Overview</Typography>
      <Typography variant="body1">
        This repository accompanies the research published in {paper.journal}. It brings together the project notes, source code, data-processing assets, and evaluation materials used to support the study. The files are organized so readers can follow the work from its research question through implementation and reported findings.
      </Typography>
      <Typography component="h2" variant="h5" fontWeight={700}>Abstract</Typography>
      <Typography variant="body1">{paper.abstract}</Typography>
      <Typography component="h2" variant="h5" fontWeight={700}>Research Goals</Typography>
      <Box component="ul" sx={{ pl: 3, m: 0 }}>
        <Typography component="li" sx={{ mb: 0.8 }}>Define a reproducible approach to the problem described in the paper.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Document the assumptions, data preparation, and evaluation choices used in the study.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Make supporting materials understandable and reusable by other student research teams.</Typography>
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Repository Structure</Typography>
      <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, lineHeight: 1.7, fontFamily: monoFont }}>
        {`configs/        Experiment configuration files\ndata/           Original and processed research data\ndocs/           Methodology, dataset notes, and citation details\nfigures/        Diagrams and visual summaries\nnotebooks/      Exploratory analysis and evaluation notebooks\nrequirements.txt Python dependencies\nsrc/            Research implementation and model code\ntests/          Data and implementation checks\noutputs/        Experiment summaries and model checkpoints`}
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Methodology</Typography>
      <Typography variant="body1">
        The workflow is divided into four stages: source review, data preparation, implementation, and evaluation. Raw inputs are kept separate from processed artifacts so that transformations can be inspected. Experiments should record the dataset version, configuration, random seed, and software environment alongside their outputs.
      </Typography>
      <Box component="ol" sx={{ pl: 3, my: 1 }}>
        <Typography component="li" sx={{ mb: 0.8 }}>Review source material and define inclusion criteria before preparing data.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Apply documented cleaning and normalization steps; retain a record of excluded or changed samples.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Run the implementation using the checked-in configuration and save outputs with descriptive experiment names.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Compare results against the stated baseline and inspect representative errors, not only aggregate scores.</Typography>
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Environment and Reproduction</Typography>
      <Typography variant="body1">
        Use a separate virtual environment and record package versions when reproducing the experiments. Large source datasets and trained checkpoints may need to be obtained separately; consult the dataset notes before running any experiment.
      </Typography>
      <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, lineHeight: 1.7, fontFamily: monoFont }}>
        {`python -m venv .venv\n# Activate the environment for your operating system\npip install -r requirements.txt\npython src/train.py --config configs/default.yaml\npython src/evaluate.py --checkpoint outputs/checkpoints/best_model.pt`}
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Evaluation and Findings</Typography>
      <Typography variant="body1">
        The paper reports the primary findings and their evaluation protocol. For a fair comparison, use the same data splits and preprocessing configuration, and report the metric definition, sample count, and any variance across repeated runs. The evaluation-results spreadsheet and notebooks contain the supporting breakdowns for review.
      </Typography>
      <Box component="ul" sx={{ pl: 3, m: 0 }}>
        <Typography component="li" sx={{ mb: 0.8 }}>Compare the proposed approach with the baseline described in the paper.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Review performance across relevant data subsets and difficult examples.</Typography>
        <Typography component="li" sx={{ mb: 0.8 }}>Treat reported scores as study results, not as a guarantee of performance on new data.</Typography>
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Limitations and Future Work</Typography>
      <Typography variant="body1">
        Results depend on the coverage and quality of the available data, the selected evaluation protocol, and the assumptions documented by the authors. Further work should test the approach on broader datasets, report additional error analyses, and evaluate how well the findings transfer to other settings.
      </Typography>
      <Typography component="h2" variant="h5" fontWeight={700}>Authors</Typography>
      <Box component="ul" sx={{ pl: 3, m: 0 }}>
        {paper.authors.map((author) => (
          <Typography component="li" key={author} sx={{ mb: 0.8 }}>{author}</Typography>
        ))}
      </Box>
      <Typography component="h2" variant="h5" fontWeight={700}>Citation</Typography>
      <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, whiteSpace: "pre-wrap", fontFamily: monoFont }}>
        {`${paper.authors.join(", ")}. (${paper.year}). ${paper.title}. ${paper.journal}.`}
      </Box>
    </Box>
  );

  // Line-numbered code / blame view
  const renderCodeLines = (content, paper, file, withBlame) => {
    const lines = content.replace(/\n$/, "").split("\n");
    const hash = (paper.id * 7919).toString(16).slice(0, 7).padEnd(7, "0");
    const author = paper.authors[0];
    return (
      <Box sx={{ py: 1.5, overflowX: "auto", fontFamily: monoFont, fontSize: 12.5, lineHeight: "20px" }}>
        {lines.map((text, index) => {
          const isChunkStart = index % 8 === 0;
          return (
            <Box key={index} sx={{ display: "flex", minWidth: "max-content", "&:hover": { bgcolor: (theme) => (isDarkTheme(theme) ? "rgba(110,118,129,0.1)" : "rgba(0,0,0,0.03)") } }}>
              {withBlame && (
                <Box
                  sx={{
                    width: 230,
                    flexShrink: 0,
                    px: 1.5,
                    display: "flex",
                    gap: 1,
                    color: "text.secondary",
                    borderRight: "1px solid",
                    borderColor: subtleLine,
                    borderTop: isChunkStart && index !== 0 ? "1px solid" : 0,
                    borderTopColor: subtleLine,
                  }}
                >
                  {isChunkStart && (
                    <>
                      <Box component="span" sx={{ color: "primary.main" }}>{hash}</Box>
                      <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{author}</Box>
                    </>
                  )}
                </Box>
              )}
              <Box sx={{ width: 64, flexShrink: 0, pr: 2, textAlign: "right", color: "text.secondary", userSelect: "none" }}>
                {index + 1}
              </Box>
              <Box component="pre" sx={{ m: 0, pr: 3, fontFamily: "inherit", whiteSpace: "pre", color: "text.primary" }}>
                {text || " "}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // The whole GitHub-style research repository viewer
  const renderResearchRepository = () => {
    const paper = selectedResearchPaper;
    const file = selectedResearchFile || { name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" };
    const isMarkdown = file.type === "md";
    const isBinary = BINARY_FILE_TYPES.includes(file.type);
    const filePath = file.path || file.name;
    const storedContent = edits[filePath];
    const content = isBinary ? "" : storedContent ?? buildResearchFileContent(file, paper);
    const sizeLabel = storedContent !== undefined ? formatBytes(content.length) : file.size || "0 KB";
    const stats = countLines(content);
    const pathParts = filePath.split("/");
    const shownTree = filterResearchFileTree([...getResearchRepositoryFiles(paper), ...additionalResearchFiles]);
    const hashSeed = storedContent !== undefined ? content.length * 31 + filePath.length : String(paper.id).split("").reduce((n, c) => n * 31 + c.charCodeAt(0), 7) * 7919;
    const commitHash = (Math.abs(hashSeed) >>> 0).toString(16).slice(0, 7).padEnd(7, "0");
    const commitMessage = storedContent !== undefined
      ? `docs: edit ${file.name}`
      : file.name === "README.md"
        ? "docs: publish research repository overview"
        : `chore: update ${file.name}`;
    const treeWidth = "clamp(260px, 22vw, 320px)";

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isResearchFileTreeOpen ? { xs: "minmax(0, 1fr)", md: `${treeWidth} minmax(0, 1fr)` } : "minmax(0, 1fr)",
          minHeight: "calc(100vh - 62px)",
          bgcolor: surfaceBg,
        }}
      >
        {/* ---------- LEFT: FILES PANEL ---------- */}
        {isResearchFileTreeOpen && (
          <Box
            component="aside"
            aria-label="Research repository files"
            sx={{
              borderRight: { md: "1px solid" },
              borderBottom: { xs: "1px solid", md: 0 },
              borderColor: lineColor,
              position: { md: "sticky" },
              top: 0,
              alignSelf: "start",
              height: { xs: "auto", md: "calc(100vh - 62px)" },
              maxHeight: { xs: "70vh", md: "none" },
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, height: 64, flexShrink: 0 }}>
              <Tooltip title="Collapse file tree">
                <IconButton
                  aria-label="Hide files panel"
                  onClick={() => setIsResearchFileTreeOpen(false)}
                  sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 40, height: 40 }}
                >
                  <PanelLeftClose size={18} />
                </IconButton>
              </Tooltip>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Files</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, pb: 1.5, flexShrink: 0 }}>
              <Button
                variant="outlined"
                startIcon={<GitBranch size={16} />}
                endIcon={<ChevronDown size={14} />}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: 40,
                  justifyContent: "flex-start",
                  color: "text.primary",
                  borderColor: lineColor,
                  bgcolor: raisedBg,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  "& .MuiButton-endIcon": { ml: "auto" },
                }}
              >
                main
              </Button>
              <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", bgcolor: raisedBg, height: 40 }}>
                <Tooltip title="Add file">
                  <IconButton
                    aria-label="Add file"
                    onClick={() => setIsAddingResearchFile((open) => !open)}
                    sx={{ borderRadius: 0, px: 1.1, borderRight: "1px solid", borderColor: lineColor }}
                  >
                    <Plus size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Go to file">
                  <IconButton aria-label="Search files" onClick={() => researchFileSearchRef.current?.focus()} sx={{ borderRadius: 0, px: 1.1 }}>
                    <Search size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ px: 2, pb: 1.5, flexShrink: 0, display: "grid", gap: 1 }}>
              <OutlinedInput
                inputRef={researchFileSearchRef}
                fullWidth
                size="small"
                value={researchFileSearch}
                onChange={(event) => setResearchFileSearch(event.target.value)}
                placeholder="Go to file"
                startAdornment={<InputAdornment position="start"><Search size={17} /></InputAdornment>}
                endAdornment={
                  researchFileSearch ? (
                    <IconButton size="small" aria-label="Clear search" onClick={() => setResearchFileSearch("")}>
                      <RotateCcw size={14} />
                    </IconButton>
                  ) : (
                    <Box component="kbd" sx={{ px: 0.9, py: 0.1, border: "1px solid", borderColor: lineColor, borderRadius: "4px", color: "text.secondary", fontSize: 12, fontFamily: monoFont }}>
                      T
                    </Box>
                  )
                }
                sx={{ height: 44, fontSize: 15, borderRadius: "6px", bgcolor: surfaceBg, "& fieldset": { borderColor: lineColor } }}
              />
              {isAddingResearchFile && (
                <OutlinedInput
                  autoFocus
                  fullWidth
                  size="small"
                  value={newResearchFileName}
                  onChange={(event) => setNewResearchFileName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleAddResearchFile();
                    if (event.key === "Escape") setIsAddingResearchFile(false);
                  }}
                  placeholder="New file name (e.g. notes.md)"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton size="small" aria-label="Create file" onClick={handleAddResearchFile}>
                        <Check size={16} />
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{ fontSize: 13, "& fieldset": { borderColor: lineColor } }}
                />
              )}
            </Box>

            <Divider sx={{ borderColor: lineColor }} />

            <Box role="tree" sx={{ py: 1.25, overflowY: "auto", overscrollBehavior: "contain", flex: 1, minHeight: 0, pl: 1.5 }}>
              {shownTree.length > 0 ? (
                renderResearchFileTree(shownTree)
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, py: 1, display: "block" }}>
                  No matching files
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* ---------- RIGHT: FILE VIEWER ---------- */}
        <Box component="section" sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: { xs: 2, md: 3 }, height: 64 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0, flex: 1 }}>
              {!isResearchFileTreeOpen && (
                <Tooltip title="Show file tree">
                  <IconButton
                    aria-label="Show files panel"
                    onClick={() => setIsResearchFileTreeOpen(true)}
                    sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 36, height: 36, mr: 0.75 }}
                  >
                    <PanelLeftOpen size={18} />
                  </IconButton>
                </Tooltip>
              )}
              <Box
                component="button"
                type="button"
                onClick={closeResearchPaper}
                sx={{ all: "unset", cursor: "pointer", flexShrink: 0, fontSize: 20, color: "primary.main", "&:hover": { textDecoration: "underline" } }}
              >
                Research
              </Box>
              <Typography sx={{ fontSize: 20, color: "text.secondary" }}>/</Typography>
              <Typography
                noWrap
                title={paper.title}
                onClick={() => setSelectedResearchFile({ name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" })}
                sx={{ fontSize: 20, color: "primary.main", cursor: "pointer", maxWidth: { xs: 120, md: 300 }, flexShrink: 1, "&:hover": { textDecoration: "underline" } }}
              >
                {paper.title}
              </Typography>
              {pathParts.map((part, index) => {
                const isLast = index === pathParts.length - 1;
                return (
                  <Box key={`${part}-${index}`} sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0, flexShrink: isLast ? 0 : 1 }}>
                    <Typography sx={{ fontSize: 20, color: "text.secondary" }}>/</Typography>
                    <Typography noWrap sx={{ fontSize: 20, fontWeight: isLast ? 700 : 400, color: isLast ? "text.primary" : "primary.main" }}>
                      {part}
                    </Typography>
                  </Box>
                );
              })}
              <Tooltip title="Copy file path">
                <IconButton
                  size="small"
                  aria-label="Copy file path"
                  onClick={() => navigator.clipboard?.writeText(`${paper.title}/${file.path || file.name}`)}
                  sx={{ ml: 0.5 }}
                >
                  <Copy size={18} />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title="More options">
              <IconButton aria-label="More options" sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 44, height: 40, bgcolor: raisedBg }}>
                <MoreHorizontal size={18} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
            {/* Latest commit bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                px: 2,
                py: 1.25,
                mb: 2,
                border: "1px solid",
                borderColor: lineColor,
                borderRadius: "6px",
                bgcolor: surfaceBg,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "primary.main" }}>
                  {paper.authors[0].split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </Avatar>
                <Typography noWrap sx={{ fontWeight: 600, fontSize: 15 }}>{paper.authors[0]}</Typography>
                <Typography noWrap color="text.secondary" sx={{ fontSize: 15, minWidth: 0 }}>{commitMessage}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", color: "#3fb950", flexShrink: 0 }}>
                  <Check size={18} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                <Typography color="text.secondary" sx={{ fontSize: 13, fontFamily: monoFont }}>
                  {commitHash} · {storedContent !== undefined ? "just now" : file.updated || "recently"}
                </Typography>
                <Button size="small" startIcon={<HistoryIcon size={16} />} sx={{ textTransform: "none", fontWeight: 600, color: "text.primary" }}>
                  History
                </Button>
              </Box>
            </Box>

            {/* File card */}
            <Box sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: surfaceBg }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: lineColor,
                  bgcolor: raisedBg,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, minWidth: 0 }}>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={fileViewMode}
                    onChange={(_, value) => value && setFileViewMode(value)}
                    aria-label="File view mode"
                    sx={{
                      "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 600, fontSize: 15, px: 2, py: 0.5, color: "text.primary", borderColor: lineColor },
                      "& .Mui-selected": { bgcolor: (theme) => (isDarkTheme(theme) ? "#0d1117 !important" : "background.paper") },
                    }}
                  >
                    {isMarkdown && <ToggleButton value="preview">Preview</ToggleButton>}
                    <ToggleButton value="code">Code</ToggleButton>
                    <ToggleButton value="blame" disabled={isBinary}>Blame</ToggleButton>
                  </ToggleButtonGroup>
                  <Typography noWrap color="text.secondary" sx={{ fontSize: 13, fontFamily: monoFont }}>
                    {isBinary ? `Binary file · ${sizeLabel}` : `${stats.lines} lines (${stats.loc} loc) · ${sizeLabel}`}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: raisedBg }}>
                    <Button size="small" disabled={isBinary} onClick={() => openRawText(content)} sx={{ ...groupBtnSx, textTransform: "none", fontWeight: 600, px: 1.5 }}>
                      Raw
                    </Button>
                    <Tooltip title="Copy raw file">
                      <span>
                        <IconButton disabled={isBinary} aria-label="Copy raw file" onClick={() => navigator.clipboard?.writeText(content)} sx={groupBtnSx}>
                          <Copy size={17} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Download raw file">
                      <span>
                        <IconButton disabled={isBinary} aria-label="Download raw file" onClick={() => downloadTextFile(file.name, content)} sx={groupBtnSx}>
                          <Download size={17} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: raisedBg }}>
                    <Tooltip title={!editable ? "Only the authors can edit this research" : isBinary ? "Binary files can't be edited here" : "Edit file"}>
                      <span>
                        <IconButton
                          aria-label="Edit file"
                          disabled={!editable || isBinary}
                          onClick={() => { setDraft(content); setEditing(true); setFileViewMode("code"); }}
                          sx={groupBtnSx}
                        >
                          <Pencil size={17} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <IconButton aria-label="More edit options" sx={{ ...groupBtnSx, px: 0.6 }}>
                      <ChevronDown size={15} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {editing && !isBinary ? (
                <Box sx={{ p: 2 }}>
                  <TextField
                    autoFocus
                    fullWidth
                    multiline
                    minRows={14}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    slotProps={{ htmlInput: { style: { fontFamily: monoFont, fontSize: 13, lineHeight: "20px" }, "aria-label": `Edit ${file.name}` } }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    <Box>
                      {storedContent !== undefined && (
                        <Button size="small" color="inherit" onClick={() => { discardEdit(filePath); setEditing(false); }} sx={{ textTransform: "none" }}>
                          Discard saved changes
                        </Button>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="outlined" color="inherit" onClick={() => setEditing(false)} sx={{ textTransform: "none", borderColor: lineColor }}>Cancel</Button>
                      <Button size="small" variant="contained" onClick={() => saveEdit(filePath, draft)} sx={{ textTransform: "none", fontWeight: 600, bgcolor: "#238636", "&:hover": { bgcolor: "#2ea043" } }}>
                        Commit changes
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : isBinary ? (
                <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
                  <File size={36} style={{ opacity: 0.5 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    This {file.type.toUpperCase()} file can't be previewed in the browser.
                  </Typography>
                  <Button variant="outlined" size="small" startIcon={<Download size={14} />} sx={{ textTransform: "none" }}>
                    Download ({file.size || "0 KB"})
                  </Button>
                </Box>
              ) : isMarkdown && fileViewMode === "preview" ? (
                file.name === "README.md" && storedContent === undefined ? (
                  renderReadmePreview(paper)
                ) : (
                  <Box sx={{ px: { xs: 2.5, md: 4 }, py: 4, "& p": { fontSize: 15.5, lineHeight: 1.75 } }}>
                    {content.split("\n\n").map((block, index) =>
                      block.startsWith("# ") ? (
                        <Typography key={index} component="h1" variant="h4" fontWeight={700} sx={{ mb: 2 }}>{block.slice(2)}</Typography>
                      ) : block.startsWith("## ") ? (
                        <Typography key={index} component="h2" variant="h5" fontWeight={700} sx={{ mt: 3, mb: 1, pb: 1, borderBottom: "1px solid", borderColor: lineColor }}>{block.slice(3)}</Typography>
                      ) : (
                        <Typography key={index} variant="body1" sx={{ whiteSpace: "pre-line", mb: 1 }}>{block}</Typography>
                      )
                    )}
                  </Box>
                )
              ) : (
                renderCodeLines(content, paper, file, fileViewMode === "blame")
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };


  return renderResearchRepository();
}