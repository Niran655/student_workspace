/** Small helpers shared by ProfilePage, ExplorePage and SettingsPage. */

export const readSavedProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("uniforge.profile") || "{}");
  } catch {
    return {};
  }
};

/** Key used to mark content (uploads, labs, research...) as owned by the current user. */
export const getOwnerKey = (user) => user?.id || user?.username || user?.name || "Rim Narong";

export const getDisplayName = (user) => readSavedProfile().name || user?.name || "Rim Narong";

/** All lower-cased names that identify the current user (used to match authors). */
export const getUserNames = (user) =>
  [...new Set([getDisplayName(user), user?.name, user?.nameEn].filter(Boolean).map((n) => n.trim().toLowerCase()))];

export const sameAny = (name, names) => names.includes(String(name || "").trim().toLowerCase());