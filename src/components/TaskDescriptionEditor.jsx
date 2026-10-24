import { Box, Dialog, Divider, IconButton, Menu, MenuItem, Popover, TextField, Tooltip, Typography } from "@mui/material";
import { AlertTriangle, AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp, AtSign, Ban, Bold, Calendar, Check, CheckCircle2, ChevronDown, ChevronRight, CircleDot, Clock, Code, Columns, Copy, Download, EllipsisVertical, Globe, GripVertical, Heading1, Heading2, Heading3, Image, Italic, LayoutGrid, Link2, List, ListChecks, ListOrdered, Maximize2, Minus, Palette, PanelLeft, PanelTop, Paperclip, Plus, Quote, Search, Sigma, Smile, Sparkles, Strikethrough, Trash2, Type, Underline, Upload, Video, Workflow, X, XCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePickerCalendar from "./DatePickerCalendar";

const uid = () => `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/* ────────────── Colors ────────────── */

// Text colors (applied to selected text from the bubble toolbar)
export const TEXT_COLORS = [
    { key: "default", title: "Default", color: null },
    { key: "gray", title: "Gray", color: "#858b98" },
    { key: "peach", title: "Peach", color: "#f87171" },
    { key: "pink", title: "Pink", color: "#ec4899" },
    { key: "orange", title: "Orange", color: "#f97316" },
    { key: "green", title: "Green", color: "#10b981" },
    { key: "lightblue", title: "Light blue", color: "#06b6d4" },
    { key: "darkblue", title: "Dark blue", color: "#3b82f6" },
];

// Background colors (table rows / columns). Translucent so they work in light + dark.
export const BG_COLORS = [
    { key: "gray", title: "Gray", color: "rgba(133,139,152,0.28)" },
    { key: "red", title: "Red", color: "rgba(239,68,68,0.28)" },
    { key: "pink", title: "Pink", color: "rgba(236,72,153,0.28)" },
    { key: "orange", title: "Orange", color: "rgba(249,115,22,0.28)" },
    { key: "green", title: "Green", color: "rgba(16,185,129,0.28)" },
    { key: "cyan", title: "Cyan", color: "rgba(6,182,212,0.28)" },
    { key: "blue", title: "Blue", color: "rgba(59,130,246,0.28)" },
    { key: "purple", title: "Purple", color: "rgba(139,92,246,0.28)" },
];

// Callout tones (rgb triplets, alpha added at render time)
const CALLOUT_TONES = {
    blue: "59,130,246",
    orange: "249,115,22",
    green: "16,185,129",
    red: "239,68,68",
    purple: "139,92,246",
    gray: "133,139,152",
};
const CALLOUT_ICONS = ["💡", "⚠️", "✅", "❌", "📌", "🔥", "📝", "❓", "🚀", "⭐"];

const CODE_LANGS = [
    "javascript", "typescript", "jsx", "python", "java", "go", "rust", "c", "cpp", "csharp",
    "php", "ruby", "swift", "kotlin", "sql", "bash", "json", "yaml", "html", "css", "markdown", "plaintext",
];

/* ────────────── Slash commands ──────────────
 * A command either:
 *   createBlock() → inserts a new block
 *   insertText()  → inserts inline text at the end of the current block
 */
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const todayLabel = () => {
    const d = new Date();
    return `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
const timeLabel = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const colBlock = (n) => () => ({
    type: "columns",
    cols: Array.from({ length: n }, (_, i) => `Column ${i + 1}`),
});
const tabsBlock = (orientation) => () => ({
    type: "tabs",
    orientation,
    tabs: [
        { title: "Tab 1", content: "" },
        { title: "Tab 2", content: "" },
    ],
});
const calloutBlock = (icon, tone) => () => ({ type: "callout", icon, tone, content: "" });
const tableBlock = (rows, cols) => () => ({
    type: "table",
    header: true,
    rowColors: [],
    colColors: [],
    colWidths: [],
    rows: Array.from({ length: rows }, () => Array.from({ length: cols }, () => "")),
});

const GROUP_ORDER = ["Basics", "Layout", "Advanced", "Inline", "Media"];

const SLASH_COMMANDS = [
    /* Basics */
    { key: "text", group: "Basics", title: "Text", desc: "Just start typing with plain text.", icon: Type, searchTerms: ["text", "paragraph", "p", "plain"], createBlock: () => ({ type: "paragraph", content: "" }) },
    { key: "h1", group: "Basics", title: "Heading 1", desc: "Big section heading.", icon: Heading1, searchTerms: ["h1", "heading 1", "title", "big", "large"], createBlock: () => ({ type: "h1", content: "" }) },
    { key: "h2", group: "Basics", title: "Heading 2", desc: "Medium section heading.", icon: Heading2, searchTerms: ["h2", "heading 2", "subtitle", "medium"], createBlock: () => ({ type: "h2", content: "" }) },
    { key: "h3", group: "Basics", title: "Heading 3", desc: "Small section heading.", icon: Heading3, searchTerms: ["h3", "heading 3", "small"], createBlock: () => ({ type: "h3", content: "" }) },
    { key: "todo", group: "Basics", title: "To-do list", desc: "Track tasks with checkable boxes.", icon: ListChecks, searchTerms: ["todo", "task", "check", "checklist", "box"], createBlock: () => ({ type: "todo", checked: false, content: "" }) },
    { key: "bullet", group: "Basics", title: "Bulleted list", desc: "Create a bulleted list.", icon: List, searchTerms: ["bullet", "list", "unordered", "point"], createBlock: () => ({ type: "bullet", content: "" }) },
    { key: "numbered", group: "Basics", title: "Numbered list", desc: "Create a sequential numbered list.", icon: ListOrdered, searchTerms: ["number", "ordered", "sequential", "1."], createBlock: () => ({ type: "numbered", content: "" }) },
    { key: "toggle", group: "Basics", title: "Toggle list", desc: "Collapsible block that hides details.", icon: ChevronRight, searchTerms: ["toggle", "collapse", "collapsible", "accordion", "details", "expand"], createBlock: () => ({ type: "toggle", open: true, content: "", body: "" }) },
    { key: "quote", group: "Basics", title: "Quote", desc: "Capture a quote with an accent border.", icon: Quote, searchTerms: ["quote", "blockquote", "cite"], createBlock: () => ({ type: "quote", content: "" }) },
    { key: "callout", group: "Basics", title: "Callout", desc: "Highlight important information.", icon: Sparkles, searchTerms: ["callout", "note", "alert", "box", "highlight", "info"], createBlock: calloutBlock("💡", "blue") },
    { key: "warning", group: "Basics", title: "Warning callout", desc: "Draw attention to a risk or caveat.", icon: AlertTriangle, searchTerms: ["warning", "caution", "alert", "careful", "callout"], createBlock: calloutBlock("⚠️", "orange") },
    { key: "success", group: "Basics", title: "Success callout", desc: "Mark something as done or working.", icon: CheckCircle2, searchTerms: ["success", "done", "ok", "good", "callout"], createBlock: calloutBlock("✅", "green") },
    { key: "danger", group: "Basics", title: "Error callout", desc: "Flag a blocker or a breaking issue.", icon: XCircle, searchTerms: ["error", "danger", "blocker", "bug", "callout"], createBlock: calloutBlock("❌", "red") },
    { key: "table", group: "Basics", title: "Table", desc: "3×3 table with rows, columns and colors.", icon: LayoutGrid, searchTerms: ["table", "grid", "rows", "columns", "spreadsheet"], createBlock: tableBlock(3, 3) },
    { key: "tablebig", group: "Basics", title: "Large table", desc: "5 rows × 4 columns table.", icon: LayoutGrid, searchTerms: ["table", "large", "big", "grid", "5x4"], createBlock: tableBlock(5, 4) },
    { key: "divider", group: "Basics", title: "Divider", desc: "Visually divide blocks with a clean line.", icon: Minus, searchTerms: ["divider", "hr", "separator", "rule", "line"], createBlock: () => ({ type: "divider", content: "" }) },

    /* Layout */
    { key: "col2", group: "Layout", title: "2 Columns", desc: "Two side-by-side columns.", icon: Columns, searchTerms: ["2 columns", "two columns", "column", "layout"], createBlock: colBlock(2) },
    { key: "col3", group: "Layout", title: "3 Columns", desc: "Three side-by-side columns.", icon: Columns, searchTerms: ["3 columns", "three columns", "column", "layout"], createBlock: colBlock(3) },
    { key: "col4", group: "Layout", title: "4 Columns", desc: "Four side-by-side columns.", icon: Columns, searchTerms: ["4 columns", "four columns", "column", "layout"], createBlock: colBlock(4) },
    { key: "htabs", group: "Layout", title: "Horizontal tabs", desc: "Tabs laid out across the top.", icon: PanelTop, searchTerms: ["tabs", "horizontal tabs", "tab"], createBlock: tabsBlock("horizontal") },
    { key: "vtabs", group: "Layout", title: "Vertical tabs", desc: "Tabs laid out down the side.", icon: PanelLeft, searchTerms: ["tabs", "vertical tabs", "tab"], createBlock: tabsBlock("vertical") },

    /* Advanced */
    { key: "code", group: "Advanced", title: "Code", desc: "Code snippet with a language picker.", icon: Code, searchTerms: ["code", "snippet", "pre", "javascript", "script"], createBlock: () => ({ type: "code", lang: "javascript", content: "" }) },
    { key: "mermaid", group: "Advanced", title: "Mermaid diagram", desc: "Flowcharts and diagrams from text.", icon: Workflow, searchTerms: ["mermaid", "diagram", "flowchart", "chart", "graph"], createBlock: () => ({ type: "mermaid", content: "graph TD\n  A[Start] --> B[End]" }) },
    { key: "equation", group: "Advanced", title: "Block equation", desc: "A full-width math equation (LaTeX).", icon: Sigma, searchTerms: ["equation", "math", "latex", "formula", "katex"], createBlock: () => ({ type: "equation", content: "E = mc^2" }) },
    { key: "toc", group: "Advanced", title: "Table of contents", desc: "Auto list of the headings in this description.", icon: AlignLeft, searchTerms: ["toc", "contents", "outline", "index", "headings"], createBlock: () => ({ type: "toc", content: "" }) },

    /* Inline */
    { key: "emoji", group: "Inline", title: "Emoji", desc: "Insert an emoji in the text.", icon: Smile, searchTerms: ["emoji", "smile", "emoticon"], insertText: () => "😀" },
    { key: "date", group: "Inline", title: "Date", desc: "Pick a date from a calendar.", icon: Calendar, searchTerms: ["date", "today", "calendar", "day"], createBlock: () => ({ type: "date", value: isoToday() }) },
    { key: "time", group: "Inline", title: "Time", desc: "Pick a time of day.", icon: Clock, searchTerms: ["time", "now", "clock", "hour"], createBlock: () => ({ type: "time", value: timeLabel() }) },
    { key: "mention", group: "Inline", title: "Mention", desc: "Mention yourself or a teammate.", icon: AtSign, searchTerms: ["mention", "at", "user", "person", "@"], insertText: (ctx) => `@${ctx.authorName} ` },
    { key: "status", group: "Inline", title: "Status", desc: "Colored tag with an editable label.", icon: CircleDot, searchTerms: ["status", "state", "tag", "badge", "label", "progress", "done", "blocked"], createBlock: () => ({ type: "status", label: "Status", color: "gray" }) },
    { key: "inlineeq", group: "Inline", title: "Inline equation", desc: "A math expression inside a sentence.", icon: Sigma, searchTerms: ["inline equation", "math", "latex", "formula"], insertText: () => "$x^2$" },

    /* Media */
    { key: "image", group: "Media", title: "Image", desc: "Upload an image or paste a link.", icon: Image, searchTerms: ["image", "photo", "picture", "upload", "img", "png", "jpg"], createBlock: () => ({ type: "image", url: "", alt: "", align: "left", fit: false }) },
    { key: "video", group: "Media", title: "Video", desc: "Upload a video or embed YouTube / Vimeo.", icon: Video, searchTerms: ["video", "movie", "mp4", "youtube", "vimeo"], createBlock: () => ({ type: "video", url: "" }) },
    { key: "attachment", group: "Media", title: "File", desc: "Upload a file or link one.", icon: Paperclip, searchTerms: ["attachment", "file", "upload", "document", "pdf"], createBlock: () => ({ type: "attachment", name: "", url: "" }) },
    { key: "embed", group: "Media", title: "Embed", desc: "Embed any web page or app.", icon: Globe, searchTerms: ["embed", "iframe", "figma", "website", "link"], createBlock: () => ({ type: "embed", url: "" }) },
];

// Block types rendered by <ExtraBlock />
const EXTRA_TYPES = ["mermaid", "equation", "columns", "tabs"];
// Media blocks (upload / link) and inline chips (pickers)
const MEDIA_TYPES = ["image", "video", "embed", "attachment"];
const CHIP_TYPES = ["date", "time", "status"];
// Block types whose `content` is plain editable text
const TEXT_TYPES = ["paragraph", "h1", "h2", "h3", "todo", "bullet", "numbered", "quote", "callout", "code", "toggle"];

/* ────────────── Markdown parsing ──────────────
 * Standard markdown plus these custom syntaxes:
 *   ```mermaid ... ```                 → mermaid
 *   $$ ... $$                          → block equation
 *   :::columns N / ::col / :::         → columns
 *   :::tabs horizontal|vertical        → tabs (sections start with "::tab Title")
 *   :::callout <icon> <tone> ... :::   → callout
 *   :::toggle <title> ... :::          → toggle
 *   [TOC]                              → table of contents
 *   <!--table-style:{...}-->           → colors / header flag for the table above it
 *   @[video](url) @[embed](url) @[file](name|url)
 */
const splitTableRow = (line) =>
    line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim().replace(/\\\|/g, "|"));

