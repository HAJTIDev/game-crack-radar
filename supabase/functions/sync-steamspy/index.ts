
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { searchTerm, limit = 100 } = await req.json();
    
    console.log(`Fetching data from SteamSpy API for search: ${searchTerm}`);

    // Fetch data from SteamSpy API
    const steamSpyUrl = searchTerm 
      ? `https://steamspy.com/api.php?request=all&format=json`
      : `https://steamspy.com/api.php?request=top100in2weeks&format=json`;
    
    const response = await fetch(steamSpyUrl);
    const steamSpyData = await response.json();

    console.log(`Received ${Object.keys(steamSpyData).length} games from SteamSpy`);

    // Process and insert/update games in our database
    const gamesToInsert = [];
    const crackStatusToInsert = [];
    
    let count = 0;
    for (const [steamId, gameData] of Object.entries(steamSpyData)) {
      if (count >= limit) break;
      
      // Skip if essential data is missing
      if (!gameData.name || !steamId) continue;

      const game = {
        steam_id: parseInt(steamId),
        title: gameData.name,
        developer: gameData.developer || null,
        publisher: gameData.publisher || null,
        genre: gameData.genre || null,
        tags: gameData.tags ? Object.keys(gameData.tags) : [],
        owners: gameData.owners || null,
        owners_variance: gameData.owners_variance || null,
        players_forever: gameData.players_forever || null,
        players_forever_variance: gameData.players_forever_variance || null,
        players_2weeks: gameData.players_2weeks || null,
        players_2weeks_variance: gameData.players_2weeks_variance || null,
        average_forever: gameData.average_forever || null,
        average_2weeks: gameData.average_2weeks || null,
        median_forever: gameData.median_forever || null,
        median_2weeks: gameData.median_2weeks || null,
        score_rank: gameData.score_rank || null,
        positive: gameData.positive || null,
        negative: gameData.negative || null,
        userscore: gameData.userscore || null,
        price: gameData.price ? parseFloat(gameData.price) / 100 : null, // Convert cents to dollars
        is_free: gameData.price === 0,
        last_synced_at: new Date().toISOString()
      };

      gamesToInsert.push(game);

      // Create initial crack status (assume uncracked for new games)
      const crackStatus = {
        steam_id: parseInt(steamId),
        status: 'uncracked',
        drm_protection: ['Steam'], // Default Steam DRM
        verified: false
      };

      crackStatusToInsert.push(crackStatus);
      count++;
    }

    console.log(`Processing ${gamesToInsert.length} games for database insertion`);

    // Insert games using upsert to handle duplicates
    if (gamesToInsert.length > 0) {
      const { data: insertedGames, error: gamesError } = await supabaseClient
        .from('games')
        .upsert(gamesToInsert, { 
          onConflict: 'steam_id',
          ignoreDuplicates: false 
        })
        .select('id, steam_id');

      if (gamesError) {
        console.error('Error inserting games:', gamesError);
        throw gamesError;
      }

      console.log(`Successfully upserted ${insertedGames?.length || 0} games`);

      // Create a map of steam_id to game_id for crack status insertion
      const steamIdToGameId = {};
      insertedGames?.forEach(game => {
        steamIdToGameId[game.steam_id] = game.id;
      });

      // Insert crack status only for new games
      const crackStatusWithGameIds = crackStatusToInsert
        .filter(status => steamIdToGameId[status.steam_id])
        .map(status => ({
          game_id: steamIdToGameId[status.steam_id],
          status: status.status,
          drm_protection: status.drm_protection,
          verified: status.verified
        }));

      if (crackStatusWithGameIds.length > 0) {
        const { error: crackError } = await supabaseClient
          .from('crack_status')
          .upsert(crackStatusWithGameIds, { 
            onConflict: 'game_id',
            ignoreDuplicates: true 
          });

        if (crackError) {
          console.error('Error inserting crack status:', crackError);
          // Don't throw here, games were inserted successfully
        } else {
          console.log(`Successfully inserted crack status for ${crackStatusWithGameIds.length} games`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: gamesToInsert.length,
        message: 'SteamSpy data synchronized successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-steamspy function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
