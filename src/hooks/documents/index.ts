
import { useFolders } from "./useFolders";
import { useDocumentsOperations } from "./useDocuments";
import { useAuth } from "@/hooks/useAuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Folder, Document } from "./types";

export { type Folder, type Document } from "./types";

export const useDocuments = (folderId: string | null = null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const folderOps = useFolders({ folderId, user });
  const documentOps = useDocumentsOperations({ folderId, user });

  return {
    // Folder operations
    folders: folderOps.folders,
    isLoadingFolders: folderOps.isLoadingFolders,
    createFolder: folderOps.createFolder,
    
    // Document operations
    documents: documentOps.documents,
    isLoadingDocuments: documentOps.isLoadingDocuments,
    isUploading: documentOps.isUploading,
    uploadDocument: documentOps.uploadDocument,
    deleteDocument: documentOps.deleteDocument,
    getDownloadUrl: documentOps.getDownloadUrl,
    
    // Refetch helpers
    refetchFolders: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
    refetchDocuments: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  };
};
