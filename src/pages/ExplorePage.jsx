// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Chip, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
// import { Award, Bookmark, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Copy, Download, ExternalLink, File, FileText, Filter, Flame, FlaskConical, Folder, FolderGit2, FolderOpen, GitFork, Globe, GraduationCap, HelpCircle, MessageSquare, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Pencil, Plus, RotateCcw, Search, Sparkles, Star, ThumbsUp, TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";

// import DashboardLayout from "../components/Layout/DashboardLayout";
// import { useThemeContext } from "../Context/ThemeContext";
// import { useAuth } from "../Context/AuthContext";

// // --- SHARED STYLE HELPERS ---
// const isDarkTheme = (theme) => theme.palette.mode === "dark";
// const surfaceBg = (theme) => (isDarkTheme(theme) ? "#0d1117" : "background.paper");
// const raisedBg = (theme) => (isDarkTheme(theme) ? "#161b22" : "#f6f8fa");
// const lineColor = (theme) => (isDarkTheme(theme) ? "#30363d" : "divider");
// const subtleLine = (theme) => (isDarkTheme(theme) ? "#21262d" : "divider");
// const cardSx = {
//   bgcolor: (theme) => (isDarkTheme(theme) ? "#161b22" : "background.paper"),
//   borderColor: (theme) => (isDarkTheme(theme) ? "#30363d" : "divider"),
//   borderRadius: "6px",
//   "&:hover": { borderColor: "primary.main" },
// };

// const dividerSx = { borderColor: subtleLine };

// const monoFont = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

// // --- EXPLORE CATEGORIES ---
// const CATEGORIES = [
//   { id: "projects", label: "Projects", icon: FolderGit2, count: 128 },
//   { id: "students", label: "Students", icon: UserCheck, count: 450 },
//   { id: "teams", label: "Teams", icon: Users, count: 64 },
//   { id: "resources", label: "Resources", icon: BookOpen, count: 89 },
//   { id: "research", label: "Research", icon: FlaskConical, count: 32 },
//   { id: "capstone", label: "Capstone", icon: GraduationCap, count: 45 },
//   { id: "thesis", label: "Thesis", icon: Award, count: 21 },
//   { id: "skills", label: "Skills", icon: Sparkles, count: 110 },
//   { id: "questions", label: "Questions", icon: HelpCircle, count: 210 },
// ];

// // --- SAMPLE DATASETS FOR ALL TABS ---

// const SAMPLE_PROJECTS = [
//   {
//     id: 1,
//     title: "AI Study Assistant",
//     description: "An intelligent learning companion tailored for university students using LLMs to synthesize lecture slides and generate interactive quizzes.",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Computer Science",
//     course: "Artificial Intelligence",
//     year: "Year 4",
//     technology: "AI",
//     status: "Completed",
//     type: "Capstone",
//     stars: 142,
//     forks: 38,
//     author: { name: "Rim Narong", avatar: "" },
//     updatedAt: "2 days ago",
//   },
//   {
//     id: 2,
//     title: "Smart Campus POS & Kiosk System",
//     description: "Logic Integrated Kiosk Application (LIKA) designed for managing university cafeteria rentals, automated payments, and inventory.",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Information Technology",
//     course: "Software Engineering",
//     year: "Year 3",
//     technology: "React JS",
//     status: "In Progress",
//     type: "Course Project",
//     stars: 98,
//     forks: 19,
//     author: { name: "Sokha Chan", avatar: "" },
//     updatedAt: "5 hours ago",
//   },
//   {
//     id: 3,
//     title: "Khmer OCR Engine",
//     description: "Deep learning OCR system optimized for digitized historical Khmer manuscripts and printed academic research papers.",
//     university: "ITC",
//     faculty: "GIC",
//     major: "Computer Science",
//     course: "Machine Learning",
//     year: "Year 4",
//     technology: "AI",
//     status: "Completed",
//     type: "Thesis",
//     stars: 215,
//     forks: 54,
//     author: { name: "Vannak Keo", avatar: "" },
//     updatedAt: "1 week ago",
//   },
//   {
//     id: 4,
//     title: "University Chatbot System",
//     description: "An automated multi-lingual RAG chatbot answering enrollment inquiries, course prerequisites, and campus navigation queries.",
//     university: "CADT",
//     faculty: "Computer Science",
//     major: "Software Engineering",
//     course: "Natural Language Processing",
//     year: "Year 3",
//     technology: "AI",
//     status: "In Progress",
//     type: "Research",
//     stars: 76,
//     forks: 12,
//     author: { name: "Dara Sam", avatar: "" },
//     updatedAt: "Just now",
//   },
//   {
//     id: 5,
//     title: "IoT Smart Agriculture Monitor",
//     description: "Sensor node network using LoRaWAN to monitor soil moisture, temperature, and automated irrigation in greenhouse labs.",
//     university: "ITC",
//     faculty: "Engineering",
//     major: "Information Technology",
//     course: "IoT & Embedded Systems",
//     year: "Year 4",
//     technology: "C++",
//     status: "Completed",
//     type: "Capstone",
//     stars: 112,
//     forks: 27,
//     author: { name: "Sophea Leng", avatar: "" },
//     updatedAt: "3 days ago",
//   },
//   {
//     id: 6,
//     title: "Student Skill & Peer Tutoring Portal",
//     description: "Peer-to-peer mentoring platform matching senior students with juniors for code reviews, math tutoring, and exam preparation.",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Computer Science",
//     course: "Web Development",
//     year: "Year 2",
//     technology: "Laravel",
//     status: "In Progress",
//     type: "Course Project",
//     stars: 64,
//     forks: 11,
//     author: { name: "Votey Seng", avatar: "" },
//     updatedAt: "Yesterday",
//   }
// ];

// const SAMPLE_STUDENTS = [
//   {
//     id: 101,
//     name: "Rim Narong",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Computer Science",
//     year: "Year 4",
//     avatar: "",
//     bio: "Building AI tools for Khmer NLP processing and student study assistance. Passionate about machine learning & open-source.",
//     skills: ["AI / ML", "Python", "React JS", "FastAPI"],
//     projectsCount: 12,
//     followers: 148,
//     status: "Available for Team",
//     github: "github.com/rimnarong",
//   },
//   {
//     id: 102,
//     name: "Sokha Chan",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Information Technology",
//     year: "Year 3",
//     avatar: "",
//     bio: "Full-stack developer focused on cafeteria POS systems and microservices. Love building clean web interfaces with MUI & Vite.",
//     skills: ["React JS", "Node.js", "PostgreSQL", "Docker"],
//     projectsCount: 8,
//     followers: 92,
//     status: "Open to Collaborate",
//     github: "github.com/sokhachan",
//   },
//   {
//     id: 103,
//     name: "Vannak Keo",
//     university: "ITC",
//     faculty: "GIC",
//     major: "Computer Science",
//     year: "Year 4",
//     avatar: "",
//     bio: "Computer Vision & Deep Learning enthusiast. Working on Khmer historical manuscript digitizing OCR research paper.",
//     skills: ["PyTorch", "OpenCV", "Python", "C++"],
//     projectsCount: 15,
//     followers: 210,
//     status: "Working on Thesis",
//     github: "github.com/vannakkeo",
//   },
//   {
//     id: 104,
//     name: "Sophea Leng",
//     university: "ITC",
//     faculty: "Engineering",
//     major: "Information Technology",
//     year: "Year 4",
//     avatar: "",
//     bio: "Embedded systems engineer & IoT maker. Focused on LoRaWAN smart agriculture and campus solar power monitoring.",
//     skills: ["IoT", "C++", "Python", "MQTT", "React"],
//     projectsCount: 9,
//     followers: 115,
//     status: "Looking for Capstone Team",
//     github: "github.com/sophealeng",
//   },
//   {
//     id: 105,
//     name: "Dara Sam",
//     university: "CADT",
//     faculty: "Computer Science",
//     major: "Software Engineering",
//     year: "Year 3",
//     avatar: "",
//     bio: "NLP researcher and backend software engineer. Building multilingual university chatbot systems.",
//     skills: ["AI / ML", "Python", "LangChain", "Next.js"],
//     projectsCount: 7,
//     followers: 88,
//     status: "Available for Team",
//     github: "github.com/darasam",
//   },
//   {
//     id: 106,
//     name: "Votey Seng",
//     university: "RUPP",
//     faculty: "Engineering",
//     major: "Computer Science",
//     year: "Year 2",
//     avatar: "",
//     bio: "UI/UX designer & frontend developer crafting student marketplace portals and design systems.",
//     skills: ["Figma", "React JS", "Tailwind CSS", "UI/UX"],
//     projectsCount: 6,
//     followers: 75,
//     status: "Open to Collaborate",
//     github: "github.com/voteyseng",
//   },
// ];

// const SAMPLE_TEAMS = [
//   {
//     id: 201,
//     name: "Khmer Vision AI Lab",
//     projectTitle: "Khmer Document OCR & Historical Manuscript Scanner",
//     university: "ITC",
//     type: "Thesis / Capstone",
//     leader: "Vannak Keo",
//     members: [
//       { name: "Vannak Keo" },
//       { name: "Rim Narong" },
//       { name: "Dara Sam" },
//     ],
//     maxMembers: 5,
//     lookingFor: ["UI/UX Designer", "Mobile Dev (Flutter)"],
//     techStack: ["PyTorch", "OpenCV", "FastAPI", "Flutter"],
//     description: "Developing offline-capable deep learning OCR models to preserve ancient palm-leaf manuscripts into searchables text.",
//     status: "Recruiting",
//   },
//   {
//     id: 202,
//     name: "Smart Campus POS Developers",
//     projectTitle: "LIKA University Cafeteria & Kiosk Solution",
//     university: "RUPP",
//     type: "Course Project",
//     leader: "Sokha Chan",
//     members: [
//       { name: "Sokha Chan" },
//       { name: "Votey Seng" },
//       { name: "Rithy Heng" },
//       { name: "Bora Kim" },
//     ],
//     maxMembers: 4,
//     lookingFor: [],
//     techStack: ["React JS", "MUI", "Node.js", "PostgreSQL"],
//     description: "All-in-one payment management system for university cafeteria vendors with real-time sales reporting and student NFC meal cards.",
//     status: "Team Full",
//   },
//   {
//     id: 203,
//     name: "EcoCampus IoT Mesh",
//     projectTitle: "Real-time Campus Energy & Microgrid Monitor",
//     university: "ITC",
//     type: "Research",
//     leader: "Sophea Leng",
//     members: [
//       { name: "Sophea Leng" },
//       { name: "Chea Vanna" },
//     ],
//     maxMembers: 4,
//     lookingFor: ["Backend Engineer (Go)", "Data Analyst"],
//     techStack: ["C++", "LoRaWAN", "Go", "Grafana"],
//     description: "Installing wireless sensor nodes across campus buildings to optimize air conditioning and solar panel electricity distribution.",
//     status: "Recruiting",
//   },
//   {
//     id: 204,
//     name: "Cambodia Student Peer Hub",
//     projectTitle: "University Knowledge Exchange & Mentorship Network",
//     university: "CADT",
//     type: "Capstone",
//     leader: "Dara Sam",
//     members: [
//       { name: "Dara Sam" },
//       { name: "Votey Seng" },
//       { name: "Maly Meas" },
//     ],
//     maxMembers: 5,
//     lookingFor: ["DevOps Engineer", "QA Tester"],
//     techStack: ["Next.js", "NestJS", "Docker", "Tailwind"],
//     description: "Connecting senior mentors with underclassmen across CADT, RUPP, and ITC for course tutoring and capstone team formation.",
//     status: "Recruiting",
//   }
// ];

// const SAMPLE_RESOURCES = [
//   {
//     id: 301,
//     title: "Khmer NLP Pre-trained Word Tokenizer & Dictionary",
//     category: "Dataset & Code",
//     type: "Code Repository",
//     format: "Python Package / Zip",
//     university: "CADT",
//     author: "Dr. Chea Vanna & Research Lab",
//     downloads: 1420,
//     stars: 320,
//     description: "Comprehensive open-source dictionary corpus and deep-learning segmentation model for Khmer language tokenization.",
//     updatedAt: "2 weeks ago",
//   },
//   {
//     id: 302,
//     title: "Data Structures & Algorithms Khmer Course Handbook",
//     category: "Study Material",
//     type: "Textbook / Guide",
//     format: "PDF Document",
//     university: "RUPP",
//     author: "Prof. Heng Piseth",
//     downloads: 3890,
//     stars: 540,
//     description: "A 280-page illustrated guide explaining Trees, Graphs, Sorting, and Dynamic Programming with code snippets in C++ and Python.",
//     updatedAt: "1 month ago",
//   },
//   {
//     id: 303,
//     title: "Full-Stack Web Dev Starter Template 2026",
//     category: "Templates",
//     type: "Project Template",
//     format: "GitHub Repo",
//     university: "ITC",
//     author: "Sokha Chan",
//     downloads: 890,
//     stars: 175,
//     description: "React 19 + Vite + MUI + Express + PostgreSQL preconfigured with authentication, dark mode support, and Docker compose files.",
//     updatedAt: "3 days ago",
//   },
//   {
//     id: 304,
//     title: "University Senior Capstone & Thesis Defense Presentation Slides",
//     category: "Templates",
//     type: "Slide Deck",
//     format: "PPTX / Figma",
//     university: "RUPP",
//     author: "Academic Steering Committee",
//     downloads: 2450,
//     stars: 410,
//     description: "Official 16:9 presentation template adhering to university defense standards, rubric charts, and project architecture diagrams.",
//     updatedAt: "Just now",
//   }
// ];

// const SAMPLE_RESEARCH = [
//   {
//     id: 401,
//     title: "Deep Transformer Architectures for Digitizing Historical Khmer Inscriptions",
//     field: "AI & Computer Vision",
//     university: "ITC",
//     journal: "IEEE ASEAN Computing & Tech Transactions",
//     year: 2025,
//     status: "Published",
//     authors: ["Vannak Keo", "Dr. Seng Rathny"],
//     supervisor: "Dr. Seng Rathny",
//     citations: 42,
//     downloads: 650,
//     abstract: "We introduce a novel Transformer OCR architecture specifically fine-tuned on degraded 10th-century Khmer stone inscriptions, achieving 94.2% character recognition accuracy under extreme noise conditions.",
//   },
//   {
//     id: 402,
//     title: "Scalable Event-Driven Microservices for University Administrative Portals",
//     field: "Distributed Systems",
//     university: "RUPP",
//     journal: "Journal of Systems & Software Research",
//     year: 2026,
//     status: "Pre-print",
//     authors: ["Rim Narong", "Dara Sam", "Prof. Khem Sok"],
//     supervisor: "Prof. Khem Sok",
//     citations: 18,
//     downloads: 310,
//     abstract: "This paper evaluates load balancing, redis caching, and Kafka message queuing under heavy concurrent student registration spikes at regional Cambodian universities.",
//   },
//   {
//     id: 403,
//     title: "Privacy-Preserving Federated Learning for Multi-University Research Datasets",
//     field: "Cybersecurity & AI",
//     university: "CADT",
//     journal: "International Higher Ed Tech Review",
//     year: 2025,
//     status: "Published",
//     authors: ["Chhan Maly", "Votey Seng", "Dr. Meas Chan"],
//     supervisor: "Dr. Meas Chan",
//     citations: 29,
//     downloads: 480,
//     abstract: "A decentralized machine learning framework that enables cross-institutional AI model training without exposing sensitive student personal identifiable information (PII).",
//   }
// ];

// const SAMPLE_CAPSTONE = [
//   {
//     id: 501,
//     title: "AI-Powered Automated Code Reviewer & Grader for Computer Science Labs",
//     university: "RUPP",
//     sponsor: "Khmer Coders Guild",
//     team: ["Rim Narong", "Sokha Chan"],
//     advisor: "Dr. Khem Sovann",
//     grade: "Distinction (A+)",
//     year: 2026,
//     demoUrl: "https://code-grade.demo.kh",
//     techStack: ["Python", "Docker", "React", "FastAPI"],
//     summary: "Automated sandboxed unit testing, code complexity analysis, and anti-plagiarism scanning system built for RUPP lab instructors.",
//   },
//   {
//     id: 502,
//     title: "Smart Solar Campus Microgrid & Telemetry Monitoring Portal",
//     university: "ITC",
//     sponsor: "EDC Innovation Hub",
//     team: ["Sophea Leng", "Borith Sovann"],
//     advisor: "Prof. Nguon Kim",
//     grade: "Grade A",
//     year: 2025,
//     demoUrl: "https://smartgrid.itc.edu.kh",
//     techStack: ["IoT", "React", "Express", "InfluxDB"],
//     summary: "Real-time power generation tracking, battery health prognosis, and automated alert system installed across ITC solar rooftops.",
//   },
//   {
//     id: 503,
//     title: "Offline-First Electronic Health Records for Rural Health Clinics",
//     university: "CADT",
//     sponsor: "Ministry of Telecom & Health",
//     team: ["Dara Sam", "Votey Seng"],
//     advisor: "Dr. Chea Vana",
//     grade: "Distinction (A+)",
//     year: 2026,
//     demoUrl: "https://e-health.cadt.edu.kh",
//     techStack: ["React Native", "CouchDB", "Node.js"],
//     summary: "Mobile clinic synchronization application enabling healthcare workers in remote provinces to log patient records without cellular internet.",
//   }
// ];

// const SAMPLE_THESIS = [
//   {
//     id: 601,
//     title: "Neural Machine Translation Strategies for Khmer-English Academic & Legal Texts",
//     degree: "Master's Thesis",
//     university: "ITC",
//     author: "Vannak Keo",
//     advisor: "Prof. Dr. Seng Rathny",
//     defenseStatus: "Defended (Honors)",
//     year: 2025,
//     citations: 56,
//     downloads: 830,
//     abstract: "Investigating subword tokenization strategies, back-translation data augmentation, and domain-specific vocabulary alignment for Khmer technical academic translation precision.",
//   },
//   {
//     id: 602,
//     title: "Zero-Trust Vulnerability Analysis in Distributed University Cloud Networks",
//     degree: "Bachelor's Thesis",
//     university: "CADT",
//     author: "Borith Sovann",
//     advisor: "Prof. Touch Sok",
//     defenseStatus: "Defended",
//     year: 2025,
//     citations: 24,
//     downloads: 410,
//     abstract: "Assessing zero-day exploit threat vectors, container runtime isolation, and automated penetration testing pipelines across university campus cloud infrastructure.",
//   },
//   {
//     id: 603,
//     title: "Graph Neural Network Embeddings for Academic Advisor & Thesis Matching",
//     degree: "Master's Thesis",
//     university: "RUPP",
//     author: "Leakhena Peou",
//     advisor: "Dr. Heng Piseth",
//     defenseStatus: "Defense Scheduled",
//     year: 2026,
//     citations: 12,
//     downloads: 215,
//     abstract: "Constructing student interest vector embeddings mapped against professor publication graphs to optimize thesis supervisor assignments and reduce student dropouts.",
//   }
// ];

