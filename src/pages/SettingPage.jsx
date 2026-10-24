// import { useState } from "react";
// import {
//     Avatar,
//     Box,
//     Button,
//     Chip,
//     Divider,
//     FormControl,
//     FormControlLabel,
//     FormLabel,
//     IconButton,
//     InputAdornment,
//     MenuItem,
//     OutlinedInput,
//     Radio,
//     RadioGroup,
//     Select,
//     Stack,
//     Typography,
// } from "@mui/material";
// import {
//     Archive,
//     Download,
//     Folder,
//     Globe,
//     KeyRound,
//     Lock,
//     Mail,
//     Shield,
//     Trash2,
//     UserPlus,
//     Users,
//     UserX,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
// import { useThemeContext } from "../Context/ThemeContext";
// import DashboardLayout from "../components/Layout/DashboardLayout";

// const initialMembers = [
//     {
//         id: "m1",
//         name: "Sok Dara",
//         email: "dara.sok@uniforge.edu.kh",
//         role: "Owner",
//         avatar: "SD",
//         status: "Active",
//     },
//     {
//         id: "m2",
//         name: "Mina Kim",
//         email: "mina.kim@uniforge.edu.kh",
//         role: "Admin",
//         avatar: "MK",
//         status: "Active",
//     },
//     {
//         id: "m3",
//         name: "Arun Patel",
//         email: "arun.p@uniforge.edu.kh",
//         role: "Member",
//         avatar: "AP",
//         status: "Active",
//     },
//     {
//         id: "m4",
//         name: "Chan Vanna",
//         email: "vanna.chan@uniforge.edu.kh",
//         role: "Member",
//         avatar: "CV",
//         status: "Pending",
//     },
// ];

// export default function ProjectSettingsPage() {
//     const { user, logout, language, changeLanguage } = useAuth();
//     const { toggleColorMode, isDark } = useThemeContext();
//     const navigate = useNavigate();

//     const [activeTab, setActiveTab] = useState("general");

//     // Project General Form State
//     const [projectName, setProjectName] = useState("Logic Integrated Kiosk Application (LIKA)");
//     const [description, setDescription] = useState(
//         "A comprehensive Point of Sale (POS) and rental management system designed for campus kiosks."
//     );
//     const [category, setCategory] = useState("Software Engineering");
//     const [tags, setTags] = useState(["React JS", "GraphQL", "MongoDB", "POS"]);
//     const [tagInput, setTagInput] = useState("");

//     // Access State
//     const [visibility, setVisibility] = useState("university");

//     // Members State
//     const [members, setMembers] = useState(initialMembers);
//     const [inviteEmail, setInviteEmail] = useState("");
//     const [inviteRole, setInviteRole] = useState("Member");

//     // Navigation Items matching the screenshot sidebar structure
//     const mainNavItems = [
//         { id: "general", label: "General", icon: Folder },
//         { id: "access", label: "Access & Visibility", icon: KeyRound },
//         { id: "members", label: "Members & Permissions", icon: Users },
//     ];

//     const dangerNavItems = [
//         { id: "danger", label: "Project Operations", icon: Trash2 },
//     ];

//     const handleAddTag = (e) => {
//         if (e.key === "Enter" && tagInput.trim()) {
//             e.preventDefault();
//             if (!tags.includes(tagInput.trim())) {
//                 setTags([...tags, tagInput.trim()]);
//             }
//             setTagInput("");
//         }
//     };

//     const handleRemoveTag = (tagToDelete) => {
//         setTags(tags.filter((tag) => tag !== tagToDelete));
//     };

//     const handleRoleChange = (memberId, newRole) => {
//         setMembers((prev) =>
//             prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
//         );
//     };

//     const handleRemoveMember = (memberId) => {
//         setMembers((prev) => prev.filter((m) => m.id !== memberId));
//     };

//     const handleInviteMember = () => {
//         if (!inviteEmail.trim()) return;
//         const newMember = {
//             id: `m_${Date.now()}`,
//             name: inviteEmail.split("@")[0],
//             email: inviteEmail,
//             role: inviteRole,
//             avatar: inviteEmail.substring(0, 2).toUpperCase(),
//             status: "Pending",
//         };
//         setMembers([...members, newMember]);
//         setInviteEmail("");
//     };

//     const settingsContent = (
//         <Box
//             component="main"
//             sx={{
//                 minHeight: "calc(100vh - 62px)",
//                 bgcolor: "#0d1117",
//                 color: "#c9d1d9",
//                 px: { xs: 2, md: 5 },
//                 py: 4,
//             }}
//         >
//             <Box sx={{ maxWidth: 1200, mx: "auto" }}>
//                 {/* Layout Grid */}
//                 <Box
//                     sx={{
//                         display: "grid",
//                         gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
//                         gap: 4,
//                         alignItems: "start",
//                     }}
//                 >
//                     {/* GitHub Style Sidebar */}
//                     <Box component="aside">
//                         {/* Header / Project Profile info */}
//                         <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
//                             <Avatar
//                                 sx={{
//                                     width: 38,
//                                     height: 38,
//                                     bgcolor: "#21262d",
//                                     color: "#f0f6fc",
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                     border: "1px solid #30363d",
//                                 }}
//                             >
//                                 LK
//                             </Avatar>
//                             <Box sx={{ minWidth: 0 }}>
//                                 <Typography variant="subtitle2" fontWeight={600} color="#f0f6fc" noWrap>
//                                     {projectName}
//                                 </Typography>
//                                 <Typography variant="caption" color="#8b949e" display="block">
//                                     Project Settings
//                                 </Typography>
//                             </Box>
//                         </Stack>

//                         {/* Sidebar Navigation */}
//                         <Stack spacing={0.5}>
//                             {mainNavItems.map((item) => {
//                                 const Icon = item.icon;
//                                 const isActive = activeTab === item.id;
//                                 return (
//                                     <Button
//                                         key={item.id}
//                                         fullWidth
//                                         onClick={() => setActiveTab(item.id)}
//                                         startIcon={<Icon size={16} />}
//                                         sx={{
//                                             justifyContent: "flex-start",
//                                             px: 1.5,
//                                             py: 0.8,
//                                             borderRadius: "6px",

//                                             fontSize: 14,
//                                             fontWeight: isActive ? 600 : 400,
//                                             color: isActive ? "#f0f6fc" : "#8b949e",
//                                             bgcolor: isActive ? "#21262d" : "transparent",

