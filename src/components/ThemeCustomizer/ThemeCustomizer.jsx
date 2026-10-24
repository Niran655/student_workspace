import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";

import { useThemeContext } from "../../Context/ThemeContext";
import { Button, Stack } from "../ui";

const ACCENT_COLORS = [
  { name: "GitHub Green", value: "#238636" },
  { name: "Primer Blue",  value: "#1f6feb" },
  { name: "Purple",       value: "#8957e5" },
  { name: "Coral / Orange", value: "#f78166" },
  { name: "Cyan / Teal",  value: "#39c5bb" },
  { name: "Amber",        value: "#d29922" },
];

export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const { mode, toggleColorMode, primaryColor, setPrimaryColor, resetSettings } =
    useThemeContext();

  const isDark = mode === "dark";
  const drawerBg = isDark ? "#0D1117" : "#ffffff";
  const drawerBorder = isDark ? "#30363d" : "#d0d7de";
  const drawerText = isDark ? "#f0f6fc" : "#1f2328";
  const drawerMuted = isDark ? "#848d97" : "#636c76";

  return (
    <>
      {/* Trigger Tab on Right Edge */}
      <Tooltip title="Theme Settings" placement="left">
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9999,
            width: 34,
            height: 44,
            backgroundColor: isDark ? "#21262d" : "#f6f8fa",
            border: `1px solid ${drawerBorder}`,
            borderRight: "none",
            borderRadius: "6px 0 0 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,0.5)"
              : "0 4px 12px rgba(31,35,40,0.15)",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: isDark ? "#30363d" : "#eaeef2",
              width: 38,
            },
          }}
        >
          <SettingsIcon sx={{ fontSize: 18, color: drawerText }} />
        </Box>
      </Tooltip>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "85vw", sm: 320 },
            backgroundColor: drawerBg,
            color: drawerText,
            borderLeft: `1px solid ${drawerBorder}`,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${drawerBorder}`,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
              Theme Settings
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: drawerMuted }}>
              Switch between Dark and Light mode
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: drawerMuted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2.5, flex: 1, overflowY: "auto" }}>
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: drawerMuted,
              mb: 1.5,
            }}
          >
            Theme Mode (Dark / Light)
          </Typography>

          <RadioGroup
            value={mode}
            onChange={(e) => toggleColorMode(e.target.value)}
            sx={{ gap: 1, mb: 3 }}
          >
            <Box
              onClick={() => toggleColorMode("dark")}
              sx={{
                p: 1.5,
                borderRadius: "6px",
                border: `1px solid ${mode === "dark" ? primaryColor : drawerBorder}`,
                backgroundColor: mode === "dark" ? (isDark ? "rgba(56, 139, 253, 0.1)" : "#f6f8fa") : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <DarkModeIcon fontSize="small" sx={{ color: isDark ? "#58a6ff" : "#0969da" }} />
                <Box>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Dark Mode</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: drawerMuted }}>
                    GitHub Dark (#0d1117)
                  </Typography>
                </Box>
              </Stack>
              <FormControlLabel
                value="dark"
                control={<Radio size="small" />}
                label=""
                sx={{ m: 0 }}
              />
            </Box>

            <Box
              onClick={() => toggleColorMode("light")}
              sx={{
                p: 1.5,
                borderRadius: "6px",
                border: `1px solid ${mode === "light" ? primaryColor : drawerBorder}`,
                backgroundColor: mode === "light" ? (isDark ? "#21262d" : "rgba(9, 105, 218, 0.08)") : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LightModeIcon fontSize="small" sx={{ color: "#d29922" }} />
                <Box>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Light Mode</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: drawerMuted }}>
                    GitHub Light (#ffffff)
                  </Typography>
                </Box>
              </Stack>
              <FormControlLabel
                value="light"
                control={<Radio size="small" />}
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </RadioGroup>

          <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: drawerMuted,
              mb: 1.5,
            }}
          >
            Primary Action Color
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, mb: 3 }}>
            {ACCENT_COLORS.map((col) => {
              const active = primaryColor === col.value;
              return (
                <Box
                  key={col.name}
                  onClick={() => setPrimaryColor(col.value)}
                  sx={{
                    p: 1,
                    borderRadius: "6px",
                    border: `1px solid ${active ? col.value : drawerBorder}`,
                    backgroundColor: active ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent",
                    cursor: "pointer",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "4px",
                      backgroundColor: col.value,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    {active && <CheckIcon sx={{ fontSize: 14 }} />}
                  </Box>
                  <Typography sx={{ fontSize: "0.6875rem", color: drawerText }}>
                    {col.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: `1px solid ${drawerBorder}` }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={resetSettings}
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: isDark ? "#f85149" : "#cf222e",
              borderColor: isDark ? "rgba(248,81,73,0.3)" : "rgba(207,34,46,0.3)",
              "&:hover": {
                borderColor: isDark ? "#f85149" : "#cf222e",
                backgroundColor: isDark ? "rgba(248,81,73,0.1)" : "rgba(207,34,46,0.08)",
              },
            }}
          >
            Reset to defaults
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