// const SAMPLE_SKILLS = [
//   {
//     id: 701,
//     name: "AI & Machine Learning",
//     category: "AI & Data Science",
//     learnersCount: 340,
//     projectsCount: 42,
//     topStudents: ["Rim Narong", "Vannak Keo", "Chhan Maly"],
//     technologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV"],
//     description: "Master machine learning algorithms, deep neural networks, computer vision, and Khmer natural language processing models.",
//   },
//   {
//     id: 702,
//     name: "Full-Stack Web Development",
//     category: "Web Development",
//     learnersCount: 510,
//     projectsCount: 78,
//     topStudents: ["Sokha Chan", "Votey Seng", "Dara Sam"],
//     technologies: ["React 19", "Next.js", "TypeScript", "Node.js"],
//     description: "Build reactive single page applications, RESTful and GraphQL APIs, and responsive design systems with Material UI & Tailwind.",
//   },
//   {
//     id: 703,
//     name: "Mobile Application Engineering",
//     category: "Mobile Dev",
//     learnersCount: 280,
//     projectsCount: 35,
//     topStudents: ["Sophea Leng", "Dara Sam"],
//     technologies: ["Flutter", "Dart", "React Native", "Expo"],
//     description: "Develop cross-platform iOS and Android apps with offline caching, push notifications, and native hardware integration.",
//   },
//   {
//     id: 704,
//     name: "Cloud Architecture & DevOps",
//     category: "Cloud & Systems",
//     learnersCount: 190,
//     projectsCount: 23,
//     topStudents: ["Borith Sovann", "Rim Narong"],
//     technologies: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
//     description: "Containerize applications, automate CI/CD delivery pipelines, and orchestrate scalable cloud services.",
//   },
//   {
//     id: 705,
//     name: "Cybersecurity & Network Defense",
//     category: "Cybersecurity",
//     learnersCount: 215,
//     projectsCount: 18,
//     topStudents: ["Borith Sovann"],
//     technologies: ["Wireshark", "Metasploit", "Linux", "Ethical Hacking"],
//     description: "Conduct network penetration tests, vulnerability audits, zero-trust network configurations, and defensive secure coding.",
//   },
//   {
//     id: 706,
//     name: "UI/UX & Product Design",
//     category: "Design & UX",
//     learnersCount: 320,
//     projectsCount: 45,
//     topStudents: ["Votey Seng"],
//     technologies: ["Figma", "User Research", "Wireframing", "Prototyping"],
//     description: "Create human-centered user interfaces, interactive Figma prototypes, design tokens, and user flow architectures.",
//   }
// ];

// const SAMPLE_QUESTIONS = [
//   {
//     id: 801,
//     title: "How to properly configure PyTorch GPU acceleration on Windows for Khmer OCR training?",
//     author: { name: "Sophea Leng", avatar: "" },
//     university: "RUPP",
//     votes: 24,
//     answers: 5,
//     isSolved: true,
//     time: "3 hours ago",
//     tags: ["PyTorch", "CUDA", "AI / ML"],
//     snippet: "I am getting CUDA out of memory error when loading the pre-trained weights for Khmer character embeddings. Has anyone fixed batch size parameters on RTX GPUs?",
//   },
//   {
//     id: 802,
//     title: "What are the best practices for structuring a Capstone Monorepo with React 19 and FastAPI?",
//     author: { name: "Dara Sam", avatar: "" },
//     university: "CADT",
//     votes: 18,
//     answers: 3,
//     isSolved: true,
//     time: "1 day ago",
//     tags: ["React", "FastAPI", "Capstone"],
//     snippet: "Should we keep frontend and backend in separate git repositories or use TurboRepo? What CI/CD pipeline setup works best for RUPP server deployments?",
//   },
//   {
//     id: 803,
//     title: "Key curriculum differences between GIC and CS major at ITC for Year 3 research track?",
//     author: { name: "Borith Sovann", avatar: "" },
//     university: "ITC",
//     votes: 12,
//     answers: 4,
//     isSolved: false,
//     time: "2 days ago",
//     tags: ["Curriculum", "ITC", "Research"],
//     snippet: "I am selecting my elective specialization modules for Year 3. Which track offers more practical machine learning laboratory hours and thesis guidance?",
//   },
//   {
//     id: 804,
//     title: "How to implement JWT authentication securely in Next.js 15 App Router with HttpOnly cookies?",
//     author: { name: "Votey Seng", avatar: "" },
//     university: "RUPP",
//     votes: 31,
//     answers: 8,
//     isSolved: true,
//     time: "4 days ago",
//     tags: ["Next.js", "Auth", "Security"],
//     snippet: "Should access tokens be stored in HttpOnly cookies or SessionStorage when communicating with an external Express REST API server?",
//   }
// ];

// // --- RESEARCH REPOSITORY HELPERS ---

// const BINARY_FILE_TYPES = ["pdf", "docx", "xlsx", "png", "pt"];

// const getResearchRepositoryFiles = (paper) => {
//   if (!paper) return [];
//   return [
//     { name: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" },
//     { name: "paper.pdf", type: "pdf", size: "1.8 MB", updated: "2 hours ago" },
//     { name: "supplementary.docx", type: "docx", size: "420 KB", updated: "1 day ago" },
//     { name: "evaluation-results.xlsx", type: "xlsx", size: "96 KB", updated: "3 days ago" },
//     { name: "requirements.txt", type: "txt", size: "1 KB", updated: "1 week ago" },
//     {
//       name: "configs",
//       type: "folder",
//       children: [{ name: "default.yaml", type: "yaml", size: "3 KB", updated: "5 days ago" }],
//     },
//     {
//       name: "data",
//       type: "folder",
//       children: [
//         {
//           name: "raw",
//           type: "folder",
//           children: [
//             { name: "inscriptions.csv", type: "csv", size: "4.2 MB", updated: "2 weeks ago" },
//             { name: "source-catalog.json", type: "json", size: "180 KB", updated: "2 weeks ago" },
//           ],
//         },
//         {
//           name: "processed",
//           type: "folder",
//           children: [
//             { name: "train.jsonl", type: "jsonl", size: "22 MB", updated: "1 week ago" },
//             { name: "validation.jsonl", type: "jsonl", size: "3.4 MB", updated: "1 week ago" },
//             { name: "test.jsonl", type: "jsonl", size: "3.1 MB", updated: "1 week ago" },
//           ],
//         },
//       ],
//     },
//     {
//       name: "docs",
//       type: "folder",
//       children: [
//         { name: "dataset-notes.md", type: "md", size: "8 KB", updated: "1 week ago" },
//         { name: "methodology.md", type: "md", size: "11 KB", updated: "5 days ago" },
//         { name: "citation.bib", type: "bib", size: "2 KB", updated: "3 days ago" },
//       ],
//     },
//     {
//       name: "figures",
//       type: "folder",
//       children: [
//         { name: "architecture.png", type: "png", size: "640 KB", updated: "4 days ago" },
//         { name: "accuracy-by-noise.svg", type: "svg", size: "42 KB", updated: "3 days ago" },
//       ],
//     },
//     {
//       name: "notebooks",
//       type: "folder",
//       children: [
//         { name: "01_dataset_review.ipynb", type: "ipynb", size: "1.2 MB", updated: "2 weeks ago" },
//         { name: "02_model_evaluation.ipynb", type: "ipynb", size: "860 KB", updated: "4 days ago" },
//       ],
//     },
//     {
//       name: "src",
//       type: "folder",
//       children: [
//         {
//           name: "models",
//           type: "folder",
//           children: [
//             {
//               name: "transformer",
//               type: "folder",
//               children: [
//                 { name: "encoder.py", type: "py", size: "14 KB", updated: "1 week ago" },
//                 { name: "decoder.py", type: "py", size: "12 KB", updated: "1 week ago" },
//                 { name: "attention.py", type: "py", size: "8 KB", updated: "1 week ago" },
//               ],
//             },
//             { name: "ocr_model.py", type: "py", size: "18 KB", updated: "1 week ago" },
//           ],
//         },
//         {
//           name: "utils",
//           type: "folder",
//           children: [
//             { name: "preprocessing.py", type: "py", size: "9 KB", updated: "1 week ago" },
//             { name: "tokenizer.py", type: "py", size: "6 KB", updated: "6 days ago" },
//           ],
//         },
//         { name: "train.py", type: "py", size: "11 KB", updated: "5 days ago" },
//         { name: "evaluate.py", type: "py", size: "8 KB", updated: "4 days ago" },
//       ],
//     },
//     {
//       name: "tests",
//       type: "folder",
//       children: [
//         { name: "test_preprocessing.py", type: "py", size: "5 KB", updated: "6 days ago" },
//         { name: "test_ocr_model.py", type: "py", size: "7 KB", updated: "4 days ago" },
//       ],
//     },
//     {
//       name: "outputs",
//       type: "folder",
//       children: [
//         {
//           name: "checkpoints",
//           type: "folder",
//           children: [
//             { name: "best_model.pt", type: "pt", size: "420 MB", updated: "2 days ago" },
//             { name: "config.yaml", type: "yaml", size: "3 KB", updated: "2 days ago" },
//           ],
//         },
//         { name: "metrics-summary.json", type: "json", size: "12 KB", updated: "2 days ago" },
//       ],
//     },
//     { name: "dataset-notes.md", type: "md", size: "8 KB", updated: "1 week ago" },
//   ];
// };

// // Folders first, then files, both alphabetical (same as GitHub)
// const sortRepositoryEntries = (files) =>
//   [...files].sort((a, b) => {
//     if (a.type === "folder" && b.type !== "folder") return -1;
//     if (a.type !== "folder" && b.type === "folder") return 1;
//     return a.name.localeCompare(b.name);
//   });

// const buildReadmeSource = (paper) => `# ${paper.title}

// ${paper.authors.join(", ")} · ${paper.university} · ${paper.year}

// ## Project Overview

// This repository accompanies the research published in ${paper.journal}. It brings together the project notes, source code, data-processing assets, and evaluation materials used to support the study.

// ## Abstract

// ${paper.abstract}

// ## Research Goals

// - Define a reproducible approach to the problem described in the paper.
// - Document the assumptions, data preparation, and evaluation choices used in the study.
// - Make supporting materials understandable and reusable by other student research teams.

// ## Repository Structure

// configs/        Experiment configuration files
// data/           Original and processed research data
// docs/           Methodology, dataset notes, and citation details
// figures/        Diagrams and visual summaries
// notebooks/      Exploratory analysis and evaluation notebooks
// requirements.txt Python dependencies
// src/            Research implementation and model code
// tests/          Data and implementation checks
// outputs/        Experiment summaries and model checkpoints

// ## Methodology

// The workflow is divided into four stages: source review, data preparation, implementation, and evaluation. Raw inputs are kept separate from processed artifacts so that transformations can be inspected.

// 1. Review source material and define inclusion criteria before preparing data.
// 2. Apply documented cleaning and normalization steps.
// 3. Run the implementation using the checked-in configuration.
// 4. Compare results against the stated baseline and inspect representative errors.

// ## Environment and Reproduction

// python -m venv .venv
// pip install -r requirements.txt
// python src/train.py --config configs/default.yaml
// python src/evaluate.py --checkpoint outputs/checkpoints/best_model.pt

// ## Evaluation and Findings

// The paper reports the primary findings and their evaluation protocol. Use the same data splits and preprocessing configuration for a fair comparison.

// ## Limitations and Future Work

// Results depend on the coverage and quality of the available data, the selected evaluation protocol, and the assumptions documented by the authors.

// ## Authors

// ${paper.authors.map((a) => `- ${a}`).join("\n")}

// ## Citation

// ${paper.authors.join(", ")}. (${paper.year}). ${paper.title}. ${paper.journal}.
// `;

// const buildResearchFileContent = (file, paper) => {
//   if (!file || !paper) return "";
//   const { name, type } = file;
//   switch (type) {
//     case "md":
//       return name === "README.md"
//         ? buildReadmeSource(paper)
//         : `# ${name.replace(".md", "")}\n\nNotes for "${paper.title}".\n\n## Summary\n\nThis document records decisions, assumptions, and open questions for the study.\n\n## Next steps\n\n- Review the data preparation steps\n- Re-run the evaluation with the latest checkpoint\n- Update the citation details\n`;
//     case "py":
//       return `# ${name}\n# Part of: ${paper.title}\n\nimport argparse\nimport json\nfrom pathlib import Path\n\n\ndef load_config(path: str) -> dict:\n    with open(path, "r", encoding="utf-8") as handle:\n        return json.load(handle)\n\n\ndef main() -> None:\n    parser = argparse.ArgumentParser(description="${name}")\n    parser.add_argument("--config", type=str, default="configs/default.yaml")\n    args = parser.parse_args()\n\n    config_path = Path(args.config)\n    print(f"Using config: {config_path}")\n\n\nif __name__ == "__main__":\n    main()\n`;
//     case "yaml":
//       return `# ${name}\nseed: 42\nmodel:\n  name: transformer-ocr\n  layers: 6\n  heads: 8\n  hidden_size: 512\ntraining:\n  batch_size: 32\n  epochs: 40\n  learning_rate: 0.0003\ndata:\n  train: data/processed/train.jsonl\n  validation: data/processed/validation.jsonl\n  test: data/processed/test.jsonl\n`;
//     case "json":
//       return `{\n  "project": "${paper.title.replace(/"/g, "'")}",\n  "university": "${paper.university}",\n  "year": ${paper.year},\n  "metrics": {\n    "accuracy": 0.942,\n    "samples": 12840\n  }\n}\n`;
//     case "jsonl":
//       return `{"id": 1, "text": "sample inscription line 1", "label": "ok"}\n{"id": 2, "text": "sample inscription line 2", "label": "ok"}\n{"id": 3, "text": "sample inscription line 3", "label": "noisy"}\n{"id": 4, "text": "sample inscription line 4", "label": "ok"}\n`;
//     case "csv":
//       return `id,source,century,condition,notes\n1,Angkor-A,10,good,clear carving\n2,Angkor-B,10,degraded,partial erosion\n3,Roluos-C,9,degraded,heavy lichen\n4,Banteay-D,12,good,high contrast\n`;
//     case "txt":
//       return `torch>=2.2\nnumpy>=1.26\npandas>=2.1\nopencv-python>=4.9\nscikit-learn>=1.4\nPyYAML>=6.0\npytest>=8.0\n`;
//     case "bib":
//       return `@article{${paper.authors[0].split(" ").pop().toLowerCase()}${paper.year},\n  title   = {${paper.title}},\n  author  = {${paper.authors.join(" and ")}},\n  journal = {${paper.journal}},\n  year    = {${paper.year}}\n}\n`;
//     case "ipynb":
//       return `{\n  "cells": [\n    { "cell_type": "markdown", "source": ["# ${name}"] },\n    { "cell_type": "code", "source": ["import pandas as pd"] }\n  ],\n  "nbformat": 4,\n  "nbformat_minor": 5\n}\n`;
//     case "svg":
//       return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">\n  <rect width="320" height="120" fill="#f6f8fa" />\n  <text x="16" y="64" font-size="14">${name}</text>\n</svg>\n`;
//     default:
//       return `# ${name}\n# New file in ${paper.title}\n`;
//   }
// };

// const countLines = (content) => {
//   const lines = content.replace(/\n$/, "").split("\n");
//   const loc = lines.filter((line) => line.trim() !== "").length;
//   return { lines: lines.length, loc };
// };

// const downloadTextFile = (name, text) => {
//   const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = name;
//   link.click();
//   URL.revokeObjectURL(url);
// };

// const openRawText = (text) => {
//   const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   window.open(url, "_blank", "noopener");
//   setTimeout(() => URL.revokeObjectURL(url), 60000);
// };

// // Small joined icon-button group used in the file toolbar
// const groupBtnSx = {
//   borderRadius: 0,
//   px: 1.1,
//   color: "text.primary",
//   "&:not(:last-of-type)": { borderRight: "1px solid", borderColor: lineColor },
// };

// export default function ExplorePage() {
//   const { user, logout, language, changeLanguage } = useAuth();
//   const { toggleColorMode, isDark } = useThemeContext();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // Active Category & Search
//   const initialCategory = searchParams.get("tab") || "projects";
//   const [activeCategory, setActiveCategoryState] = useState(initialCategory);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Research repository viewer state
//   const [selectedResearchPaper, setSelectedResearchPaper] = useState(null);
//   const [selectedResearchFile, setSelectedResearchFile] = useState(null);
//   const [expandedResearchFolders, setExpandedResearchFolders] = useState({ src: true });
//   const [isResearchFileTreeOpen, setIsResearchFileTreeOpen] = useState(true);
//   const [researchFileSearch, setResearchFileSearch] = useState("");
//   const [isAddingResearchFile, setIsAddingResearchFile] = useState(false);
//   const [newResearchFileName, setNewResearchFileName] = useState("");
//   const [additionalResearchFiles, setAdditionalResearchFiles] = useState([]);
//   const [fileViewMode, setFileViewMode] = useState("preview"); // preview | source | contributors
//   const researchFileSearchRef = useRef(null);

//   useEffect(() => {
//     const tabParam = searchParams.get("tab");
//     if (tabParam && tabParam !== activeCategory) {
//       setActiveCategoryState(tabParam);
//     }
//   }, [searchParams]);

//   // Reset view mode whenever another file is opened
//   useEffect(() => {
//     if (!selectedResearchFile) return;
//     setFileViewMode(selectedResearchFile.type === "md" ? "preview" : "code");
//   }, [selectedResearchFile?.path]);

//   const setActiveCategory = (catId) => {
//     setActiveCategoryState(catId);
//     setSelectedResearchPaper(null);
//     setSelectedResearchFile(null);
//     const newParams = new URLSearchParams(searchParams);
//     newParams.set("tab", catId);
//     setSearchParams(newParams, { replace: true });
//   };

//   // Filter States
//   const [filters, setFilters] = useState({
//     university: "All",
//     faculty: "All",
//     major: "All",
//     technology: "All",
//     status: "All",
//     type: "All",
//     sort: "popular",
//     resourceType: "All",
//     field: "All",
//     degree: "All",
//     skillCategory: "All",
//     solvedStatus: "All",
//   });

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       university: "All",
//       faculty: "All",
//       major: "All",
//       technology: "All",
//       status: "All",
//       type: "All",
//       sort: "popular",
//       resourceType: "All",
//       field: "All",
//       degree: "All",
//       skillCategory: "All",
//       solvedStatus: "All",
//     });
//     setSearchQuery("");
//   };

//   // Filtered Logic for Projects
//   const filteredProjects = useMemo(() => {
//     return SAMPLE_PROJECTS.filter((proj) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         proj.title.toLowerCase().includes(q) ||
//         proj.description.toLowerCase().includes(q) ||
//         proj.technology.toLowerCase().includes(q);

//       const matchesUni = filters.university === "All" || proj.university === filters.university;
//       const matchesTech = filters.technology === "All" || proj.technology === filters.technology;
//       const matchesStatus = filters.status === "All" || proj.status === filters.status;
//       const matchesType = filters.type === "All" || proj.type === filters.type;

//       return matchesSearch && matchesUni && matchesTech && matchesStatus && matchesType;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Students
//   const filteredStudents = useMemo(() => {
//     return SAMPLE_STUDENTS.filter((st) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         st.name.toLowerCase().includes(q) ||
//         st.bio.toLowerCase().includes(q) ||
//         st.skills.some((s) => s.toLowerCase().includes(q));