const isSeparatorRow = (cells) => cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));

export function parseContentToBlocks(rawText) {
    if (!rawText || !rawText.trim()) {
        return [{ id: "b-init", type: "paragraph", content: "" }];
    }

    const lines = rawText.split(/\r?\n/);
    const blocks = [];
    let i = 0;
    const push = (b) => blocks.push({ id: uid(), ...b });

    while (i < lines.length) {
        const line = lines[i];
        const t = line.trim();

        // Block equation
        if (t === "$$") {
            const body = [];
            i++;
            while (i < lines.length && lines[i].trim() !== "$$") body.push(lines[i++]);
            i++;
            push({ type: "equation", content: body.join("\n") });
            continue;
        }

        // Table of contents
        if (t === "[TOC]") {
            push({ type: "toc", content: "" });
            i++;
            continue;
        }

        // Columns
        let m = t.match(/^:::columns\s+(\d)$/);
        if (m) {
            const cols = [[]];
            i++;
            while (i < lines.length && lines[i].trim() !== ":::") {
                if (lines[i].trim() === "::col") cols.push([]);
                else cols[cols.length - 1].push(lines[i]);
                i++;
            }
            i++;
            const n = Math.min(4, Math.max(2, Number(m[1])));
            const out = cols.map((c) => c.join("\n"));
            while (out.length < n) out.push("");
            push({ type: "columns", cols: out.slice(0, n) });
            continue;
        }

        // Tabs
        m = t.match(/^:::tabs\s+(horizontal|vertical)$/);
        if (m) {
            const tabs = [];
            i++;
            while (i < lines.length && lines[i].trim() !== ":::") {
                const tm = lines[i].match(/^::tab\s+(.*)$/);
                if (tm) tabs.push({ title: tm[1], lines: [] });
                else if (tabs.length) tabs[tabs.length - 1].lines.push(lines[i]);
                i++;
            }
            i++;
            push({
                type: "tabs",
                orientation: m[1],
                tabs: tabs.length
                    ? tabs.map((x) => ({ title: x.title, content: x.lines.join("\n") }))
                    : [{ title: "Tab 1", content: "" }],
            });
            continue;
        }

        // Callout (new syntax)
        m = t.match(/^:::callout\s+(\S+)\s+(\w+)$/);
        if (m) {
            const body = [];
            i++;
            while (i < lines.length && lines[i].trim() !== ":::") body.push(lines[i++]);
            i++;
            push({
                type: "callout",
                icon: m[1],
                tone: CALLOUT_TONES[m[2]] ? m[2] : "blue",
                content: body.join("\n"),
            });
            continue;
        }

        // Toggle
        m = t.match(/^:::toggle\s*(.*)$/);
        if (m) {
            const body = [];
            i++;
            while (i < lines.length && lines[i].trim() !== ":::") body.push(lines[i++]);
            i++;
            push({ type: "toggle", open: true, content: m[1], body: body.join("\n") });
            continue;
        }

        // Video / embed / attachment
        m = t.match(/^@\[(video|embed|file|date|time|status)\]\((.*)\)$/);
        if (m) {
            if (m[1] === "date" || m[1] === "time") {
                push({ type: m[1], value: m[2] });
            } else if (m[1] === "status") {
                const [label, ...rest] = m[2].split("|");
                const col = rest.join("|");
                push({ type: "status", label, color: STATUS_COLORS[col] ? col : "gray" });
            } else if (m[1] === "file") {
                const [name, ...rest] = m[2].split("|");
                push({ type: "attachment", name, url: rest.join("|") });
            } else {
                push({ type: m[1], url: m[2] });
            }
            i++;
            continue;
        }

        // Headings
        if (line.startsWith("### ")) { push({ type: "h3", content: line.slice(4) }); i++; continue; }
        if (line.startsWith("## ")) { push({ type: "h2", content: line.slice(3) }); i++; continue; }
        if (line.startsWith("# ")) { push({ type: "h1", content: line.slice(2) }); i++; continue; }

        // Horizontal rule
        if (t === "---" || t === "***" || t === "___") {
            push({ type: "divider", content: "" });
            i++;
            continue;
        }

        // Todo
        const todoMatch = line.match(/^-\s*\[([ xX])\]\s*(.*)$/);
        if (todoMatch) {
            push({ type: "todo", checked: todoMatch[1].toLowerCase() === "x", content: todoMatch[2] });
            i++;
            continue;
        }

        // Bullet list
        if (line.match(/^[*-]\s+(.*)$/)) {
            push({ type: "bullet", content: line.replace(/^[*-]\s+/, "") });
            i++;
            continue;
        }

        // Numbered list
        const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
            push({ type: "numbered", content: numMatch[2] });
            i++;
            continue;
        }

        // Blockquote
        if (line.startsWith("> ")) {
            push({ type: "quote", content: line.slice(2) });
            i++;
            continue;
        }

        // Callout (legacy syntax)
        if (line.startsWith("💡") || line.startsWith("[!NOTE]") || line.startsWith("Note:")) {
            push({
                type: "callout",
                icon: "💡",
                tone: "blue",
                content: line.replace(/^\[!NOTE\]\s*|^Note:\s*|^💡\s*(Note:\s*)?/, "").trim(),
            });
            i++;
            continue;
        }

        // Code block (mermaid is a code fence with lang "mermaid")
        if (line.startsWith("```")) {
            const lang = line.slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) i++;
            if (lang === "mermaid") {
                push({ type: "mermaid", content: codeLines.join("\n") });
            } else {
                push({ type: "code", lang: lang || "javascript", content: codeLines.join("\n") });
            }
            continue;
        }

        // Table
        if (t.startsWith("|") && t.endsWith("|")) {
            const raw = [];
            while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
                raw.push(splitTableRow(lines[i]));
                i++;
            }
            // The separator row is always the 2nd row in markdown
            let rows = raw.length >= 2 && isSeparatorRow(raw[1]) ? [raw[0], ...raw.slice(2)] : raw;
            const width = Math.max(1, ...rows.map((r) => r.length));
            rows = rows.map((r) => Array.from({ length: width }, (_, k) => r[k] ?? ""));

            // Optional style comment right below the table
            let style = {};
            const sm = i < lines.length && lines[i].trim().match(/^<!--table-style:(.*)-->$/);
            if (sm) {
                try { style = JSON.parse(sm[1]); } catch (e) { style = {}; }
                i++;
            }
            const fit = (arr, n) => Array.from({ length: n }, (_, k) => (Array.isArray(arr) ? arr[k] ?? null : null));
            push({
                type: "table",
                rows: rows.length ? rows : [["", ""], ["", ""]],
                rowColors: fit(style.r, rows.length || 2),
                colColors: fit(style.c, width),
                colWidths: fit(style.w, width),
                header: style.h !== false,
            });
            continue;
        }

        // Image
        const imgMatch = line.match(/^!\[(.*?)\]\((\S*?)(?:\s+"([^"]*)")?\)$/);
        if (imgMatch) {
            const opts = (imgMatch[3] || "").split("|");
            push({
                type: "image",
                alt: imgMatch[1] === "image" ? "" : imgMatch[1],
                url: imgMatch[2],
                align: ["left", "center", "right"].find((a) => opts.includes(a)) || "left",
                fit: opts.includes("fit"),
            });
            i++;
            continue;
        }

        // Default paragraph
        push({ type: "paragraph", content: line });
        i++;
    }

    return blocks.length ? blocks : [{ id: "b-empty", type: "paragraph", content: "" }];
}

export function serializeBlocksToMarkdown(blocks) {
    if (!blocks || !blocks.length) return "";
    let numCounter = 0;
    return blocks
        .map((b) => {
            numCounter = b.type === "numbered" ? numCounter + 1 : 0;
            switch (b.type) {
                case "h1": return `# ${b.content}`;
                case "h2": return `## ${b.content}`;
                case "h3": return `### ${b.content}`;
                case "divider": return `---`;
                case "toc": return `[TOC]`;
                case "todo": return `- [${b.checked ? "x" : " "}] ${b.content}`;
                case "bullet": return `- ${b.content}`;
                case "numbered": return `${numCounter}. ${b.content}`;
                case "quote": return `> ${b.content}`;
                case "callout": return `:::callout ${b.icon || "💡"} ${b.tone || "blue"}\n${b.content}\n:::`;
                case "toggle": return `:::toggle ${b.content}\n${b.body || ""}\n:::`;
                case "code": return `\`\`\`${b.lang || ""}\n${b.content}\n\`\`\``;
                case "mermaid": return `\`\`\`mermaid\n${b.content}\n\`\`\``;
                case "equation": return `$$\n${b.content}\n$$`;
                case "columns": return `:::columns ${b.cols.length}\n${b.cols.join("\n::col\n")}\n:::`;
                case "tabs":
                    return `:::tabs ${b.orientation}\n${b.tabs.map((tb) => `::tab ${tb.title}\n${tb.content}`).join("\n")}\n:::`;
                case "video": return `@[video](${b.url || ""})`;
                case "embed": return `@[embed](${b.url || ""})`;
                case "attachment": return `@[file](${b.name || ""}|${b.url || ""})`;
                case "table": {
                    const r = b.rows || [];
                    if (!r.length) return "";
                    const esc = (v) => String(v ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|");
                    const fmtRow = (row) => `| ${row.map(esc).join(" | ")} |`;
                    const header = fmtRow(r[0]);
                    const sep = `| ${r[0].map(() => "---").join(" | ")} |`;
                    const rest = r.slice(1).map(fmtRow).join("\n");
                    let out = `${header}\n${sep}${rest ? "\n" + rest : ""}`;
                    const hasStyle =
                        (b.rowColors || []).some(Boolean) || (b.colColors || []).some(Boolean) || (b.colWidths || []).some(Boolean) || b.header === false;
                    if (hasStyle) {
                        out += `\n<!--table-style:${JSON.stringify({
                            r: b.rowColors || [],
                            c: b.colColors || [],
                            w: b.colWidths || [],
                            h: b.header !== false,
                        })}-->`;
                    }
                    return out;
                }
                case "image": {
                    const opts = [b.align && b.align !== "left" ? b.align : null, b.fit ? "fit" : null].filter(Boolean).join("|");
                    return `![${b.alt || ""}](${b.url || ""}${opts ? ` "${opts}"` : ""})`;
                }
                case "date": return `@[date](${b.value || ""})`;
                case "time": return `@[time](${b.value || ""})`;
                case "status": return `@[status](${String(b.label || "").replace(/\|/g, "/")}|${b.color || "gray"})`;
                case "paragraph":
                default:
                    return b.content ?? "";
            }
        })
        .join("\n");
}

/* ────────────── Small helpers ────────────── */
const toEmbedUrl = (url = "") => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return null;
};

const padArr = (arr, n) => Array.from({ length: n }, (_, i) => (arr && arr[i] !== undefined ? arr[i] : null));

/* Row of color swatches used by the table menus */
function ColorSwatches({ value, onPick, c }) {
    return (
        <Box sx={{ display: "flex", gap: 0.75, px: 1.5, py: 0.75, flexWrap: "wrap" }}>
            {BG_COLORS.map((col) => (
                <Tooltip key={col.key} title={col.title}>
                    <Box
                        onClick={() => onPick(col.color)}
                        sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "6px",
                            bgcolor: col.color,
                            border: `1px solid ${c.border}`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": { transform: "scale(1.1)" },
                            transition: "transform 0.1s ease",
                        }}
                    >
                        {value === col.color && <Check size={12} color={c.text} />}
                    </Box>
                </Tooltip>
            ))}
            <Tooltip title="No color">
                <Box
                    onClick={() => onPick(null)}
                    sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "6px",
                        border: `1px solid ${c.border}`,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: c.muted,
                        "&:hover": { color: c.text },
                    }}
                >
                    <Ban size={13} />
                </Box>
            </Tooltip>
        </Box>
    );
}