//                                             "&:hover": {
//                                                 bgcolor: isActive ? "#21262d" : "rgba(177,186,196,0.12)",
//                                                 color: "#f0f6fc",
//                                             },
//                                         }}
//                                     >
//                                         {item.label}
//                                     </Button>
//                                 );
//                             })}

//                             <Typography
//                                 variant="caption"
//                                 fontWeight={600}
//                                 color="#8b949e"
//                                 sx={{ pt: 2, pb: 0.5, px: 1.5, textTransform: "uppercase", fontSize: 11 }}
//                             >
//                                 Danger Zone
//                             </Typography>

//                             {dangerNavItems.map((item) => {
//                                 const Icon = item.icon;
//                                 const isActive = activeTab === item.id;
//                                 return (
//                                     <Button
//                                         key={item.id}
//                                         fullWidth
//                                         onClick={() => setActiveTab(item.id)}
//                                         startIcon={<Icon size={16} />}
//                                         sx={{
//                                             justifyContent: "flex-start",
//                                             px: 1.5,
//                                             py: 0.8,
//                                             borderRadius: "6px",
//                                             fontSize: 14,
//                                             fontWeight: isActive ? 600 : 400,
//                                             color: isActive ? "#f85149" : "#8b949e",
//                                             bgcolor: isActive ? "#21262d" : "transparent",

//                                             "&:hover": {
//                                                 bgcolor: isActive ? "#21262d" : "rgba(177,186,196,0.12)",
//                                                 color: "#f85149",
//                                             },
//                                         }}
//                                     >
//                                         {item.label}
//                                     </Button>
//                                 );
//                             })}
//                         </Stack>
//                     </Box>

//                     {/* Main Content Area */}
//                     <Box>
//                         {/* GENERAL TAB */}
//                         {activeTab === "general" && (
//                             <Stack spacing={4}>
//                                 <Box>
//                                     <Typography variant="h5" fontWeight={500} color="#f0f6fc" sx={{ mb: 1 }}>
//                                         General
//                                     </Typography>
//                                     <Typography variant="body2" color="#8b949e" sx={{ mb: 3 }}>
//                                         Manage basic project metadata, categories, and tags.
//                                     </Typography>

//                                     <Stack spacing={2.5} sx={{ maxWith: 600 }}>
//                                         <Box>
//                                             <FormLabel sx={{ display: "block", mb: 1, color: "#f0f6fc", fontSize: 14, fontWeight: 600 }}>
//                                                 Project name
//                                             </FormLabel>
//                                             <OutlinedInput
//                                                 fullWidth
//                                                 size="small"
//                                                 value={projectName}
//                                                 onChange={(e) => setProjectName(e.target.value)}
//                                                 sx={{
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     "& fieldset": { borderColor: "#30363d" },
//                                                     "&:hover fieldset": { borderColor: "#8b949e" },
//                                                 }}
//                                             />
//                                         </Box>

//                                         <Box>
//                                             <FormLabel sx={{ display: "block", mb: 1, color: "#f0f6fc", fontSize: 14, fontWeight: 600 }}>
//                                                 Description
//                                             </FormLabel>
//                                             <OutlinedInput
//                                                 fullWidth
//                                                 multiline
//                                                 rows={3}
//                                                 size="small"
//                                                 value={description}
//                                                 onChange={(e) => setDescription(e.target.value)}
//                                                 sx={{
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     "& fieldset": { borderColor: "#30363d" },
//                                                     "&:hover fieldset": { borderColor: "#8b949e" },
//                                                 }}
//                                             />
//                                         </Box>

//                                         <Box>
//                                             <FormLabel sx={{ display: "block", mb: 1, color: "#f0f6fc", fontSize: 14, fontWeight: 600 }}>
//                                                 Category
//                                             </FormLabel>
//                                             <Select
//                                                 fullWidth
//                                                 size="small"
//                                                 value={category}
//                                                 onChange={(e) => setCategory(e.target.value)}
//                                                 sx={{
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     "& .MuiOutlinedInput-notchedOutline": { borderColor: "#30363d" },
//                                                 }}
//                                             >
//                                                 <MenuItem value="Software Engineering">Software Engineering</MenuItem>
//                                                 <MenuItem value="Data Science & AI">Data Science & AI</MenuItem>
//                                                 <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
//                                                 <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
//                                             </Select>
//                                         </Box>

//                                         <Box>
//                                             <FormLabel sx={{ display: "block", mb: 1, color: "#f0f6fc", fontSize: 14, fontWeight: 600 }}>
//                                                 Tags
//                                             </FormLabel>
//                                             <OutlinedInput
//                                                 fullWidth
//                                                 size="small"
//                                                 value={tagInput}
//                                                 onChange={(e) => setTagInput(e.target.value)}
//                                                 onKeyDown={handleAddTag}
//                                                 placeholder="Type a tag and press Enter"
//                                                 sx={{
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     mb: 1.5,
//                                                     "& fieldset": { borderColor: "#30363d" },
//                                                 }}
//                                             />
//                                             <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                                                 {tags.map((tag) => (
//                                                     <Chip
//                                                         key={tag}
//                                                         label={tag}
//                                                         size="small"
//                                                         onDelete={() => handleRemoveTag(tag)}
//                                                         sx={{
//                                                             bgcolor: "#21262d",
//                                                             color: "#58a6ff",
//                                                             borderRadius: "12px",
//                                                             border: "1px solid #30363d",
//                                                         }}
//                                                     />
//                                                 ))}
//                                             </Stack>
//                                         </Box>

//                                         <Box sx={{ pt: 1 }}>
//                                             <Button
//                                                 variant="contained"
//                                                 sx={{
//                                                     bgcolor: "#238636",
//                                                     color: "#ffffff",
//                                                     textTransform: "none",
//                                                     fontWeight: 600,
//                                                     borderRadius: "6px",
//                                                     "&:hover": { bgcolor: "#2ea043" },
//                                                 }}
//                                             >
//                                                 Save changes
//                                             </Button>
//                                         </Box>
//                                     </Stack>
//                                 </Box>
//                             </Stack>
//                         )}

//                         {/* ACCESS & VISIBILITY TAB */}
//                         {activeTab === "access" && (
//                             <Stack spacing={3}>
//                                 <Box>
//                                     <Typography variant="h5" fontWeight={500} color="#f0f6fc" sx={{ mb: 1 }}>
//                                         Access & Visibility
//                                     </Typography>
//                                     <Typography variant="body2" color="#8b949e" sx={{ mb: 3 }}>
//                                         Control who can discover, view, and contribute to this project.
//                                     </Typography>

