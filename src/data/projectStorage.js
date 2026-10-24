const PROJECTS_STORAGE_KEY = "uniforge:projects:v1";

export function loadProjects(fallbackProjects) {
  try {
    const stored = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) return fallbackProjects;

    const projects = JSON.parse(stored);
    return Array.isArray(projects) ? projects.map(normalizeProject) : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export function saveProjects(projects) {
  try {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Storage may be unavailable or full; keep the current session usable.
  }
}

function normalizeProject(project) {
  return {
    ...project,
    notifications: Array.isArray(project.notifications) ? project.notifications : [],
    tasks: (project.tasks || []).map((task) => ({
      ...task,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
      comments: Array.isArray(task.comments) ? task.comments : [],
      history: Array.isArray(task.history) ? task.history : [],
    })),
    documents: (project.documents || []).map((document) => ({
      ...document,
      comments: Array.isArray(document.comments) ? document.comments : [],
      versions: Array.isArray(document.versions)
        ? document.versions
        : [{ id: `legacy-${document.id}`, ver: document.ver || "v1.0", date: document.date, by: document.by, fileKey: null }],
    })),
  };
}