import { useSyncExternalStore } from "react";

/**
 * Tiny shared store for community content (uploaded resources + research repos).
 * ProfilePage writes to it, ExplorePage reads from it. Data persists in localStorage.
 */
const KEY = "uniforge.community.v1";
const EMPTY = [];
const listeners = new Set();

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.resources) ? parsed.resources : EMPTY;
  } catch {
    return EMPTY;
  }
};

let resources = load();

const save = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ resources: list }));
    return true;
  } catch {
    return false; // storage full or unavailable
  }
};

const emit = () => listeners.forEach((listener) => listener());

export const addCommunityResources = (items) => {
  let next = [...items, ...resources];
  if (!save(next)) {
    // Quota exceeded: keep the metadata but drop the file contents
    next = [...items.map(({ dataUrl, ...rest }) => ({ ...rest, downloadable: false })), ...resources];
    save(next);
  }
  resources = next;
  emit();
};

export const removeCommunityResource = (id) => {
  resources = resources.filter((item) => item.id !== id);
  save(resources);
  emit();
};

export const clearCommunityResourcesByOwner = (ownerKey) => {
  resources = resources.filter((item) => item.ownerKey !== ownerKey);
  save(resources);
  emit();
};

const subscribe = (callback) => {
  listeners.add(callback);
  const onStorage = (event) => {
    if (event.key === KEY) {
      resources = load();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const useCommunityResources = () =>
  useSyncExternalStore(subscribe, () => resources, () => EMPTY);