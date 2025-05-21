
import { useQuery, useMutation, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Folder, DocumentsHookOptions } from "./types";

export const useFolders = ({ folderId, user }: DocumentsHookOptions) => {
  const { toast } = useToast();

  // Função para buscar pastas
  const fetchFolders = async (): Promise<Folder[]> => {
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

  // Função para criar nova pasta
  const createFolder = async (name: string, parentId: string | null = null): Promise<Folder> => {
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
    
    return data as Folder;
  };

  // Consulta React Query para pastas
  const foldersQuery: UseQueryResult<Folder[], Error> = useQuery({
    queryKey: ["folders", folderId],
    queryFn: fetchFolders,
    enabled: !!user,
  });

  // Mutação React Query para criar pastas
  const createFolderMutation = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      createFolder(name, parentId),
  });

  return {
    folders: foldersQuery.data || [],
    isLoadingFolders: foldersQuery.isLoading,
    createFolder: createFolderMutation.mutate,
    refetchFolders: foldersQuery.refetch,
  };
};
