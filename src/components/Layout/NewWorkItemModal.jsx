import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  X,
  Plus,
  Layers,
  Sparkles,
  User,
  Flag,
  Calendar,
  Tag,
  Paperclip,
} from "lucide-react";

export default function NewWorkItemModal({ open, onClose, onSubmit, isDark = true }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("TerraLink");
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState("NIRON ROEM");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onSubmit) {
      onSubmit({
        title,
        description,
        project,
        priority,
        assignee,
        id: `TERRA-${Math.floor(Math.random() * 90) + 10}`,
        time: "Just now",
      });
    }

    setTitle("");
    setDescription("");
    onClose();
  };

  const bgColor = isDark ? "#16171b" : "#ffffff";
  const borderColor = isDark ? "#282a31" : "#e2e8f0";
  const textColor = isDark ? "#f0f2f5" : "#0f172a";
  const mutedTextColor = isDark ? "#949aa7" : "#64748b";
  const inputBg = isDark ? "#101114" : "#f8fafc";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? "0 20px 40px rgba(0,0,0,0.6)"
              : "0 20px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                bgcolor: "#d946ef",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              T
            </Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: textColor }}>
              Create work item in {project}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: mutedTextColor, "&:hover": { color: textColor } }}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            placeholder="Work item title..."
            variant="standard"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: textColor,
                },
              },
            }}
          />

          <TextField
            placeholder="Add description, notes, or acceptance criteria..."
            multiline
            rows={3}
            variant="standard"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: "0.875rem",
                  color: textColor,
                },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              pt: 2,
              borderTop: `1px solid ${borderColor}`,
            }}
          >
            {/* Project selection */}
            <Select
              size="small"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              sx={{
                height: 32,
                fontSize: "0.8125rem",
                color: textColor,
                bgcolor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value="TerraLink">TerraLink</MenuItem>
              <MenuItem value="HR Management">HR Management</MenuItem>
              <MenuItem value="UniForge Lab">UniForge Lab</MenuItem>
            </Select>

            {/* Priority selection */}
            <Select
              size="small"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              sx={{
                height: 32,
                fontSize: "0.8125rem",
                color: textColor,
                bgcolor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value="Urgent">🔴 Urgent</MenuItem>
              <MenuItem value="High">🟠 High</MenuItem>
              <MenuItem value="Medium">🟡 Medium</MenuItem>
              <MenuItem value="Low">⚪ Low</MenuItem>
            </Select>

            {/* Assignee selection */}
            <Select
              size="small"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              sx={{
                height: 32,
                fontSize: "0.8125rem",
                color: textColor,
                bgcolor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value="NIRON ROEM">👤 NIRON ROEM</MenuItem>
              <MenuItem value="Engineering Team">👥 Engineering Team</MenuItem>
              <MenuItem value="Unassigned">🔘 Unassigned</MenuItem>
            </Select>
          </Box>
        </DialogContent>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderTop: `1px solid ${borderColor}`,
            bgcolor: isDark ? "#121316" : "#f1f5f9",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Attach file">
              <IconButton size="small" sx={{ color: mutedTextColor }}>
                <Paperclip size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="AI Assistant suggestion">
              <IconButton size="small" sx={{ color: "#38bdf8" }}>
                <Sparkles size={16} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              size="small"
              onClick={onClose}
              sx={{
                color: mutedTextColor,
                textTransform: "none",
                "&:hover": { color: textColor },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={!title.trim()}
              sx={{
                textTransform: "none",
                bgcolor: "#0284c7",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: "6px",
                "&:hover": { bgcolor: "#0369a1" },
              }}
            >
              Create Item
            </Button>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
}
