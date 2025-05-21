
import { useState } from "react";
import { useQuery, useMutation, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Document, DocumentsHookOptions, formatFileSize } from "./types";

export const useDocumentsOperations = ({ folderId, user }: DocumentsHookOptions) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Função para buscar documentos
  const fetchDocuments = async (): Promise<Document[]> => {
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

  // Função para fazer upload de documento
  const uploadDocument = async (file: File, folderId: string | null = null): Promise<Document> => {
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
      
      return documentData as Document;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Função para excluir documento
  const deleteDocument = async ({ documentId, filePath }: { documentId: string, filePath: string | null }): Promise<void> => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      // 1. Se houver arquivo no storage, remover
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([filePath]);

        if (storageError) {
          console.error("Erro ao remover arquivo:", storageError);
          // Não vamos interromper o fluxo aqui, pois ainda é possível remover o registro
        }
      }

      // 2. Remover registro da tabela
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) {
        console.error("Erro ao excluir documento:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      throw error;
    }
  };

  // Função para gerar URL de download
  const getDownloadUrl = async (filePath: string): Promise<string> => {
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

  // Consultas React Query
  const documentsQuery: UseQueryResult<Document[], Error> = useQuery({
    queryKey: ["documents", folderId],
    queryFn: fetchDocuments,
    enabled: !!user,
  });

  // Mutações React Query
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId: string | null }) =>
      uploadDocument(file, folderId),
    onSuccess: () => {
      // Atualizar a lista de documentos após o upload
      documentsQuery.refetch();
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ documentId, filePath }: { documentId: string; filePath: string | null }) =>
      deleteDocument({ documentId, filePath }),
    onSuccess: () => {
      // Atualizar a lista de documentos após a exclusão
      documentsQuery.refetch();
    }
  });

  return {
    documents: documentsQuery.data || [],
    isLoadingDocuments: documentsQuery.isLoading,
    isUploading,
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    getDownloadUrl,
    refetchDocuments: documentsQuery.refetch,
  };
};