/* Menu entries shared by table / column menus */
function ActionItems({ items, c, onDone }) {
    return items.map((it) => (
        <MenuItem
            key={it.label}
            disabled={it.disabled}
            onClick={() => {
                it.run();
                onDone();
            }}
            sx={{ gap: 1.25, color: it.danger ? "#f87171" : c.text }}
        >
            {it.icon}
            <span style={{ fontWeight: 600 }}>{it.label}</span>
            {it.checked && <Check size={14} style={{ marginLeft: "auto" }} />}
        </MenuItem>
    ));
}

/* ────────────── Table block ──────────────
 * Hover a row/column to reveal its handle. The handle menu offers:
 * background color, insert, duplicate, clear contents, delete.
 * "+" bars on the right and bottom append a column / row.
 */
function TableBlock({ block: b, onChange, c, popoverPaperSx }) {
    const rows = b.rows && b.rows.length ? b.rows : [[""]];
    const nCols = Math.max(1, ...rows.map((r) => r.length));
    const grid = rows.map((r) => Array.from({ length: nCols }, (_, i) => r[i] ?? ""));
    const rowColors = padArr(b.rowColors, grid.length);
    const colColors = padArr(b.colColors, nCols);
    const colWidths = padArr(b.colWidths, nCols);
    const header = b.header !== false;
    const hasWidths = colWidths.some(Boolean);

    const [hoverRow, setHoverRow] = useState(-1);
    const [resizeHover, setResizeHover] = useState(-1);
    const [drag, setDrag] = useState(null); // { ci, widths } while resizing a column
    const headRefs = useRef({});
    const [hoverCol, setHoverCol] = useState(-1);
    const [menu, setMenu] = useState(null); // { anchor, kind: "row" | "col", index }
    const cellRefs = useRef({});
    const pendingFocus = useRef(null);

    useEffect(() => {
        if (pendingFocus.current) {
            cellRefs.current[pendingFocus.current]?.focus();
            pendingFocus.current = null;
        }
    });

    const commit = (patch) =>
        onChange({ rows: grid, rowColors, colColors, colWidths, header, ...patch });

    /* rows */
    const insertRow = (at) => {
        const nr = [...grid];
        nr.splice(at, 0, Array(nCols).fill(""));
        const rc = [...rowColors];
        rc.splice(at, 0, null);
        commit({ rows: nr, rowColors: rc });
    };
    const duplicateRow = (at) => {
        const nr = [...grid];
        nr.splice(at + 1, 0, [...grid[at]]);
        const rc = [...rowColors];
        rc.splice(at + 1, 0, rowColors[at]);
        commit({ rows: nr, rowColors: rc });
    };
    const deleteRow = (at) => {
        if (grid.length <= 1) return;
        commit({ rows: grid.filter((_, i) => i !== at), rowColors: rowColors.filter((_, i) => i !== at) });
    };
    const clearRow = (at) => commit({ rows: grid.map((r, i) => (i === at ? r.map(() => "") : r)) });
    const setRowColor = (at, color) => commit({ rowColors: rowColors.map((x, i) => (i === at ? color : x)) });

    /* columns */
    const insertCol = (at) => {
        const cc = [...colColors];
        cc.splice(at, 0, null);
        const cw = [...colWidths];
        cw.splice(at, 0, null);
        commit({ rows: grid.map((r) => [...r.slice(0, at), "", ...r.slice(at)]), colColors: cc, colWidths: cw });
    };
    const duplicateCol = (at) => {
        const cc = [...colColors];
        cc.splice(at + 1, 0, colColors[at]);
        const cw = [...colWidths];
        cw.splice(at + 1, 0, colWidths[at]);
        commit({ rows: grid.map((r) => [...r.slice(0, at + 1), r[at], ...r.slice(at + 1)]), colColors: cc, colWidths: cw });
    };
    const deleteCol = (at) => {
        if (nCols <= 1) return;
        commit({ rows: grid.map((r) => r.filter((_, i) => i !== at)), colColors: colColors.filter((_, i) => i !== at), colWidths: colWidths.filter((_, i) => i !== at) });
    };
    const clearCol = (at) => commit({ rows: grid.map((r) => r.map((v, i) => (i === at ? "" : v))) });
    const setColColor = (at, color) => commit({ colColors: colColors.map((x, i) => (i === at ? color : x)) });

    const setCell = (r, ci, value) =>
        commit({ rows: grid.map((row, ri) => (ri === r ? row.map((v, k) => (k === ci ? value : v)) : row)) });

    const onCellKey = (e, r, ci) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (r === grid.length - 1) {
                insertRow(grid.length);
                pendingFocus.current = `${r + 1}-${ci}`;
            } else {
                cellRefs.current[`${r + 1}-${ci}`]?.focus();
            }
        } else if (e.key === "Tab" && !e.shiftKey && r === grid.length - 1 && ci === nCols - 1) {
            e.preventDefault();
            insertRow(grid.length);
            pendingFocus.current = `${r + 1}-0`;
        }
    };

    /* column resize: drag the right border of a column, double-click it to reset all widths */
    const startResize = (e, ci) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const base = Array.from({ length: nCols }, (_, i) =>
            Math.round(colWidths[i] || headRefs.current[i]?.getBoundingClientRect().width || 160)
        );
        let latest = base;
        setDrag({ ci, widths: base });
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        const move = (ev) => {
            const w = Math.max(60, Math.round(base[ci] + ev.clientX - startX));
            latest = base.map((x, i) => (i === ci ? w : x));
            setDrag({ ci, widths: latest });
        };
        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            setDrag(null);
            commit({ colWidths: latest });
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    const resetWidths = () => commit({ colWidths: colWidths.map(() => null) });
    const effWidths = drag ? drag.widths : hasWidths ? colWidths.map((w) => w || 160) : null;

    /* menu content */
    const menuItems = () => {
        if (!menu) return [];
        const i = menu.index;
        if (menu.kind === "row") {
            return [
                ...(i === 0
                    ? [{ label: "Header row", icon: <Type size={15} color={c.muted} />, checked: header, run: () => commit({ header: !header }) }]
                    : []),
                { label: "Insert above", icon: <ArrowUp size={15} color={c.muted} />, run: () => insertRow(i) },
                { label: "Insert below", icon: <ArrowDown size={15} color={c.muted} />, run: () => insertRow(i + 1) },
                { label: "Duplicate", icon: <Copy size={15} color={c.muted} />, run: () => duplicateRow(i) },
                { label: "Clear contents", icon: <X size={15} color={c.muted} />, run: () => clearRow(i) },
                { label: "Delete", icon: <Trash2 size={15} color="#f87171" />, danger: true, disabled: grid.length <= 1, run: () => deleteRow(i) },
            ];
        }
        return [
            { label: "Insert left", icon: <ArrowLeft size={15} color={c.muted} />, run: () => insertCol(i) },
            { label: "Insert right", icon: <ArrowRight size={15} color={c.muted} />, run: () => insertCol(i + 1) },
            { label: "Duplicate", icon: <Copy size={15} color={c.muted} />, run: () => duplicateCol(i) },
            { label: "Clear contents", icon: <X size={15} color={c.muted} />, run: () => clearCol(i) },
            { label: "Delete", icon: <Trash2 size={15} color="#f87171" />, danger: true, disabled: nCols <= 1, run: () => deleteCol(i) },
        ];
    };

    const handleBtn = (vertical, visible, onClick) => (
        <Box
            onClick={onClick}
            sx={{
                width: vertical ? 14 : 24,
                height: vertical ? 24 : 14,
                borderRadius: "5px",
                bgcolor: c.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.12s ease",
                mx: "auto",
            }}
        >
            <EllipsisVertical size={12} style={{ transform: vertical ? "none" : "rotate(90deg)" }} />
        </Box>
    );

    const barSx = {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "6px",
        bgcolor: c.sub,
        border: `1px solid ${c.border}`,
        color: c.muted,
        opacity: 0.45,
        transition: "opacity 0.15s ease, color 0.15s ease",
        "&:hover": { opacity: 1, color: c.text, bgcolor: c.hover },
    };

    return (
        <Box
            className="tbl-wrap"
            sx={{ position: "relative", pr: "28px", pb: "28px", my: 1, "&:hover .tbl-bar": { opacity: 1 } }}
        >
            <Box sx={{ overflowX: "auto" }} onMouseLeave={() => { setHoverRow(-1); setHoverCol(-1); }}>
                <table
                    style={{
                        width: effWidths ? 22 + effWidths.reduce((a, z) => a + z, 0) : "100%",
                        minWidth: effWidths ? undefined : nCols * 120 + 22,
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                        fontSize: "0.8125rem",
                    }}
                >
                    <colgroup>
                        <col style={{ width: 22 }} />
                        {Array.from({ length: nCols }).map((_, i) => (
                            <col key={i} style={effWidths ? { width: effWidths[i] } : undefined} />
                        ))}
                    </colgroup>
                    <tbody>
                        {/* column handles */}
                        <tr>
                            <td style={{ height: 18, padding: 0, border: "none" }} />
                            {Array.from({ length: nCols }).map((_, ci) => (
                                <td
                                    key={ci}
                                    ref={(el) => (headRefs.current[ci] = el)}
                                    onMouseEnter={() => setHoverCol(ci)}
                                    style={{ height: 18, padding: 0, border: "none" }}
                                >
                                    {handleBtn(
                                        false,
                                        hoverCol === ci || (menu?.kind === "col" && menu.index === ci),
                                        (e) => setMenu({ anchor: e.currentTarget, kind: "col", index: ci })
                                    )}
                                </td>
                            ))}
                        </tr>

                        {grid.map((row, r) => {
                            const rowActive = menu?.kind === "row" && menu.index === r;
                            return (
                                <tr key={r}>
                                    {/* row handle */}
                                    <td
                                        onMouseEnter={() => setHoverRow(r)}
                                        style={{ padding: 0, border: "none", verticalAlign: "middle" }}
                                    >
                                        {handleBtn(
                                            true,
                                            hoverRow === r || rowActive,
                                            (e) => setMenu({ anchor: e.currentTarget, kind: "row", index: r })
                                        )}
                                    </td>
                                    {row.map((cell, ci) => {
                                        const colActive = menu?.kind === "col" && menu.index === ci;
                                        const bg =
                                            rowColors[r] || colColors[ci] || (header && r === 0 ? c.sub : "transparent");
                                        const shadows = [];
                                        if (rowActive) shadows.push(`inset 0 1px 0 ${c.accent}`, `inset 0 -1px 0 ${c.accent}`);
                                        if (colActive) shadows.push(`inset 1px 0 0 ${c.accent}`, `inset -1px 0 0 ${c.accent}`);
                                        return (
                                            <td
                                                key={ci}
                                                onMouseEnter={() => { setHoverRow(r); setHoverCol(ci); }}
                                                style={{
                                                    position: "relative",
                                                    border: `1px solid ${c.border}`,
                                                    background: bg,
                                                    padding: 0,
                                                    boxShadow: shadows.length ? shadows.join(",") : "none",
                                                }}
                                            >
                                                <input
                                                    ref={(el) => (cellRefs.current[`${r}-${ci}`] = el)}
                                                    value={cell}
                                                    onChange={(e) => setCell(r, ci, e.target.value)}
                                                    onKeyDown={(e) => onCellKey(e, r, ci)}
                                                    style={{
                                                        width: "100%",
                                                        boxSizing: "border-box",
                                                        padding: "8px 12px",
                                                        background: "transparent",
                                                        border: "none",
                                                        outline: "none",
                                                        color: c.text,
                                                        fontWeight: header && r === 0 ? 600 : 400,
                                                        fontFamily: "inherit",
                                                        fontSize: "0.8125rem",
                                                    }}
                                                />
                                                {/* column resize grip */}
                                                <Box
                                                    onMouseDown={(e) => startResize(e, ci)}
                                                    onDoubleClick={resetWidths}
                                                    onMouseEnter={() => setResizeHover(ci)}
                                                    onMouseLeave={() => setResizeHover(-1)}
                                                    title="Drag to resize · double-click to reset"
                                                    sx={{
                                                        position: "absolute",
                                                        top: -1,
                                                        bottom: -1,
                                                        right: -4,
                                                        width: 8,
                                                        cursor: "col-resize",
                                                        zIndex: 2,
                                                        backgroundImage:
                                                            resizeHover === ci || drag?.ci === ci
                                                                ? `linear-gradient(to right, transparent 3px, ${c.accent} 3px, ${c.accent} 5px, transparent 5px)`
                                                                : "none",
                                                    }}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Box>

            {/* add column */}
            <Box
                className="tbl-bar"
                onClick={() => { insertCol(nCols); pendingFocus.current = `0-${nCols}`; }}
                title="Add column"
                sx={{ ...barSx, top: 18, right: 0, bottom: 28, width: 22 }}
            >
                <Plus size={13} />
            </Box>
            {/* add row */}
            <Box
                className="tbl-bar"
                onClick={() => { insertRow(grid.length); pendingFocus.current = `${grid.length}-0`; }}
                title="Add row"
                sx={{ ...barSx, left: 22, right: 28, bottom: 0, height: 22 }}
            >
                <Plus size={13} />
            </Box>

            <Menu
                anchorEl={menu?.anchor}
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
                slotProps={{
                    paper: {
                        sx: { ...popoverPaperSx, minWidth: 220, borderRadius: "8px", py: 0.5, "& .MuiMenuItem-root": { fontSize: "0.8125rem" } },
                    },
                }}
            >
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: c.muted, px: 1.5, py: 0.5 }}>
                    Background colors
                </Typography>
                <ColorSwatches
                    c={c}
                    value={menu ? (menu.kind === "row" ? rowColors[menu.index] : colColors[menu.index]) : null}
                    onPick={(color) => {
                        if (menu.kind === "row") setRowColor(menu.index, color);
                        else setColColor(menu.index, color);
                        setMenu(null);
                    }}
                />
                <Divider sx={{ my: 0.5, borderColor: c.border }} />
                <ActionItems items={menuItems()} c={c} onDone={() => setMenu(null)} />
            </Menu>
        </Box>
    );
}

/* ────────────── Helpers for chips & media ────────────── */
const STATUS_COLORS = {
    gray: "133,139,152",
    green: "16,185,129",
    red: "239,68,68",
    yellow: "234,179,8",
    blue: "59,130,246",
    purple: "139,92,246",
};

const isoToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fmtIso = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return isNaN(d.getTime()) ? iso : `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
const fmtTime = (hhmm = "") => {
    const [h, m] = hhmm.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return hhmm;
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
    });

const MEDIA_META = {
    image: { label: "Add an image", accept: "image/*", icon: Image, linkPh: "Paste the image link...", btn: "Embed image" },
    video: { label: "Add a video", accept: "video/*", icon: Video, linkPh: "Paste a video link (mp4, YouTube, Vimeo)...", btn: "Embed video" },
    attachment: { label: "Add a file", accept: "", icon: Paperclip, linkPh: "Paste the file link...", btn: "Add file" },
    embed: { label: "Add an embed", accept: "", icon: Globe, linkPh: "Paste an https:// link to embed...", btn: "Embed link" },
};

/* ────────────── Date / Time / Status chips ──────────────
 * Dates open a MUI calendar; time opens the native time picker. Status opens a popover with an
 * editable label and color swatches.
 */
function ChipBlock({ block: b, onChange, c, isDark, popoverPaperSx }) {
    const inputRef = useRef(null);
    const [anchor, setAnchor] = useState(null);

    const chipSx = {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: "8px",
        bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
        color: c.text,
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: "pointer",
        userSelect: "none",
        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.08)" },
    };

    if (b.type === "date") {
        return (
            <>
                <Box onClick={(event) => setAnchor(event.currentTarget)} sx={chipSx}>
                    <Calendar size={15} color={c.muted} />
                    <span style={{ color: b.value ? c.text : c.muted }}>{b.value ? fmtIso(b.value) : "Pick a date"}</span>
                </Box>
                <Popover
                    open={Boolean(anchor)}
                    anchorEl={anchor}
                    onClose={() => setAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{ paper: { sx: { ...popoverPaperSx, width: 340, p: 0, borderRadius: "10px", mt: 0.5 } } }}
                >
                    <DatePickerCalendar
                        value={b.value || ""}
                        isDark={isDark}
                        onChange={(value) => {
                            onChange({ value });
                            setAnchor(null);
                        }}
                        onClose={() => setAnchor(null)}
                        onClear={() => {
                            onChange({ value: "" });
                            setAnchor(null);
                        }}
                    />
                </Popover>
            </>
        );
    }

    if (b.type === "time") {
        const text = b.value
            ? fmtTime(b.value)
            : "Pick a time";
        return (
            <Box onClick={() => inputRef.current?.showPicker?.()} sx={chipSx}>
                <Clock size={15} color={c.muted} />
                <span style={{ color: b.value ? c.text : c.muted }}>{text}</span>
                <input
                    ref={inputRef}
                    type="time"
                    value={b.value || ""}
                    onChange={(e) => onChange({ value: e.target.value })}
                    tabIndex={-1}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, pointerEvents: "none" }}
                />
            </Box>
        );
    }

    // status
    const rgb = STATUS_COLORS[b.color] || STATUS_COLORS.gray;
    return (
        <>
            <Box
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ ...chipSx, bgcolor: `rgba(${rgb},${isDark ? 0.22 : 0.16})`, textTransform: "uppercase", "&:hover": { filter: "brightness(1.15)" } }}
            >
                {b.label || "Status"}
            </Box>
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { sx: { ...popoverPaperSx, width: 320, p: 1.25, borderRadius: "10px", mt: 0.5 } } }}
            >
                <input
                    autoFocus
                    placeholder="Status"
                    value={b.label || ""}
                    onChange={(e) => onChange({ label: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && setAnchor(null)}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: `1px solid ${c.accent}`,
                        background: c.sub,
                        color: c.text,
                        outline: "none",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        fontFamily: "inherit",
                    }}
                />
                <Box sx={{ display: "flex", gap: 0.75, mt: 1.25 }}>
                    {Object.entries(STATUS_COLORS).map(([key, v]) => (
                        <Box
                            key={key}
                            onClick={() => onChange({ color: key })}
                            sx={{
                                flex: 1,
                                height: 34,
                                borderRadius: "6px",
                                bgcolor: `rgba(${v},0.3)`,
                                border: (b.color || "gray") === key ? `1px solid ${c.text}` : "1px solid transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                "&:hover": { filter: "brightness(1.2)" },
                            }}
                        >
                            {(b.color || "gray") === key && <Check size={15} color={c.text} />}
                        </Box>
                    ))}
                </Box>
            </Popover>
        </>
    );
}

/* ────────────── Upload / Link picker for media blocks ────────────── */
function MediaPicker({ anchor, onClose, kind, onPick, onUploadFile, c, popoverPaperSx }) {
    const meta = MEDIA_META[kind];
    const canUpload = kind !== "embed";
    const Icon = meta.icon;
    const maxMB = onUploadFile ? 100 : 5; // without an upload handler files are embedded in the text
    const [tab, setTab] = useState(canUpload ? "upload" : "link");
    const [link, setLink] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [over, setOver] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (anchor) {
            setTab(canUpload ? "upload" : "link");
            setLink("");
            setError("");
            setBusy(false);
            setOver(false);
        }
    }, [anchor, canUpload]);

    const handleFile = async (file) => {
        if (!file) return;
        if (file.size > maxMB * 1024 * 1024) {
            setError(`That file is larger than ${maxMB}MB.`);
            return;
        }
        if (kind === "image" && !file.type.startsWith("image/")) {
            setError("Choose an image file.");
            return;
        }
        if (kind === "video" && !file.type.startsWith("video/")) {
            setError("Choose a video file.");
            return;
        }
        setBusy(true);
        setError("");
        try {
            const res = onUploadFile ? await onUploadFile(file) : await fileToDataUrl(file);
            const url = typeof res === "string" ? res : res?.url;
            if (!url) throw new Error("no url");
            onPick({ url, name: file.name });
        } catch (e) {
            setBusy(false);
            setError("Upload failed. Try again.");
        }
    };

    const submitLink = () => {
        const url = link.trim();
        if (!url) return;
        onPick({ url, name: decodeURIComponent(url.split("?")[0].split("/").pop() || "") });
    };

    const tabs = [...(canUpload ? [["upload", "Upload"]] : []), ["link", "Link"]];
    const primaryBtn = {
        border: "none",
        borderRadius: 6,
        background: c.accent,
        color: "#fff",
        padding: "7px 18px",
        fontWeight: 600,
        fontSize: "0.8125rem",
        cursor: "pointer",
        fontFamily: "inherit",
    };

    return (
        <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{ paper: { sx: { ...popoverPaperSx, width: 440, maxWidth: "92vw", p: 1.5, mt: 0.5 } } }}
        >
            <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                {tabs.map(([k, label]) => (
                    <Box
                        key={k}
                        onClick={() => { setTab(k); setError(""); }}
                        sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: tab === k ? c.text : c.muted,
                            bgcolor: tab === k ? c.activeHover : "transparent",
                            "&:hover": { bgcolor: c.hover },
                        }}
                    >
                        {label}
                    </Box>
                ))}
            </Box>

            {tab === "upload" && canUpload && (
                <Box>
                    <Box
                        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
                        onDragLeave={() => setOver(false)}
                        onDrop={(e) => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                        sx={{
                            border: `1px dashed ${over ? c.accent : c.border}`,
                            bgcolor: over ? "rgba(59,130,246,0.08)" : c.sub,
                            borderRadius: "8px",
                            py: 3.5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.5,
                            transition: "all 0.15s ease",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: c.muted, fontSize: "0.8125rem" }}>
                            <Icon size={15} /> {busy ? "Uploading..." : "Drag and drop or"}
                        </Box>
                        {!busy && (
                            <button type="button" style={primaryBtn} onClick={() => fileRef.current?.click()}>
                                Upload
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept={meta.accept}
                            style={{ display: "none" }}
                            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
                        />
                    </Box>
                    <Typography sx={{ fontSize: "0.75rem", color: c.muted, textAlign: "center", mt: 1 }}>
                        Maximum size per file is {maxMB}MB
                    </Typography>
                </Box>
            )}

            {tab === "link" && (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <input
                        autoFocus
                        placeholder={meta.linkPh}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitLink()}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: `1px solid ${c.border}`,
                            background: c.sub,
                            color: c.text,
                            outline: "none",
                            fontSize: "0.8125rem",
                            fontFamily: "inherit",
                        }}
                    />
                    <button type="button" style={primaryBtn} onClick={submitLink}>
                        {meta.btn}
                    </button>
                </Box>
            )}

            {error && (
                <Typography sx={{ fontSize: "0.75rem", color: "#f87171", mt: 1 }}>{error}</Typography>
            )}
        </Popover>
    );
}

/* ────────────── Image / Video / File / Embed ──────────────
 * Empty → "Add an image" bar that opens the Upload / Link picker.
 * Image toolbar: download, alignment, fit to width, fullscreen, replace.
 */
function MediaBlock({ block: b, onChange, c, isDark, popoverPaperSx, onUploadFile }) {
    const meta = MEDIA_META[b.type];
    const Icon = meta.icon;
    const [anchor, setAnchor] = useState(null);
    const [alignAnchor, setAlignAnchor] = useState(null);
    const [full, setFull] = useState(false);

    const pick = ({ url, name }) => {
        if (b.type === "attachment") onChange({ url, name: b.name || name || "" });
        else onChange({ url });
        setAnchor(null);
    };
    const picker = (
        <MediaPicker
            anchor={anchor}
            onClose={() => setAnchor(null)}
            kind={b.type}
            onPick={pick}
            onUploadFile={onUploadFile}
            c={c}
            popoverPaperSx={popoverPaperSx}
        />
    );

    if (!b.url) {
        return (
            <>
                <Box
                    onClick={(e) => setAnchor(e.currentTarget)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1.75,
                        py: 1.75,
                        my: 0.5,
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: c.accent,
                        bgcolor: isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.09)",
                        "&:hover": { bgcolor: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.14)" },
                    }}
                >
                    <Icon size={18} />
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 500, color: "inherit" }}>{meta.label}</Typography>
                </Box>
                {picker}
            </>
        );
    }

    const tbBtn = { p: 0.6, color: c.text, borderRadius: "6px", "&:hover": { bgcolor: c.hover } };
    const toolbar = (children) => (
        <Box
            className="media-toolbar"
            sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                p: 0.5,
                bgcolor: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: "10px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                opacity: 0,
                transition: "opacity 0.15s ease",
                zIndex: 3,
            }}
        >
            {children}
        </Box>
    );
    const replaceBtn = (
        <Tooltip title="Replace">
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={tbBtn}>
                <Upload size={16} />
            </IconButton>
        </Tooltip>
    );
    const hoverSx = { position: "relative", "&:hover .media-toolbar": { opacity: 1 } };

    /* Image */
    if (b.type === "image") {
        const align = b.align || "left";
        const fit = Boolean(b.fit);
        const AlignIcon = align === "center" ? AlignCenter : align === "right" ? AlignRight : AlignLeft;
        const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
        return (
            <Box sx={{ my: 1 }}>
                <Box sx={{ display: "flex", justifyContent: justify }}>
                    <Box sx={{ ...hoverSx, width: fit ? "100%" : "auto", maxWidth: "100%" }}>
                        <Box
                            component="img"
                            src={b.url}
                            alt={b.alt || "image"}
                            sx={{
                                display: "block",
                                width: fit ? "100%" : "auto",
                                maxWidth: "100%",
                                maxHeight: fit ? "none" : 480,
                                borderRadius: "8px",
                                objectFit: "contain",
                            }}
                        />
                        {toolbar(
                            <>
                                <Tooltip title="Download">
                                    <IconButton
                                        size="small"
                                        component="a"
                                        href={b.url}
                                        download={b.alt || "image"}
                                        target="_blank"
                                        rel="noreferrer"
                                        sx={{ ...tbBtn, color: c.accent }}
                                    >
                                        <Download size={16} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Alignment">
                                    <IconButton size="small" onClick={(e) => setAlignAnchor(e.currentTarget)} sx={{ ...tbBtn, gap: 0.25, borderRadius: "6px" }}>
                                        <AlignIcon size={16} />
                                        <ChevronDown size={13} color={c.muted} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={fit ? "Original size" : "Fit to width"}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onChange({ fit: !fit })}
                                        sx={{ ...tbBtn, bgcolor: fit ? c.activeHover : "transparent" }}
                                    >
                                        <ArrowLeftRight size={16} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Fullscreen">
                                    <IconButton size="small" onClick={() => setFull(true)} sx={tbBtn}>
                                        <Maximize2 size={16} />
                                    </IconButton>
                                </Tooltip>
                                {replaceBtn}
                            </>
                        )}
                    </Box>
                </Box>
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Add a caption..."
                    value={b.alt || ""}
                    onChange={(e) => onChange({ alt: e.target.value })}
                    InputProps={{ disableUnderline: true, sx: { fontSize: "0.75rem", color: c.muted, mt: 0.5 } }}
                    inputProps={{ style: { textAlign: align } }}
                />
                <Menu
                    anchorEl={alignAnchor}
                    open={Boolean(alignAnchor)}
                    onClose={() => setAlignAnchor(null)}
                    slotProps={{ paper: { sx: { ...popoverPaperSx, minWidth: 150, py: 0.5, "& .MuiMenuItem-root": { fontSize: "0.8125rem", gap: 1.25 } } } }}
                >
                    {[["left", "Left", AlignLeft], ["center", "Center", AlignCenter], ["right", "Right", AlignRight]].map(([k, label, I]) => (
                        <MenuItem key={k} onClick={() => { onChange({ align: k }); setAlignAnchor(null); }}>
                            <I size={15} color={c.muted} /> {label}
                            {align === k && <Check size={14} style={{ marginLeft: "auto" }} />}
                        </MenuItem>
                    ))}
                </Menu>
                <Dialog
                    open={full}
                    onClose={() => setFull(false)}
                    maxWidth={false}
                    slotProps={{ paper: { sx: { bgcolor: "transparent", boxShadow: "none", backgroundImage: "none", overflow: "visible" } } }}
                >
                    <img
                        src={b.url}
                        alt={b.alt || "image"}
                        onClick={() => setFull(false)}
                        style={{ maxWidth: "94vw", maxHeight: "90vh", borderRadius: 8, cursor: "zoom-out", display: "block" }}
                    />
                </Dialog>
                {picker}
            </Box>
        );
    }

    /* Video / Embed */
    if (b.type === "video" || b.type === "embed") {
        const embedUrl = b.type === "video" ? toEmbedUrl(b.url) : b.url;
        return (
            <Box sx={{ ...hoverSx, my: 0.5 }}>
                {embedUrl ? (
                    <Box
                        component="iframe"
                        src={embedUrl}
                        title={b.type}
                        allowFullScreen
                        sx={{ width: "100%", height: 320, border: "none", borderRadius: "8px", display: "block" }}
                    />
                ) : (
                    <Box
                        component="video"
                        src={b.url}
                        controls
                        sx={{ width: "100%", maxHeight: 360, borderRadius: "8px", border: "none", display: "block", bgcolor: "#000" }}
                    />
                )}
                {toolbar(replaceBtn)}
                {picker}
            </Box>
        );
    }

    /* File attachment */
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 1.25,
                my: 0.5,
                borderRadius: "8px",
                bgcolor: c.codeBg,
                border: `1px solid ${c.border}`,
            }}
        >
            <Paperclip size={16} color={c.muted} />
            <TextField
                fullWidth
                variant="standard"
                placeholder="File name"
                value={b.name || ""}
                onChange={(e) => onChange({ name: e.target.value })}
                InputProps={{ disableUnderline: true, sx: { fontSize: "0.8125rem", fontWeight: 600, color: c.text, p: 0 } }}
            />
            <Tooltip title="Download">
                <IconButton size="small" component="a" href={b.url} download={b.name || ""} target="_blank" rel="noreferrer" sx={{ ...tbBtn, color: c.accent }}>
                    <Download size={16} />
                </IconButton>
            </Tooltip>
            {replaceBtn}
            {picker}
        </Box>
    );
}

/* ────────────── Renderer for Layout / Advanced / Media blocks ────────────── */
function ExtraBlock({ block: b, onChange, c, popoverPaperSx }) {
    const [tab, setTab] = useState(0);
    const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
    const [columnMenuIndex, setColumnMenuIndex] = useState(0);
    const boxSx = { border: "none", borderRadius: "8px", bgcolor: c.codeBg, p: 1.5 };
    const inputProps = (extra = {}) => ({
        disableUnderline: true,
        sx: {
            fontSize: "0.875rem",
            color: c.text,
            p: 0,
            lineHeight: 1.55,
            "&&:before, &&:after, &&:hover:not(.Mui-disabled)::before": {
                borderBottom: "none !important",
            },
            ...extra,
        },
    });

    const urlInput = (placeholder) => (
        <TextField
            fullWidth
            variant="standard"
            placeholder={placeholder}
            value={b.url || ""}
            onChange={(e) => onChange({ url: e.target.value })}
            InputProps={inputProps({ fontSize: "0.8125rem", mt: 0.5 })}
        />
    );

    switch (b.type) {
        case "mermaid":
        case "equation":
            return (
                <Box sx={boxSx}>
                    <Typography sx={{ fontSize: "0.7rem", color: c.muted, textTransform: "uppercase", mb: 0.5 }}>
                        {b.type === "mermaid" ? "Mermaid diagram" : "Block equation (LaTeX)"}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        value={b.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        InputProps={inputProps({ fontFamily: "monospace", fontSize: "0.8125rem" })}
                    />
                </Box>
            );

        case "columns": {
            const i0 = columnMenuIndex;
            const setCols = (cols) => onChange({ cols });
            const swap = (a, z) => {
                const next = [...b.cols];
                [next[a], next[z]] = [next[z], next[a]];
                setCols(next);
            };
            const items = [
                { label: "Insert left", icon: <ArrowLeft size={15} color={c.muted} />, disabled: b.cols.length >= 4, run: () => setCols([...b.cols.slice(0, i0), "", ...b.cols.slice(i0)]) },
                { label: "Insert right", icon: <ArrowRight size={15} color={c.muted} />, disabled: b.cols.length >= 4, run: () => setCols([...b.cols.slice(0, i0 + 1), "", ...b.cols.slice(i0 + 1)]) },
                { label: "Move left", icon: <ArrowLeft size={15} color={c.muted} />, disabled: i0 === 0, run: () => swap(i0, i0 - 1) },
                { label: "Move right", icon: <ArrowRight size={15} color={c.muted} />, disabled: i0 >= b.cols.length - 1, run: () => swap(i0, i0 + 1) },
                { label: "Duplicate", icon: <Copy size={15} color={c.muted} />, disabled: b.cols.length >= 4, run: () => setCols([...b.cols.slice(0, i0 + 1), b.cols[i0], ...b.cols.slice(i0 + 1)]) },
                { label: "Clear contents", icon: <X size={15} color={c.muted} />, run: () => setCols(b.cols.map((v, k) => (k === i0 ? "" : v))) },
                { label: "Delete", icon: <Trash2 size={15} color="#f87171" />, danger: true, disabled: b.cols.length <= 2, run: () => setCols(b.cols.filter((_, k) => k !== i0)) },
            ];
            return (
                <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: `repeat(${b.cols.length}, minmax(0, 1fr))` }}>
                    {b.cols.map((txt, i) => (
                        <Box
                            key={i}
                            sx={{
                                ...boxSx,
                                bgcolor: "transparent",
                                position: "relative",
                                "&:hover .column-actions": { opacity: 1 },
                            }}
                        >
                            <IconButton
                                className="column-actions"
                                size="small"
                                aria-label={`Column ${i + 1} options`}
                                onClick={(e) => {
                                    setColumnMenuIndex(i);
                                    setColumnMenuAnchor(e.currentTarget);
                                }}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    opacity: 0,
                                    p: 0.25,
                                    color: c.muted,
                                    "&:hover": { color: c.text, bgcolor: c.hover },
                                }}
                            >
                                <EllipsisVertical size={16} />
                            </IconButton>
                            <TextField
                                fullWidth
                                multiline
                                variant="standard"
                                placeholder={`Column ${i + 1}`}
                                value={txt}
                                onChange={(e) => setCols(b.cols.map((x, xi) => (xi === i ? e.target.value : x)))}
                                InputProps={inputProps()}
                            />
                        </Box>
                    ))}
                    <Menu
                        anchorEl={columnMenuAnchor}
                        open={Boolean(columnMenuAnchor)}
                        onClose={() => setColumnMenuAnchor(null)}
                        slotProps={{
                            paper: { sx: { ...popoverPaperSx, minWidth: 200, borderRadius: "8px", py: 0.5, "& .MuiMenuItem-root": { fontSize: "0.8125rem" } } },
                        }}
                    >
                        <ActionItems items={items} c={c} onDone={() => setColumnMenuAnchor(null)} />
                    </Menu>
                </Box>
            );
        }

        case "tabs": {
            const vertical = b.orientation === "vertical";
            const idx = Math.min(tab, b.tabs.length - 1);
            const cur = b.tabs[idx];
            const removeTab = (i) => {
                if (b.tabs.length <= 1) return;
                onChange({ tabs: b.tabs.filter((_, k) => k !== i) });
                setTab(Math.max(0, i === idx ? i - 1 : idx > i ? idx - 1 : idx));
            };
            return (
                <Box
                    sx={{
                        ...boxSx,
                        bgcolor: "transparent",
                        position: "relative",
                        display: "flex",
                        flexDirection: vertical ? "row" : "column",
                        gap: 1.5,
                        "&:hover .tabs-actions": { opacity: 1 },
                    }}
                >
                    {/* orientation toggle */}
                    <Box
                        className="tabs-actions"
                        sx={{
                            position: "absolute",
                            top: -8,
                            right: 0,
                            display: "flex",
                            gap: 0.25,
                            opacity: 0,
                            transition: "opacity 0.15s ease",
                            bgcolor: c.sub,
                            border: `1px solid ${c.border}`,
                            borderRadius: "6px",
                            p: 0.25,
                            zIndex: 2,
                        }}
                    >
                        <Tooltip title="Horizontal tabs">
                            <IconButton size="small" onClick={() => onChange({ orientation: "horizontal" })} sx={{ p: 0.4, color: !vertical ? c.text : c.muted, bgcolor: !vertical ? c.hover : "transparent" }}>
                                <PanelTop size={14} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Vertical tabs">
                            <IconButton size="small" onClick={() => onChange({ orientation: "vertical" })} sx={{ p: 0.4, color: vertical ? c.text : c.muted, bgcolor: vertical ? c.hover : "transparent" }}>
                                <PanelLeft size={14} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: vertical ? "column" : "row",
                            flexWrap: "wrap",
                            alignItems: vertical ? "stretch" : "center",
                            gap: 0.5,
                            pr: vertical ? 1.5 : 0,
                            pb: vertical ? 0 : 0.75,
                            minWidth: vertical ? 120 : 0,
                        }}
                    >
                        {b.tabs.map((tb, i) => (
                            <Box
                                key={i}
                                onClick={() => setTab(i)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 1.25,
                                    py: 0.4,
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    bgcolor: i === idx ? c.hover : "transparent",
                                    "&:hover": { bgcolor: c.hover },
                                    "&:hover .tab-close": { opacity: 1 },
                                }}
                            >
                                <TextField
                                    variant="standard"
                                    value={tb.title}
                                    onChange={(e) =>
                                        onChange({ tabs: b.tabs.map((x, xi) => (xi === i ? { ...x, title: e.target.value } : x)) })
                                    }
                                    InputProps={inputProps({
                                        fontWeight: i === idx ? 700 : 500,
                                        color: i === idx ? c.text : c.muted,
                                    })}
                                    inputProps={{ size: Math.max(5, tb.title.length) }}
                                />
                                {b.tabs.length > 1 && (
                                    <IconButton
                                        className="tab-close"
                                        size="small"
                                        aria-label={`Delete ${tb.title}`}
                                        onClick={(e) => { e.stopPropagation(); removeTab(i); }}
                                        sx={{ p: 0.2, color: c.muted, opacity: i === idx ? 1 : 0, "&:hover": { color: c.text } }}
                                    >
                                        <X size={13} />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Box
                            onClick={() => {
                                onChange({ tabs: [...b.tabs, { title: `Tab ${b.tabs.length + 1}`, content: "" }] });
                                setTab(b.tabs.length);
                            }}
                            title="Add tab"
                            sx={{ px: 1, py: 0.4, cursor: "pointer", color: c.muted, display: "flex", alignItems: "center", "&:hover": { color: c.text } }}
                        >
                            <Plus size={15} />
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            variant="standard"
                            placeholder="Tab content..."
                            value={cur.content}
                            onChange={(e) =>
                                onChange({ tabs: b.tabs.map((x, xi) => (xi === idx ? { ...x, content: e.target.value } : x)) })
                            }
                            InputProps={inputProps()}
                        />
                    </Box>
                </Box>
            );
        }

        default:
            return null;
    }
}

/* ────────────── Markdown shortcuts: typing "- " at the start of a paragraph, etc. ────────────── */
const shortcutType = (text) => {
    switch (text) {
        case "# ": return "h1";
        case "## ": return "h2";
        case "### ": return "h3";
        case "- ":
        case "* ": return "bullet";
        case "1. ": return "numbered";
        case "[] ":
        case "[ ] ": return "todo";
        case "> ": return "quote";
        default: return null;
    }
};

/* ────────────── Main TaskDescriptionEditor Component ────────────── */
export default React.forwardRef(function TaskDescriptionEditor(
    {
        value = "",
        onChange,
        isDark = true,
        authorName = "User",
        onLastEditedChange,
        onUploadFile, // optional: async (file) => url | { url }. Without it files are embedded (max 5MB).
    },
    ref
) {
    const [blocks, setBlocks] = useState(() => parseContentToBlocks(value));
    const [activeBlockId, setActiveBlockId] = useState(null);
    const [hoveredBlockId, setHoveredBlockId] = useState(null);
    const [slashOpen, setSlashOpen] = useState(false);
    const [slashQuery, setSlashQuery] = useState("");
    const [slashIndex, setSlashIndex] = useState(0);
    const [slashAnchorEl, setSlashAnchorEl] = useState(null);
    const [targetInsertIdx, setTargetInsertIdx] = useState(null);

    // Block options menu (side handle)
    const [blockMenuAnchor, setBlockMenuAnchor] = useState(null);
    const [blockMenuTargetId, setBlockMenuTargetId] = useState(null);

    // Callout icon / tone picker
    const [calloutMenu, setCalloutMenu] = useState(null); // { anchor, id }

    // Bubble selection menu
    const [bubblePos, setBubblePos] = useState(null);
    const [colorMenuAnchor, setColorMenuAnchor] = useState(null);
    const selRef = useRef(null); // { id, start, end } of the current textarea selection

    const containerRef = useRef(null);
    const inputRefs = useRef({});
    const lastEmitted = useRef(value);

    // Sync external value, but ignore echoes of our own changes (keeps focus & block ids stable)
    useEffect(() => {
        if (value === lastEmitted.current) return;
        lastEmitted.current = value;
        setBlocks(parseContentToBlocks(value));
    }, [value]);

    const emit = useCallback(
        (next) => {
            const markdown = serializeBlocksToMarkdown(next);
            lastEmitted.current = markdown;
            onChange?.(markdown);
            onLastEditedChange?.();
        },
        [onChange, onLastEditedChange]
    );

    const updateBlocks = useCallback(
        (next) => {
            setBlocks(next);
            emit(next);
        },
        [emit]
    );

    const patchBlock = (id, patch) =>
        updateBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));

    const focusBlock = (id, delay = 50) =>
        setTimeout(() => inputRefs.current[id]?.focus(), delay);

    /* ─── Public API for the drawer toolbar ─── */
    React.useImperativeHandle(ref, () => ({
        openSlashMenu: () => {
            setTargetInsertIdx(blocks.length - 1);
            setSlashQuery("");
            setSlashIndex(0);
            setSlashAnchorEl(containerRef.current);
            setSlashOpen(true);
        },
        insertBlock: (key) => {
            const cmd = SLASH_COMMANDS.find((x) => x.key === key);
            if (!cmd || !cmd.createBlock) return;
            const newBlock = { id: uid(), ...cmd.createBlock() };
            updateBlocks([...blocks, newBlock]);
            setActiveBlockId(newBlock.id);
        },
    }));

    /* ─── Slash command filtering ─── */
    const filteredCommands = SLASH_COMMANDS.filter((cmd) => {
        const q = slashQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            cmd.title.toLowerCase().includes(q) ||
            cmd.desc.toLowerCase().includes(q) ||
            cmd.group.toLowerCase().includes(q) ||
            cmd.searchTerms.some((t) => t.includes(q))
        );
    });
    // Flat list in display order so arrow keys match what the user sees
    const orderedCommands = GROUP_ORDER.flatMap((g) => filteredCommands.filter((cmd) => cmd.group === g));

    const closeSlash = () => {
        setSlashOpen(false);
        setSlashQuery("");
    };

    const executeSlashCommand = (cmd) => {
        const idx =
            targetInsertIdx !== null && targetInsertIdx >= 0 ? Math.min(targetInsertIdx, blocks.length - 1) : blocks.length - 1;
        const curr = blocks[idx];

        /* Inline commands: insert text at the end of the current block */
        if (cmd.insertText) {
            const text = cmd.insertText({ authorName });
            let next;
            if (curr && typeof curr.content === "string") {
                next = blocks.map((b, i) =>
                    i === idx ? { ...b, content: b.content.replace(/\/$/, "") + text } : b
                );
                updateBlocks(next);
                setActiveBlockId(curr.id);
                focusBlock(curr.id);
            } else {
                const nb = { id: uid(), type: "paragraph", content: text };
                next = [...blocks];
                next.splice(idx + 1, 0, nb);
                updateBlocks(next);
                setActiveBlockId(nb.id);
                focusBlock(nb.id);
            }
            closeSlash();
            setTargetInsertIdx(null);
            return;
        }

        /* Block commands */
        const newBlock = { id: uid(), ...cmd.createBlock() };
        const next = [...blocks];
        const currEmpty = curr && typeof curr.content === "string" && (curr.content === "/" || curr.content === "");
        if (curr && currEmpty) {
            next.splice(idx, 1, newBlock);
        } else if (curr && typeof curr.content === "string" && curr.content.endsWith("/")) {
            next[idx] = { ...curr, content: curr.content.replace(/\/$/, "") };
            next.splice(idx + 1, 0, newBlock);
        } else {
            next.splice(idx + 1, 0, newBlock);
        }

        // Always keep an editable paragraph after non-text blocks at the end
        if (!TEXT_TYPES.includes(newBlock.type) && next[next.length - 1].id === newBlock.id) {
            next.push({ id: uid(), type: "paragraph", content: "" });
        }

        updateBlocks(next);
        closeSlash();
        setTargetInsertIdx(null);
        setActiveBlockId(newBlock.id);
        focusBlock(newBlock.id);
    };

    /* ─── Block content editing ─── */
    const handleContentChange = (id, newContent) => {
        const current = blocks.find((b) => b.id === id);

        // Markdown shortcuts ("- ", "1. ", "# ", "[] ", "> ")
        if (current && current.type === "paragraph") {
            const type = shortcutType(newContent);
            if (type) {
                updateBlocks(
                    blocks.map((b) =>
                        b.id === id ? { id, type, content: "", ...(type === "todo" ? { checked: false } : {}) } : b
                    )
                );
                focusBlock(id, 30);
                return;
            }
        }

        const next = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
        setBlocks(next);
        emit(next);

        // "/" trigger: only at the start of the block or after a space (so URLs don't open the menu)
        if (typeof newContent === "string" && /(^|\s)\/$/.test(newContent)) {
            const idx = blocks.findIndex((b) => b.id === id);
            setTargetInsertIdx(idx);
            setSlashQuery("");
            setSlashIndex(0);
            setSlashAnchorEl(inputRefs.current[id] || containerRef.current);
            setSlashOpen(true);
        }
    };

    const handleKeyDown = (e, b, idx) => {
        const el = e.target;
        const isList = ["todo", "bullet", "numbered"].includes(b.type);
        if (e.key === "Enter" && !e.shiftKey && b.type !== "code") {
            e.preventDefault();
            // Enter on an empty list item exits the list
            if (isList && b.content === "") {
                patchBlock(b.id, { type: "paragraph", checked: undefined });
                return;
            }
            const newBlock = {
                id: uid(),
                type: isList ? b.type : "paragraph",
                content: "",
                ...(b.type === "todo" ? { checked: false } : {}),
            };
            const next = [...blocks];
            next.splice(idx + 1, 0, newBlock);
            updateBlocks(next);
            setActiveBlockId(newBlock.id);
            focusBlock(newBlock.id, 40);
        } else if (e.key === "Backspace" && b.content === "") {
            // Empty list / heading / quote first turns into plain text, then the next Backspace deletes it
            if (b.type !== "paragraph") {
                e.preventDefault();
                patchBlock(b.id, { type: "paragraph", checked: undefined });
                return;
            }
            if (blocks.length > 1) {
                e.preventDefault();
                const prev = blocks[idx - 1];
                updateBlocks(blocks.filter((item) => item.id !== b.id));
                if (prev) {
                    setActiveBlockId(prev.id);
                    focusBlock(prev.id, 40);
                }
            }
        } else if (e.key === "ArrowDown" && idx < blocks.length - 1 && el.selectionStart === el.value.length) {
            const nb = blocks[idx + 1];
            if (inputRefs.current[nb.id]) {
                e.preventDefault();
                inputRefs.current[nb.id].focus();
            }
        } else if (e.key === "ArrowUp" && idx > 0 && el.selectionStart === 0) {
            const pb = blocks[idx - 1];
            if (inputRefs.current[pb.id]) {
                e.preventDefault();
                inputRefs.current[pb.id].focus();
            }
        }
    };

    const handleToggleTodo = (id, e) => {
        e?.stopPropagation();
        updateBlocks(blocks.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b)));
    };

    /* ─── Side menu actions ─── */
    const handleTurnBlockInto = (targetId, newType) => {
        updateBlocks(
            blocks.map((b) =>
                b.id === targetId
                    ? {
                        id: b.id,
                        type: newType,
                        content: typeof b.content === "string" ? b.content : "",
                        ...(newType === "todo" ? { checked: false } : {}),
                        ...(newType === "callout" ? { icon: b.icon || "💡", tone: b.tone || "blue" } : {}),
                        ...(newType === "code" ? { lang: b.lang || "javascript" } : {}),
                        ...(newType === "toggle" ? { open: true, body: b.body || "" } : {}),
                    }
                    : b
            )
        );
        setBlockMenuAnchor(null);
    };

    const handleDeleteBlock = (targetId) => {
        if (blocks.length <= 1) {
            updateBlocks([{ id: uid(), type: "paragraph", content: "" }]);
        } else {
            updateBlocks(blocks.filter((b) => b.id !== targetId));
        }
        setBlockMenuAnchor(null);
    };

    const handleDuplicateBlock = (targetId) => {
        const idx = blocks.findIndex((b) => b.id === targetId);
        if (idx === -1) return;
        const next = [...blocks];
        next.splice(idx + 1, 0, JSON.parse(JSON.stringify({ ...blocks[idx], id: uid() })));
        updateBlocks(next);
        setBlockMenuAnchor(null);
    };

    const handleMoveBlock = (targetId, dir) => {
        const idx = blocks.findIndex((b) => b.id === targetId);
        const to = idx + dir;
        if (idx === -1 || to < 0 || to >= blocks.length) return;
        const next = [...blocks];
        [next[idx], next[to]] = [next[to], next[idx]];
        updateBlocks(next);
        setBlockMenuAnchor(null);
    };

    /* ─── Selection bubble menu (works on the block textareas) ─── */
    const handleMouseUp = (e) => {
        if (e.target?.closest?.("[data-bubble]")) return;
        const el = document.activeElement;
        if (el && el.tagName === "TEXTAREA") {
            const id = Object.keys(inputRefs.current).find((k) => inputRefs.current[k] === el);
            if (id && el.selectionEnd > el.selectionStart) {
                selRef.current = { id, start: el.selectionStart, end: el.selectionEnd };
                setBubblePos({
                    top: Math.max(8, e.clientY - 56),
                    left: Math.max(16, e.clientX - 130),
                });
                return;
            }
        }
        selRef.current = null;
        setBubblePos(null);
    };

    const applyInlineFormat = (prefix, suffix = prefix) => {
        const sel = selRef.current;
        if (!sel) return;
        const blk = blocks.find((b) => b.id === sel.id);
        if (!blk || typeof blk.content !== "string") return;
        const { content } = blk;
        const nextContent =
            content.slice(0, sel.start) + prefix + content.slice(sel.start, sel.end) + suffix + content.slice(sel.end);
        patchBlock(sel.id, { content: nextContent });
        setBubblePos(null);
        selRef.current = null;
        focusBlock(sel.id);
    };

    /* ─── Paste an image from the clipboard → image block ─── */
    const handlePaste = async (e) => {
        const file = Array.from(e.clipboardData?.files || []).find((f) => f.type.startsWith("image/"));
        if (!file) return;
        e.preventDefault();
        if (file.size > (onUploadFile ? 100 : 5) * 1024 * 1024) return;
        try {
            const res = onUploadFile ? await onUploadFile(file) : await fileToDataUrl(file);
            const url = typeof res === "string" ? res : res?.url;
            if (!url) return;
            const nb = { id: uid(), type: "image", url, alt: "", align: "left", fit: false };
            const idx = blocks.findIndex((b) => b.id === activeBlockId);
            const next = [...blocks];
            const curr = blocks[idx];
            if (curr && curr.type === "paragraph" && !(curr.content || "").trim()) next.splice(idx, 1, nb);
            else next.splice(idx >= 0 ? idx + 1 : next.length, 0, nb);
            updateBlocks(next);
        } catch (err) {
            /* ignore failed paste */
        }
    };

    /* ─── Theme ─── */
    const c = {
        text: isDark ? "#f1f5f9" : "#0f172a",
        muted: isDark ? "#858b98" : "#64748b",
        border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        card: isDark ? "#17181f" : "#ffffff",
        sub: isDark ? "#121318" : "#f8fafc",
        hover: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        activeHover: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)",
        accent: "#3b82f6",
        codeBg: isDark ? "#121318" : "#f1f5f9",
    };

    const popoverPaperSx = {
        bgcolor: c.card,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: "10px",
        backgroundImage: "none",
        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
    };

    const isEmpty =
        blocks.length === 1 &&
        blocks[0].type === "paragraph" &&
        (!blocks[0].content || !blocks[0].content.trim());

    const numberFor = (idx) => {
        let n = 1;
        for (let k = idx - 1; k >= 0 && blocks[k].type === "numbered"; k--) n++;
        return n;
    };

    /* Shared text input used by every text-like block */
    const textField = (b, idx, placeholder, sx = {}) => (
        <TextField
            inputRef={(el) => (inputRefs.current[b.id] = el)}
            fullWidth
            multiline
            variant="standard"
            placeholder={placeholder}
            value={b.content}
            onChange={(e) => handleContentChange(b.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, b, idx)}
            onFocus={() => setActiveBlockId(b.id)}
            InputProps={{
                disableUnderline: true,
                sx: { fontSize: "0.875rem", color: c.text, p: 0, lineHeight: 1.55, ...sx },
            }}
        />
    );

    const TURN_INTO = [
        { key: "paragraph", label: "Text", I: Type },
        { key: "h1", label: "Heading 1", I: Heading1 },
        { key: "h2", label: "Heading 2", I: Heading2 },
        { key: "h3", label: "Heading 3", I: Heading3 },
        { key: "todo", label: "To-do list", I: ListChecks },
        { key: "bullet", label: "Bulleted list", I: List },
        { key: "numbered", label: "Numbered list", I: ListOrdered },
        { key: "toggle", label: "Toggle list", I: ChevronRight },
        { key: "quote", label: "Quote", I: Quote },
        { key: "callout", label: "Callout", I: Sparkles },
        { key: "code", label: "Code", I: Code },
    ];

    const menuBlock = blocks.find((b) => b.id === blockMenuTargetId);
    const menuBlockIdx = blocks.findIndex((b) => b.id === blockMenuTargetId);
    const canTurnInto = menuBlock && TEXT_TYPES.includes(menuBlock.type);

    const calloutTarget = calloutMenu ? blocks.find((b) => b.id === calloutMenu.id) : null;

    const headings = blocks.filter((h) => ["h1", "h2", "h3"].includes(h.type) && (h.content || "").trim());

    const bubbleBtn = { color: c.text, p: 0.5 };
    const keepFocus = (e) => e.preventDefault(); // don't steal focus/selection from the textarea

    return (
        <Box
            ref={containerRef}
            onMouseUp={handleMouseUp}
            onPaste={handlePaste}
            sx={{
                position: "relative",
                width: "100%",
                minHeight: 80,
                color: c.text,
                fontFamily: "inherit",
                fontSize: "0.875rem",
                lineHeight: 1.6,
            }}
        >
            {/* Empty placeholder prompt */}
            {isEmpty && activeBlockId !== blocks[0].id && (
                <Box
                    onClick={() => {
                        setActiveBlockId(blocks[0].id);
                        focusBlock(blocks[0].id);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        py: 1,
                        px: 0.5,
                        cursor: "text",
                        color: c.muted,
                        borderRadius: "6px",
                        transition: "all 0.15s ease",
                        "&:hover": { color: c.text, bgcolor: c.hover },
                    }}
                >
                    <Typography sx={{ fontSize: "0.875rem", color: "inherit", fontWeight: 400 }}>
                        Click to add description... Type{" "}
                        <kbd style={{ padding: "1px 5px", borderRadius: 4, background: c.hover, border: `1px solid ${c.border}`, fontSize: "0.78rem" }}>/</kbd>{" "}
                        for commands
                    </Typography>
                </Box>
            )}

            {/* Blocks */}
            {(!isEmpty || activeBlockId === blocks[0].id) && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {blocks.map((b, idx) => {
                        const isHovered = hoveredBlockId === b.id;
                        return (
                            <Box
                                key={b.id}
                                onMouseEnter={() => setHoveredBlockId(b.id)}
                                onMouseLeave={() => setHoveredBlockId(null)}
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    width: "100%",
                                    minHeight: 28,
                                    borderRadius: "6px",
                                    transition: "background-color 0.1s ease",
                                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)" },
                                }}
                            >
                                {/* Left gutter (+ and grip) */}
                                <Box
                                    className="block-gutter-btn"
                                    sx={{
                                        position: "absolute",
                                        left: -36,
                                        top: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.25,
                                        opacity: isHovered ? 1 : 0,
                                        transition: "opacity 0.15s ease",
                                        userSelect: "none",
                                        zIndex: 2,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTargetInsertIdx(idx);
                                            setSlashQuery("");
                                            setSlashIndex(0);
                                            setSlashAnchorEl(e.currentTarget);
                                            setSlashOpen(true);
                                        }}
                                        sx={{ p: 0.35, color: c.muted, "&:hover": { color: c.text, bgcolor: c.hover } }}
                                        title="Click to insert block below (/)"
                                    >
                                        <Plus size={13} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBlockMenuAnchor(e.currentTarget);
                                            setBlockMenuTargetId(b.id);
                                        }}
                                        sx={{ p: 0.35, color: c.muted, "&:hover": { color: c.text, bgcolor: c.hover } }}
                                        title="Click for block options"
                                    >
                                        <GripVertical size={13} />
                                    </IconButton>
                                </Box>

                                {/* Block body */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        py: 0.25,
                                        // remove every MUI input underline inside blocks
                                        "& .MuiInput-root:before, & .MuiInput-root:after, & .MuiInput-underline:before, & .MuiInput-underline:after": {
                                            display: "none !important",
                                            borderBottom: "none !important",
                                        },
                                    }}
                                >
                                    {b.type === "h1" && textField(b, idx, "Heading 1", { fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.35 })}
                                    {b.type === "h2" && textField(b, idx, "Heading 2", { fontSize: "1.15rem", fontWeight: 600, lineHeight: 1.4 })}
                                    {b.type === "h3" && textField(b, idx, "Heading 3", { fontSize: "1rem", fontWeight: 600, lineHeight: 1.45 })}

                                    {b.type === "paragraph" && textField(b, idx, isEmpty ? "Type '/' for commands..." : "", { lineHeight: 1.6 })}

                                    {b.type === "todo" && (
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <Box
                                                onClick={(e) => handleToggleTodo(b.id, e)}
                                                sx={{
                                                    mt: "4px",
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "4px",
                                                    bgcolor: b.checked ? c.accent : "transparent",
                                                    border: b.checked ? "none" : `1.5px solid ${c.muted}`,
                                                    boxSizing: "border-box",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    flexShrink: 0,
                                                    transition: "all 0.15s ease",
                                                    "&:hover": { transform: "scale(1.05)" },
                                                }}
                                            >
                                                {b.checked && <Check size={11} color="#fff" strokeWidth={3} />}
                                            </Box>
                                            {textField(b, idx, "To-do item...", {
                                                color: b.checked ? c.muted : c.text,
                                                textDecoration: b.checked ? "line-through" : "none",
                                            })}
                                        </Box>
                                    )}

                                    {b.type === "bullet" && (
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                                            <Box sx={{ mt: "10px", width: 5, height: 5, borderRadius: "50%", bgcolor: c.muted, flexShrink: 0 }} />
                                            {textField(b, idx, "List item...")}
                                        </Box>
                                    )}

                                    {b.type === "numbered" && (
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: c.muted, minWidth: 18, pt: "1px", flexShrink: 0 }}>
                                                {numberFor(idx)}.
                                            </Typography>
                                            {textField(b, idx, "List item...")}
                                        </Box>
                                    )}

                                    {b.type === "toggle" && (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => patchBlock(b.id, { open: !b.open })}
                                                    sx={{ p: 0.25, mt: "2px", color: c.muted, "&:hover": { color: c.text, bgcolor: c.hover } }}
                                                >
                                                    <ChevronRight
                                                        size={16}
                                                        style={{ transform: b.open ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }}
                                                    />
                                                </IconButton>
                                                {textField(b, idx, "Toggle title...", { fontWeight: 600 })}
                                            </Box>
                                            {b.open && (
                                                <Box sx={{ pl: 3.5, mt: 0.5 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        variant="standard"
                                                        placeholder="Toggle content..."
                                                        value={b.body || ""}
                                                        onChange={(e) => patchBlock(b.id, { body: e.target.value })}
                                                        InputProps={{ disableUnderline: true, sx: { fontSize: "0.875rem", color: c.text, p: 0, lineHeight: 1.55 } }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {b.type === "quote" && (
                                        <Box sx={{ pl: 2, borderLeft: `3px solid ${c.muted}` }}>
                                            {textField(b, idx, "Empty quote...", { fontStyle: "italic", lineHeight: 1.6 })}
                                        </Box>
                                    )}

                                    {b.type === "callout" && (() => {
                                        const rgb = CALLOUT_TONES[b.tone] || CALLOUT_TONES.blue;
                                        return (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: "8px",
                                                    bgcolor: `rgba(${rgb},${isDark ? 0.12 : 0.09})`,
                                                    border: "none",
                                                }}
                                            >
                                                <Tooltip title="Change icon & color">
                                                    <Box
                                                        onClick={(e) => setCalloutMenu({ anchor: e.currentTarget, id: b.id })}
                                                        sx={{
                                                            fontSize: "1.1rem",
                                                            lineHeight: 1.4,
                                                            cursor: "pointer",
                                                            borderRadius: "6px",
                                                            px: 0.25,
                                                            "&:hover": { bgcolor: c.hover },
                                                        }}
                                                    >
                                                        {b.icon || "💡"}
                                                    </Box>
                                                </Tooltip>
                                                {textField(b, idx, "Callout note or highlight...")}
                                            </Box>
                                        );
                                    })()}

                                    {b.type === "code" && (
                                        <Box sx={{ p: 1.5, borderRadius: "8px", bgcolor: c.codeBg, fontFamily: "monospace" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                                <select
                                                    value={b.lang || "javascript"}
                                                    onChange={(e) => patchBlock(b.id, { lang: e.target.value })}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        outline: "none",
                                                        color: c.muted,
                                                        fontFamily: "monospace",
                                                        fontSize: "0.7rem",
                                                        textTransform: "uppercase",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {(CODE_LANGS.includes(b.lang) ? CODE_LANGS : [b.lang, ...CODE_LANGS]).map((l) => (
                                                        <option key={l} value={l} style={{ background: c.card, color: c.text }}>
                                                            {l}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Tooltip title="Copy code">
                                                    <IconButton size="small" onClick={() => navigator.clipboard?.writeText(b.content)} sx={{ p: 0.25, color: c.muted }}>
                                                        <Copy size={12} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            {textField(b, idx, "// code snippet...", { fontFamily: "monospace", fontSize: "0.8125rem", lineHeight: 1.45 })}
                                        </Box>
                                    )}

                                    {/* Layout / Advanced / Media blocks */}
                                    {EXTRA_TYPES.includes(b.type) && (
                                        <ExtraBlock
                                            block={b}
                                            c={c}
                                            popoverPaperSx={popoverPaperSx}
                                            onChange={(patch) => patchBlock(b.id, patch)}
                                        />
                                    )}

                                    {b.type === "table" && (
                                        <TableBlock
                                            block={b}
                                            c={c}
                                            popoverPaperSx={popoverPaperSx}
                                            onChange={(patch) => patchBlock(b.id, patch)}
                                        />
                                    )}

                                    {b.type === "toc" && (
                                        <Box sx={{ p: 1.5, borderRadius: "8px", bgcolor: c.codeBg }}>
                                            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: c.muted, mb: 0.75 }}>
                                                Table of contents
                                            </Typography>
                                            {headings.length === 0 && (
                                                <Typography sx={{ fontSize: "0.8125rem", color: c.muted }}>
                                                    Add a heading and it will show up here.
                                                </Typography>
                                            )}
                                            {headings.map((h) => (
                                                <Box
                                                    key={h.id}
                                                    onClick={() => {
                                                        const el = inputRefs.current[h.id];
                                                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                                        el?.focus();
                                                    }}
                                                    sx={{
                                                        pl: h.type === "h1" ? 0 : h.type === "h2" ? 2 : 4,
                                                        py: 0.25,
                                                        fontSize: "0.8125rem",
                                                        color: c.muted,
                                                        cursor: "pointer",
                                                        "&:hover": { color: c.accent, textDecoration: "underline" },
                                                    }}
                                                >
                                                    {h.content}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {b.type === "divider" && (
                                        <Box sx={{ py: 1.5, cursor: "pointer" }} onClick={() => setActiveBlockId(b.id)}>
                                            <Divider sx={{ borderColor: c.border }} />
                                        </Box>
                                    )}

                                    {MEDIA_TYPES.includes(b.type) && (
                                        <MediaBlock
                                            block={b}
                                            c={c}
                                            isDark={isDark}
                                            popoverPaperSx={popoverPaperSx}
                                            onUploadFile={onUploadFile}
                                            onChange={(patch) => patchBlock(b.id, patch)}
                                        />
                                    )}

                                    {CHIP_TYPES.includes(b.type) && (
                                        <ChipBlock
                                            block={b}
                                            c={c}
                                            isDark={isDark}
                                            popoverPaperSx={popoverPaperSx}
                                            onChange={(patch) => patchBlock(b.id, patch)}
                                        />
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ────────────── Slash commands menu ────────────── */}
            <Popover
                open={slashOpen}
                anchorEl={slashAnchorEl}
                onClose={closeSlash}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            ...popoverPaperSx,
                            minWidth: 260,
                            maxWidth: 320,
                            maxHeight: 380,
                            p: 0.75,
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        },
                    },
                }}
            >
                <Box sx={{ px: 1, py: 0.5, mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                    <Search size={14} color={c.muted} />
                    <input
                        autoFocus
                        placeholder="Search commands..."
                        value={slashQuery}
                        onChange={(e) => {
                            setSlashQuery(e.target.value);
                            setSlashIndex(0);
                        }}
                        onKeyDown={(e) => {
                            const n = Math.max(1, orderedCommands.length);
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setSlashIndex((p) => (p + 1) % n);
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setSlashIndex((p) => (p - 1 + n) % n);
                            } else if (e.key === "Enter" && orderedCommands[slashIndex]) {
                                e.preventDefault();
                                executeSlashCommand(orderedCommands[slashIndex]);
                            } else if (e.key === "Escape") {
                                closeSlash();
                            }
                        }}
                        style={{ width: "100%", border: "none", background: "transparent", outline: "none", color: c.text, fontSize: "0.8125rem" }}
                    />
                </Box>

                {orderedCommands.length === 0 ? (
                    <Box sx={{ p: 1.5, textAlign: "center", color: c.muted, fontSize: "0.8125rem" }}>No commands found</Box>
                ) : (
                    GROUP_ORDER.map((g) => {
                        const items = orderedCommands.filter((cmd) => cmd.group === g);
                        if (!items.length) return null;
                        return (
                            <Box key={g}>
                                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: c.muted, px: 1.25, py: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    {g}
                                </Typography>
                                {items.map((cmd) => {
                                    const Icon = cmd.icon;
                                    const i = orderedCommands.indexOf(cmd);
                                    return (
                                        <Box
                                            key={cmd.key}
                                            onClick={() => executeSlashCommand(cmd)}
                                            onMouseEnter={() => setSlashIndex(i)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.25,
                                                px: 1.25,
                                                py: 0.75,
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                bgcolor: i === slashIndex ? c.activeHover : "transparent",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: "6px",
                                                    border: `1px solid ${c.border}`,
                                                    bgcolor: c.sub,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    color: c.text,
                                                }}
                                            >
                                                <Icon size={14} />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: c.text, lineHeight: 1.2 }}>
                                                    {cmd.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        );
                    })
                )}
            </Popover>

            {/* ────────────── Block options menu ────────────── */}
            <Menu
                anchorEl={blockMenuAnchor}
                open={Boolean(blockMenuAnchor)}
                onClose={() => setBlockMenuAnchor(null)}
                slotProps={{
                    paper: {
                        sx: {
                            ...popoverPaperSx,
                            borderRadius: "8px",
                            minWidth: 190,
                            maxHeight: 420,
                            py: 0.5,
                            "& .MuiMenuItem-root": { fontSize: "0.8125rem", gap: 1.25 },
                        },
                    },
                }}
            >
                {canTurnInto && (
                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: c.muted, px: 1.5, py: 0.4, textTransform: "uppercase" }}>
                        Turn Into
                    </Typography>
                )}
                {canTurnInto &&
                    TURN_INTO.map(({ key, label, I }) => (
                        <MenuItem key={key} onClick={() => handleTurnBlockInto(blockMenuTargetId, key)}>
                            <I size={14} color={c.muted} /> {label}
                            {menuBlock.type === key && <Check size={13} style={{ marginLeft: "auto" }} />}
                        </MenuItem>
                    ))}
                {canTurnInto && <Divider sx={{ my: 0.5, borderColor: c.border }} />}
                <MenuItem disabled={menuBlockIdx <= 0} onClick={() => handleMoveBlock(blockMenuTargetId, -1)}>
                    <ArrowUp size={14} color={c.muted} /> Move up
                </MenuItem>
                <MenuItem disabled={menuBlockIdx >= blocks.length - 1} onClick={() => handleMoveBlock(blockMenuTargetId, 1)}>
                    <ArrowDown size={14} color={c.muted} /> Move down
                </MenuItem>
                <MenuItem onClick={() => handleDuplicateBlock(blockMenuTargetId)}>
                    <Copy size={14} color={c.muted} /> Duplicate block
                </MenuItem>
                <MenuItem onClick={() => handleDeleteBlock(blockMenuTargetId)} sx={{ color: "#ef4444" }}>
                    <Trash2 size={14} color="#ef4444" /> Delete block
                </MenuItem>
            </Menu>

            {/* ────────────── Callout icon + tone picker ────────────── */}
            <Popover
                open={Boolean(calloutMenu)}
                anchorEl={calloutMenu?.anchor}
                onClose={() => setCalloutMenu(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { sx: { ...popoverPaperSx, borderRadius: "8px", p: 1.25, width: 232 } } }}
            >
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: c.muted, mb: 0.75 }}>Icon</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.25 }}>
                    {CALLOUT_ICONS.map((ic) => (
                        <Box
                            key={ic}
                            onClick={() => { patchBlock(calloutMenu.id, { icon: ic }); setCalloutMenu(null); }}
                            sx={{
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "1.05rem",
                                bgcolor: calloutTarget?.icon === ic ? c.activeHover : "transparent",
                                "&:hover": { bgcolor: c.hover },
                            }}
                        >
                            {ic}
                        </Box>
                    ))}
                </Box>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: c.muted, mb: 0.75 }}>Color</Typography>
                <Box sx={{ display: "flex", gap: 0.75 }}>
                    {Object.entries(CALLOUT_TONES).map(([tone, rgb]) => (
                        <Box
                            key={tone}
                            onClick={() => { patchBlock(calloutMenu.id, { tone }); setCalloutMenu(null); }}
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: `rgb(${rgb})`,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": { transform: "scale(1.1)" },
                                transition: "transform 0.1s ease",
                            }}
                        >
                            {(calloutTarget?.tone || "blue") === tone && <Check size={13} color="#fff" strokeWidth={3} />}
                        </Box>
                    ))}
                </Box>
            </Popover>

            {/* ────────────── Text colors menu ────────────── */}
            <Menu
                anchorEl={colorMenuAnchor}
                open={Boolean(colorMenuAnchor)}
                onClose={() => setColorMenuAnchor(null)}
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
                slotProps={{
                    paper: {
                        "data-bubble": "1",
                        sx: { ...popoverPaperSx, borderRadius: "8px", minWidth: 190, py: 0.5 },
                    },
                }}
            >
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: c.muted, px: 1.5, py: 0.5 }}>Text colors</Typography>
                {TEXT_COLORS.map((t) => (
                    <MenuItem
                        key={t.key}
                        onMouseDown={keepFocus}
                        onClick={() => {
                            if (t.color) applyInlineFormat(`<span style="color:${t.color}">`, "</span>");
                            setColorMenuAnchor(null);
                        }}
                        sx={{ gap: 1.25, fontSize: "0.875rem", fontWeight: 500 }}
                    >
                        <span style={{ color: t.color || c.text, fontWeight: 700, fontSize: "0.8rem" }}>Aa</span>
                        {t.title}
                    </MenuItem>
                ))}
            </Menu>

            {/* ────────────── Selection bubble toolbar ────────────── */}
            {bubblePos && (
                <Box
                    data-bubble="1"
                    onMouseDown={keepFocus}
                    sx={{
                        position: "fixed",
                        top: bubblePos.top,
                        left: bubblePos.left,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: c.card,
                        border: `1px solid ${c.border}`,
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        p: 0.5,
                        zIndex: 9999,
                    }}
                >
                    <Tooltip title="Bold">
                        <IconButton size="small" onClick={() => applyInlineFormat("**")} sx={bubbleBtn}><Bold size={13} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                        <IconButton size="small" onClick={() => applyInlineFormat("*")} sx={bubbleBtn}><Italic size={13} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Underline">
                        <IconButton size="small" onClick={() => applyInlineFormat("<u>", "</u>")} sx={bubbleBtn}><Underline size={13} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Strikethrough">
                        <IconButton size="small" onClick={() => applyInlineFormat("~~")} sx={bubbleBtn}><Strikethrough size={13} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Inline code">
                        <IconButton size="small" onClick={() => applyInlineFormat("`")} sx={bubbleBtn}><Code size={13} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Text color">
                        <IconButton size="small" onClick={(e) => setColorMenuAnchor(e.currentTarget)} sx={bubbleBtn}><Palette size={13} /></IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ my: 0.5, borderColor: c.border }} />
                    <Tooltip title="Add link">
                        <IconButton
                            size="small"
                            onClick={() => {
                                const url = window.prompt("Enter URL:", "https://");
                                if (url) applyInlineFormat("[", `](${url})`);
                            }}
                            sx={bubbleBtn}
                        >
                            <Link2 size={13} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
});
