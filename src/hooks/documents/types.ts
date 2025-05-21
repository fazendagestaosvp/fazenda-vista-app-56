
import { User } from "@supabase/supabase-js";

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  folder_id: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentsHookOptions {
  folderId: string | null;
  user: User | null;
}

// Helper para formatar o tamanho do arquivo
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};
