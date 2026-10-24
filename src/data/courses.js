import {
  Atom,
  Braces,
  Database,
  Network,
  Palette,
  Terminal,
} from "lucide-react";

const courses = [
  { id: "react-fundamentals", title: "React.js Fundamentals", category: "Programming", level: "Beginner", duration: "12h 30m", lessons: 24, rating: "4.8 (1.2k)", progress: 60, icon: Atom, description: "Build modern web applications with React, components, and hooks." },
  { id: "node-express", title: "Node.js & Express", category: "Programming", level: "Intermediate", duration: "9h 40m", lessons: 30, rating: "4.7 (890)", progress: 35, icon: Braces, description: "Build REST APIs and backend services with Node.js and Express." },
  { id: "database-systems", title: "Database Systems", category: "Database", level: "Intermediate", duration: "8h 20m", lessons: 18, rating: "4.6 (750)", progress: 45, icon: Database, description: "Learn SQL, data modeling, and database optimization from the ground up." },
  { id: "python-beginners", title: "Python for Beginners", category: "Programming", level: "Beginner", duration: "10h 15m", lessons: 22, rating: "4.9 (1.8k)", progress: 30, icon: Terminal, description: "Start your programming journey with Python basics and practical projects." },
  { id: "network-essentials", title: "Network Essentials", category: "Networking", level: "Beginner", duration: "6h 30m", lessons: 16, rating: "4.7 (620)", progress: 0, icon: Network, description: "Understand protocols, network devices, and how the internet moves data." },
  { id: "interface-design", title: "Interface Design Basics", category: "Design", level: "Beginner", duration: "5h 10m", lessons: 14, rating: "4.8 (540)", progress: 0, icon: Palette, description: "Create consistent interfaces using color, type, layout, and design systems." },
];

export default courses;