//       const matchesUni = filters.university === "All" || st.university === filters.university;
//       const matchesFaculty = filters.faculty === "All" || st.faculty === filters.faculty;
//       const matchesMajor = filters.major === "All" || st.major === filters.major;

//       return matchesSearch && matchesUni && matchesFaculty && matchesMajor;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Teams
//   const filteredTeams = useMemo(() => {
//     return SAMPLE_TEAMS.filter((team) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         team.name.toLowerCase().includes(q) ||
//         team.projectTitle.toLowerCase().includes(q) ||
//         team.description.toLowerCase().includes(q) ||
//         team.techStack.some((t) => t.toLowerCase().includes(q));

//       const matchesUni = filters.university === "All" || team.university === filters.university;
//       const matchesStatus = filters.status === "All" || team.status === filters.status;

//       return matchesSearch && matchesUni && matchesStatus;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Resources
//   const filteredResources = useMemo(() => {
//     return SAMPLE_RESOURCES.filter((res) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         res.title.toLowerCase().includes(q) ||
//         res.description.toLowerCase().includes(q) ||
//         res.author.toLowerCase().includes(q);

//       const matchesUni = filters.university === "All" || res.university === filters.university;
//       const matchesType = filters.resourceType === "All" || res.category === filters.resourceType;

//       return matchesSearch && matchesUni && matchesType;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Research
//   const filteredResearch = useMemo(() => {
//     return SAMPLE_RESEARCH.filter((res) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         res.title.toLowerCase().includes(q) ||
//         res.abstract.toLowerCase().includes(q) ||
//         res.authors.some((a) => a.toLowerCase().includes(q));

//       const matchesUni = filters.university === "All" || res.university === filters.university;
//       const matchesField = filters.field === "All" || res.field === filters.field;

//       return matchesSearch && matchesUni && matchesField;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Capstone
//   const filteredCapstone = useMemo(() => {
//     return SAMPLE_CAPSTONE.filter((cap) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         cap.title.toLowerCase().includes(q) ||
//         cap.summary.toLowerCase().includes(q) ||
//         cap.sponsor.toLowerCase().includes(q);

//       const matchesUni = filters.university === "All" || cap.university === filters.university;

//       return matchesSearch && matchesUni;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Thesis
//   const filteredThesis = useMemo(() => {
//     return SAMPLE_THESIS.filter((th) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         th.title.toLowerCase().includes(q) ||
//         th.abstract.toLowerCase().includes(q) ||
//         th.author.toLowerCase().includes(q);

//       const matchesUni = filters.university === "All" || th.university === filters.university;
//       const matchesDegree = filters.degree === "All" || th.degree === filters.degree;

//       return matchesSearch && matchesUni && matchesDegree;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Skills
//   const filteredSkills = useMemo(() => {
//     return SAMPLE_SKILLS.filter((sk) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         sk.name.toLowerCase().includes(q) ||
//         sk.description.toLowerCase().includes(q) ||
//         sk.technologies.some((t) => t.toLowerCase().includes(q));

//       const matchesCat = filters.skillCategory === "All" || sk.category === filters.skillCategory;

//       return matchesSearch && matchesCat;
//     });
//   }, [searchQuery, filters]);

//   // Filtered Logic for Questions
//   const filteredQuestions = useMemo(() => {
//     return SAMPLE_QUESTIONS.filter((qs) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         !q ||
//         qs.title.toLowerCase().includes(q) ||
//         qs.snippet.toLowerCase().includes(q) ||
//         qs.tags.some((t) => t.toLowerCase().includes(q));

//       const matchesUni = filters.university === "All" || qs.university === filters.university;
//       const matchesSolved =
//         filters.solvedStatus === "All" ||
//         (filters.solvedStatus === "Solved" && qs.isSolved) ||
//         (filters.solvedStatus === "Unanswered" && !qs.isSolved);

//       return matchesSearch && matchesUni && matchesSolved;
//     });
//   }, [searchQuery, filters]);

//   // Active items array length helper
//   const getActiveItemCount = () => {
//     switch (activeCategory) {
//       case "projects": return filteredProjects.length;
//       case "students": return filteredStudents.length;
//       case "teams": return filteredTeams.length;
//       case "resources": return filteredResources.length;
//       case "research": return filteredResearch.length;
//       case "capstone": return filteredCapstone.length;
//       case "thesis": return filteredThesis.length;
//       case "skills": return filteredSkills.length;
//       case "questions": return filteredQuestions.length;
//       default: return 0;
//     }
//   };

//   // ---------- RESEARCH REPOSITORY LOGIC ----------

//   const openResearchPaper = (paper) => {
//     setSelectedResearchPaper(paper);
//     setSelectedResearchFile({ name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" });
//     setResearchFileSearch("");
//     setAdditionalResearchFiles([]);
//     setIsAddingResearchFile(false);
//     setIsResearchFileTreeOpen(true);
//   };

//   const closeResearchPaper = () => {
//     setSelectedResearchPaper(null);
//     setSelectedResearchFile(null);
//   };

//   // Search: a matching folder keeps all its children, otherwise only matching descendants remain
//   const filterResearchFileTree = (files, parentPath = "") => {
//     const query = researchFileSearch.trim().toLowerCase();
//     if (!query) return files;

//     return files.flatMap((file) => {
//       const path = parentPath ? `${parentPath}/${file.name}` : file.name;
//       const matches = path.toLowerCase().includes(query);
//       if (file.type === "folder") {
//         if (matches) return [file];
//         const children = filterResearchFileTree(file.children || [], path);
//         return children.length > 0 ? [{ ...file, children }] : [];
//       }
//       return matches ? [file] : [];
//     });
//   };

//   const handleAddResearchFile = () => {
//     const name = newResearchFileName.trim();
//     if (!name || name.includes("/") || name.includes("\\")) return;

//     const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "file";
//     const file = { name, type: extension, size: "0 KB", updated: "Just now", path: name };
//     setAdditionalResearchFiles((current) => (current.some((item) => item.name === name) ? current : [...current, file]));
//     setSelectedResearchFile(file);
//     setNewResearchFileName("");
//     setIsAddingResearchFile(false);
//   };

//   const renderResearchFileTree = (files, parentPath = "", depth = 0) =>
//     sortRepositoryEntries(files).map((file) => {
//       const path = parentPath ? `${parentPath}/${file.name}` : file.name;
//       const isFolder = file.type === "folder";
//       const isSelected = !isFolder && selectedResearchFile?.path === path;
//       const isExpanded = isFolder && (Boolean(expandedResearchFolders[path]) || Boolean(researchFileSearch.trim()));

//       return (
//         <Box key={path}>
//           <Box
//             role="treeitem"
//             aria-expanded={isFolder ? isExpanded : undefined}
//             aria-selected={isSelected}
//             onClick={() => {
//               if (isFolder) {
//                 setExpandedResearchFolders((current) => ({ ...current, [path]: !current[path] }));
//               } else {
//                 setSelectedResearchFile({ ...file, path });
//               }
//             }}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.25,
//               pl: 1.5 + depth * 1.75,
//               pr: 1.5,
//               height: 34,
//               mr: 1.5,
//               cursor: "pointer",
//               position: "relative",
//               borderRadius: "6px",
//               fontSize: 14,
//               bgcolor: isSelected ? (theme) => (isDarkTheme(theme) ? "#262c36" : "action.selected") : "transparent",
//               color: "text.primary",
//               "&::before": isSelected
//                 ? {
//                   content: '""',
//                   position: "absolute",
//                   left: -12,
//                   top: 4,
//                   bottom: 4,
//                   width: "4px",
//                   bgcolor: "primary.main",
//                   borderRadius: "2px",
//                 }
//                 : {},
//               "&:hover": { bgcolor: (theme) => (isDarkTheme(theme) ? "#21262d" : "action.hover") },
//             }}
//           >
//             {isFolder ? (
//               isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
//             ) : (
//               <Box sx={{ width: 14, flexShrink: 0 }} />
//             )}
//             {isFolder ? (
//               isExpanded ? (
//                 <FolderOpen size={18} color="#9198a1" fill="#9198a1" fillOpacity={0.85} />
//               ) : (
//                 <Folder size={18} color="#9198a1" fill="#9198a1" fillOpacity={0.85} />
//               )
//             ) : file.type === "md" ? (
//               <FileText size={18} color="#9198a1" />
//             ) : (
//               <File size={18} color="#9198a1" />
//             )}
//             <Typography noWrap sx={{ fontSize: 14, fontWeight: isSelected ? 600 : 400 }}>
//               {file.name}
//             </Typography>
//           </Box>
//           {isFolder && isExpanded && file.children?.length > 0 && renderResearchFileTree(file.children, path, depth + 1)}
//         </Box>
//       );
//     });

//   // Rendered README (markdown preview)
//   const renderReadmePreview = (paper) => (
//     <Box
//       sx={{
//         px: { xs: 2.5, md: 4 },
//         py: { xs: 3, md: 4 },
//         "& h1": { fontSize: { xs: 28, md: 34 }, lineHeight: 1.2, mb: 1.5 },
//         "& h2": { fontSize: { xs: 20, md: 24 }, mt: 4, mb: 1.5, pb: 1, borderBottom: "1px solid", borderColor: lineColor },
//         "& p": { fontSize: 15.5, lineHeight: 1.75 },
//       }}
//     >
//       <Typography component="h1" variant="h3" fontWeight={700}>{paper.title}</Typography>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//         {paper.authors.join(", ")} · {paper.university} · {paper.year}
//       </Typography>
//       <Typography component="h2" variant="h5" fontWeight={700}>Project Overview</Typography>
//       <Typography variant="body1">
//         This repository accompanies the research published in {paper.journal}. It brings together the project notes, source code, data-processing assets, and evaluation materials used to support the study. The files are organized so readers can follow the work from its research question through implementation and reported findings.
//       </Typography>
//       <Typography component="h2" variant="h5" fontWeight={700}>Abstract</Typography>
//       <Typography variant="body1">{paper.abstract}</Typography>
//       <Typography component="h2" variant="h5" fontWeight={700}>Research Goals</Typography>
//       <Box component="ul" sx={{ pl: 3, m: 0 }}>
//         <Typography component="li" sx={{ mb: 0.8 }}>Define a reproducible approach to the problem described in the paper.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Document the assumptions, data preparation, and evaluation choices used in the study.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Make supporting materials understandable and reusable by other student research teams.</Typography>
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Repository Structure</Typography>
//       <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, lineHeight: 1.7, fontFamily: monoFont }}>
//         {`configs/        Experiment configuration files\ndata/           Original and processed research data\ndocs/           Methodology, dataset notes, and citation details\nfigures/        Diagrams and visual summaries\nnotebooks/      Exploratory analysis and evaluation notebooks\nrequirements.txt Python dependencies\nsrc/            Research implementation and model code\ntests/          Data and implementation checks\noutputs/        Experiment summaries and model checkpoints`}
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Methodology</Typography>
//       <Typography variant="body1">
//         The workflow is divided into four stages: source review, data preparation, implementation, and evaluation. Raw inputs are kept separate from processed artifacts so that transformations can be inspected. Experiments should record the dataset version, configuration, random seed, and software environment alongside their outputs.
//       </Typography>
//       <Box component="ol" sx={{ pl: 3, my: 1 }}>
//         <Typography component="li" sx={{ mb: 0.8 }}>Review source material and define inclusion criteria before preparing data.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Apply documented cleaning and normalization steps; retain a record of excluded or changed samples.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Run the implementation using the checked-in configuration and save outputs with descriptive experiment names.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Compare results against the stated baseline and inspect representative errors, not only aggregate scores.</Typography>
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Environment and Reproduction</Typography>
//       <Typography variant="body1">
//         Use a separate virtual environment and record package versions when reproducing the experiments. Large source datasets and trained checkpoints may need to be obtained separately; consult the dataset notes before running any experiment.
//       </Typography>
//       <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, lineHeight: 1.7, fontFamily: monoFont }}>
//         {`python -m venv .venv\n# Activate the environment for your operating system\npip install -r requirements.txt\npython src/train.py --config configs/default.yaml\npython src/evaluate.py --checkpoint outputs/checkpoints/best_model.pt`}
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Evaluation and Findings</Typography>
//       <Typography variant="body1">
//         The paper reports the primary findings and their evaluation protocol. For a fair comparison, use the same data splits and preprocessing configuration, and report the metric definition, sample count, and any variance across repeated runs. The evaluation-results spreadsheet and notebooks contain the supporting breakdowns for review.
//       </Typography>
//       <Box component="ul" sx={{ pl: 3, m: 0 }}>
//         <Typography component="li" sx={{ mb: 0.8 }}>Compare the proposed approach with the baseline described in the paper.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Review performance across relevant data subsets and difficult examples.</Typography>
//         <Typography component="li" sx={{ mb: 0.8 }}>Treat reported scores as study results, not as a guarantee of performance on new data.</Typography>
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Limitations and Future Work</Typography>
//       <Typography variant="body1">
//         Results depend on the coverage and quality of the available data, the selected evaluation protocol, and the assumptions documented by the authors. Further work should test the approach on broader datasets, report additional error analyses, and evaluate how well the findings transfer to other settings.
//       </Typography>
//       <Typography component="h2" variant="h5" fontWeight={700}>Authors</Typography>
//       <Box component="ul" sx={{ pl: 3, m: 0 }}>
//         {paper.authors.map((author) => (
//           <Typography component="li" key={author} sx={{ mb: 0.8 }}>{author}</Typography>
//         ))}
//       </Box>
//       <Typography component="h2" variant="h5" fontWeight={700}>Citation</Typography>
//       <Box component="pre" sx={{ p: 2, borderRadius: "6px", overflowX: "auto", bgcolor: raisedBg, border: "1px solid", borderColor: lineColor, fontSize: 13, whiteSpace: "pre-wrap", fontFamily: monoFont }}>
//         {`${paper.authors.join(", ")}. (${paper.year}). ${paper.title}. ${paper.journal}.`}
//       </Box>
//     </Box>
//   );

//   // Line-numbered source and contributor view
//   const renderCodeLines = (content, paper, file, withBlame) => {
//     const lines = content.replace(/\n$/, "").split("\n");
//     const author = paper.authors[0];
//     return (
//       <Box sx={{ py: 1.5, overflowX: "auto", fontFamily: monoFont, fontSize: 12.5, lineHeight: "20px" }}>
//         {lines.map((text, index) => {
//           const isChunkStart = index % 8 === 0;
//           return (
//             <Box key={index} sx={{ display: "flex", minWidth: "max-content", "&:hover": { bgcolor: (theme) => (isDarkTheme(theme) ? "rgba(110,118,129,0.1)" : "rgba(0,0,0,0.03)") } }}>
//               {withBlame && (
//                 <Box
//                   sx={{
//                     width: 230,
//                     flexShrink: 0,
//                     px: 1.5,
//                     display: "flex",
//                     gap: 1,
//                     color: "text.secondary",
//                     borderRight: "1px solid",
//                     borderColor: subtleLine,
//                     borderTop: isChunkStart && index !== 0 ? "1px solid" : 0,
//                     borderTopColor: subtleLine,
//                   }}
//                 >
//                   {isChunkStart && (
//                     <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{author}</Box>
//                   )}
//                 </Box>
//               )}
//               <Box sx={{ width: 64, flexShrink: 0, pr: 2, textAlign: "right", color: "text.secondary", userSelect: "none" }}>
//                 {index + 1}
//               </Box>
//               <Box component="pre" sx={{ m: 0, pr: 3, fontFamily: "inherit", whiteSpace: "pre", color: "text.primary" }}>
//                 {text || " "}
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>
//     );
//   };

//   // Research project files and document viewer
//   const renderResearchRepository = () => {
//     const paper = selectedResearchPaper;
//     const file = selectedResearchFile || { name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" };
//     const isMarkdown = file.type === "md";
//     const isBinary = BINARY_FILE_TYPES.includes(file.type);
//     const content = isBinary ? "" : buildResearchFileContent(file, paper);
//     const stats = countLines(content);
//     const pathParts = (file.path || file.name).split("/");
//     const shownTree = filterResearchFileTree([...getResearchRepositoryFiles(paper), ...additionalResearchFiles]);
//     const treeWidth = "clamp(260px, 22vw, 320px)";

//     return (
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: isResearchFileTreeOpen ? { xs: "minmax(0, 1fr)", md: `${treeWidth} minmax(0, 1fr)` } : "minmax(0, 1fr)",
//           minHeight: "calc(100vh - 62px)",
//           bgcolor: surfaceBg,
//         }}
//       >
//         {/* ---------- LEFT: FILES PANEL ---------- */}
//         {isResearchFileTreeOpen && (
//           <Box
//             component="aside"
//             aria-label="Research repository files"
//             sx={{
//               borderRight: { md: "1px solid" },
//               borderBottom: { xs: "1px solid", md: 0 },
//               borderColor: lineColor,
//               position: { md: "sticky" },
//               top: 0,
//               alignSelf: "start",
//               height: { xs: "auto", md: "calc(100vh - 62px)" },
//               maxHeight: { xs: "70vh", md: "none" },
//               display: "flex",
//               flexDirection: "column",
//               minHeight: 0,
//             }}
//           >
//             {/* Panel header */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, height: 64, flexShrink: 0 }}>
//               <Tooltip title="Collapse file tree">
//                 <IconButton
//                   aria-label="Hide files panel"
//                   onClick={() => setIsResearchFileTreeOpen(false)}
//                   sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 40, height: 40 }}
//                 >
//                   <PanelLeftClose size={18} />
//                 </IconButton>
//               </Tooltip>
//               <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Files</Typography>
//             </Box>

//             {/* Research files + actions */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, pb: 1.5, flexShrink: 0 }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<BookOpen size={16} />}
//                 sx={{
//                   flex: 1,
//                   minWidth: 0,
//                   height: 40,
//                   justifyContent: "flex-start",
//                   color: "text.primary",
//                   borderColor: lineColor,
//                   bgcolor: raisedBg,
//                   textTransform: "none",
//                   fontWeight: 600,
//                   fontSize: 14,
//                 }}
//               >
//                 Project materials
//               </Button>
//               <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", bgcolor: raisedBg, height: 40 }}>
//                 <Tooltip title="Add research file">
//                   <IconButton
//                     aria-label="Add research file"
//                     onClick={() => setIsAddingResearchFile((open) => !open)}
//                     sx={{ borderRadius: 0, px: 1.1, borderRight: "1px solid", borderColor: lineColor }}
//                   >
//                     <Plus size={18} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Find a research file">
//                   <IconButton aria-label="Search files" onClick={() => researchFileSearchRef.current?.focus()} sx={{ borderRadius: 0, px: 1.1 }}>
//                     <Search size={18} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Go to file */}
//             <Box sx={{ px: 2, pb: 1.5, flexShrink: 0, display: "grid", gap: 1 }}>
//               <OutlinedInput
//                 inputRef={researchFileSearchRef}
//                 fullWidth
//                 size="small"
//                 value={researchFileSearch}
//                 onChange={(event) => setResearchFileSearch(event.target.value)}
//                 placeholder="Find a research file"
//                 startAdornment={<InputAdornment position="start"><Search size={17} /></InputAdornment>}
//                 endAdornment={
//                   researchFileSearch ? (
//                     <IconButton size="small" aria-label="Clear search" onClick={() => setResearchFileSearch("")}>
//                       <RotateCcw size={14} />
//                     </IconButton>
//                   ) : null
//                 }
//                 sx={{ height: 44, fontSize: 15, borderRadius: "6px", bgcolor: surfaceBg, "& fieldset": { borderColor: lineColor } }}
//               />
//               {isAddingResearchFile && (
//                 <OutlinedInput
//                   autoFocus
//                   fullWidth
//                   size="small"
//                   value={newResearchFileName}
//                   onChange={(event) => setNewResearchFileName(event.target.value)}
//                   onKeyDown={(event) => {
//                     if (event.key === "Enter") handleAddResearchFile();
//                     if (event.key === "Escape") setIsAddingResearchFile(false);
//                   }}
//                   placeholder="New file name (e.g. notes.md)"
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton size="small" aria-label="Create file" onClick={handleAddResearchFile}>
//                         <Check size={16} />
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   sx={{ fontSize: 13, "& fieldset": { borderColor: lineColor } }}
//                 />
//               )}
//             </Box>

