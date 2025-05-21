
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuthContext";
import { useToast } from "@/components/ui/use-toast";

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

export const useDocuments = (folderId: string | null = null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Função para buscar pastas
  const fetchFolders = async () => {
    if (!user) throw new Error("Usuário não autenticado");

    let query = supabase
      .from("document_folders")
      .select("*")
      .order("name", { ascending: true });

    if (folderId) {
      query = query.eq("parent_id", folderId);
    } else {
      query = query.is("parent_id", null);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao buscar pastas:", error);
      throw error;
    }

    return data as Folder[];
  };

  // Função para buscar documentos
  const fetchDocuments = async () => {
    if (!user) throw new Error("Usuário não autenticado");

    let query = supabase
      .from("documents")
      .select("*")
      .order("name", { ascending: true });

    if (folderId) {
      query = query.eq("folder_id", folderId);
    } else {
      query = query.is("folder_id", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar documentos:", error);
      throw error;
    }

    return data as Document[];
  };

  // Função para criar nova pasta
  const createFolder = async (name: string, parentId: string | null = null) => {
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("document_folders")
      .insert({
        name,
        parent_id: parentId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar pasta:", error);
      toast({
        title: "Erro ao criar pasta",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Pasta criada com sucesso",
      description: `A pasta "${name}" foi criada.`,
    });

    // Invalidar a consulta para atualizar a lista
    queryClient.invalidateQueries({ queryKey: ["folders", parentId] });
    
    return data as Folder;
  };

  // Função para fazer upload de documento
  const uploadDocument = async (file: File, folderId: string | null = null) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      setIsUploading(true);

      // 1. Fazer upload do arquivo para o storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro no upload do arquivo:", uploadError);
        toast({
          title: "Erro no upload",
          description: uploadError.message,
          variant: "destructive",
        });
        throw uploadError;
      }

      // 2. Criar registro na tabela documents
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          name: file.name,
          folder_id: folderId,
          user_id: user.id,
          file_path: filePath,
          file_type: file.type,
          file_size: formatFileSize(file.size),
        })
        .select()
        .single();

      if (documentError) {
        console.error("Erro ao registrar documento:", documentError);
        toast({
          title: "Erro ao registrar documento",
          description: documentError.message,
          variant: "destructive",
        });
        throw documentError;
      }

      toast({
        title: "Documento adicionado com sucesso",
        description: `O documento "${file.name}" foi adicionado.`,
      });

      // Invalidar a consulta para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["documents", folderId] });
      
      return documentData as Document;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Função para excluir documento
  const deleteDocument = async (documentId: string, filePath: string | null) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      // 1. Se houver arquivo no storage, remover
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([filePath]);

        if (storageError) {
          console.error("Erro ao remover arquivo:", storageError);
        }
      }

      // 2. Remover registro da tabela
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) {
        console.error("Erro ao excluir documento:", error);
        toast({
          title: "Erro ao excluir documento",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Documento excluído com sucesso",
        description: "O documento foi removido.",
      });

      // Invalidar a consulta para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["documents", folderId] });
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      throw error;
    }
  };

  // Função para gerar URL de download
  const getDownloadUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 60); // URL válida por 60 segundos

    if (error) {
      console.error("Erro ao gerar URL de download:", error);
      toast({
        title: "Erro ao gerar link",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data.signedUrl;
  };

  // Helper para formatar o tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Consultas React Query
  const foldersQuery = useQuery({
    queryKey: ["folders", folderId],
    queryFn: fetchFolders,
    enabled: !!user,
  });

  const documentsQuery = useQuery({
    queryKey: ["documents", folderId],
    queryFn: fetchDocuments,
    enabled: !!user,
  });

  // Mutações React Query
  const createFolderMutation = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      createFolder(name, parentId),
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId: string | null }) =>
      uploadDocument(file, folderId),
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ documentId, filePath }: { documentId: string; filePath: string | null }) =>
      deleteDocument(documentId, filePath),
  });

  return {
    folders: foldersQuery.data || [],
    documents: documentsQuery.data || [],
    isLoadingFolders: foldersQuery.isLoading,
    isLoadingDocuments: documentsQuery.isLoading,
    isUploading,
    createFolder: createFolderMutation.mutate,
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    getDownloadUrl,
    refetchFolders: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
    refetchDocuments: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  };
};
