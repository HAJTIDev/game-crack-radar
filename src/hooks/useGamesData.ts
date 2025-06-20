
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Game {
  id: string;
  steam_id: number;
  title: string;
  release_date?: string;
  developer?: string;
  publisher?: string;
  genre?: string;
  tags?: string[];
  owners?: string;
  players_forever?: number;
  players_2weeks?: number;
  positive?: number;
  negative?: number;
  price?: number;
  is_free?: boolean;
  header_image?: string;
  crack_status?: {
    status: "cracked" | "uncracked" | "drm_free";
    crack_date?: string;
    cracked_by?: string;
    drm_protection?: string[];
  };
}

export const useGamesData = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: async (): Promise<Game[]> => {
      console.log('Fetching games from database...');
      
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          crack_status (
            status,
            crack_date,
            cracked_by,
            drm_protection
          )
        `)
        .order('players_2weeks', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} games from database`);

      return data?.map(game => ({
        id: game.id,
        steam_id: game.steam_id,
        title: game.title,
        release_date: game.release_date,
        developer: game.developer,
        publisher: game.publisher,
        genre: game.genre,
        tags: game.tags,
        owners: game.owners,
        players_forever: game.players_forever,
        players_2weeks: game.players_2weeks,
        positive: game.positive,
        negative: game.negative,
        price: game.price,
        is_free: game.is_free,
        header_image: game.header_image,
        crack_status: game.crack_status?.[0] ? {
          status: game.crack_status[0].status as "cracked" | "uncracked" | "drm_free",
          crack_date: game.crack_status[0].crack_date,
          cracked_by: game.crack_status[0].cracked_by,
          drm_protection: game.crack_status[0].drm_protection
        } : undefined
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (replaces cacheTime)
  });
};

export const useSyncSteamSpy = () => {
  return useQuery({
    queryKey: ['sync-steamspy'],
    queryFn: async () => {
      console.log('Syncing with SteamSpy API...');
      
      const { data, error } = await supabase.functions.invoke('sync-steamspy', {
        body: { limit: 100 }
      });

      if (error) {
        console.error('Error syncing with SteamSpy:', error);
        throw error;
      }

      console.log('SteamSpy sync completed:', data);
      return data;
    },
    enabled: false, // Only run when manually triggered
    retry: 1
  });
};