//             <Divider sx={{ borderColor: lineColor }} />

//             {/* Tree */}
//             <Box role="tree" sx={{ py: 1.25, overflowY: "auto", overscrollBehavior: "contain", flex: 1, minHeight: 0, pl: 1.5 }}>
//               {shownTree.length > 0 ? (
//                 renderResearchFileTree(shownTree)
//               ) : (
//                 <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, py: 1, display: "block" }}>
//                   No matching files
//                 </Typography>
//               )}
//             </Box>
//           </Box>
//         )}

//         {/* ---------- RIGHT: FILE VIEWER ---------- */}
//         <Box component="section" sx={{ minWidth: 0 }}>
//           {/* Breadcrumb bar */}
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: { xs: 2, md: 3 }, height: 64 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0, flex: 1 }}>
//               {!isResearchFileTreeOpen && (
//                 <Tooltip title="Show file tree">
//                   <IconButton
//                     aria-label="Show files panel"
//                     onClick={() => setIsResearchFileTreeOpen(true)}
//                     sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 36, height: 36, mr: 0.75 }}
//                   >
//                     <PanelLeftOpen size={18} />
//                   </IconButton>
//                 </Tooltip>
//               )}
//               <Box
//                 component="button"
//                 type="button"
//                 onClick={closeResearchPaper}
//                 sx={{ all: "unset", cursor: "pointer", flexShrink: 0, fontSize: 20, color: "primary.main", "&:hover": { textDecoration: "underline" } }}
//               >
//                 Research
//               </Box>
//               <Typography sx={{ fontSize: 20, color: "text.secondary" }}>/</Typography>
//               <Typography
//                 noWrap
//                 title={paper.title}
//                 onClick={() => setSelectedResearchFile({ name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" })}
//                 sx={{ fontSize: 20, color: "primary.main", cursor: "pointer", maxWidth: { xs: 120, md: 300 }, flexShrink: 1, "&:hover": { textDecoration: "underline" } }}
//               >
//                 {paper.title}
//               </Typography>
//               {pathParts.map((part, index) => {
//                 const isLast = index === pathParts.length - 1;
//                 return (
//                   <Box key={`${part}-${index}`} sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0, flexShrink: isLast ? 0 : 1 }}>
//                     <Typography sx={{ fontSize: 20, color: "text.secondary" }}>/</Typography>
//                     <Typography noWrap sx={{ fontSize: 20, fontWeight: isLast ? 700 : 400, color: isLast ? "text.primary" : "primary.main" }}>
//                       {part}
//                     </Typography>
//                   </Box>
//                 );
//               })}
//               <Tooltip title="Copy file path">
//                 <IconButton
//                   size="small"
//                   aria-label="Copy file path"
//                   onClick={() => navigator.clipboard?.writeText(`${paper.title}/${file.path || file.name}`)}
//                   sx={{ ml: 0.5 }}
//                 >
//                   <Copy size={18} />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             <Tooltip title="More options">
//               <IconButton aria-label="More options" sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", width: 44, height: 40, bgcolor: raisedBg }}>
//                 <MoreHorizontal size={18} />
//               </IconButton>
//             </Tooltip>
//           </Box>

//           <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
//             {/* Research record metadata */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 flexWrap: "wrap",
//                 gap: 2,
//                 py: 1.5,
//                 mb: 2,
//                 borderBottom: "1px solid",
//                 borderColor: lineColor,
//               }}
//             >
//               <Box sx={{ display: "flex", color: "primary.main" }}><FlaskConical size={21} /></Box>
//               <Box sx={{ minWidth: 0, flex: 1 }}>
//                 <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
//                   Research record
//                 </Typography>
//                 <Typography noWrap sx={{ fontWeight: 600, fontSize: 15 }}>{paper.journal}</Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {paper.field} · {paper.university} · {paper.year}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
//                 <Chip label={paper.status} size="small" variant="outlined" />
//                 <Typography color="text.secondary" sx={{ fontSize: 13 }}>
//                   File updated {file.updated || "recently"}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* File card */}
//             <Box sx={{ border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: surfaceBg }}>
//               {/* Toolbar */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: 1.5,
//                   px: 1.5,
//                   py: 1,
//                   borderBottom: "1px solid",
//                   borderColor: lineColor,
//                   bgcolor: raisedBg,
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, minWidth: 0 }}>
//                   <ToggleButtonGroup
//                     exclusive
//                     size="small"
//                     value={fileViewMode}
//                     onChange={(_, value) => value && setFileViewMode(value)}
//                     aria-label="File view mode"
//                     sx={{
//                       "& .MuiToggleButton-root": {
//                         textTransform: "none",
//                         fontWeight: 600,
//                         fontSize: 15,
//                         px: 2,
//                         py: 0.5,
//                         color: "text.primary",
//                         borderColor: lineColor,
//                       },
//                       "& .Mui-selected": {
//                         bgcolor: (theme) => (isDarkTheme(theme) ? "#0d1117 !important" : "background.paper"),
//                       },
//                     }}
//                   >
//                     {isMarkdown && <ToggleButton value="preview">Read</ToggleButton>}
//                     <ToggleButton value="code">Source</ToggleButton>
//                     <ToggleButton value="blame" disabled={isBinary}>Contributors</ToggleButton>
//                   </ToggleButtonGroup>
//                   <Typography noWrap color="text.secondary" sx={{ fontSize: 13, fontFamily: monoFont }}>
//                     {isBinary ? `Binary file · ${file.size || "0 KB"}` : `${stats.lines} lines (${stats.loc} loc) · ${file.size || "0 KB"}`}
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: raisedBg }}>
//                     <Button
//                       size="small"
//                       disabled={isBinary}
//                       onClick={() => openRawText(content)}
//                       sx={{ ...groupBtnSx, textTransform: "none", fontWeight: 600, px: 1.5 }}
//                     >
//                       Open
//                     </Button>
//                     <Tooltip title="Copy file contents">
//                       <span>
//                         <IconButton disabled={isBinary} aria-label="Copy file contents" onClick={() => navigator.clipboard?.writeText(content)} sx={groupBtnSx}>
//                           <Copy size={17} />
//                         </IconButton>
//                       </span>
//                     </Tooltip>
//                     <Tooltip title="Download file contents">
//                       <span>
//                         <IconButton disabled={isBinary} aria-label="Download file contents" onClick={() => downloadTextFile(file.name, content)} sx={groupBtnSx}>
//                           <Download size={17} />
//                         </IconButton>
//                       </span>
//                     </Tooltip>
//                   </Box>
//                   <Box sx={{ display: "flex", border: "1px solid", borderColor: lineColor, borderRadius: "6px", overflow: "hidden", bgcolor: raisedBg }}>
//                     <Tooltip title="Edit file">
//                       <IconButton aria-label="Edit file" sx={groupBtnSx}>
//                         <Pencil size={17} />
//                       </IconButton>
//                     </Tooltip>
//                     <IconButton aria-label="More edit options" sx={{ ...groupBtnSx, px: 0.6 }}>
//                       <ChevronDown size={15} />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Body */}
//               {isBinary ? (
//                 <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
//                   <File size={36} style={{ opacity: 0.5 }} />
//                   <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>{file.name}</Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
//                     This {file.type.toUpperCase()} file can't be previewed in the browser.
//                   </Typography>
//                   <Button variant="outlined" size="small" startIcon={<Download size={14} />} sx={{ textTransform: "none" }}>
//                     Download ({file.size || "0 KB"})
//                   </Button>
//                 </Box>
//               ) : isMarkdown && fileViewMode === "preview" ? (
//                 file.name === "README.md" ? (
//                   renderReadmePreview(paper)
//                 ) : (
//                   <Box sx={{ px: { xs: 2.5, md: 4 }, py: 4, "& p": { fontSize: 15.5, lineHeight: 1.75 } }}>
//                     {content.split("\n\n").map((block, index) =>
//                       block.startsWith("# ") ? (
//                         <Typography key={index} component="h1" variant="h4" fontWeight={700} sx={{ mb: 2 }}>{block.slice(2)}</Typography>
//                       ) : block.startsWith("## ") ? (
//                         <Typography key={index} component="h2" variant="h5" fontWeight={700} sx={{ mt: 3, mb: 1, pb: 1, borderBottom: "1px solid", borderColor: lineColor }}>{block.slice(3)}</Typography>
//                       ) : (
//                         <Typography key={index} variant="body1" sx={{ whiteSpace: "pre-line", mb: 1 }}>{block}</Typography>
//                       )
//                     )}
//                   </Box>
//                 )
//               ) : (
//                 renderCodeLines(content, paper, file, fileViewMode === "blame")
//               )}
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     );
//   };

//   return (
//     <DashboardLayout
//       user={user}
//       logout={logout}
//       language={language}
//       changeLanguage={changeLanguage}
//       toggleColorMode={toggleColorMode}
//       isDark={isDark}
//     >
//       <Box
//         component="main"
//         sx={{
//           minHeight: "calc(100vh - 62px)",
//           bgcolor: (theme) =>
//             theme.palette.mode === "dark" ? "#0d1117" : "background.default",
//           color: "text.primary",
//           px: 0,
//           pt: selectedResearchPaper ? 0 : 3,
//           pb: selectedResearchPaper ? 0 : 5,
//         }}
//       >
//         <Box sx={{ maxWidth: "none", mx: 0 }}>
//           {/* Research repository viewer takes over the whole page */}
//           {activeCategory === "research" && selectedResearchPaper ? (
//             renderResearchRepository()
//           ) : (
//             <Grid container spacing={0}>
//               {/* LEFT SIDEBAR FILTERS & NAVIGATION */}
//               <Grid
//                 size={{ xs: 12, md: 2.2 }}
//                 sx={{
//                   borderRight: { md: "1px solid" },
//                   borderColor: { md: (theme) => (theme.palette.mode === "dark" ? "#30363d" : "divider") },
//                   minHeight: { md: "calc(100vh - 220px)" },
//                   pr: { xs: 2, md: 4 },
//                   pl: { xs: 2, md: 1.5 },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     bgcolor: (theme) =>
//                       theme.palette.mode === "dark" ? "#0d1117" : "background.paper",
//                     borderRadius: 0,
//                   }}
//                 >
//                   {/* Category Navigation Sidebar List */}
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ px: 1.5, mb: 1, display: "block", letterSpacing: 0.5 }}>
//                       CATEGORIES
//                     </Typography>
//                     <Stack spacing={0.5}>
//                       {CATEGORIES.map((cat) => {
//                         const Icon = cat.icon;
//                         const isActive = activeCategory === cat.id;
//                         return (
//                           <Box
//                             key={cat.id}
//                             onClick={() => setActiveCategory(cat.id)}
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               px: 1.5,
//                               py: 1,
//                               cursor: "pointer",
//                               fontSize: 14,
//                               fontWeight: isActive ? 600 : 400,
//                               borderRadius: "0 6px 6px 0",
//                               bgcolor: isActive
//                                 ? (theme) => (theme.palette.mode === "dark" ? "#161b22" : "action.selected")
//                                 : "transparent",
//                               color: isActive
//                                 ? (theme) => (theme.palette.mode === "dark" ? "#f0f6fc" : "primary.main")
//                                 : "text.secondary",
//                               position: "relative",
//                               "&::before": isActive
//                                 ? {
//                                   content: '""',
//                                   position: "absolute",
//                                   left: 0,
//                                   top: "15%",
//                                   bottom: "15%",
//                                   width: "3px",
//                                   bgcolor: "#f78166",
//                                   borderRadius: "2px",
//                                 }
//                                 : {},
//                               "&:hover": {
//                                 bgcolor: (theme) =>
//                                   theme.palette.mode === "dark" ? "#161b22" : "action.hover",
//                                 color: "text.primary",
//                               },
//                             }}
//                           >
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
//                               <Icon size={16} />
//                               <span>{cat.label}</span>
//                             </Box>
//                             {cat.count !== undefined && (
//                               <Box
//                                 sx={{
//                                   px: 0.8,
//                                   py: 0.1,
//                                   borderRadius: "10px",
//                                   fontSize: 12,
//                                   fontWeight: 500,
//                                   bgcolor: isActive
//                                     ? (theme) => (theme.palette.mode === "dark" ? "rgba(247,129,102,0.2)" : "rgba(25,118,210,0.12)")
//                                     : (theme) => (theme.palette.mode === "dark" ? "rgba(110,118,129,0.2)" : "rgba(0,0,0,0.06)"),
//                                   color: isActive ? (theme) => (theme.palette.mode === "dark" ? "#f78166" : "primary.main") : "text.secondary",
//                                 }}
//                               >
//                                 {cat.count}
//                               </Box>
//                             )}
//                           </Box>
//                         );
//                       })}
//                     </Stack>
//                   </Box>

//                   <Divider sx={{ my: 2, ...dividerSx }} />

//                   {/* Title & Reset */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       px: 1.5,
//                       py: 0.5,
//                       mb: 1.5,
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <Filter size={16} />
//                       <Typography variant="subtitle2" fontWeight={600}>
//                         Filters
//                       </Typography>
//                     </Box>
//                     <IconButton size="small" onClick={handleResetFilters} title="Reset Filters">
//                       <RotateCcw size={14} />
//                     </IconButton>
//                   </Box>

//                   <Stack spacing={2}>
//                     {/* Dynamic Dropdown Filters Based on Active Category */}
//                     <Stack spacing={1.5} sx={{ px: 1 }}>
//                       {/* University Filter Dropdown */}
//                       <FormControl fullWidth size="small">
//                         <InputLabel sx={{ fontSize: 13 }}>University</InputLabel>
//                         <Select
//                           value={filters.university}
//                           label="University"
//                           onChange={(e) => handleFilterChange("university", e.target.value)}
//                           sx={{ fontSize: 13 }}
//                         >
//                           <MenuItem value="All">All Universities</MenuItem>
//                           <MenuItem value="RUPP">RUPP</MenuItem>
//                           <MenuItem value="ITC">ITC</MenuItem>
//                           <MenuItem value="CADT">CADT</MenuItem>
//                         </Select>
//                       </FormControl>
//                       {activeCategory === "projects" && (
//                         <>
//                           <FormControl fullWidth size="small">
//                             <InputLabel sx={{ fontSize: 13 }}>Faculty</InputLabel>
//                             <Select
//                               value={filters.faculty}
//                               label="Faculty"
//                               onChange={(e) => handleFilterChange("faculty", e.target.value)}
//                               sx={{ fontSize: 13 }}
//                             >
//                               <MenuItem value="All">All Faculties</MenuItem>
//                               <MenuItem value="Engineering">Engineering</MenuItem>
//                               <MenuItem value="GIC">GIC</MenuItem>
//                               <MenuItem value="Computer Science">Computer Science</MenuItem>
//                             </Select>
//                           </FormControl>

//                           <FormControl fullWidth size="small">
//                             <InputLabel sx={{ fontSize: 13 }}>Technology</InputLabel>
//                             <Select
//                               value={filters.technology}
//                               label="Technology"
//                               onChange={(e) => handleFilterChange("technology", e.target.value)}
//                               sx={{ fontSize: 13 }}
//                             >
//                               <MenuItem value="All">All Tech Stack</MenuItem>
//                               <MenuItem value="AI">AI / ML</MenuItem>
//                               <MenuItem value="React JS">React JS</MenuItem>
//                               <MenuItem value="Laravel">Laravel</MenuItem>
//                               <MenuItem value="C++">C++ / IoT</MenuItem>
//                             </Select>
//                           </FormControl>

//                           <FormControl fullWidth size="small">
//                             <InputLabel sx={{ fontSize: 13 }}>Project Type</InputLabel>
//                             <Select
//                               value={filters.type}
//                               label="Project Type"
//                               onChange={(e) => handleFilterChange("type", e.target.value)}
//                               sx={{ fontSize: 13 }}
//                             >
//                               <MenuItem value="All">All Types</MenuItem>
//                               <MenuItem value="Course Project">Course Project</MenuItem>
//                               <MenuItem value="Capstone">Capstone</MenuItem>
//                               <MenuItem value="Thesis">Thesis</MenuItem>
//                               <MenuItem value="Research">Research</MenuItem>
//                             </Select>
//                           </FormControl>
//                         </>
//                       )}

//                       {activeCategory === "students" && (
//                         <>
//                           <FormControl fullWidth size="small">
//                             <InputLabel sx={{ fontSize: 13 }}>Faculty</InputLabel>
//                             <Select
//                               value={filters.faculty}
//                               label="Faculty"
//                               onChange={(e) => handleFilterChange("faculty", e.target.value)}
//                               sx={{ fontSize: 13 }}
//                             >
//                               <MenuItem value="All">All Faculties</MenuItem>
//                               <MenuItem value="Engineering">Engineering</MenuItem>
//                               <MenuItem value="GIC">GIC</MenuItem>
//                               <MenuItem value="Computer Science">Computer Science</MenuItem>
//                             </Select>
//                           </FormControl>

//                           <FormControl fullWidth size="small">
//                             <InputLabel sx={{ fontSize: 13 }}>Major</InputLabel>
//                             <Select
//                               value={filters.major}
//                               label="Major"
//                               onChange={(e) => handleFilterChange("major", e.target.value)}
//                               sx={{ fontSize: 13 }}
//                             >
//                               <MenuItem value="All">All Majors</MenuItem>
//                               <MenuItem value="Computer Science">Computer Science</MenuItem>
//                               <MenuItem value="Information Technology">Information Technology</MenuItem>
//                               <MenuItem value="Software Engineering">Software Engineering</MenuItem>
//                             </Select>
//                           </FormControl>
//                         </>
//                       )}

//                       {activeCategory === "teams" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Team Status</InputLabel>
//                           <Select
//                             value={filters.status}
//                             label="Team Status"
//                             onChange={(e) => handleFilterChange("status", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Statuses</MenuItem>
//                             <MenuItem value="Recruiting">Recruiting</MenuItem>
//                             <MenuItem value="Team Full">Team Full</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}