//                                     <FormControl component="fieldset" fullWidth sx={{ maxWidth: 650 }}>
//                                         <RadioGroup value={visibility} onChange={(e) => setVisibility(e.target.value)}>
//                                             <Stack spacing={2}>
//                                                 {[
//                                                     {
//                                                         value: "public",
//                                                         title: "Public",
//                                                         desc: "Anyone on the internet can see this project. You choose who can commit.",
//                                                         icon: Globe,
//                                                     },
//                                                     {
//                                                         value: "university",
//                                                         title: "University Only",
//                                                         desc: "Only verified campus students and faculty members can view.",
//                                                         icon: Shield,
//                                                     },
//                                                     {
//                                                         value: "private",
//                                                         title: "Private",
//                                                         desc: "You choose who can see and commit to this project.",
//                                                         icon: Lock,
//                                                     },
//                                                 ].map((item) => {
//                                                     const Icon = item.icon;
//                                                     const isSelected = visibility === item.value;
//                                                     return (
//                                                         <Box
//                                                             key={item.value}
//                                                             onClick={() => setVisibility(item.value)}
//                                                             sx={{
//                                                                 p: 2,
//                                                                 borderRadius: "6px",
//                                                                 border: "1px solid",
//                                                                 borderColor: isSelected ? "#388bfd" : "#30363d",
//                                                                 bgcolor: isSelected ? "#0d1117" : "#161b22",
//                                                                 cursor: "pointer",
//                                                             }}
//                                                         >
//                                                             <FormControlLabel
//                                                                 value={item.value}
//                                                                 control={<Radio size="small" sx={{ color: "#8b949e", "&.Mui-checked": { color: "#58a6ff" } }} />}
//                                                                 label={
//                                                                     <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ ml: 0.5 }}>
//                                                                         <Icon size={18} style={{ marginTop: 2, color: "#8b949e" }} />
//                                                                         <Box>
//                                                                             <Typography variant="body2" fontWeight={600} color="#f0f6fc">
//                                                                                 {item.title}
//                                                                             </Typography>
//                                                                             <Typography variant="caption" color="#8b949e">
//                                                                                 {item.desc}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Stack>
//                                                                 }
//                                                                 sx={{ m: 0, width: "100%" }}
//                                                             />
//                                                         </Box>
//                                                     );
//                                                 })}
//                                             </Stack>
//                                         </RadioGroup>
//                                     </FormControl>

//                                     <Box sx={{ mt: 3 }}>
//                                         <Button
//                                             variant="contained"
//                                             sx={{
//                                                 bgcolor: "#238636",
//                                                 color: "#ffffff",
//                                                 textTransform: "none",
//                                                 fontWeight: 600,
//                                                 borderRadius: "6px",
//                                                 "&:hover": { bgcolor: "#2ea043" },
//                                             }}
//                                         >
//                                             Update visibility
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                             </Stack>
//                         )}

//                         {/* MEMBERS TAB */}
//                         {activeTab === "members" && (
//                             <Stack spacing={3}>
//                                 <Box>
//                                     <Typography variant="h5" fontWeight={500} color="#f0f6fc" sx={{ mb: 1 }}>
//                                         Manage Members
//                                     </Typography>
//                                     <Typography variant="body2" color="#8b949e" sx={{ mb: 3 }}>
//                                         Invite collaborators and configure role-based permissions.
//                                     </Typography>

//                                     {/* Invite Bar */}
//                                     <Box sx={{ mb: 4, p: 2, bgcolor: "#161b22", border: "1px solid #30363d", borderRadius: "6px" }}>
//                                         <Typography variant="subtitle2" color="#f0f6fc" sx={{ mb: 1.5 }}>
//                                             Invite a collaborator
//                                         </Typography>
//                                         <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
//                                             <OutlinedInput
//                                                 fullWidth
//                                                 size="small"
//                                                 placeholder="Enter email address"
//                                                 value={inviteEmail}
//                                                 onChange={(e) => setInviteEmail(e.target.value)}
//                                                 startAdornment={
//                                                     <InputAdornment position="start">
//                                                         <Mail size={16} style={{ color: "#8b949e" }} />
//                                                     </InputAdornment>
//                                                 }
//                                                 sx={{
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     "& fieldset": { borderColor: "#30363d" },
//                                                 }}
//                                             />
//                                             <Select
//                                                 size="small"
//                                                 value={inviteRole}
//                                                 onChange={(e) => setInviteRole(e.target.value)}
//                                                 sx={{
//                                                     minWidth: 120,
//                                                     bgcolor: "#010409",
//                                                     color: "#c9d1d9",
//                                                     borderRadius: "6px",
//                                                     "& .MuiOutlinedInput-notchedOutline": { borderColor: "#30363d" },
//                                                 }}
//                                             >
//                                                 <MenuItem value="Admin">Admin</MenuItem>
//                                                 <MenuItem value="Member">Member</MenuItem>
//                                             </Select>
//                                             <Button
//                                                 variant="contained"
//                                                 startIcon={<UserPlus size={16} />}
//                                                 onClick={handleInviteMember}
//                                                 sx={{
//                                                     bgcolor: "#238636",
//                                                     color: "#ffffff",
//                                                     textTransform: "none",
//                                                     fontWeight: 600,
//                                                     borderRadius: "6px",
//                                                     whiteSpace: "nowrap",
//                                                     "&:hover": { bgcolor: "#2ea043" },
//                                                 }}
//                                             >
//                                                 Invite
//                                             </Button>
//                                         </Stack>
//                                     </Box>

//                                     {/* Member List */}
//                                     <Typography variant="subtitle2" color="#f0f6fc" sx={{ mb: 1 }}>
//                                         Project Members ({members.length})
//                                     </Typography>
//                                     <Divider sx={{ borderColor: "#30363d", mb: 1 }} />
//                                     {members.map((member, idx) => (
//                                         <Box key={member.id}>
//                                             <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
//                                                 <Stack direction="row" spacing={1.5} alignItems="center">
//                                                     <Avatar
//                                                         sx={{
//                                                             width: 34,
//                                                             height: 34,
//                                                             fontSize: 12,
//                                                             bgcolor: "#21262d",
//                                                             color: "#f0f6fc",
//                                                             border: "1px solid #30363d",
//                                                         }}
//                                                     >
//                                                         {member.avatar}
//                                                     </Avatar>
//                                                     <Box>
//                                                         <Stack direction="row" spacing={1} alignItems="center">
//                                                             <Typography variant="body2" fontWeight={600} color="#f0f6fc">
//                                                                 {member.name}
//                                                             </Typography>
//                                                             {member.status === "Pending" && (
//                                                                 <Chip
//                                                                     label="Pending"
//                                                                     size="small"
//                                                                     sx={{ height: 18, fontSize: 10, bgcolor: "#341a00", color: "#d29922", border: "1px solid #845306" }}
//                                                                 />
//                                                             )}
//                                                         </Stack>
//                                                         <Typography variant="caption" color="#8b949e">
//                                                             {member.email}
//                                                         </Typography>
//                                                     </Box>
//                                                 </Stack>

