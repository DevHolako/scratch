import type { NoteMetadata, FolderNode } from "../types/note";

export interface SortStrategy {
  id: string;
  label: string;
  description: string;
  compareNotes: (a: NoteMetadata, b: NoteMetadata) => number;
  compareFolders?: (a: FolderNode, b: FolderNode) => number;
}

// Natural collation for human-friendly sorting (e.g. "1 - Note", "2 - Note", "10 - Note")
const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export const SORT_STRATEGIES: Record<string, SortStrategy> = {
  "title-asc": {
    id: "title-asc",
    label: "Alphabetical / Folder Structure (A–Z)",
    description: "Sorted by note title and natural number order",
    compareNotes: (a, b) => naturalCompare(a.title || a.id, b.title || b.id),
    compareFolders: (a, b) => naturalCompare(a.name, b.name),
  },
  "modified-desc": {
    id: "modified-desc",
    label: "Last Modified (Newest First)",
    description: "Recently edited notes appear at the top",
    compareNotes: (a, b) => b.modified - a.modified,
    compareFolders: (a, b) => naturalCompare(a.name, b.name),
  },
  "modified-asc": {
    id: "modified-asc",
    label: "Last Modified (Oldest First)",
    description: "Oldest edited notes appear at the top",
    compareNotes: (a, b) => a.modified - b.modified,
    compareFolders: (a, b) => naturalCompare(a.name, b.name),
  },
  "title-desc": {
    id: "title-desc",
    label: "Alphabetical (Z–A)",
    description: "Reverse alphabetical order",
    compareNotes: (a, b) => naturalCompare(b.title || b.id, a.title || a.id),
    compareFolders: (a, b) => naturalCompare(b.name, a.name),
  },
};

export const DEFAULT_SORT_ORDER = "title-asc";

export function getSortStrategy(sortOrder?: string): SortStrategy {
  if (sortOrder && SORT_STRATEGIES[sortOrder]) {
    return SORT_STRATEGIES[sortOrder];
  }
  return SORT_STRATEGIES[DEFAULT_SORT_ORDER];
}