//                       {activeCategory === "resources" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Resource Category</InputLabel>
//                           <Select
//                             value={filters.resourceType}
//                             label="Resource Category"
//                             onChange={(e) => handleFilterChange("resourceType", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Categories</MenuItem>
//                             <MenuItem value="Dataset & Code">Dataset & Code</MenuItem>
//                             <MenuItem value="Study Material">Study Material</MenuItem>
//                             <MenuItem value="Templates">Templates</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}

//                       {activeCategory === "research" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Research Field</InputLabel>
//                           <Select
//                             value={filters.field}
//                             label="Research Field"
//                             onChange={(e) => handleFilterChange("field", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Fields</MenuItem>
//                             <MenuItem value="AI & Computer Vision">AI & Computer Vision</MenuItem>
//                             <MenuItem value="Distributed Systems">Distributed Systems</MenuItem>
//                             <MenuItem value="Cybersecurity & AI">Cybersecurity & AI</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}

//                       {activeCategory === "thesis" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Degree Level</InputLabel>
//                           <Select
//                             value={filters.degree}
//                             label="Degree Level"
//                             onChange={(e) => handleFilterChange("degree", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Degrees</MenuItem>
//                             <MenuItem value="Bachelor's Thesis">Bachelor's Thesis</MenuItem>
//                             <MenuItem value="Master's Thesis">Master's Thesis</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}

//                       {activeCategory === "skills" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Skill Category</InputLabel>
//                           <Select
//                             value={filters.skillCategory}
//                             label="Skill Category"
//                             onChange={(e) => handleFilterChange("skillCategory", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Skill Domains</MenuItem>
//                             <MenuItem value="AI & Data Science">AI & Data Science</MenuItem>
//                             <MenuItem value="Web Development">Web Development</MenuItem>
//                             <MenuItem value="Mobile Dev">Mobile Dev</MenuItem>
//                             <MenuItem value="Cloud & Systems">Cloud & Systems</MenuItem>
//                             <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
//                             <MenuItem value="Design & UX">Design & UX</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}

//                       {activeCategory === "questions" && (
//                         <FormControl fullWidth size="small">
//                           <InputLabel sx={{ fontSize: 13 }}>Question Status</InputLabel>
//                           <Select
//                             value={filters.solvedStatus}
//                             label="Question Status"
//                             onChange={(e) => handleFilterChange("solvedStatus", e.target.value)}
//                             sx={{ fontSize: 13 }}
//                           >
//                             <MenuItem value="All">All Questions</MenuItem>
//                             <MenuItem value="Solved">Solved</MenuItem>
//                             <MenuItem value="Unanswered">Unanswered</MenuItem>
//                           </Select>
//                         </FormControl>
//                       )}
//                     </Stack>
//                   </Stack>
//                 </Box>
//               </Grid>

//               {/* RIGHT COLUMN: RESULTS CONTENT */}
//               <Grid size={{ xs: 12, md: 9.8 }} sx={{ px: { xs: 2, md: 4 } }}>
//                 {/* Header Banner */}
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: 24, md: 28 } }}>
//                     University Ecosystem
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Discover student projects, thesis research, skill groups, academic resources, and peer discussions.
//                   </Typography>
//                 </Box>

//                 {/* Search Bar */}
//                 <Box sx={{ mb: 3 }}>
//                   <OutlinedInput
//                     fullWidth
//                     size="small"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder={`Search ${activeCategory}... (e.g. AI, Khmer OCR, React, RUPP)`}
//                     startAdornment={
//                       <InputAdornment position="start">
//                         <Search size={18} />
//                       </InputAdornment>
//                     }
//                     sx={{
//                       bgcolor: (theme) =>
//                         theme.palette.mode === "dark" ? "#010409" : "background.paper",
//                       borderRadius: "6px",
//                       fontSize: 14,
//                       "& fieldset": { borderColor: (theme) => (theme.palette.mode === "dark" ? "#30363d" : "divider") },
//                     }}
//                   />
//                 </Box>

//                 {/* FLEXBOX TOOLBAR */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     justifyContent: "space-between",
//                     alignItems: { xs: "flex-start", sm: "center" },
//                     gap: 2,
//                     mb: 2,
//                     width: "100%",
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     Showing <strong>{getActiveItemCount()}</strong> result(s) for <strong>{CATEGORIES.find(c => c.id === activeCategory)?.label}</strong>
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       overflowX: "auto",
//                       width: { xs: "100%", sm: "auto" },
//                     }}
//                   >
//                     <Button
//                       size="small"
//                       startIcon={<Flame size={14} />}
//                       onClick={() => handleFilterChange("sort", "popular")}
//                       variant={filters.sort === "popular" ? "contained" : "outlined"}
//                       sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
//                     >
//                       Popular
//                     </Button>
//                     <Button
//                       size="small"
//                       startIcon={<Clock size={14} />}
//                       onClick={() => handleFilterChange("sort", "recent")}
//                       variant={filters.sort === "recent" ? "contained" : "outlined"}
//                       sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
//                     >
//                       Recent
//                     </Button>
//                     <Button
//                       size="small"
//                       startIcon={<TrendingUp size={14} />}
//                       onClick={() => handleFilterChange("sort", "trending")}
//                       variant={filters.sort === "trending" ? "contained" : "outlined"}
//                       sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
//                     >
//                       Trending
//                     </Button>
//                   </Box>
//                 </Box>

//                 {/* PROJECTS TAB */}
//                 {activeCategory === "projects" && (
//                   <Stack spacing={2}>
//                     {filteredProjects.length > 0 ? (
//                       filteredProjects.map((proj) => (
//                         <Card key={proj.id} variant="outlined" sx={cardSx}>
//                           <CardContent sx={{ p: 2.5 }}>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
//                               <Box sx={{ flex: 1 }}>
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
//                                   <Typography
//                                     variant="h6"
//                                     fontWeight={600}
//                                     color="primary.main"
//                                     onClick={() => navigate(`/projects?project=${proj.id}&tab=overview`)}
//                                     sx={{ cursor: "pointer", fontSize: 16, "&:hover": { textDecoration: "underline" } }}
//                                   >
//                                     {proj.title}
//                                   </Typography>
//                                   <Chip
//                                     label={proj.status}
//                                     size="small"
//                                     color={proj.status === "Completed" ? "success" : "warning"}
//                                     variant="outlined"
//                                     sx={{ height: 20, fontSize: 11 }}
//                                   />
//                                 </Box>

//                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
//                                   {proj.description}
//                                 </Typography>
//                               </Box>

//                               <IconButton
//                                 size="small"
//                                 onClick={() => navigate(`/projects?project=${proj.id}&tab=overview`)}
//                               >
//                                 <ExternalLink size={16} />
//                               </IconButton>
//                             </Box>

//                             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
//                               <Chip label={`Uni: ${proj.university}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
//                               <Chip label={proj.faculty} size="small" variant="outlined" sx={{ fontSize: 11 }} />
//                               <Chip label={proj.type} size="small" color="primary" variant="outlined" sx={{ fontSize: 11 }} />
//                               <Chip label={`Tech: ${proj.technology}`} size="small" color="secondary" sx={{ fontSize: 11 }} />
//                             </Box>

//                             <Divider sx={{ mb: 2, ...dividerSx }} />

//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                 <Avatar src={proj.author.avatar} sx={{ width: 20, height: 20, fontSize: 10 }}>
//                                   {proj.author.name.substring(0, 2)}
//                                 </Avatar>
//                                 <Typography variant="caption" color="text.secondary">
//                                   {proj.author.name} • Updated {proj.updatedAt}
//                                 </Typography>
//                               </Box>

//                               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                   <Star size={14} color="#e3b341" />
//                                   <Typography variant="caption" fontWeight={600}>
//                                     {proj.stars}
//                                   </Typography>
//                                 </Box>
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                   <GitFork size={14} />
//                                   <Typography variant="caption" fontWeight={600}>
//                                     {proj.forks}
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                             </Box>
//                           </CardContent>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="projects" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* STUDENTS TAB */}
//                 {activeCategory === "students" && (
//                   <Grid container spacing={2}>
//                     {filteredStudents.length > 0 ? (
//                       filteredStudents.map((st) => (
//                         <Grid size={{ xs: 12, sm: 6 }} key={st.id}>
//                           <Card
//                             variant="outlined"
//                             sx={{
//                               ...cardSx,
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "space-between",
//                               p: 2,
//                             }}
//                           >
//                             <Box>
//                               <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1.5 }}>
//                                 <Avatar sx={{ width: 44, height: 44, bgcolor: "primary.main", fontWeight: 700 }}>
//                                   {st.name.split(" ").map(n => n[0]).join("")}
//                                 </Avatar>
//                                 <Box>
//                                   <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
//                                     {st.name}
//                                   </Typography>
//                                   <Typography variant="caption" color="text.secondary">
//                                     {st.university} • {st.major} ({st.year})
//                                   </Typography>
//                                 </Box>
//                               </Box>

//                               <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>
//                                 {st.bio}
//                               </Typography>

//                               <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
//                                 {st.skills.map((skill) => (
//                                   <Chip key={skill} label={skill} size="small" sx={{ fontSize: 10, height: 20 }} />
//                                 ))}
//                               </Box>
//                             </Box>

//                             <Box>
//                               <Divider sx={{ mb: 1.5, ...dividerSx }} />
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <Typography variant="caption" color="text.secondary">
//                                   <strong>{st.projectsCount}</strong> Projects • <strong>{st.followers}</strong> Followers
//                                 </Typography>
//                                 <Button size="small" variant="contained" startIcon={<UserPlus size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
//                                   Connect
//                                 </Button>
//                               </Box>
//                             </Box>
//                           </Card>
//                         </Grid>
//                       ))
//                     ) : (
//                       <Grid size={{ xs: 12 }}>
//                         <EmptyState category="students" onReset={handleResetFilters} />
//                       </Grid>
//                     )}
//                   </Grid>
//                 )}

//                 {/* TEAMS TAB */}
//                 {activeCategory === "teams" && (
//                   <Stack spacing={2}>
//                     {filteredTeams.length > 0 ? (
//                       filteredTeams.map((team) => (
//                         <Card key={team.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
//                             <Box>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
//                                 <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16 }}>
//                                   {team.name}
//                                 </Typography>
//                                 <Chip
//                                   label={team.status}
//                                   size="small"
//                                   color={team.status === "Recruiting" ? "success" : "default"}
//                                   variant="outlined"
//                                   sx={{ height: 20, fontSize: 11 }}
//                                 />
//                               </Box>
//                               <Typography variant="subtitle2" color="primary.main">
//                                 Project: {team.projectTitle}
//                               </Typography>
//                             </Box>

//                             <Chip label={`Uni: ${team.university}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
//                           </Box>

//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
//                             {team.description}
//                           </Typography>

//                           {team.lookingFor.length > 0 && (
//                             <Box sx={{ mb: 2, p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(31,111,235,0.1)" : "#f0f7ff", borderRadius: "6px" }}>
//                               <Typography variant="caption" fontWeight={600} color="primary.main" sx={{ display: "block", mb: 0.5 }}>
//                                 LOOKING FOR TEAM MEMBERS:
//                               </Typography>
//                               <Stack direction="row" spacing={1} flexWrap="wrap">
//                                 {team.lookingFor.map((role) => (
//                                   <Chip key={role} label={role} size="small" color="primary" sx={{ fontSize: 11, height: 22 }} />
//                                 ))}
//                               </Stack>
//                             </Box>
//                           )}

//                           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
//                             {team.techStack.map((tech) => (
//                               <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ fontSize: 11 }} />
//                             ))}
//                           </Box>

//                           <Divider sx={{ mb: 2, ...dividerSx }} />

//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                               <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 26, height: 26, fontSize: 11 } }}>
//                                 {team.members.map((m, idx) => (
//                                   <Avatar key={idx}>{m.name.substring(0, 2)}</Avatar>
//                                 ))}
//                               </AvatarGroup>
//                               <Typography variant="caption" color="text.secondary">
//                                 {team.members.length} / {team.maxMembers} members • Led by <strong>{team.leader}</strong>
//                               </Typography>
//                             </Box>

//                             <Button
//                               size="small"
//                               variant="contained"
//                               disabled={team.status === "Team Full"}
//                               sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}
//                             >
//                               {team.status === "Team Full" ? "Team Full" : "Apply to Join"}
//                             </Button>
//                           </Box>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="teams" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* RESOURCES TAB */}
//                 {activeCategory === "resources" && (
//                   <Stack spacing={2}>
//                     {filteredResources.length > 0 ? (
//                       filteredResources.map((res) => (
//                         <Card key={res.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
//                                 <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
//                                   {res.title}
//                                 </Typography>
//                                 <Chip label={res.category} size="small" color="secondary" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
//                               </Box>
//                               <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
//                                 Contributed by <strong>{res.author}</strong> ({res.university}) • Format: {res.format}
//                               </Typography>
//                             </Box>

//                             <Button size="small" variant="outlined" startIcon={<Download size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
//                               Download
//                             </Button>
//                           </Box>

//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
//                             {res.description}
//                           </Typography>

//                           <Divider sx={{ mb: 1.5, ...dividerSx }} />

//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="caption" color="text.secondary">
//                               <strong>{res.downloads}</strong> Downloads • <strong>{res.stars}</strong> Stars • Updated {res.updatedAt}
//                             </Typography>
//                             <IconButton size="small">
//                               <Bookmark size={16} />
//                             </IconButton>
//                           </Box>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="resources" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* RESEARCH TAB (list of papers) */}
//                 {activeCategory === "research" && (
//                   <Stack spacing={2}>
//                     {filteredResearch.length > 0 ? (
//                       filteredResearch.map((res) => (
//                         <Card key={res.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, mb: 0.5 }}>
//                                 {res.title}
//                               </Typography>
//                               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
//                                 <Chip label={res.field} size="small" color="primary" sx={{ fontSize: 11, height: 20 }} />
//                                 <Chip label={res.status} size="small" color="success" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                                 <Chip label={`Uni: ${res.university}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                               </Box>
//                             </Box>
//                           </Box>

//                           <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
//                             Authors: <strong>{res.authors.join(", ")}</strong> • Supervisor: <strong>{res.supervisor}</strong> • Journal: <em>{res.journal} ({res.year})</em>
//                           </Typography>

//                           <Box sx={{ p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "#0d1117" : "#f8f9fa", borderRadius: "6px", mb: 2 }}>
//                             <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
//                               ABSTRACT:
//                             </Typography>
//                             <Typography variant="body2" color="text.primary" sx={{ fontSize: 13, fontStyle: "italic" }}>
//                               "{res.abstract}"
//                             </Typography>
//                           </Box>

//                           <Divider sx={{ mb: 1.5, ...dividerSx }} />

//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="caption" color="text.secondary">
//                               Citations: <strong>{res.citations}</strong> • Downloads: <strong>{res.downloads}</strong>
//                             </Typography>
//                             <Stack direction="row" spacing={1}>
//                               <Button
//                                 size="small"
//                                 variant="outlined"
//                                 startIcon={<FileText size={14} />}
//                                 onClick={() => openResearchPaper(res)}
//                                 sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}
//                               >
//                                 Into
//                               </Button>
//                             </Stack>
//                           </Box>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="research" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* CAPSTONE TAB */}
//                 {activeCategory === "capstone" && (
//                   <Stack spacing={2}>
//                     {filteredCapstone.length > 0 ? (
//                       filteredCapstone.map((cap) => (
//                         <Card key={cap.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
//                                 <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
//                                   {cap.title}
//                                 </Typography>
//                                 <Chip label={cap.grade} size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
//                               </Box>
//                               <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
//                                 University: <strong>{cap.university}</strong> ({cap.year}) • Industry Sponsor: <strong>{cap.sponsor}</strong>
//                               </Typography>
//                             </Box>

//                             <Button size="small" variant="outlined" startIcon={<Globe size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
//                               Live Demo
//                             </Button>
//                           </Box>

//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
//                             {cap.summary}
//                           </Typography>

//                           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
//                             {cap.techStack.map((tech) => (
//                               <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ fontSize: 11 }} />
//                             ))}
//                           </Box>

//                           <Divider sx={{ mb: 1.5, ...dividerSx }} />

//                           <Typography variant="caption" color="text.secondary">
//                             Team Members: <strong>{cap.team.join(", ")}</strong> • Advisor: <strong>{cap.advisor}</strong>
//                           </Typography>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="capstone" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* THESIS TAB */}
//                 {activeCategory === "thesis" && (
//                   <Stack spacing={2}>
//                     {filteredThesis.length > 0 ? (
//                       filteredThesis.map((th) => (
//                         <Card key={th.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, mb: 0.5 }}>
//                                 {th.title}
//                               </Typography>
//                               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
//                                 <Chip label={th.degree} size="small" color="secondary" sx={{ fontSize: 11, height: 20 }} />
//                                 <Chip label={th.defenseStatus} size="small" color="success" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                                 <Chip label={`Uni: ${th.university}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                               </Box>
//                             </Box>
//                           </Box>

//                           <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
//                             Candidate: <strong>{th.author}</strong> • Thesis Advisor: <strong>{th.advisor}</strong> ({th.year})
//                           </Typography>

//                           <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
//                             "{th.abstract}"
//                           </Typography>

//                           <Divider sx={{ mb: 1.5, ...dividerSx }} />

//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="caption" color="text.secondary">
//                               Citations: <strong>{th.citations}</strong> • PDF Downloads: <strong>{th.downloads}</strong>
//                             </Typography>
//                             <Button size="small" variant="outlined" startIcon={<Download size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
//                               Download Thesis
//                             </Button>
//                           </Box>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="thesis" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}

//                 {/* SKILLS TAB */}
//                 {activeCategory === "skills" && (
//                   <Grid container spacing={2}>
//                     {filteredSkills.length > 0 ? (
//                       filteredSkills.map((sk) => (
//                         <Grid size={{ xs: 12, sm: 6 }} key={sk.id}>
//                           <Card
//                             variant="outlined"
//                             sx={{
//                               ...cardSx,
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "space-between",
//                               p: 2.5,
//                             }}
//                           >
//                             <Box>
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
//                                 <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
//                                   {sk.name}
//                                 </Typography>
//                                 <Chip label={sk.category} size="small" color="secondary" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
//                               </Box>

//                               <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
//                                 {sk.description}
//                               </Typography>

//                               <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
//                                 {sk.technologies.map((t) => (
//                                   <Chip key={t} label={t} size="small" sx={{ fontSize: 11, height: 20 }} />
//                                 ))}
//                               </Box>
//                             </Box>

//                             <Box>
//                               <Divider sx={{ mb: 1.5, ...dividerSx }} />
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <Typography variant="caption" color="text.secondary">
//                                   <strong>{sk.learnersCount}</strong> Learners • <strong>{sk.projectsCount}</strong> Projects
//                                 </Typography>
//                                 <Button size="small" variant="contained" sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
//                                   Join Group
//                                 </Button>
//                               </Box>
//                             </Box>
//                           </Card>
//                         </Grid>
//                       ))
//                     ) : (
//                       <Grid size={{ xs: 12 }}>
//                         <EmptyState category="skills" onReset={handleResetFilters} />
//                       </Grid>
//                     )}
//                   </Grid>
//                 )}

