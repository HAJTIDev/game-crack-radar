
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

    // Handle empty request body gracefully
    let requestData = {};
    try {
      const body = await req.text();
      if (body && body.trim()) {
        requestData = JSON.parse(body);
      }
    } catch (parseError) {
      console.log('No valid JSON body provided, using defaults');
    }

    const { limit = 100 } = requestData;
    
    console.log(`Fetching data from Steam Web API with limit: ${limit}`);

    // Fetch data from Steam Web API
    const steamUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    
    console.log(`Requesting from: ${steamUrl}`);
    
    const response = await fetch(steamUrl);
    if (!response.ok) {
      throw new Error(`Steam API returned ${response.status}: ${response.statusText}`);
    }
    
    const steamData = await response.json();
    const apps = steamData.applist?.apps || [];

    console.log(`Received ${apps.length} apps from Steam API`);

    // Process and insert/update games in our database
    const gamesToInsert = [];
    const crackStatusToInsert = [];
    
    // Take only the first 'limit' apps and filter out non-games (apps with very low appids are usually tools/DLC)
    const filteredApps = apps
      .filter(app => app.appid > 10000 && app.name && app.name.length > 3)
      .slice(0, limit);
    
    for (const app of filteredApps) {
      const game = {
        steam_id: app.appid,
        title: app.name,
        developer: null,
        publisher: null,
        genre: null,
        tags: [],
        owners: null,
        owners_variance: null,
        players_forever: null,
        players_forever_variance: null,
        players_2weeks: null,
        players_2weeks_variance: null,
        average_forever: null,
        average_2weeks: null,
        median_forever: null,
        median_2weeks: null,
        score_rank: null,
        positive: null,
        negative: null,
        userscore: null,
        price: null,
        is_free: false,
        last_synced_at: new Date().toISOString()
      };

      gamesToInsert.push(game);

      // Create initial crack status (assume uncracked for new games)
      const crackStatus = {
        steam_id: app.appid,
        status: 'uncracked',
        drm_protection: ['Steam'], // Default Steam DRM
        verified: false
      };

      crackStatusToInsert.push(crackStatus);
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
        message: 'Steam data synchronized successfully' 
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
