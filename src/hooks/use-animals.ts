
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  identification?: string;
  gender?: string;
  birth_date?: string;
  weight?: number;
  status?: string;
  created_at: string;
}

export const useAnimals = () => {
  const { user } = useSimpleAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const fetchAnimals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching animals:', error);
        return;
      }

      setAnimals(data || []);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animalData: Omit<Animal, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('animals')
        .insert({
          ...animalData,
          user_id: user.id,
        });

      if (error) {
        console.error('Error adding animal:', error);
        throw error;
      }

      await fetchAnimals();
    } catch (error) {
      console.error('Error adding animal:', error);
      throw error;
    }
  };

  const updateAnimal = async (id: string, animalData: Partial<Animal>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('animals')
        .update(animalData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating animal:', error);
        throw error;
      }

      await fetchAnimals();
    } catch (error) {
      console.error('Error updating animal:', error);
      throw error;
    }
  };

  const deleteAnimal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting animal:', error);
        throw error;
      }

      await fetchAnimals();
    } catch (error) {
      console.error('Error deleting animal:', error);
      throw error;
    }
  };

  return {
    animals,
    loading,
    fetchAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
  };
};
