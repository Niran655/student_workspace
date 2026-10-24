/* eslint-disable react-refresh/only-export-components */
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext must be used within ThemeProvider");
  return context;
};

// ─── GitHub / Primer Design Tokens ──────────────────────────────────────────
const tokens = {
  dark: {
    bg:           "#0d1117",
    bgSubtle:     "#161b22",
    bgMuted:      "#21262d",
    bgOverlay:    "#161b22",
    surface:      "#161b22",
    border:       "#30363d",
    borderSubtle: "#21262d",
    text:         "#f0f6fc",
    textMuted:    "#848d97",
    textSubtle:   "#6e7681",
    primary:      "#238636", // GitHub Action Green
    primaryHover: "#2ea043",
    accent:       "#58a6ff", // GitHub Blue link
    accentSubtle: "rgba(56, 139, 253, 0.15)",
    tabIndicator: "#f78166", // Orange coral tab active line
  },
  light: {
    bg:           "#ffffff",
    bgSubtle:     "#f6f8fa",
    bgMuted:      "#eaeef2",
    bgOverlay:    "#ffffff",
    surface:      "#ffffff",
    border:       "#d0d7de",
    borderSubtle: "#eaeef2",
    text:         "#1f2328",
    textMuted:    "#636c76",
    textSubtle:   "#9198a1",
    primary:      "#1f883d",
    primaryHover: "#1a7f37",
    accent:       "#0969da",
    accentSubtle: "rgba(9, 105, 218, 0.1)",
    tabIndicator: "#fd8c73",
  },
};