//                                                 <Stack direction="row" spacing={1} alignItems="center">
//                                                     {member.role === "Owner" ? (
//                                                         <Chip label="Owner" size="small" sx={{ bgcolor: "#1f6beb", color: "#ffffff", fontWeight: 600 }} />
//                                                     ) : (
//                                                         <Select
//                                                             size="small"
//                                                             value={member.role}
//                                                             onChange={(e) => handleRoleChange(member.id, e.target.value)}
//                                                             sx={{
//                                                                 height: 30,
//                                                                 fontSize: 13,
//                                                                 bgcolor: "#21262d",
//                                                                 color: "#c9d1d9",
//                                                                 borderRadius: "6px",
//                                                                 "& .MuiOutlinedInput-notchedOutline": { borderColor: "#30363d" },
//                                                             }}
//                                                         >
//                                                             <MenuItem value="Admin">Admin</MenuItem>
//                                                             <MenuItem value="Member">Member</MenuItem>
//                                                         </Select>
//                                                     )}

//                                                     {member.role !== "Owner" && (
//                                                         <IconButton size="small" onClick={() => handleRemoveMember(member.id)} sx={{ color: "#f85149" }}>
//                                                             <UserX size={16} />
//                                                         </IconButton>
//                                                     )}
//                                                 </Stack>
//                                             </Stack>
//                                             {idx < members.length - 1 && <Divider sx={{ borderColor: "#21262d" }} />}
//                                         </Box>
//                                     ))}
//                                 </Box>
//                             </Stack>
//                         )}

//                         {/* DANGER ZONE TAB */}
//                         {activeTab === "danger" && (
//                             <Stack spacing={4}>
//                                 <Box>
//                                     <Typography variant="h5" fontWeight={500} color="#f85149" sx={{ mb: 1 }}>
//                                         Project Operations
//                                     </Typography>
//                                     <Typography variant="body2" color="#8b949e" sx={{ mb: 3 }}>
//                                         Destructive actions and account ownership management.
//                                     </Typography>

//                                     <Stack spacing={3} divider={<Divider sx={{ borderColor: "#21262d" }} />}>
//                                         {/* Export */}
//                                         <Stack direction="row" justifyContent="space-between" alignItems="center">

//                                             <Box>
//                                                 <Typography variant="body2" fontWeight={600} color="#f0f6fc">
//                                                     Export project data
//                                                 </Typography>
//                                                 <Typography variant="caption" color="#8b949e">
//                                                     Download an archive of project issues, code references, and team logs.
//                                                 </Typography>
//                                             </Box>

//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 startIcon={<Download size={14} />}
//                                                 sx={{
//                                                     color: "#c9d1d9",
//                                                     borderColor: "#30363d",
//                                                     textTransform: "none",
//                                                     "&:hover": { borderColor: "#8b949e", bgcolor: "#21262d" },
//                                                 }}
//                                             >
//                                                 Export
//                                             </Button>
//                                         </Stack>

//                                         {/* Transfer */}
//                                         <Stack direction="row" justifyContent="space-between" alignItems="center">
//                                             <Box>
//                                                 <Typography variant="body2" fontWeight={600} color="#f0f6fc">
//                                                     Transfer ownership
//                                                 </Typography>
//                                                 <Typography variant="caption" color="#8b949e">
//                                                     Transfer this project to another team member or organization.
//                                                 </Typography>
//                                             </Box>
//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 sx={{
//                                                     color: "#d29922",
//                                                     borderColor: "#30363d",
//                                                     textTransform: "none",
//                                                     "&:hover": { borderColor: "#d29922", bgcolor: "rgba(210,153,34,0.1)" },
//                                                 }}
//                                             >
//                                                 Transfer
//                                             </Button>
//                                         </Stack>

//                                         {/* Archive */}
//                                         <Stack direction="row" justifyContent="space-between" alignItems="center">
//                                             <Box>
//                                                 <Typography variant="body2" fontWeight={600} color="#f0f6fc">
//                                                     Archive this project
//                                                 </Typography>
//                                                 <Typography variant="caption" color="#8b949e">
//                                                     Mark project as read-only. Unarchive anytime later.
//                                                 </Typography>
//                                             </Box>
//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 startIcon={<Archive size={14} />}
//                                                 sx={{
//                                                     color: "#d29922",
//                                                     borderColor: "#30363d",
//                                                     textTransform: "none",
//                                                     "&:hover": { borderColor: "#d29922", bgcolor: "rgba(210,153,34,0.1)" },
//                                                 }}
//                                             >
//                                                 Archive
//                                             </Button>
//                                         </Stack>

//                                         {/* Delete */}
//                                         <Stack direction="row" justifyContent="space-between" alignItems="center">
//                                             <Box>
//                                                 <Typography variant="body2" fontWeight={600} color="#f85149">
//                                                     Delete this project
//                                                 </Typography>
//                                                 <Typography variant="caption" color="#8b949e">
//                                                     Once deleted, there is no going back. Please be certain.
//                                                 </Typography>
//                                             </Box>
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 startIcon={<Trash2 size={14} />}
//                                                 sx={{
//                                                     bgcolor: "#21262d",
//                                                     color: "#f85149",
//                                                     border: "1px solid #30363d",
//                                                     textTransform: "none",
//                                                     fontWeight: 600,
//                                                     "&:hover": { bgcolor: "#b62324", color: "#ffffff" },
//                                                 }}
//                                             >
//                                                 Delete project
//                                             </Button>
//                                         </Stack>
//                                     </Stack>
//                                 </Box>
//                             </Stack>
//                         )}
//                     </Box>
//                 </Box>
//             </Box>
//         </Box>
//     );

//     return (
//         <DashboardLayout
//             user={user}
//             logout={logout}
//             language={language}
//             changeLanguage={changeLanguage}
//             toggleColorMode={toggleColorMode}
//             isDark={isDark}
//         >
//             {settingsContent}
//         </DashboardLayout>
//     );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Slider,
    Snackbar,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Accessibility,
    Bell,
    Copy,
    CreditCard,
    Download,
    Key,
    KeyRound,
    Mail,
    Monitor,
    Moon,
    Palette,
    Plus,
    ShieldCheck,
    Smartphone,
    Sun,
    Trash2,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import DashboardLayout from "../components/Layout/DashboardLayout";