//                 {/* QUESTIONS TAB */}
//                 {activeCategory === "questions" && (
//                   <Stack spacing={2}>
//                     {filteredQuestions.length > 0 ? (
//                       filteredQuestions.map((qs) => (
//                         <Card key={qs.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
//                                 {qs.isSolved ? (
//                                   <Chip icon={<CheckCircle2 size={12} />} label="Solved" size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
//                                 ) : (
//                                   <Chip label="Unanswered" size="small" color="warning" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                                 )}
//                                 <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
//                                   {qs.title}
//                                 </Typography>
//                               </Box>

//                               <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>
//                                 {qs.snippet}
//                               </Typography>
//                             </Box>
//                           </Box>

//                           <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 2 }}>
//                             {qs.tags.map((tag) => (
//                               <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
//                             ))}
//                           </Box>

//                           <Divider sx={{ mb: 1.5, ...dividerSx }} />

//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="caption" color="text.secondary">
//                               Asked by <strong>{qs.author.name}</strong> ({qs.university}) • {qs.time}
//                             </Typography>

//                             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <ThumbsUp size={14} />
//                                 <Typography variant="caption" fontWeight={600}>{qs.votes}</Typography>
//                               </Box>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <MessageSquare size={14} />
//                                 <Typography variant="caption" fontWeight={600}>{qs.answers} answers</Typography>
//                               </Box>
//                             </Box>
//                           </Box>
//                         </Card>
//                       ))
//                     ) : (
//                       <EmptyState category="questions" onReset={handleResetFilters} />
//                     )}
//                   </Stack>
//                 )}
//               </Grid>
//             </Grid>
//           )}
//         </Box>
//       </Box>
//     </DashboardLayout>
//   );
// }

// // Helper component for Empty Search State
// function EmptyState({ category, onReset }) {
//   return (
//     <Card
//       variant="outlined"
//       sx={{
//         p: 5,
//         textAlign: "center",
//         bgcolor: (theme) =>
//           theme.palette.mode === "dark" ? "#161b22" : "background.paper",
//         borderColor: (theme) =>
//           theme.palette.mode === "dark" ? "#30363d" : "divider",
//         borderRadius: "6px",
//       }}
//     >
//       <FolderGit2 size={40} style={{ opacity: 0.5, marginBottom: 12 }} />
//       <Typography variant="h6" color="text.secondary" gutterBottom>
//         No {category} found matching your filter criteria
//       </Typography>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//         Try adjusting your search query or clear your active filters.
//       </Typography>
//       <Button variant="outlined" size="small" onClick={onReset}>
//         Reset All Filters
//       </Button>
//     </Card>
//   );
// }
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  OutlinedInput,
  InputAdornment,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  Divider,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search,
  FolderGit2,
  Users,
  UserCheck,
  BookOpen,
  FlaskConical,
  Award,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Filter,
  RotateCcw,
  Star,
  GitFork,
  ExternalLink,
  Flame,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  ThumbsUp,
  Bookmark,
  Download,
  ChevronDown,
  ChevronRight,
  Copy,
  Plus,
  Globe,
  FileText,
  File,
  Folder,
  FolderOpen,
  UserPlus,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  MoreHorizontal,
  GitBranch,
  History as HistoryIcon,
} from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import { useCommunityResources } from "../store/communityStore";

// --- SHARED STYLE HELPERS (GitHub-like palette) ---
const isDarkTheme = (theme) => theme.palette.mode === "dark";
const surfaceBg = (theme) => (isDarkTheme(theme) ? "#0d1117" : "background.paper");
const raisedBg = (theme) => (isDarkTheme(theme) ? "#161b22" : "#f6f8fa");
const lineColor = (theme) => (isDarkTheme(theme) ? "#30363d" : "divider");
const subtleLine = (theme) => (isDarkTheme(theme) ? "#21262d" : "divider");

const cardSx = {
  bgcolor: (theme) => (isDarkTheme(theme) ? "#161b22" : "background.paper"),
  borderColor: (theme) => (isDarkTheme(theme) ? "#30363d" : "divider"),
  borderRadius: "6px",
  "&:hover": { borderColor: "primary.main" },
};

const dividerSx = { borderColor: subtleLine };

const monoFont = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

// --- EXPLORE CATEGORIES ---
const CATEGORIES = [
  { id: "projects", label: "Projects", icon: FolderGit2, count: 128 },
  { id: "students", label: "Students", icon: UserCheck, count: 450 },
  { id: "teams", label: "Teams", icon: Users, count: 64 },
  { id: "resources", label: "Resources", icon: BookOpen, count: 89 },
  { id: "research", label: "Research", icon: FlaskConical, count: 32 },
  { id: "capstone", label: "Capstone", icon: GraduationCap, count: 45 },
  { id: "thesis", label: "Thesis", icon: Award, count: 21 },
  { id: "skills", label: "Skills", icon: Sparkles, count: 110 },
  { id: "questions", label: "Questions", icon: HelpCircle, count: 210 },
];

// --- SAMPLE DATASETS FOR ALL TABS ---

const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: "AI Study Assistant",
    description: "An intelligent learning companion tailored for university students using LLMs to synthesize lecture slides and generate interactive quizzes.",
    university: "RUPP",
    faculty: "Engineering",
    major: "Computer Science",
    course: "Artificial Intelligence",
    year: "Year 4",
    technology: "AI",
    status: "Completed",
    type: "Capstone",
    stars: 142,
    forks: 38,
    author: { name: "Rim Narong", avatar: "" },
    updatedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Smart Campus POS & Kiosk System",
    description: "Logic Integrated Kiosk Application (LIKA) designed for managing university cafeteria rentals, automated payments, and inventory.",
    university: "RUPP",
    faculty: "Engineering",
    major: "Information Technology",
    course: "Software Engineering",
    year: "Year 3",
    technology: "React JS",
    status: "In Progress",
    type: "Course Project",
    stars: 98,
    forks: 19,
    author: { name: "Sokha Chan", avatar: "" },
    updatedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Khmer OCR Engine",
    description: "Deep learning OCR system optimized for digitized historical Khmer manuscripts and printed academic research papers.",
    university: "ITC",
    faculty: "GIC",
    major: "Computer Science",
    course: "Machine Learning",
    year: "Year 4",
    technology: "AI",
    status: "Completed",
    type: "Thesis",
    stars: 215,
    forks: 54,
    author: { name: "Vannak Keo", avatar: "" },
    updatedAt: "1 week ago",
  },
  {
    id: 4,
    title: "University Chatbot System",
    description: "An automated multi-lingual RAG chatbot answering enrollment inquiries, course prerequisites, and campus navigation queries.",
    university: "CADT",
    faculty: "Computer Science",
    major: "Software Engineering",
    course: "Natural Language Processing",
    year: "Year 3",
    technology: "AI",
    status: "In Progress",
    type: "Research",
    stars: 76,
    forks: 12,
    author: { name: "Dara Sam", avatar: "" },
    updatedAt: "Just now",
  },
  {
    id: 5,
    title: "IoT Smart Agriculture Monitor",
    description: "Sensor node network using LoRaWAN to monitor soil moisture, temperature, and automated irrigation in greenhouse labs.",
    university: "ITC",
    faculty: "Engineering",
    major: "Information Technology",
    course: "IoT & Embedded Systems",
    year: "Year 4",
    technology: "C++",
    status: "Completed",
    type: "Capstone",
    stars: 112,
    forks: 27,
    author: { name: "Sophea Leng", avatar: "" },
    updatedAt: "3 days ago",
  },
  {
    id: 6,
    title: "Student Skill & Peer Tutoring Portal",
    description: "Peer-to-peer mentoring platform matching senior students with juniors for code reviews, math tutoring, and exam preparation.",
    university: "RUPP",
    faculty: "Engineering",
    major: "Computer Science",
    course: "Web Development",
    year: "Year 2",
    technology: "Laravel",
    status: "In Progress",
    type: "Course Project",
    stars: 64,
    forks: 11,
    author: { name: "Votey Seng", avatar: "" },
    updatedAt: "Yesterday",
  }
];

const SAMPLE_STUDENTS = [
  {
    id: 101,
    name: "Rim Narong",
    university: "RUPP",
    faculty: "Engineering",
    major: "Computer Science",
    year: "Year 4",
    avatar: "",
    bio: "Building AI tools for Khmer NLP processing and student study assistance. Passionate about machine learning & open-source.",
    skills: ["AI / ML", "Python", "React JS", "FastAPI"],
    projectsCount: 12,
    followers: 148,
    status: "Available for Team",
    github: "github.com/rimnarong",
  },
  {
    id: 102,
    name: "Sokha Chan",
    university: "RUPP",
    faculty: "Engineering",
    major: "Information Technology",
    year: "Year 3",
    avatar: "",
    bio: "Full-stack developer focused on cafeteria POS systems and microservices. Love building clean web interfaces with MUI & Vite.",
    skills: ["React JS", "Node.js", "PostgreSQL", "Docker"],
    projectsCount: 8,
    followers: 92,
    status: "Open to Collaborate",
    github: "github.com/sokhachan",
  },
  {
    id: 103,
    name: "Vannak Keo",
    university: "ITC",
    faculty: "GIC",
    major: "Computer Science",
    year: "Year 4",
    avatar: "",
    bio: "Computer Vision & Deep Learning enthusiast. Working on Khmer historical manuscript digitizing OCR research paper.",
    skills: ["PyTorch", "OpenCV", "Python", "C++"],
    projectsCount: 15,
    followers: 210,
    status: "Working on Thesis",
    github: "github.com/vannakkeo",
  },
  {
    id: 104,
    name: "Sophea Leng",
    university: "ITC",
    faculty: "Engineering",
    major: "Information Technology",
    year: "Year 4",
    avatar: "",
    bio: "Embedded systems engineer & IoT maker. Focused on LoRaWAN smart agriculture and campus solar power monitoring.",
    skills: ["IoT", "C++", "Python", "MQTT", "React"],
    projectsCount: 9,
    followers: 115,
    status: "Looking for Capstone Team",
    github: "github.com/sophealeng",
  },
  {
    id: 105,
    name: "Dara Sam",
    university: "CADT",
    faculty: "Computer Science",
    major: "Software Engineering",
    year: "Year 3",
    avatar: "",
    bio: "NLP researcher and backend software engineer. Building multilingual university chatbot systems.",
    skills: ["AI / ML", "Python", "LangChain", "Next.js"],
    projectsCount: 7,
    followers: 88,
    status: "Available for Team",
    github: "github.com/darasam",
  },
  {
    id: 106,
    name: "Votey Seng",
    university: "RUPP",
    faculty: "Engineering",
    major: "Computer Science",
    year: "Year 2",
    avatar: "",
    bio: "UI/UX designer & frontend developer crafting student marketplace portals and design systems.",
    skills: ["Figma", "React JS", "Tailwind CSS", "UI/UX"],
    projectsCount: 6,
    followers: 75,
    status: "Open to Collaborate",
    github: "github.com/voteyseng",
  },
];

const SAMPLE_TEAMS = [
  {
    id: 201,
    name: "Khmer Vision AI Lab",
    projectTitle: "Khmer Document OCR & Historical Manuscript Scanner",
    university: "ITC",
    type: "Thesis / Capstone",
    leader: "Vannak Keo",
    members: [
      { name: "Vannak Keo" },
      { name: "Rim Narong" },
      { name: "Dara Sam" },
    ],
    maxMembers: 5,
    lookingFor: ["UI/UX Designer", "Mobile Dev (Flutter)"],
    techStack: ["PyTorch", "OpenCV", "FastAPI", "Flutter"],
    description: "Developing offline-capable deep learning OCR models to preserve ancient palm-leaf manuscripts into searchables text.",
    status: "Recruiting",
  },
  {
    id: 202,
    name: "Smart Campus POS Developers",
    projectTitle: "LIKA University Cafeteria & Kiosk Solution",
    university: "RUPP",
    type: "Course Project",
    leader: "Sokha Chan",
    members: [
      { name: "Sokha Chan" },
      { name: "Votey Seng" },
      { name: "Rithy Heng" },
      { name: "Bora Kim" },
    ],
    maxMembers: 4,
    lookingFor: [],
    techStack: ["React JS", "MUI", "Node.js", "PostgreSQL"],
    description: "All-in-one payment management system for university cafeteria vendors with real-time sales reporting and student NFC meal cards.",
    status: "Team Full",
  },
  {
    id: 203,
    name: "EcoCampus IoT Mesh",
    projectTitle: "Real-time Campus Energy & Microgrid Monitor",
    university: "ITC",
    type: "Research",
    leader: "Sophea Leng",
    members: [
      { name: "Sophea Leng" },
      { name: "Chea Vanna" },
    ],
    maxMembers: 4,
    lookingFor: ["Backend Engineer (Go)", "Data Analyst"],
    techStack: ["C++", "LoRaWAN", "Go", "Grafana"],
    description: "Installing wireless sensor nodes across campus buildings to optimize air conditioning and solar panel electricity distribution.",
    status: "Recruiting",
  },
  {
    id: 204,
    name: "Cambodia Student Peer Hub",
    projectTitle: "University Knowledge Exchange & Mentorship Network",
    university: "CADT",
    type: "Capstone",
    leader: "Dara Sam",
    members: [
      { name: "Dara Sam" },
      { name: "Votey Seng" },
      { name: "Maly Meas" },
    ],
    maxMembers: 5,
    lookingFor: ["DevOps Engineer", "QA Tester"],
    techStack: ["Next.js", "NestJS", "Docker", "Tailwind"],
    description: "Connecting senior mentors with underclassmen across CADT, RUPP, and ITC for course tutoring and capstone team formation.",
    status: "Recruiting",
  }
];

const SAMPLE_RESOURCES = [
  {
    id: 301,
    title: "Khmer NLP Pre-trained Word Tokenizer & Dictionary",
    category: "Dataset & Code",
    type: "Code Repository",
    format: "Python Package / Zip",
    university: "CADT",
    author: "Dr. Chea Vanna & Research Lab",
    downloads: 1420,
    stars: 320,
    description: "Comprehensive open-source dictionary corpus and deep-learning segmentation model for Khmer language tokenization.",
    updatedAt: "2 weeks ago",
  },
  {
    id: 302,
    title: "Data Structures & Algorithms Khmer Course Handbook",
    category: "Study Material",
    type: "Textbook / Guide",
    format: "PDF Document",
    university: "RUPP",
    author: "Prof. Heng Piseth",
    downloads: 3890,
    stars: 540,
    description: "A 280-page illustrated guide explaining Trees, Graphs, Sorting, and Dynamic Programming with code snippets in C++ and Python.",
    updatedAt: "1 month ago",
  },
  {
    id: 303,
    title: "Full-Stack Web Dev Starter Template 2026",
    category: "Templates",
    type: "Project Template",
    format: "GitHub Repo",
    university: "ITC",
    author: "Sokha Chan",
    downloads: 890,
    stars: 175,
    description: "React 19 + Vite + MUI + Express + PostgreSQL preconfigured with authentication, dark mode support, and Docker compose files.",
    updatedAt: "3 days ago",
  },
  {
    id: 304,
    title: "University Senior Capstone & Thesis Defense Presentation Slides",
    category: "Templates",
    type: "Slide Deck",
    format: "PPTX / Figma",
    university: "RUPP",
    author: "Academic Steering Committee",
    downloads: 2450,
    stars: 410,
    description: "Official 16:9 presentation template adhering to university defense standards, rubric charts, and project architecture diagrams.",
    updatedAt: "Just now",
  }
];

const SAMPLE_RESEARCH = [
  {
    id: 401,
    title: "Deep Transformer Architectures for Digitizing Historical Khmer Inscriptions",
    field: "AI & Computer Vision",
    university: "ITC",
    journal: "IEEE ASEAN Computing & Tech Transactions",
    year: 2025,
    status: "Published",
    authors: ["Vannak Keo", "Dr. Seng Rathny"],
    supervisor: "Dr. Seng Rathny",
    citations: 42,
    downloads: 650,
    abstract: "We introduce a novel Transformer OCR architecture specifically fine-tuned on degraded 10th-century Khmer stone inscriptions, achieving 94.2% character recognition accuracy under extreme noise conditions.",
  },
  {
    id: 402,
    title: "Scalable Event-Driven Microservices for University Administrative Portals",
    field: "Distributed Systems",
    university: "RUPP",
    journal: "Journal of Systems & Software Research",
    year: 2026,
    status: "Pre-print",
    authors: ["Rim Narong", "Dara Sam", "Prof. Khem Sok"],
    supervisor: "Prof. Khem Sok",
    citations: 18,
    downloads: 310,
    abstract: "This paper evaluates load balancing, redis caching, and Kafka message queuing under heavy concurrent student registration spikes at regional Cambodian universities.",
  },
  {
    id: 403,
    title: "Privacy-Preserving Federated Learning for Multi-University Research Datasets",
    field: "Cybersecurity & AI",
    university: "CADT",
    journal: "International Higher Ed Tech Review",
    year: 2025,
    status: "Published",
    authors: ["Chhan Maly", "Votey Seng", "Dr. Meas Chan"],
    supervisor: "Dr. Meas Chan",
    citations: 29,
    downloads: 480,
    abstract: "A decentralized machine learning framework that enables cross-institutional AI model training without exposing sensitive student personal identifiable information (PII).",
  }
];

const SAMPLE_CAPSTONE = [
  {
    id: 501,
    title: "AI-Powered Automated Code Reviewer & Grader for Computer Science Labs",
    university: "RUPP",
    sponsor: "Khmer Coders Guild",
    team: ["Rim Narong", "Sokha Chan"],
    advisor: "Dr. Khem Sovann",
    grade: "Distinction (A+)",
    year: 2026,
    demoUrl: "https://code-grade.demo.kh",
    techStack: ["Python", "Docker", "React", "FastAPI"],
    summary: "Automated sandboxed unit testing, code complexity analysis, and anti-plagiarism scanning system built for RUPP lab instructors.",
  },
  {
    id: 502,
    title: "Smart Solar Campus Microgrid & Telemetry Monitoring Portal",
    university: "ITC",
    sponsor: "EDC Innovation Hub",
    team: ["Sophea Leng", "Borith Sovann"],
    advisor: "Prof. Nguon Kim",
    grade: "Grade A",
    year: 2025,
    demoUrl: "https://smartgrid.itc.edu.kh",
    techStack: ["IoT", "React", "Express", "InfluxDB"],
    summary: "Real-time power generation tracking, battery health prognosis, and automated alert system installed across ITC solar rooftops.",
  },
  {
    id: 503,
    title: "Offline-First Electronic Health Records for Rural Health Clinics",
    university: "CADT",
    sponsor: "Ministry of Telecom & Health",
    team: ["Dara Sam", "Votey Seng"],
    advisor: "Dr. Chea Vana",
    grade: "Distinction (A+)",
    year: 2026,
    demoUrl: "https://e-health.cadt.edu.kh",
    techStack: ["React Native", "CouchDB", "Node.js"],
    summary: "Mobile clinic synchronization application enabling healthcare workers in remote provinces to log patient records without cellular internet.",
  }
];