// ─── Global Base CSS ────────────────────────────────────────────────────────
const injectBaseStyles = () => {
  if (document.getElementById("theme-base-styles")) return;
  const style = document.createElement("style");
  style.id = "theme-base-styles";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(110, 118, 129, 0.4); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(110, 118, 129, 0.6); }

    body.theme-dark {
      background-color: #0d1117;
      color: #f0f6fc;
    }

    body.theme-light {
      background-color: #ffffff;
      color: #1f2328;
    }

    ::selection {
      background: rgba(56, 139, 253, 0.3);
    }
  `;
  document.head.appendChild(style);
};

export const ThemeProvider = ({ children }) => {
  // Only 2 modes: 'dark' or 'light'
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved === "light" ? "light" : "dark";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "#238636";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    injectBaseStyles();
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${mode}`);
  }, [mode]);

  const toggleColorMode = (newMode) => {
    if (newMode === "light" || newMode === "dark") {
      setMode(newMode);
    } else {
      setMode((prev) => (prev === "dark" ? "light" : "dark"));
    }
  };

  const resetSettings = () => {
    setMode("dark");
    setPrimaryColor("#238636");
    localStorage.setItem("themeMode", "dark");
    localStorage.setItem("primaryColor", "#238636");
  };

  // ─── MUI Theme ─────────────────────────────────────────────────────────────
  const theme = useMemo(() => {
    const isDark = mode === "dark";
    const t = isDark ? tokens.dark : tokens.light;
    const effectivePrimary = primaryColor || t.primary;
    const radius = 6;

    return createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
        primary: {
          main: effectivePrimary,
          light: isDark ? "#2ea043" : "#2da44e",
          dark: isDark ? "#196c2e" : "#1a7f37",
          contrastText: "#ffffff",
        },
        secondary: {
          main: isDark ? "#21262d" : "#f6f8fa",
          light: isDark ? "#30363d" : "#f3f4f6",
          dark: isDark ? "#161b22" : "#eaeef2",
          contrastText: isDark ? "#f0f6fc" : "#1f2328",
        },
        background: {
          default: t.bg,
          paper: t.surface,
        },
        text: {
          primary: t.text,
          secondary: t.textMuted,
          disabled: t.textSubtle,
        },
        divider: t.border,
        error: {
          main: isDark ? "#f85149" : "#cf222e",
          light: "#ff7b72",
          dark: "#da3633",
        },
        warning: {
          main: isDark ? "#d29922" : "#9a6700",
          light: "#e3b341",
          dark: "#bb8009",
        },
        success: {
          main: isDark ? "#238636" : "#1f883d",
          light: "#2ea043",
          dark: "#196c2e",
        },
        info: {
          main: isDark ? "#58a6ff" : "#0969da",
          light: "#79c0ff",
          dark: "#1f6feb",
        },
        action: {
          hover: isDark ? "rgba(110, 118, 129, 0.12)" : "rgba(208, 215, 222, 0.32)",
          selected: isDark ? "rgba(110, 118, 129, 0.2)" : "rgba(208, 215, 222, 0.48)",
          focus: isDark ? "rgba(56, 139, 253, 0.2)" : "rgba(9, 105, 218, 0.15)",
        },
      },

      typography: {
        fontFamily: [
          '"Kantumruy Pro"',
          '"Inter"',
          '"Noto Sans Khmer"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ].join(","),
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        h1: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.25, color: t.text },
        h2: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3, color: t.text },
        h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.375, color: t.text },
        h4: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4, color: t.text },
        h5: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5, color: t.text },
        h6: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5, color: t.textMuted },
        body1: { fontSize: "0.875rem", lineHeight: 1.5, color: t.text },
        body2: { fontSize: "0.8125rem", lineHeight: 1.5, color: t.textMuted },
        caption: { fontSize: "0.75rem", lineHeight: 1.4, color: t.textSubtle },
        button: { fontWeight: 500, textTransform: "none", letterSpacing: 0 },
      },

      shape: {
        borderRadius: radius,
      },

      shadows: [
        "none",
        isDark ? "0 0 0 1px #30363d" : "0 1px 3px rgba(31,35,40,0.12), 0 0 0 1px #d0d7de",
        isDark ? "0 0 0 1px #30363d, 0 4px 12px rgba(0,0,0,0.4)" : "0 1px 3px rgba(31,35,40,0.12), 0 4px 12px rgba(31,35,40,0.08)",
        isDark ? "0 0 0 1px #30363d, 0 8px 24px rgba(0,0,0,0.5)" : "0 1px 3px rgba(31,35,40,0.12), 0 8px 24px rgba(31,35,40,0.12)",
        ...Array(21).fill("none"),
      ],

      components: {
        // ── AppBar (Header / Topbar) ─────────────────────────────────────────
        MuiAppBar: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#010409" : "#f6f8fa",
              color: t.text,
              borderBottom: `1px solid ${t.border}`,
              boxShadow: "none",
            },
          },
        },

        // ── Paper ────────────────────────────────────────────────────────────
        MuiPaper: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundColor: t.surface,
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
              boxShadow: "none",
            },
          },
        },

        // ── Card ─────────────────────────────────────────────────────────────
        MuiCard: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundColor: t.surface,
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
              borderRadius: radius,
              boxShadow: "none",
            },
          },
        },

        MuiCardContent: {
          styleOverrides: {
            root: { padding: "16px", "&:last-child": { paddingBottom: "16px" } },
          },
        },

        // ── Button (Primary, Secondary, Outlined, Text) ──────────────────────
        MuiButton: {
          defaultProps: {
            disableElevation: true,
            variant: "outlined",
            color: "primary",
          },
          styleOverrides: {
            root: {
              alignSelf: "center",
              boxSizing: "border-box",
              flex: "0 0 auto",
              minHeight: "40px",
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: "22px",
              borderRadius: radius,
              textTransform: "none",
              padding: "8px 16px",
              transition: "80ms cubic-bezier(0.33, 1, 0.68, 1)",
              "&:focus-visible": {
                outline: `2px solid ${isDark ? "#58a6ff" : "#0969da"}`,
                outlineOffset: "2px",
              },
            },
            sizeSmall: {
              minHeight: "32px",
              fontSize: "0.8125rem",
              lineHeight: "18px",
              padding: "5px 10px",
            },
            sizeLarge: {
              minHeight: "44px",
              padding: "10px 20px",
            },
            containedPrimary: {
              backgroundColor: effectivePrimary,
              color: "#ffffff",
              border: `1px solid ${isDark ? "rgba(240, 246, 252, 0.1)" : "rgba(31, 35, 40, 0.15)"}`,
              boxShadow: isDark
                ? "0 0 0 1px transparent, inset 0 1px 0 rgba(255,255,255,0.15)"
                : "0 1px 0 rgba(31,35,40,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: isDark ? "#2ea043" : "#1a7f37",
                borderColor: isDark ? "rgba(240, 246, 252, 0.2)" : "rgba(31, 35, 40, 0.2)",
              },
              "&:active": {
                backgroundColor: isDark ? "#196c2e" : "#156525",
              },
            },
            containedSecondary: {
              backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              color: isDark ? "#c9d1d9" : "#24292f",
              border: `1px solid ${t.border}`,
              "&:hover": {
                backgroundColor: isDark ? "#30363d" : "#f3f4f6",
                borderColor: isDark ? "#8b949e" : "rgba(31, 35, 40, 0.3)",
              },
            },
            outlined: {
              backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              borderColor: t.border,
              color: t.text,
              "&:hover": {
                backgroundColor: isDark ? "#30363d" : "#f3f4f6",
                borderColor: isDark ? "#8b949e" : "rgba(31,35,40,0.3)",
              },
            },
            outlinedPrimary: {
              backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              borderColor: t.border,
              color: t.text,
              "&:hover": {
                backgroundColor: isDark ? "#30363d" : "#f3f4f6",
                borderColor: isDark ? "#8b949e" : "rgba(31, 35, 40, 0.3)",
              },
            },
            text: {
              color: t.text,
              "&:hover": {
                backgroundColor: isDark ? "rgba(110,118,129,0.15)" : "rgba(208,215,222,0.3)",
              },
            },
          },
        },

        // ── Text Field & Input Base ──────────────────────────────────────────
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#0d1117" : "#ffffff",
              color: t.text,
              borderRadius: radius,
              fontSize: "0.875rem",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: t.border,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#8b949e" : "rgba(31,35,40,0.4)",
              },
              "&.Mui-focused": {
                backgroundColor: isDark ? "#0d1117" : "#ffffff",
                boxShadow: isDark
                  ? "0 0 0 3px rgba(31, 111, 235, 0.35)"
                  : "0 0 0 3px rgba(9, 105, 218, 0.25)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "#1f6feb" : "#0969da",
                  borderWidth: "1px",
                },
              },
              "&.Mui-error": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "#f85149" : "#cf222e",
                },
                "&.Mui-focused": {
                  boxShadow: isDark
                    ? "0 0 0 3px rgba(248, 81, 73, 0.35)"
                    : "0 0 0 3px rgba(207, 34, 46, 0.25)",
                },
              },
            },
            input: {
              padding: "7px 12px",
              "&::placeholder": {
                color: t.textSubtle,
                opacity: 1,
              },
            },
          },
        },

        // ── Standard Input (variant="standard") ─────────────────────────────
        MuiInput: {
          styleOverrides: {
            root: {
              "&::before": {
                borderBottom: `1px solid ${t.border}`,
              },
              "&:hover:not(.Mui-disabled)::before": {
                borderBottom: `1px solid ${isDark ? "#8b949e" : "rgba(31,35,40,0.4)"}`,
              },
              "&::after": {
                borderBottom: "none",
              },
              "&.Mui-focused::after": {
                borderBottom: "none",
              },
            },
          },
        },

        // ── Select & NativeSelect ────────────────────────────────────────────
        MuiSelect: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#0d1117" : "#ffffff",
              borderRadius: radius,
            },
            select: {
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
            },
            icon: {
              color: t.textMuted,
            },
          },
        },

        // ── Autocomplete ─────────────────────────────────────────────────────
        MuiAutocomplete: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                padding: "3px 9px",
              },
            },
            paper: {
              backgroundColor: isDark ? "#161b22" : "#ffffff",
              border: `1px solid ${t.border}`,
              borderRadius: radius,
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px #30363d"
                : "0 8px 24px rgba(31,35,40,0.12), 0 0 0 1px #d0d7de",
              marginTop: "4px",
            },
            listbox: {
              padding: "4px",
              "& .MuiAutocomplete-option": {
                borderRadius: "4px",
                fontSize: "0.8125rem",
                padding: "6px 8px",
                color: t.text,
                '&[aria-selected="true"]': {
                  backgroundColor: isDark ? "rgba(56, 139, 253, 0.15)" : "rgba(9, 105, 218, 0.1)",
                  color: isDark ? "#58a6ff" : "#0969da",
                  fontWeight: 600,
                },
                '&[data-focus="true"]': {
                  backgroundColor: isDark ? "#21262d" : "#f6f8fa",
                },
              },
            },
            tag: {
              margin: "2px",
              borderRadius: "4px",
              height: "22px",
              fontSize: "0.75rem",
              backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              border: `1px solid ${t.border}`,
              color: t.text,
            },
          },
        },

        // ── Menu & MenuItem ──────────────────────────────────────────────────
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? "#161b22" : "#ffffff",
              border: `1px solid ${t.border}`,
              borderRadius: radius,
              padding: "4px",
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px #30363d"
                : "0 8px 24px rgba(31,35,40,0.12), 0 0 0 1px #d0d7de",
            },
          },
        },

        MuiMenuItem: {
          styleOverrides: {
            root: {
              borderRadius: "4px",
              fontSize: "0.8125rem",
              padding: "6px 8px",
              color: t.text,
              "&:hover": {
                backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              },
              "&.Mui-selected": {
                backgroundColor: isDark ? "rgba(56, 139, 253, 0.15)" : "rgba(9, 105, 218, 0.1)",
                color: isDark ? "#58a6ff" : "#0969da",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: isDark ? "rgba(56, 139, 253, 0.22)" : "rgba(9, 105, 218, 0.15)",
                },
              },
            },
          },
        },

        // ── Tabs & Tab (GitHub style with coral active line) ─────────────────
        MuiTabs: {
          styleOverrides: {
            root: {
              minHeight: "40px",
              borderBottom: `1px solid ${t.border}`,
            },
            indicator: {
              backgroundColor: t.tabIndicator,
              height: "2px",
              borderRadius: "2px",
            },
          },
        },

        MuiTab: {
          styleOverrides: {
            root: {
              minHeight: "40px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              color: t.textMuted,
              padding: "8px 16px",
              gap: "8px",
              transition: "color 0.12s ease",
              "&:hover": {
                color: t.text,
              },
              "&.Mui-selected": {
                color: t.text,
                fontWeight: 600,
              },
            },
          },
        },

        // ── Chip (Labels / Tags) ─────────────────────────────────────────────
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 500,
              height: "24px",
              backgroundColor: isDark ? "#21262d" : "#f6f8fa",
              border: `1px solid ${t.border}`,
              color: t.text,
            },
            filledPrimary: {
              backgroundColor: isDark ? "rgba(56, 139, 253, 0.15)" : "rgba(9, 105, 218, 0.1)",
              border: `1px solid ${isDark ? "rgba(56, 139, 253, 0.4)" : "rgba(9, 105, 218, 0.3)"}`,
              color: isDark ? "#58a6ff" : "#0969da",
              fontWeight: 600,
            },
            outlined: {
              backgroundColor: "transparent",
              borderColor: t.border,
            },
          },
        },

        // ── Checkbox & Radio ─────────────────────────────────────────────────
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: t.border,
              "&.Mui-checked": {
                color: isDark ? "#1f6feb" : "#0969da",
              },
            },
          },
        },

        MuiRadio: {
          styleOverrides: {
            root: {
              color: t.border,
              "&.Mui-checked": {
                color: isDark ? "#1f6feb" : "#0969da",
              },
            },
          },
        },

        // ── Switch ───────────────────────────────────────────────────────────
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: 36,
              height: 20,
              padding: 0,
            },
            switchBase: {
              padding: 2,
              "&.Mui-checked": {
                transform: "translateX(16px)",
                color: "#ffffff",
                "& + .MuiSwitch-track": {
                  backgroundColor: isDark ? "#1f6feb" : "#0969da",
                  opacity: 1,
                  border: 0,
                },
              },
            },
            thumb: {
              width: 16,
              height: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            },
            track: {
              borderRadius: 10,
              backgroundColor: isDark ? "#30363d" : "#d0d7de",
              opacity: 1,
            },
          },
        },

        // ── Table ────────────────────────────────────────────────────────────
        MuiTable: {
          styleOverrides: {
            root: {
              borderCollapse: "separate",
              borderSpacing: 0,
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: `1px solid ${t.borderSubtle}`,
              color: t.text,
              fontSize: "0.8125rem",
              padding: "10px 16px",
            },
            head: {
              backgroundColor: isDark ? "#161b22" : "#f6f8fa",
              fontWeight: 600,
              color: t.textMuted,
              borderBottom: `1px solid ${t.border}`,
            },
          },
        },

        // ── Dialog ───────────────────────────────────────────────────────────
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? "#161b22" : "#ffffff",
              border: `1px solid ${t.border}`,
              borderRadius: "10px",
              boxShadow: isDark
                ? "0 16px 32px rgba(0,0,0,0.7), 0 0 0 1px #30363d"
                : "0 16px 32px rgba(31,35,40,0.15), 0 0 0 1px #d0d7de",
            },
          },
        },

        // ── Divider ──────────────────────────────────────────────────────────
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: t.borderSubtle,
            },
          },
        },

        // ── Tooltip ──────────────────────────────────────────────────────────
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: isDark ? "#24292f" : "#1f2328",
              border: `1px solid ${isDark ? "#30363d" : "#24292f"}`,
              color: "#ffffff",
              fontSize: "0.75rem",
              borderRadius: "4px",
              padding: "4px 8px",
            },
            arrow: {
              color: isDark ? "#24292f" : "#1f2328",
            },
          },
        },
      },
    });
  }, [mode, primaryColor]);

  const value = {
    mode,
    isDark: mode === "dark",
    primaryColor,
    toggleColorMode,
    setPrimaryColor,
    resetSettings,
    tokens: mode === "dark" ? tokens.dark : tokens.light,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};