import { clearCommunityResourcesByOwner, useCommunityResources } from "../store/communityStore";
import { ACCESSIBILITY_KEY, applyAccessibility, defaultAccessibility, loadAccessibility } from "../store/accessibility";

/* ------------------------------------------------------------------ */
/* Navigation config (moved here from the profile page)                */
/* ------------------------------------------------------------------ */
const PERSONAL_NAV = [
    { id: "account", label: "Account", icon: KeyRound },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "notifications", label: "Notifications", icon: Bell },
];

const ACCESS_NAV = [
    { id: "billing", label: "Billing and licensing", icon: CreditCard },
    { id: "emails", label: "Emails", icon: Mail },
    { id: "security", label: "Password and authentication", icon: ShieldCheck },
    { id: "sessions", label: "Sessions", icon: Monitor },
    { id: "keys", label: "SSH and GPG keys", icon: Key },
];

const ALL_SECTIONS = [...PERSONAL_NAV, ...ACCESS_NAV];
const uid = () => Math.random().toString(36).slice(2, 9);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Persistent preference helper (localStorage) */
function usePref(key, defaults) {
    const [value, setValue] = useState(() => {
        try {
            return { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") };
        } catch {
            return defaults;
        }
    });
    const update = (patch) =>
        setValue((prev) => {
            const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
            try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
            return next;
        });
    return [value, update];
}

function SettingsCard({ title, description, children, danger, action }) {
    return (
        <Box sx={{ border: "1px solid", borderColor: danger ? "error.main" : "divider", borderRadius: "6px", mb: 3, overflow: "hidden", bgcolor: "background.paper" }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "action.hover", borderBottom: "1px solid", borderColor: danger ? "error.main" : "divider", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }} color={danger ? "error.main" : "text.primary"}>{title}</Typography>
                    {description && <Typography variant="caption" color="text.secondary">{description}</Typography>}
                </Box>
                {action}
            </Box>
            <Box sx={{ p: 2.5 }}>{children}</Box>
        </Box>
    );
}

function SwitchRow({ label, hint, checked, onChange }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, py: 1 }}>
            <Box>
                <Typography variant="body2" fontWeight={600}>{label}</Typography>
                {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
            </Box>
            <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </Box>
    );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