const SAMPLE_THESIS = [
  {
    id: 601,
    title: "Neural Machine Translation Strategies for Khmer-English Academic & Legal Texts",
    degree: "Master's Thesis",
    university: "ITC",
    author: "Vannak Keo",
    advisor: "Prof. Dr. Seng Rathny",
    defenseStatus: "Defended (Honors)",
    year: 2025,
    citations: 56,
    downloads: 830,
    abstract: "Investigating subword tokenization strategies, back-translation data augmentation, and domain-specific vocabulary alignment for Khmer technical academic translation precision.",
  },
  {
    id: 602,
    title: "Zero-Trust Vulnerability Analysis in Distributed University Cloud Networks",
    degree: "Bachelor's Thesis",
    university: "CADT",
    author: "Borith Sovann",
    advisor: "Prof. Touch Sok",
    defenseStatus: "Defended",
    year: 2025,
    citations: 24,
    downloads: 410,
    abstract: "Assessing zero-day exploit threat vectors, container runtime isolation, and automated penetration testing pipelines across university campus cloud infrastructure.",
  },
  {
    id: 603,
    title: "Graph Neural Network Embeddings for Academic Advisor & Thesis Matching",
    degree: "Master's Thesis",
    university: "RUPP",
    author: "Leakhena Peou",
    advisor: "Dr. Heng Piseth",
    defenseStatus: "Defense Scheduled",
    year: 2026,
    citations: 12,
    downloads: 215,
    abstract: "Constructing student interest vector embeddings mapped against professor publication graphs to optimize thesis supervisor assignments and reduce student dropouts.",
  }
];

const SAMPLE_SKILLS = [
  {
    id: 701,
    name: "AI & Machine Learning",
    category: "AI & Data Science",
    learnersCount: 340,
    projectsCount: 42,
    topStudents: ["Rim Narong", "Vannak Keo", "Chhan Maly"],
    technologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV"],
    description: "Master machine learning algorithms, deep neural networks, computer vision, and Khmer natural language processing models.",
  },
  {
    id: 702,
    name: "Full-Stack Web Development",
    category: "Web Development",
    learnersCount: 510,
    projectsCount: 78,
    topStudents: ["Sokha Chan", "Votey Seng", "Dara Sam"],
    technologies: ["React 19", "Next.js", "TypeScript", "Node.js"],
    description: "Build reactive single page applications, RESTful and GraphQL APIs, and responsive design systems with Material UI & Tailwind.",
  },
  {
    id: 703,
    name: "Mobile Application Engineering",
    category: "Mobile Dev",
    learnersCount: 280,
    projectsCount: 35,
    topStudents: ["Sophea Leng", "Dara Sam"],
    technologies: ["Flutter", "Dart", "React Native", "Expo"],
    description: "Develop cross-platform iOS and Android apps with offline caching, push notifications, and native hardware integration.",
  },
  {
    id: 704,
    name: "Cloud Architecture & DevOps",
    category: "Cloud & Systems",
    learnersCount: 190,
    projectsCount: 23,
    topStudents: ["Borith Sovann", "Rim Narong"],
    technologies: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
    description: "Containerize applications, automate CI/CD delivery pipelines, and orchestrate scalable cloud services.",
  },
  {
    id: 705,
    name: "Cybersecurity & Network Defense",
    category: "Cybersecurity",
    learnersCount: 215,
    projectsCount: 18,
    topStudents: ["Borith Sovann"],
    technologies: ["Wireshark", "Metasploit", "Linux", "Ethical Hacking"],
    description: "Conduct network penetration tests, vulnerability audits, zero-trust network configurations, and defensive secure coding.",
  },
  {
    id: 706,
    name: "UI/UX & Product Design",
    category: "Design & UX",
    learnersCount: 320,
    projectsCount: 45,
    topStudents: ["Votey Seng"],
    technologies: ["Figma", "User Research", "Wireframing", "Prototyping"],
    description: "Create human-centered user interfaces, interactive Figma prototypes, design tokens, and user flow architectures.",
  }
];

const SAMPLE_QUESTIONS = [
  {
    id: 801,
    title: "How to properly configure PyTorch GPU acceleration on Windows for Khmer OCR training?",
    author: { name: "Sophea Leng", avatar: "" },
    university: "RUPP",
    votes: 24,
    answers: 5,
    isSolved: true,
    time: "3 hours ago",
    tags: ["PyTorch", "CUDA", "AI / ML"],
    snippet: "I am getting CUDA out of memory error when loading the pre-trained weights for Khmer character embeddings. Has anyone fixed batch size parameters on RTX GPUs?",
  },
  {
    id: 802,
    title: "What are the best practices for structuring a Capstone Monorepo with React 19 and FastAPI?",
    author: { name: "Dara Sam", avatar: "" },
    university: "CADT",
    votes: 18,
    answers: 3,
    isSolved: true,
    time: "1 day ago",
    tags: ["React", "FastAPI", "Capstone"],
    snippet: "Should we keep frontend and backend in separate git repositories or use TurboRepo? What CI/CD pipeline setup works best for RUPP server deployments?",
  },
  {
    id: 803,
    title: "Key curriculum differences between GIC and CS major at ITC for Year 3 research track?",
    author: { name: "Borith Sovann", avatar: "" },
    university: "ITC",
    votes: 12,
    answers: 4,
    isSolved: false,
    time: "2 days ago",
    tags: ["Curriculum", "ITC", "Research"],
    snippet: "I am selecting my elective specialization modules for Year 3. Which track offers more practical machine learning laboratory hours and thesis guidance?",
  },
  {
    id: 804,
    title: "How to implement JWT authentication securely in Next.js 15 App Router with HttpOnly cookies?",
    author: { name: "Votey Seng", avatar: "" },
    university: "RUPP",
    votes: 31,
    answers: 8,
    isSolved: true,
    time: "4 days ago",
    tags: ["Next.js", "Auth", "Security"],
    snippet: "Should access tokens be stored in HttpOnly cookies or SessionStorage when communicating with an external Express REST API server?",
  }
];

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

