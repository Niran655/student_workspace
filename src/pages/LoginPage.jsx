import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Fade,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  LogIn,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import { Button, Card, CardContent, Stack } from "../components/ui";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@uniforge.dev",
    nameEn: "Super Admin",
    nameKh: "រដ្ឋបាលជាន់ខ្ពស់",
  },
  {
    role: "Developer",
    email: "dev@uniforge.dev",
    nameEn: "Alex Rivera",
    nameKh: "អាឡិច រីវេរ៉ា",
  },
  {
    role: "Student",
    email: "student@uniforge.dev",
    nameEn: "Sarah Chen",
    nameKh: "សារ៉ា ចិន",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, language, changeLanguage, quickAlert } = useAuth();
  const { toggleColorMode, isDark, primaryColor } = useThemeContext();

  const [email, setEmail] = useState("admin@uniforge.dev");
  const [password, setPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("signin");

  const isKhLang = language === "kh";

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg(
        isKhLang
          ? "សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់"
          : "Please enter both email and password."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const mockPayload = {
        userId: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        role: email.includes("admin")
          ? "admin"
          : email.includes("dev")
          ? "developer"
          : "student",
        nameEn: email.split("@")[0].toUpperCase(),
        nameKh: isKhLang ? "អ្នកប្រើប្រាស់" : "User",
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      };

      const base64Payload = btoa(JSON.stringify(mockPayload));
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.mockSignature`;

      login(mockToken, {
        _id: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
        nameEn: mockPayload.nameEn,
        nameKh: mockPayload.nameKh,
      });

      quickAlert(
        "success",
        `Welcome back, ${mockPayload.nameEn}!`,
        `សូមស្វាគមន៍ការត្រឡប់មកវិញ!`
      );

      navigate("/home", { replace: true });
    }, 400);
  };

  const handleFillDemo = (acc) => {
    setEmail(acc.email);
    setPassword("DemoPass2026!");
    setErrorMsg("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: isDark ? "#0d1117" : "#f6f8fa",
        color: isDark ? "#f0f6fc" : "#1f2328",
        position: "relative",
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 32 },
          right: { xs: 16, sm: 32 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              backgroundColor: isDark ? "#21262d" : "#ffffff",
              border: `1px solid ${isDark ? "#30363d" : "#d0d7de"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDark ? "#f0f6fc" : "#1f2328",
            }}
          >
            <GitHubIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: isDark ? "#f0f6fc" : "#1f2328",
            }}
          >
            UniForge
          </Typography>
        </Stack>

        {/* Controls: Language + Dark/Light toggle */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            onClick={() => changeLanguage(isKhLang ? "en" : "kh")}
            startIcon={<Globe size={14} />}
            sx={{
              fontSize: "0.75rem",
              py: 0.4,
              px: 1.25,
            }}
          >
            {isKhLang ? "ភាសាខ្មែរ (KH)" : "English (EN)"}
          </Button>

          <Tooltip title={isDark ? "Switch to Light mode" : "Switch to Dark mode"} arrow>
            <IconButton
              size="small"
              onClick={() => toggleColorMode()}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                border: `1px solid ${isDark ? "#30363d" : "#d0d7de"}`,
                backgroundColor: isDark ? "#21262d" : "#ffffff",
                color: isDark ? "#f0f6fc" : "#1f2328",
                "&:hover": {
                  backgroundColor: isDark ? "#30363d" : "#f3f4f6",
                },
              }}
            >
              {isDark ? <Sun size={15} color="#e3b341" /> : <Moon size={15} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Main Card */}
      <Fade in timeout={300}>
        <Box sx={{ width: "100%", maxWidth: 360, my: "auto" }}>
          {/* Top Brand Icon */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: isDark ? "#161b22" : "#ffffff",
                border: `1px solid ${isDark ? "#30363d" : "#d0d7de"}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: isDark ? "#f0f6fc" : "#1f2328",
              }}
            >
              <Shield size={24} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                letterSpacing: "-0.02em",
                color: isDark ? "#f0f6fc" : "#1f2328",
              }}
            >
              {activeTab === "signin"
                ? isKhLang
                  ? "ចូលគណនី UniForge"
                  : "Sign in to UniForge"
                : isKhLang
                ? "បង្កើតគណនីថ្មី"
                : "Create an account"}
            </Typography>
          </Box>

          {/* Card Body */}
          <Card
            sx={{
              backgroundColor: isDark ? "#161b22" : "#ffffff",
              border: `1px solid ${isDark ? "#30363d" : "#d0d7de"}`,
              borderRadius: "6px",
              boxShadow: isDark
                ? "0 4px 12px rgba(0,0,0,0.4)"
                : "0 1px 3px rgba(31,35,40,0.12), 0 0 0 1px #d0d7de",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              {errorMsg && (
                <Alert
                  severity="error"
                  onClose={() => setErrorMsg("")}
                  sx={{
                    mb: 2,
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                  }}
                >
                  {errorMsg}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleLogin}>
                <Stack spacing={2}>
                  {/* Email */}
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="email-input"
                      sx={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: isDark ? "#f0f6fc" : "#1f2328",
                        mb: 0.75,
                      }}
                    >
                      {isKhLang ? "ឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល" : "Username or email address"}
                    </Typography>
                    <TextField
                      id="email-input"
                      fullWidth
                      size="small"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail size={15} color={isDark ? "#848d97" : "#636c76"} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  {/* Password */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        component="label"
                        htmlFor="password-input"
                        sx={{
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          color: isDark ? "#f0f6fc" : "#1f2328",
                        }}
                      >
                        {isKhLang ? "ពាក្យសម្ងាត់" : "Password"}
                      </Typography>
                      <Typography
                        component="a"
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          quickAlert("info", "Password reset link sent to your email.", "បានផ្ញើតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ។");
                        }}
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#58a6ff" : "#0969da",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {isKhLang ? "ភ្លេចពាក្យសម្ងាត់?" : "Forgot password?"}
                      </Typography>
                    </Box>
                    <TextField
                      id="password-input"
                      fullWidth
                      size="small"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock size={15} color={isDark ? "#848d97" : "#636c76"} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: isDark ? "#848d97" : "#636c76" }}
                              >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  {/* Remember Me */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.8125rem", color: isDark ? "#f0f6fc" : "#1f2328" }}>
                        {isKhLang ? "ចងចាំខ្ញុំ" : "Remember me"}
                      </Typography>
                    }
                  />

                  {/* Primary Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LogIn size={16} />}
                    sx={{
                      py: 0.9,
                      fontWeight: 600,
                      backgroundColor: primaryColor,
                    }}
                  >
                    {loading
                      ? isKhLang
                        ? "កំពុងចូល..."
                        : "Signing in..."
                      : isKhLang
                      ? "ចូលគណនី (Sign in)"
                      : "Sign in"}
                  </Button>
                </Stack>
              </form>

              <Divider sx={{ my: 2.5 }} />

              {/* Quick Demo Credentials */}
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: isDark ? "#848d97" : "#636c76",
                    mb: 1,
                  }}
                >
                  {isKhLang ? "គណនីសាកល្បងរហ័ស" : "Quick Demo Login"}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {DEMO_ACCOUNTS.map((acc) => (
                    <Button
                      key={acc.role}
                      variant="outlined"
                      size="small"
                      onClick={() => handleFillDemo(acc)}
                      sx={{
                        flex: 1,
                        fontSize: "0.75rem",
                        py: 0.4,
                        px: 1,
                        borderColor: email === acc.email ? (isDark ? "#58a6ff" : "#0969da") : undefined,
                        color: email === acc.email ? (isDark ? "#58a6ff" : "#0969da") : undefined,
                      }}
                    >
                      {acc.role}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Footer Callout */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: "6px",
              border: `1px solid ${isDark ? "#30363d" : "#d0d7de"}`,
              backgroundColor: isDark ? "#161b22" : "#ffffff",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.8125rem", color: isDark ? "#f0f6fc" : "#1f2328" }}>
              {activeTab === "signin"
                ? isKhLang
                  ? "ថ្មីជាមួយ UniForge? "
                  : "New to UniForge? "
                : isKhLang
                ? "មានគណនីរួចហើយ? "
                : "Already have an account? "}
              <Typography
                component="span"
                onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
                sx={{
                  color: isDark ? "#58a6ff" : "#0969da",
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {activeTab === "signin"
                  ? isKhLang
                    ? "បង្កើតគណនី"
                    : "Create an account"
                  : isKhLang
                  ? "ចូលគណនី"
                  : "Sign in"}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography sx={{ fontSize: "0.75rem", color: isDark ? "#848d97" : "#636c76" }}>
          Terms · Privacy · Security · Status · Docs
        </Typography>
      </Box>
    </Box>
  );
}