function AccountSection({ user, language, changeLanguage, logout, notify, ownerKey }) {
    const [profile, setProfile] = usePref("uniforge.profile", {
        name: user?.name || "Rim Narong", username: user?.username || "Niran655", bio: "", location: "Phnom Penh, Cambodia", university: "RUPP",
    });
    const [draft, setDraft] = useState(profile);
    const [errors, setErrors] = useState({});
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [confirm, setConfirm] = useState("");
    const items = useCommunityResources();

    const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
    const save = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Display name is required";
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(draft.username)) next.username = "3–30 letters, numbers, dashes or underscores";
        setErrors(next);
        if (Object.keys(next).length) return;
        setProfile(draft);
        notify("Profile saved");
    };

    const exportData = () => {
        const mine = items.filter((i) => i.ownerKey === ownerKey).map(({ dataUrl, ...rest }) => rest);
        const blob = new Blob([JSON.stringify({ profile, community: mine, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "uniforge-data-export.json"; a.click();
        URL.revokeObjectURL(url);
        notify("Data export downloaded");
    };

    const deleteAccount = () => {
        clearCommunityResourcesByOwner(ownerKey);
        ["uniforge.profile", "uniforge.emails", "uniforge.sessions", "uniforge.keys", "uniforge.notifications", ACCESSIBILITY_KEY].forEach((k) => localStorage.removeItem(k));
        setDeleteOpen(false);
        logout();
    };

    return (
        <>
            <SettingsCard title="Public profile" description="This information is shown on your profile page.">
                <Stack spacing={2} sx={{ maxWidth: 560 }}>
                    <TextField size="small" label="Display name" value={draft.name} onChange={(e) => set("name", e.target.value)} error={Boolean(errors.name)} helperText={errors.name} />
                    <TextField size="small" label="Username" value={draft.username} onChange={(e) => set("username", e.target.value)} error={Boolean(errors.username)} helperText={errors.username} />
                    <TextField size="small" label="Bio" multiline rows={3} value={draft.bio} onChange={(e) => set("bio", e.target.value)} />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField size="small" fullWidth label="Location" value={draft.location} onChange={(e) => set("location", e.target.value)} />
                        <TextField select size="small" fullWidth label="University" value={draft.university} onChange={(e) => set("university", e.target.value)}>
                            {["RUPP", "ITC", "CADT"].map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                        </TextField>
                    </Stack>
                    <Box><Button variant="contained" onClick={save} sx={{ textTransform: "none", fontWeight: 600 }}>Save profile</Button></Box>
                </Stack>
            </SettingsCard>

            <SettingsCard title="Language" description="Choose the language used across the app.">
                <TextField select size="small" value={language || "en"} onChange={(e) => { changeLanguage(e.target.value); notify("Language updated"); }} sx={{ minWidth: 220 }}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="kh">ខ្មែរ (Khmer)</MenuItem>
                </TextField>
            </SettingsCard>

            <SettingsCard title="Export your data" description="Download your profile and the resources you shared as JSON.">
                <Button variant="outlined" startIcon={<Download size={16} />} onClick={exportData} sx={{ textTransform: "none" }}>Export data</Button>
            </SettingsCard>

            <SettingsCard danger title="Delete account" description="Removes your shared resources and local settings, then signs you out.">
                <Button variant="contained" color="error" onClick={() => { setConfirm(""); setDeleteOpen(true); }} sx={{ textTransform: "none" }}>Delete my account</Button>
            </SettingsCard>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete your account?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>This cannot be undone. Type your username <strong>{profile.username}</strong> to confirm.</Typography>
                    <TextField autoFocus fullWidth size="small" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
                    <Button color="error" variant="contained" disabled={confirm !== profile.username} onClick={deleteAccount} sx={{ textTransform: "none" }}>Delete forever</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function AppearanceSection({ isDark, toggleColorMode, notify }) {
    const choose = (mode) => {
        if ((mode === "dark") !== isDark) {
            toggleColorMode();
            notify(`${mode === "dark" ? "Dark" : "Light"} theme applied`);
        }
    };
    return (
        <SettingsCard title="Theme" description="Choose how UniForge looks on this device.">
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2, maxWidth: 560 }}>
                {[
                    { id: "light", label: "Light", icon: Sun, bg: "#ffffff", fg: "#1f2328", bar: "#e5e7eb" },
                    { id: "dark", label: "Dark", icon: Moon, bg: "#0d1117", fg: "#f0f6fc", bar: "#30363d" },
                ].map(({ id, label, icon: Icon, bg, fg, bar }) => {
                    const selected = (id === "dark") === isDark;
                    return (
                        <Card key={id} variant="outlined" onClick={() => choose(id)} sx={{ cursor: "pointer", borderRadius: 3, borderWidth: 2, borderColor: selected ? "primary.main" : "divider", overflow: "hidden" }}>
                            <Box sx={{ bgcolor: bg, p: 2, height: 96 }}>
                                <Box sx={{ width: "55%", height: 8, bgcolor: bar, borderRadius: 1, mb: 1 }} />
                                <Box sx={{ width: "80%", height: 8, bgcolor: bar, borderRadius: 1, mb: 1 }} />
                                <Box sx={{ width: "40%", height: 8, bgcolor: fg, opacity: 0.7, borderRadius: 1 }} />
                            </Box>
                            <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon size={16} />
                                <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>{label}</Typography>
                                {selected && <Chip label="Active" size="small" color="primary" sx={{ height: 20 }} />}
                            </Box>
                        </Card>
                    );
                })}
            </Box>
        </SettingsCard>
    );
}

function AccessibilitySection({ notify }) {
    const [prefs, setPrefs] = useState(loadAccessibility);
    const update = (patch) => {
        const next = { ...prefs, ...patch };
        setPrefs(next);
        try { localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        applyAccessibility(next);
    };
    return (
        <SettingsCard title="Display and motion" description="Adjust the interface so it is comfortable to read and use.">
            <Box sx={{ maxWidth: 560 }}>
                <Typography variant="body2" fontWeight={600}>Text size: {prefs.textScale}%</Typography>
                <Slider value={prefs.textScale} min={90} max={130} step={5} marks={[{ value: 90, label: "90%" }, { value: 100, label: "100%" }, { value: 130, label: "130%" }]} onChange={(_, v) => update({ textScale: v })} sx={{ mb: 2 }} />
                <Divider sx={{ my: 1 }} />
                <SwitchRow label="Reduce motion" hint="Turns off animations and transitions." checked={prefs.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
                <SwitchRow label="Underline links" hint="Makes links easier to spot without relying on color." checked={prefs.underlineLinks} onChange={(v) => update({ underlineLinks: v })} />
                <Button size="small" onClick={() => { update(defaultAccessibility); notify("Accessibility settings reset"); }} sx={{ textTransform: "none", mt: 1 }}>Reset to defaults</Button>
            </Box>
        </SettingsCard>
    );
}

const NOTIFICATION_ROWS = [
    ["projectUpdates", "Project updates"],
    ["taskAssignments", "Task assignments and reminders"],
    ["reviewFeedback", "Review feedback"],
    ["discussionReplies", "Replies to my discussions"],
    ["mentions", "Mentions"],
    ["weeklyDigest", "Weekly digest"],
];

function NotificationsSection({ notify }) {
    const defaults = { matrix: Object.fromEntries(NOTIFICATION_ROWS.map(([k]) => [k, { email: k !== "weeklyDigest", web: true }])) };
    const [prefs, setPrefs] = usePref("uniforge.notifications", defaults);
    const toggle = (key, channel) =>
        setPrefs((p) => ({ ...p, matrix: { ...p.matrix, [key]: { ...p.matrix[key], [channel]: !p.matrix[key][channel] } } }));
    return (
        <SettingsCard title="Notification preferences" description="Choose where you want to hear about activity." action={<Button size="small" onClick={() => { setPrefs(defaults); notify("Notification settings reset"); }} sx={{ textTransform: "none" }}>Reset</Button>}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Activity</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="center">In app</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {NOTIFICATION_ROWS.map(([key, label]) => (
                        <TableRow key={key} hover>
                            <TableCell>{label}</TableCell>
                            {["email", "web"].map((channel) => (
                                <TableCell key={channel} align="center" padding="checkbox">
                                    <Checkbox size="small" checked={Boolean(prefs.matrix[key]?.[channel])} onChange={() => toggle(key, channel)} inputProps={{ "aria-label": `${label} by ${channel}` }} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </SettingsCard>
    );
}

function BillingSection({ ownerKey }) {
    const items = useCommunityResources();
    const usedBytes = items.filter((i) => i.ownerKey === ownerKey).reduce((s, i) => s + (i.bytes || 0), 0);
    const quota = 100 * 1024 * 1024;
    const pct = Math.min(100, (usedBytes / quota) * 100);
    return (
        <>
            <SettingsCard title="Current plan" description="Your university provides this plan.">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6" fontWeight={700}>Student</Typography>
                            <Chip label="Free" size="small" color="success" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">Unlimited projects, 100 MB of shared resource storage.</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">Need more? Contact your university administrator.</Typography>
                </Box>
            </SettingsCard>
            <SettingsCard title="Storage usage">
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>{(usedBytes / 1024 / 1024).toFixed(1)} MB of 100 MB</Typography>
                    <Typography variant="body2" color="text.secondary">{pct.toFixed(0)}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4 }} color={pct > 85 ? "warning" : "primary"} />
            </SettingsCard>
            <SettingsCard title="Invoices"><Typography variant="body2" color="text.secondary">No invoices. The Student plan is free.</Typography></SettingsCard>
        </>
    );
}

function EmailsSection({ user, notify }) {
    const [data, setData] = usePref("uniforge.emails", {
        list: [{ id: "primary", email: user?.email || "student@uniforge.edu.kh", primary: true, verified: true }],
    });
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const add = () => {
        const email = value.trim().toLowerCase();
        if (!EMAIL_RE.test(email)) return setError("Enter a valid email address");
        if (data.list.some((e) => e.email.toLowerCase() === email)) return setError("This email is already added");
        setData((p) => ({ list: [...p.list, { id: uid(), email, primary: false, verified: false }] }));
        setValue(""); setError("");
        notify(`Verification email sent to ${email}`);
    };
    const patch = (id, change) => setData((p) => ({ list: p.list.map((e) => (e.id === id ? { ...e, ...change } : e)) }));

    return (
        <>
            <SettingsCard title="Your email addresses" description="Your primary email is used for sign-in and notifications.">
                <Stack divider={<Divider />}>
                    {data.list.map((e) => (
                        <Box key={e.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5, flexWrap: "wrap" }}>
                            <Mail size={18} />
                            <Typography variant="body2" fontWeight={600} sx={{ flex: 1, minWidth: 180 }}>{e.email}</Typography>
                            {e.primary && <Chip label="Primary" size="small" color="primary" />}
                            {e.verified ? <Chip label="Verified" size="small" color="success" variant="outlined" /> : <Chip label="Unverified" size="small" color="warning" variant="outlined" />}
                            {!e.verified && <Button size="small" onClick={() => { patch(e.id, { verified: true }); notify("Email verified"); }} sx={{ textTransform: "none" }}>Verify (demo)</Button>}
                            {!e.primary && e.verified && <Button size="small" onClick={() => { setData((p) => ({ list: p.list.map((x) => ({ ...x, primary: x.id === e.id })) })); notify("Primary email updated"); }} sx={{ textTransform: "none" }}>Make primary</Button>}
                            {!e.primary && (
                                <Tooltip title="Remove"><IconButton size="small" aria-label="Remove email" onClick={() => { setData((p) => ({ list: p.list.filter((x) => x.id !== e.id) })); notify("Email removed"); }}><Trash2 size={16} /></IconButton></Tooltip>
                            )}
                        </Box>
                    ))}
                </Stack>
            </SettingsCard>
            <SettingsCard title="Add email address">
                <Box sx={{ display: "flex", gap: 1.5, maxWidth: 520 }}>
                    <TextField size="small" fullWidth placeholder="name@university.edu.kh" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} error={Boolean(error)} helperText={error} />
                    <Button variant="contained" onClick={add} sx={{ textTransform: "none", height: 40 }}>Add</Button>
                </Box>
            </SettingsCard>
        </>
    );
}

function SecuritySection({ notify }) {
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [sec, setSec] = usePref("uniforge.security", { twoFactor: false, codes: [] });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const strength = useMemo(() => {
        const p = form.next;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
        if (/\d/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    }, [form.next]);

    const change = () => {
        const next = {};
        if (!form.current) next.current = "Enter your current password";
        if (form.next.length < 8) next.next = "Use at least 8 characters";
        else if (!/\d/.test(form.next)) next.next = "Include at least one number";
        else if (form.next === form.current) next.next = "New password must be different";
        if (form.confirm !== form.next) next.confirm = "Passwords do not match";
        setErrors(next);
        if (Object.keys(next).length) return;
        setForm({ current: "", next: "", confirm: "" });
        notify("Password updated");
    };

    const toggle2fa = (on) => {
        const codes = on ? Array.from({ length: 8 }, () => `${uid()}-${uid()}`.toUpperCase()) : [];
        setSec({ twoFactor: on, codes });
        notify(on ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    };

    return (
        <>
            <SettingsCard title="Change password">
                <Stack spacing={2} sx={{ maxWidth: 420 }}>
                    <TextField size="small" type="password" label="Current password" value={form.current} onChange={(e) => set("current", e.target.value)} error={Boolean(errors.current)} helperText={errors.current} />
                    <TextField size="small" type="password" label="New password" value={form.next} onChange={(e) => set("next", e.target.value)} error={Boolean(errors.next)} helperText={errors.next} />
                    {form.next && <LinearProgress variant="determinate" value={(strength / 4) * 100} color={strength <= 1 ? "error" : strength <= 2 ? "warning" : "success"} sx={{ height: 6, borderRadius: 3 }} />}
                    <TextField size="small" type="password" label="Confirm new password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={Boolean(errors.confirm)} helperText={errors.confirm} />
                    <Box><Button variant="contained" onClick={change} sx={{ textTransform: "none", fontWeight: 600 }}>Update password</Button></Box>
                </Stack>
            </SettingsCard>
            <SettingsCard title="Two-factor authentication" description="Add a second step when you sign in.">
                <SwitchRow label="Authenticator app" hint={sec.twoFactor ? "Enabled" : "Not enabled"} checked={sec.twoFactor} onChange={toggle2fa} />
                {sec.twoFactor && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>Save these recovery codes somewhere safe. Each code can be used once.</Alert>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1, fontFamily: "monospace", maxWidth: 420 }}>
                            {sec.codes.map((c) => <Box key={c} sx={{ p: 1, bgcolor: "action.hover", borderRadius: 1, fontSize: 13 }}>{c}</Box>)}
                        </Box>
                        <Button size="small" startIcon={<Copy size={14} />} onClick={() => { navigator.clipboard?.writeText(sec.codes.join("\n")); notify("Recovery codes copied"); }} sx={{ textTransform: "none", mt: 1.5 }}>Copy codes</Button>
                    </Box>
                )}
            </SettingsCard>
        </>
    );
}

function SessionsSection({ notify }) {
    const [data, setData] = usePref("uniforge.sessions", {
        list: [
            { id: "s1", device: "This browser", place: "Siem Reap, Cambodia", last: "Active now", current: true, mobile: false },
            { id: "s2", device: "Chrome on Windows", place: "Phnom Penh, Cambodia", last: "2 hours ago", current: false, mobile: false },
            { id: "s3", device: "UniForge app on Android", place: "Phnom Penh, Cambodia", last: "Yesterday", current: false, mobile: true },
        ],
    });
    const others = data.list.filter((s) => !s.current);
    return (
        <SettingsCard
            title="Where you're signed in"
            action={<Button size="small" color="error" disabled={others.length === 0} onClick={() => { setData((p) => ({ list: p.list.filter((s) => s.current) })); notify("Signed out of all other sessions"); }} sx={{ textTransform: "none" }}>Sign out all others</Button>}
        >
            <Stack divider={<Divider />}>
                {data.list.map((s) => (
                    <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                        {s.mobile ? <Smartphone size={20} /> : <Monitor size={20} />}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={700}>{s.device} {s.current && <Chip label="This device" size="small" color="success" variant="outlined" sx={{ ml: 1, height: 20 }} />}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.place} · {s.last}</Typography>
                        </Box>
                        {!s.current && <Button size="small" color="error" onClick={() => { setData((p) => ({ list: p.list.filter((x) => x.id !== s.id) })); notify("Session revoked"); }} sx={{ textTransform: "none" }}>Revoke</Button>}
                    </Box>
                ))}
            </Stack>
        </SettingsCard>
    );
}

function KeysSection({ notify }) {
    const [data, setData] = usePref("uniforge.keys", { list: [] });
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: "", key: "" });
    const [errors, setErrors] = useState({});

    const detectType = (k) => (/^-----BEGIN PGP PUBLIC KEY BLOCK-----/.test(k.trim()) ? "GPG" : /^(ssh-(rsa|ed25519|dss)|ecdsa-sha2-nistp\d+|sk-ssh-ed25519@openssh\.com)\s+\S+/.test(k.trim()) ? "SSH" : null);

    const add = () => {
        const next = {};
        if (!form.title.trim()) next.title = "Give the key a title";
        const type = detectType(form.key);
        if (!form.key.trim()) next.key = "Paste your public key";
        else if (!type) next.key = "This doesn't look like an SSH or GPG public key";
        setErrors(next);
        if (Object.keys(next).length) return;
        const body = form.key.trim().replace(/\s+/g, "");
        setData((p) => ({ list: [{ id: uid(), title: form.title.trim(), type, fingerprint: `SHA256:${btoa(body.slice(-24)).slice(0, 32)}`, added: new Date().toISOString().slice(0, 10) }, ...p.list] }));
        setOpen(false); setForm({ title: "", key: "" });
        notify(`${type} key added`);
    };

    return (
        <>
            <SettingsCard title="Your keys" description="Public keys let you authenticate securely." action={<Button size="small" variant="contained" startIcon={<Plus size={14} />} onClick={() => { setErrors({}); setOpen(true); }} sx={{ textTransform: "none" }}>New key</Button>}>
                {data.list.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No keys yet. Add an SSH or GPG public key.</Typography>
                ) : (
                    <Stack divider={<Divider />}>
                        {data.list.map((k) => (
                            <Box key={k.id} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                                <Key size={20} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                        <Typography variant="body2" fontWeight={700}>{k.title}</Typography>
                                        <Chip label={k.type} size="small" variant="outlined" sx={{ height: 20 }} />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", fontFamily: "monospace" }}>{k.fingerprint}</Typography>
                                    <Typography variant="caption" color="text.secondary">Added {k.added}</Typography>
                                </Box>
                                <Button size="small" color="error" onClick={() => { setData((p) => ({ list: p.list.filter((x) => x.id !== k.id) })); notify("Key deleted"); }} sx={{ textTransform: "none" }}>Delete</Button>
                            </Box>
                        ))}
                    </Stack>
                )}
            </SettingsCard>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Add a new key</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <TextField size="small" label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={Boolean(errors.title)} helperText={errors.title} />
                        <TextField size="small" label="Public key" multiline rows={5} placeholder="ssh-ed25519 AAAA… or -----BEGIN PGP PUBLIC KEY BLOCK-----" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} error={Boolean(errors.key)} helperText={errors.key} slotProps={{ htmlInput: { style: { fontFamily: "monospace", fontSize: 12 } } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
                    <Button variant="contained" onClick={add} sx={{ textTransform: "none" }}>Add key</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function SettingsPage() {
    const { user, logout, language, changeLanguage } = useAuth();
    const { toggleColorMode, isDark } = useThemeContext();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [snack, setSnack] = useState({ open: false, message: "" });

    const ownerKey = user?.id || user?.username || user?.name || "Rim Narong";
    const requested = searchParams.get("section");
    const section = ALL_SECTIONS.some((s) => s.id === requested) ? requested : "account";
    const current = ALL_SECTIONS.find((s) => s.id === section);

    const notify = (message) => setSnack({ open: true, message });
    const go = (id) => setSearchParams({ section: id }, { replace: true });

    useEffect(() => { applyAccessibility(loadAccessibility()); }, []);

    const renderNav = (label, items) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ px: 1.5, letterSpacing: 0.5, display: "block", mb: 0.5 }}>{label}</Typography>
            <List disablePadding>
                {items.map(({ id, label: text, icon: Icon }) => (
                    <ListItemButton key={id} selected={section === id} onClick={() => go(id)} sx={{ borderRadius: "6px", py: 0.75, position: "relative", "&.Mui-selected::before": { content: '""', position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, bgcolor: "#f78166", borderRadius: 2 } }}>
                        <ListItemIcon sx={{ minWidth: 34 }}><Icon size={17} /></ListItemIcon>
                        <ListItemText primary={text} primaryTypographyProps={{ fontSize: 14, fontWeight: section === id ? 700 : 400 }} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <DashboardLayout user={user} logout={logout} language={language} changeLanguage={changeLanguage} toggleColorMode={toggleColorMode} isDark={isDark}>
        
                <Box component="main" sx={{ minHeight: "calc(100vh - 62px)", bgcolor: "background.default", color: "text.primary", px: { xs: 2, md: 5 }, py: 4 }}>
                    <Box sx={{ maxWidth: 1280, mx: "auto" }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px minmax(0, 1fr)" }, gap: 4 }}>
                            <Box component="nav" aria-label="Settings sections" sx={{ alignSelf: "start", position: { md: "sticky" }, top: { md: 82 } }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, pb: 2, mb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                                    <Avatar src={user?.avatar} sx={{ width: 40, height: 40, bgcolor: "primary.dark", fontWeight: 700 }}>
                                        {(user?.name || "R").charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography noWrap sx={{ fontSize: 14, fontWeight: 600 }}>{user?.name || "Rim Narong"}</Typography>
                                        <Typography noWrap variant="caption" color="text.secondary">Your personal account</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" variant="outlined" fullWidth onClick={() => navigate("/profile")} sx={{ mb: 2 }}>Go to your profile</Button>
                                {renderNav("SETTINGS", PERSONAL_NAV)}
                                {renderNav("ACCESS", ACCESS_NAV)}
                            </Box>

                            <Box>
                                <Box sx={{ pb: 1.5, mb: 3, borderBottom: "1px solid", borderColor: "divider" }}><Typography component="h1" sx={{ fontSize: 24, fontWeight: 400 }}>{current.label}</Typography></Box>
                                {section === "account" && <AccountSection user={user} language={language} changeLanguage={changeLanguage} logout={logout} notify={notify} ownerKey={ownerKey} />}
                                {section === "appearance" && <AppearanceSection isDark={isDark} toggleColorMode={toggleColorMode} notify={notify} />}
                                {section === "accessibility" && <AccessibilitySection notify={notify} />}
                                {section === "notifications" && <NotificationsSection notify={notify} />}
                                {section === "billing" && <BillingSection ownerKey={ownerKey} />}
                                {section === "emails" && <EmailsSection user={user} notify={notify} />}
                                {section === "security" && <SecuritySection notify={notify} />}
                                {section === "sessions" && <SessionsSection notify={notify} />}
                                {section === "keys" && <KeysSection notify={notify} />}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert severity="success" variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.message}</Alert>
                </Snackbar>
        
        </DashboardLayout>
    );
}