// Download helper for resources (uploaded files keep their contents when small enough)
const downloadResource = (res) => {
  const link = document.createElement("a");
  if (res.dataUrl) {
    link.href = res.dataUrl;
    link.download = res.fileName || res.title;
    link.click();
    return;
  }
  const isRepo = res.kind === "repo";
  const text = isRepo
    ? `# ${res.title}\n\n${res.description}\n\n- Field: ${res.field || "Research"}\n- University: ${res.university}\n- Author: ${res.author}\n${res.tags?.length ? `- Topics: ${res.tags.join(", ")}\n` : ""}`
    : `${res.title}\n\n${res.description}\n\n(File contents are not available in this demo.)`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = isRepo ? "README.md" : `${res.fileName || res.title}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function ExplorePage() {
  const { user, logout, language, changeLanguage } = useAuth();
  const { toggleColorMode, isDark } = useThemeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const communityResources = useCommunityResources();

  // Active Category & Search
  const initialCategory = searchParams.get("tab") || "projects";
  const [activeCategory, setActiveCategoryState] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  // Research repository viewer state
  const [selectedResearchPaper, setSelectedResearchPaper] = useState(null);
  const [selectedResearchFile, setSelectedResearchFile] = useState(null);
  const [expandedResearchFolders, setExpandedResearchFolders] = useState({ src: true });
  const [isResearchFileTreeOpen, setIsResearchFileTreeOpen] = useState(true);
  const [researchFileSearch, setResearchFileSearch] = useState("");
  const [isAddingResearchFile, setIsAddingResearchFile] = useState(false);
  const [newResearchFileName, setNewResearchFileName] = useState("");
  const [additionalResearchFiles, setAdditionalResearchFiles] = useState([]);
  const [fileViewMode, setFileViewMode] = useState("preview"); // preview | code | blame
  const researchFileSearchRef = useRef(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeCategory) {
      setActiveCategoryState(tabParam);
    }
  }, [searchParams]);

  // Reset view mode whenever another file is opened
  useEffect(() => {
    if (!selectedResearchFile) return;
    setFileViewMode(selectedResearchFile.type === "md" ? "preview" : "code");
  }, [selectedResearchFile?.path]);

  // GitHub-style "T" shortcut: jump to the file search box
  useEffect(() => {
    if (!selectedResearchPaper) return undefined;
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
  }, [selectedResearchPaper]);

  const setActiveCategory = (catId) => {
    setActiveCategoryState(catId);
    setSelectedResearchPaper(null);
    setSelectedResearchFile(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", catId);
    setSearchParams(newParams, { replace: true });
  };

  // Filter States
  const [filters, setFilters] = useState({
    university: "All",
    faculty: "All",
    major: "All",
    technology: "All",
    status: "All",
    type: "All",
    sort: "popular",
    resourceType: "All",
    field: "All",
    degree: "All",
    skillCategory: "All",
    solvedStatus: "All",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      university: "All",
      faculty: "All",
      major: "All",
      technology: "All",
      status: "All",
      type: "All",
      sort: "popular",
      resourceType: "All",
      field: "All",
      degree: "All",
      skillCategory: "All",
      solvedStatus: "All",
    });
    setSearchQuery("");
  };

  // Filtered Logic for Projects
  const filteredProjects = useMemo(() => {
    return SAMPLE_PROJECTS.filter((proj) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.technology.toLowerCase().includes(q);

      const matchesUni = filters.university === "All" || proj.university === filters.university;
      const matchesTech = filters.technology === "All" || proj.technology === filters.technology;
      const matchesStatus = filters.status === "All" || proj.status === filters.status;
      const matchesType = filters.type === "All" || proj.type === filters.type;

      return matchesSearch && matchesUni && matchesTech && matchesStatus && matchesType;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Students
  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter((st) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        st.name.toLowerCase().includes(q) ||
        st.bio.toLowerCase().includes(q) ||
        st.skills.some((s) => s.toLowerCase().includes(q));

      const matchesUni = filters.university === "All" || st.university === filters.university;
      const matchesFaculty = filters.faculty === "All" || st.faculty === filters.faculty;
      const matchesMajor = filters.major === "All" || st.major === filters.major;

      return matchesSearch && matchesUni && matchesFaculty && matchesMajor;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Teams
  const filteredTeams = useMemo(() => {
    return SAMPLE_TEAMS.filter((team) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        team.name.toLowerCase().includes(q) ||
        team.projectTitle.toLowerCase().includes(q) ||
        team.description.toLowerCase().includes(q) ||
        team.techStack.some((t) => t.toLowerCase().includes(q));

      const matchesUni = filters.university === "All" || team.university === filters.university;
      const matchesStatus = filters.status === "All" || team.status === filters.status;

      return matchesSearch && matchesUni && matchesStatus;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Resources
  const filteredResources = useMemo(() => {
    return [...communityResources, ...SAMPLE_RESOURCES].filter((res) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q);

      const matchesUni = filters.university === "All" || res.university === filters.university;
      const matchesType = filters.resourceType === "All" || res.category === filters.resourceType;

      return matchesSearch && matchesUni && matchesType;
    });
  }, [searchQuery, filters, communityResources]);

  // Filtered Logic for Research
  const filteredResearch = useMemo(() => {
    return SAMPLE_RESEARCH.filter((res) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.abstract.toLowerCase().includes(q) ||
        res.authors.some((a) => a.toLowerCase().includes(q));

      const matchesUni = filters.university === "All" || res.university === filters.university;
      const matchesField = filters.field === "All" || res.field === filters.field;

      return matchesSearch && matchesUni && matchesField;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Capstone
  const filteredCapstone = useMemo(() => {
    return SAMPLE_CAPSTONE.filter((cap) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cap.title.toLowerCase().includes(q) ||
        cap.summary.toLowerCase().includes(q) ||
        cap.sponsor.toLowerCase().includes(q);

      const matchesUni = filters.university === "All" || cap.university === filters.university;

      return matchesSearch && matchesUni;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Thesis
  const filteredThesis = useMemo(() => {
    return SAMPLE_THESIS.filter((th) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        th.title.toLowerCase().includes(q) ||
        th.abstract.toLowerCase().includes(q) ||
        th.author.toLowerCase().includes(q);

      const matchesUni = filters.university === "All" || th.university === filters.university;
      const matchesDegree = filters.degree === "All" || th.degree === filters.degree;

      return matchesSearch && matchesUni && matchesDegree;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Skills
  const filteredSkills = useMemo(() => {
    return SAMPLE_SKILLS.filter((sk) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        sk.name.toLowerCase().includes(q) ||
        sk.description.toLowerCase().includes(q) ||
        sk.technologies.some((t) => t.toLowerCase().includes(q));

      const matchesCat = filters.skillCategory === "All" || sk.category === filters.skillCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, filters]);

  // Filtered Logic for Questions
  const filteredQuestions = useMemo(() => {
    return SAMPLE_QUESTIONS.filter((qs) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        qs.title.toLowerCase().includes(q) ||
        qs.snippet.toLowerCase().includes(q) ||
        qs.tags.some((t) => t.toLowerCase().includes(q));

      const matchesUni = filters.university === "All" || qs.university === filters.university;
      const matchesSolved =
        filters.solvedStatus === "All" ||
        (filters.solvedStatus === "Solved" && qs.isSolved) ||
        (filters.solvedStatus === "Unanswered" && !qs.isSolved);

      return matchesSearch && matchesUni && matchesSolved;
    });
  }, [searchQuery, filters]);

  // Active items array length helper
  const getActiveItemCount = () => {
    switch (activeCategory) {
      case "projects": return filteredProjects.length;
      case "students": return filteredStudents.length;
      case "teams": return filteredTeams.length;
      case "resources": return filteredResources.length;
      case "research": return filteredResearch.length;
      case "capstone": return filteredCapstone.length;
      case "thesis": return filteredThesis.length;
      case "skills": return filteredSkills.length;
      case "questions": return filteredQuestions.length;
      default: return 0;
    }
  };

  // ---------- RESEARCH REPOSITORY LOGIC ----------

  const openResearchPaper = (paper) => {
    setSelectedResearchPaper(paper);
    setSelectedResearchFile({ name: "README.md", path: "README.md", type: "md", size: "12 KB", updated: "2 hours ago" });
    setResearchFileSearch("");
    setAdditionalResearchFiles([]);
    setIsAddingResearchFile(false);
    setIsResearchFileTreeOpen(true);
  };

  const closeResearchPaper = () => {
    setSelectedResearchPaper(null);
    setSelectedResearchFile(null);
  };

  // Search: a matching folder keeps all its children, otherwise only matching descendants remain
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
    const content = isBinary ? "" : buildResearchFileContent(file, paper);
    const stats = countLines(content);
    const pathParts = (file.path || file.name).split("/");
    const shownTree = filterResearchFileTree([...getResearchRepositoryFiles(paper), ...additionalResearchFiles]);
    const commitHash = (paper.id * 7919).toString(16).slice(0, 7).padEnd(7, "0");
    const commitMessage = file.name === "README.md"
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
                  {commitHash} · {file.updated || "recently"}
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
                    {isBinary ? `Binary file · ${file.size || "0 KB"}` : `${stats.lines} lines (${stats.loc} loc) · ${file.size || "0 KB"}`}
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
                    <Tooltip title="Edit file">
                      <IconButton aria-label="Edit file" sx={groupBtnSx}>
                        <Pencil size={17} />
                      </IconButton>
                    </Tooltip>
                    <IconButton aria-label="More edit options" sx={{ ...groupBtnSx, px: 0.6 }}>
                      <ChevronDown size={15} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {isBinary ? (
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
                file.name === "README.md" ? (
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

  return (
    <DashboardLayout
      user={user}
      logout={logout}
      language={language}
      changeLanguage={changeLanguage}
      toggleColorMode={toggleColorMode}
      isDark={isDark}
    >
      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 62px)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#0d1117" : "background.default",
          color: "text.primary",
          px: 0,
          pt: selectedResearchPaper ? 0 : 3,
          pb: selectedResearchPaper ? 0 : 5,
        }}
      >
        <Box sx={{ maxWidth: "none", mx: 0 }}>
          {/* Research repository viewer takes over the whole page */}
          {activeCategory === "research" && selectedResearchPaper ? (
            renderResearchRepository()
          ) : (
            <Grid container spacing={0}>
              {/* LEFT SIDEBAR FILTERS & NAVIGATION */}
              <Grid
                size={{ xs: 12, md: 2.2 }}
                sx={{
                  borderRight: { md: "1px solid" },
                  borderColor: { md: (theme) => (theme.palette.mode === "dark" ? "#30363d" : "divider") },
                  minHeight: { md: "calc(100vh - 220px)" },
                  pr: { xs: 2, md: 4 },
                  pl: { xs: 2, md: 1.5 },
                }}
              >
                <Box
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#0d1117" : "background.paper",
                    borderRadius: 0,
                  }}
                >
                  {/* Category Navigation Sidebar List */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ px: 1.5, mb: 1, display: "block", letterSpacing: 0.5 }}>
                      CATEGORIES
                    </Typography>
                    <Stack spacing={0.5}>
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                          <Box
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1.5,
                              py: 1,
                              cursor: "pointer",
                              fontSize: 14,
                              fontWeight: isActive ? 600 : 400,
                              borderRadius: "0 6px 6px 0",
                              bgcolor: isActive
                                ? (theme) => (theme.palette.mode === "dark" ? "#161b22" : "action.selected")
                                : "transparent",
                              color: isActive
                                ? (theme) => (theme.palette.mode === "dark" ? "#f0f6fc" : "primary.main")
                                : "text.secondary",
                              position: "relative",
                              "&::before": isActive
                                ? {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: "15%",
                                  bottom: "15%",
                                  width: "3px",
                                  bgcolor: "#f78166",
                                  borderRadius: "2px",
                                }
                                : {},
                              "&:hover": {
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark" ? "#161b22" : "action.hover",
                                color: "text.primary",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                              <Icon size={16} />
                              <span>{cat.label}</span>
                            </Box>
                            {cat.count !== undefined && (
                              <Box
                                sx={{
                                  px: 0.8,
                                  py: 0.1,
                                  borderRadius: "10px",
                                  fontSize: 12,
                                  fontWeight: 500,
                                  bgcolor: isActive
                                    ? (theme) => (theme.palette.mode === "dark" ? "rgba(247,129,102,0.2)" : "rgba(25,118,210,0.12)")
                                    : (theme) => (theme.palette.mode === "dark" ? "rgba(110,118,129,0.2)" : "rgba(0,0,0,0.06)"),
                                  color: isActive ? (theme) => (theme.palette.mode === "dark" ? "#f78166" : "primary.main") : "text.secondary",
                                }}
                              >
                                {cat.count}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2, ...dividerSx }} />

                  {/* Title & Reset */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1.5,
                      py: 0.5,
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Filter size={16} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Filters
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleResetFilters} title="Reset Filters">
                      <RotateCcw size={14} />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    {/* Dynamic Dropdown Filters Based on Active Category */}
                    <Stack spacing={1.5} sx={{ px: 1 }}>
                      {/* University Filter Dropdown */}
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: 13 }}>University</InputLabel>
                        <Select
                          value={filters.university}
                          label="University"
                          onChange={(e) => handleFilterChange("university", e.target.value)}
                          sx={{ fontSize: 13 }}
                        >
                          <MenuItem value="All">All Universities</MenuItem>
                          <MenuItem value="RUPP">RUPP</MenuItem>
                          <MenuItem value="ITC">ITC</MenuItem>
                          <MenuItem value="CADT">CADT</MenuItem>
                        </Select>
                      </FormControl>
                      {activeCategory === "projects" && (
                        <>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Faculty</InputLabel>
                            <Select
                              value={filters.faculty}
                              label="Faculty"
                              onChange={(e) => handleFilterChange("faculty", e.target.value)}
                              sx={{ fontSize: 13 }}
                            >
                              <MenuItem value="All">All Faculties</MenuItem>
                              <MenuItem value="Engineering">Engineering</MenuItem>
                              <MenuItem value="GIC">GIC</MenuItem>
                              <MenuItem value="Computer Science">Computer Science</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Technology</InputLabel>
                            <Select
                              value={filters.technology}
                              label="Technology"
                              onChange={(e) => handleFilterChange("technology", e.target.value)}
                              sx={{ fontSize: 13 }}
                            >
                              <MenuItem value="All">All Tech Stack</MenuItem>
                              <MenuItem value="AI">AI / ML</MenuItem>
                              <MenuItem value="React JS">React JS</MenuItem>
                              <MenuItem value="Laravel">Laravel</MenuItem>
                              <MenuItem value="C++">C++ / IoT</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Project Type</InputLabel>
                            <Select
                              value={filters.type}
                              label="Project Type"
                              onChange={(e) => handleFilterChange("type", e.target.value)}
                              sx={{ fontSize: 13 }}
                            >
                              <MenuItem value="All">All Types</MenuItem>
                              <MenuItem value="Course Project">Course Project</MenuItem>
                              <MenuItem value="Capstone">Capstone</MenuItem>
                              <MenuItem value="Thesis">Thesis</MenuItem>
                              <MenuItem value="Research">Research</MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      )}

                      {activeCategory === "students" && (
                        <>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Faculty</InputLabel>
                            <Select
                              value={filters.faculty}
                              label="Faculty"
                              onChange={(e) => handleFilterChange("faculty", e.target.value)}
                              sx={{ fontSize: 13 }}
                            >
                              <MenuItem value="All">All Faculties</MenuItem>
                              <MenuItem value="Engineering">Engineering</MenuItem>
                              <MenuItem value="GIC">GIC</MenuItem>
                              <MenuItem value="Computer Science">Computer Science</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Major</InputLabel>
                            <Select
                              value={filters.major}
                              label="Major"
                              onChange={(e) => handleFilterChange("major", e.target.value)}
                              sx={{ fontSize: 13 }}
                            >
                              <MenuItem value="All">All Majors</MenuItem>
                              <MenuItem value="Computer Science">Computer Science</MenuItem>
                              <MenuItem value="Information Technology">Information Technology</MenuItem>
                              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      )}

                      {activeCategory === "teams" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Team Status</InputLabel>
                          <Select
                            value={filters.status}
                            label="Team Status"
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Statuses</MenuItem>
                            <MenuItem value="Recruiting">Recruiting</MenuItem>
                            <MenuItem value="Team Full">Team Full</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {activeCategory === "resources" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Resource Category</InputLabel>
                          <Select
                            value={filters.resourceType}
                            label="Resource Category"
                            onChange={(e) => handleFilterChange("resourceType", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Categories</MenuItem>
                            <MenuItem value="Dataset & Code">Dataset & Code</MenuItem>
                            <MenuItem value="Study Material">Study Material</MenuItem>
                            <MenuItem value="Templates">Templates</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {activeCategory === "research" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Research Field</InputLabel>
                          <Select
                            value={filters.field}
                            label="Research Field"
                            onChange={(e) => handleFilterChange("field", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Fields</MenuItem>
                            <MenuItem value="AI & Computer Vision">AI & Computer Vision</MenuItem>
                            <MenuItem value="Distributed Systems">Distributed Systems</MenuItem>
                            <MenuItem value="Cybersecurity & AI">Cybersecurity & AI</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {activeCategory === "thesis" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Degree Level</InputLabel>
                          <Select
                            value={filters.degree}
                            label="Degree Level"
                            onChange={(e) => handleFilterChange("degree", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Degrees</MenuItem>
                            <MenuItem value="Bachelor's Thesis">Bachelor's Thesis</MenuItem>
                            <MenuItem value="Master's Thesis">Master's Thesis</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {activeCategory === "skills" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Skill Category</InputLabel>
                          <Select
                            value={filters.skillCategory}
                            label="Skill Category"
                            onChange={(e) => handleFilterChange("skillCategory", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Skill Domains</MenuItem>
                            <MenuItem value="AI & Data Science">AI & Data Science</MenuItem>
                            <MenuItem value="Web Development">Web Development</MenuItem>
                            <MenuItem value="Mobile Dev">Mobile Dev</MenuItem>
                            <MenuItem value="Cloud & Systems">Cloud & Systems</MenuItem>
                            <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                            <MenuItem value="Design & UX">Design & UX</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {activeCategory === "questions" && (
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Question Status</InputLabel>
                          <Select
                            value={filters.solvedStatus}
                            label="Question Status"
                            onChange={(e) => handleFilterChange("solvedStatus", e.target.value)}
                            sx={{ fontSize: 13 }}
                          >
                            <MenuItem value="All">All Questions</MenuItem>
                            <MenuItem value="Solved">Solved</MenuItem>
                            <MenuItem value="Unanswered">Unanswered</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>

              {/* RIGHT COLUMN: RESULTS CONTENT */}
              <Grid size={{ xs: 12, md: 9.8 }} sx={{ px: { xs: 2, md: 4 } }}>
                {/* Header Banner */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: 24, md: 28 } }}>
                    University Ecosystem
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover student projects, thesis research, skill groups, academic resources, and peer discussions.
                  </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ mb: 3 }}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeCategory}... (e.g. AI, Khmer OCR, React, RUPP)`}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    }
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#010409" : "background.paper",
                      borderRadius: "6px",
                      fontSize: 14,
                      "& fieldset": { borderColor: (theme) => (theme.palette.mode === "dark" ? "#30363d" : "divider") },
                    }}
                  />
                </Box>

                {/* FLEXBOX TOOLBAR */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing <strong>{getActiveItemCount()}</strong> result(s) for <strong>{CATEGORIES.find(c => c.id === activeCategory)?.label}</strong>
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      overflowX: "auto",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Flame size={14} />}
                      onClick={() => handleFilterChange("sort", "popular")}
                      variant={filters.sort === "popular" ? "contained" : "outlined"}
                      sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
                    >
                      Popular
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Clock size={14} />}
                      onClick={() => handleFilterChange("sort", "recent")}
                      variant={filters.sort === "recent" ? "contained" : "outlined"}
                      sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
                    >
                      Recent
                    </Button>
                    <Button
                      size="small"
                      startIcon={<TrendingUp size={14} />}
                      onClick={() => handleFilterChange("sort", "trending")}
                      variant={filters.sort === "trending" ? "contained" : "outlined"}
                      sx={{ textTransform: "none", borderRadius: "6px", fontSize: 13, whiteSpace: "nowrap" }}
                    >
                      Trending
                    </Button>
                  </Box>
                </Box>

                {/* PROJECTS TAB */}
                {activeCategory === "projects" && (
                  <Stack spacing={2}>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((proj) => (
                        <Card key={proj.id} variant="outlined" sx={cardSx}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    color="primary.main"
                                    onClick={() => navigate(`/projects?project=${proj.id}&tab=overview`)}
                                    sx={{ cursor: "pointer", fontSize: 16, "&:hover": { textDecoration: "underline" } }}
                                  >
                                    {proj.title}
                                  </Typography>
                                  <Chip
                                    label={proj.status}
                                    size="small"
                                    color={proj.status === "Completed" ? "success" : "warning"}
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: 11 }}
                                  />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
                                  {proj.description}
                                </Typography>
                              </Box>

                              <IconButton
                                size="small"
                                onClick={() => navigate(`/projects?project=${proj.id}&tab=overview`)}
                              >
                                <ExternalLink size={16} />
                              </IconButton>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                              <Chip label={`Uni: ${proj.university}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                              <Chip label={proj.faculty} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                              <Chip label={proj.type} size="small" color="primary" variant="outlined" sx={{ fontSize: 11 }} />
                              <Chip label={`Tech: ${proj.technology}`} size="small" color="secondary" sx={{ fontSize: 11 }} />
                            </Box>

                            <Divider sx={{ mb: 2, ...dividerSx }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={proj.author.avatar} sx={{ width: 20, height: 20, fontSize: 10 }}>
                                  {proj.author.name.substring(0, 2)}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {proj.author.name} • Updated {proj.updatedAt}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Star size={14} color="#e3b341" />
                                  <Typography variant="caption" fontWeight={600}>
                                    {proj.stars}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <GitFork size={14} />
                                  <Typography variant="caption" fontWeight={600}>
                                    {proj.forks}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="projects" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* STUDENTS TAB */}
                {activeCategory === "students" && (
                  <Grid container spacing={2}>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={st.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              ...cardSx,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              p: 2,
                            }}
                          >
                            <Box>
                              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1.5 }}>
                                <Avatar sx={{ width: 44, height: 44, bgcolor: "primary.main", fontWeight: 700 }}>
                                  {st.name.split(" ").map(n => n[0]).join("")}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                    {st.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {st.university} • {st.major} ({st.year})
                                  </Typography>
                                </Box>
                              </Box>

                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>
                                {st.bio}
                              </Typography>

                              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                                {st.skills.map((skill) => (
                                  <Chip key={skill} label={skill} size="small" sx={{ fontSize: 10, height: 20 }} />
                                ))}
                              </Box>
                            </Box>

                            <Box>
                              <Divider sx={{ mb: 1.5, ...dividerSx }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>{st.projectsCount}</strong> Projects • <strong>{st.followers}</strong> Followers
                                </Typography>
                                <Button size="small" variant="contained" startIcon={<UserPlus size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
                                  Connect
                                </Button>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid size={{ xs: 12 }}>
                        <EmptyState category="students" onReset={handleResetFilters} />
                      </Grid>
                    )}
                  </Grid>
                )}

                {/* TEAMS TAB */}
                {activeCategory === "teams" && (
                  <Stack spacing={2}>
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => (
                        <Card key={team.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16 }}>
                                  {team.name}
                                </Typography>
                                <Chip
                                  label={team.status}
                                  size="small"
                                  color={team.status === "Recruiting" ? "success" : "default"}
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: 11 }}
                                />
                              </Box>
                              <Typography variant="subtitle2" color="primary.main">
                                Project: {team.projectTitle}
                              </Typography>
                            </Box>

                            <Chip label={`Uni: ${team.university}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
                            {team.description}
                          </Typography>

                          {team.lookingFor.length > 0 && (
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(31,111,235,0.1)" : "#f0f7ff", borderRadius: "6px" }}>
                              <Typography variant="caption" fontWeight={600} color="primary.main" sx={{ display: "block", mb: 0.5 }}>
                                LOOKING FOR TEAM MEMBERS:
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {team.lookingFor.map((role) => (
                                  <Chip key={role} label={role} size="small" color="primary" sx={{ fontSize: 11, height: 22 }} />
                                ))}
                              </Stack>
                            </Box>
                          )}

                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {team.techStack.map((tech) => (
                              <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                            ))}
                          </Box>

                          <Divider sx={{ mb: 2, ...dividerSx }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 26, height: 26, fontSize: 11 } }}>
                                {team.members.map((m, idx) => (
                                  <Avatar key={idx}>{m.name.substring(0, 2)}</Avatar>
                                ))}
                              </AvatarGroup>
                              <Typography variant="caption" color="text.secondary">
                                {team.members.length} / {team.maxMembers} members • Led by <strong>{team.leader}</strong>
                              </Typography>
                            </Box>

                            <Button
                              size="small"
                              variant="contained"
                              disabled={team.status === "Team Full"}
                              sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}
                            >
                              {team.status === "Team Full" ? "Team Full" : "Apply to Join"}
                            </Button>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="teams" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* RESOURCES TAB */}
                {activeCategory === "resources" && (
                  <Stack spacing={2}>
                    {filteredResources.length > 0 ? (
                      filteredResources.map((res) => (
                        <Card key={res.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
                                  {res.title}
                                </Typography>
                                <Chip label={res.category} size="small" color="secondary" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                                {res.kind === "repo" && <Chip label="Research repo" size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />}
                                {res.kind === "upload" && <Chip label="Community upload" size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />}
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                Contributed by <strong>{res.author}</strong> ({res.university}) • Format: {res.format}
                              </Typography>
                            </Box>

                            <Button size="small" variant="outlined" startIcon={<Download size={14} />} onClick={() => downloadResource(res)} disabled={res.downloadable === false} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
                              {res.kind === "repo" ? "README" : "Download"}
                            </Button>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
                            {res.description}
                          </Typography>

                          <Divider sx={{ mb: 1.5, ...dividerSx }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>{res.downloads}</strong> Downloads • <strong>{res.stars}</strong> Stars • Updated {res.updatedAt}
                            </Typography>
                            <IconButton size="small">
                              <Bookmark size={16} />
                            </IconButton>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="resources" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* RESEARCH TAB (list of papers) */}
                {activeCategory === "research" && (
                  <Stack spacing={2}>
                    {filteredResearch.length > 0 ? (
                      filteredResearch.map((res) => (
                        <Card key={res.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, mb: 0.5 }}>
                                {res.title}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                                <Chip label={res.field} size="small" color="primary" sx={{ fontSize: 11, height: 20 }} />
                                <Chip label={res.status} size="small" color="success" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                                <Chip label={`Uni: ${res.university}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                              </Box>
                            </Box>
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                            Authors: <strong>{res.authors.join(", ")}</strong> • Supervisor: <strong>{res.supervisor}</strong> • Journal: <em>{res.journal} ({res.year})</em>
                          </Typography>

                          <Box sx={{ p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "#0d1117" : "#f8f9fa", borderRadius: "6px", mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                              ABSTRACT:
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ fontSize: 13, fontStyle: "italic" }}>
                              "{res.abstract}"
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 1.5, ...dividerSx }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary">
                              Citations: <strong>{res.citations}</strong> • Downloads: <strong>{res.downloads}</strong>
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileText size={14} />}
                                onClick={() => openResearchPaper(res)}
                                sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}
                              >
                                Read Paper
                              </Button>
                            </Stack>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="research" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* CAPSTONE TAB */}
                {activeCategory === "capstone" && (
                  <Stack spacing={2}>
                    {filteredCapstone.length > 0 ? (
                      filteredCapstone.map((cap) => (
                        <Card key={cap.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
                                  {cap.title}
                                </Typography>
                                <Chip label={cap.grade} size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                University: <strong>{cap.university}</strong> ({cap.year}) • Industry Sponsor: <strong>{cap.sponsor}</strong>
                              </Typography>
                            </Box>

                            <Button size="small" variant="outlined" startIcon={<Globe size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
                              Live Demo
                            </Button>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
                            {cap.summary}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {cap.techStack.map((tech) => (
                              <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                            ))}
                          </Box>

                          <Divider sx={{ mb: 1.5, ...dividerSx }} />

                          <Typography variant="caption" color="text.secondary">
                            Team Members: <strong>{cap.team.join(", ")}</strong> • Advisor: <strong>{cap.advisor}</strong>
                          </Typography>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="capstone" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* THESIS TAB */}
                {activeCategory === "thesis" && (
                  <Stack spacing={2}>
                    {filteredThesis.length > 0 ? (
                      filteredThesis.map((th) => (
                        <Card key={th.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, mb: 0.5 }}>
                                {th.title}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                                <Chip label={th.degree} size="small" color="secondary" sx={{ fontSize: 11, height: 20 }} />
                                <Chip label={th.defenseStatus} size="small" color="success" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                                <Chip label={`Uni: ${th.university}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                              </Box>
                            </Box>
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                            Candidate: <strong>{th.author}</strong> • Thesis Advisor: <strong>{th.advisor}</strong> ({th.year})
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
                            "{th.abstract}"
                          </Typography>

                          <Divider sx={{ mb: 1.5, ...dividerSx }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary">
                              Citations: <strong>{th.citations}</strong> • PDF Downloads: <strong>{th.downloads}</strong>
                            </Typography>
                            <Button size="small" variant="outlined" startIcon={<Download size={14} />} sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
                              Download Thesis
                            </Button>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="thesis" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}

                {/* SKILLS TAB */}
                {activeCategory === "skills" && (
                  <Grid container spacing={2}>
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((sk) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={sk.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              ...cardSx,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              p: 2.5,
                            }}
                          >
                            <Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, color: "primary.main" }}>
                                  {sk.name}
                                </Typography>
                                <Chip label={sk.category} size="small" color="secondary" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
                              </Box>

                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
                                {sk.description}
                              </Typography>

                              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                                {sk.technologies.map((t) => (
                                  <Chip key={t} label={t} size="small" sx={{ fontSize: 11, height: 20 }} />
                                ))}
                              </Box>
                            </Box>

                            <Box>
                              <Divider sx={{ mb: 1.5, ...dividerSx }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>{sk.learnersCount}</strong> Learners • <strong>{sk.projectsCount}</strong> Projects
                                </Typography>
                                <Button size="small" variant="contained" sx={{ textTransform: "none", borderRadius: "6px", fontSize: 12 }}>
                                  Join Group
                                </Button>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid size={{ xs: 12 }}>
                        <EmptyState category="skills" onReset={handleResetFilters} />
                      </Grid>
                    )}
                  </Grid>
                )}

                {/* QUESTIONS TAB */}
                {activeCategory === "questions" && (
                  <Stack spacing={2}>
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((qs) => (
                        <Card key={qs.id} variant="outlined" sx={{ ...cardSx, p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                                {qs.isSolved ? (
                                  <Chip icon={<CheckCircle2 size={12} />} label="Solved" size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
                                ) : (
                                  <Chip label="Unanswered" size="small" color="warning" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                                )}
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: 16, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                  {qs.title}
                                </Typography>
                              </Box>

                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>
                                {qs.snippet}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 2 }}>
                            {qs.tags.map((tag) => (
                              <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                            ))}
                          </Box>

                          <Divider sx={{ mb: 1.5, ...dividerSx }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary">
                              Asked by <strong>{qs.author.name}</strong> ({qs.university}) • {qs.time}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <ThumbsUp size={14} />
                                <Typography variant="caption" fontWeight={600}>{qs.votes}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <MessageSquare size={14} />
                                <Typography variant="caption" fontWeight={600}>{qs.answers} answers</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <EmptyState category="questions" onReset={handleResetFilters} />
                    )}
                  </Stack>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
}

// Helper component for Empty Search State
function EmptyState({ category, onReset }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 5,
        textAlign: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#161b22" : "background.paper",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "#30363d" : "divider",
        borderRadius: "6px",
      }}
    >
      <FolderGit2 size={40} style={{ opacity: 0.5, marginBottom: 12 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No {category} found matching your filter criteria
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Try adjusting your search query or clear your active filters.
      </Typography>
      <Button variant="outlined" size="small" onClick={onReset}>
        Reset All Filters
      </Button>
    </Card>
  );
}