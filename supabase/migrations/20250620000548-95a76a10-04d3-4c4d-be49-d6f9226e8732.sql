
-- Create games table with comprehensive fields for SteamSpy data
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  steam_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  developer TEXT,
  publisher TEXT,
  release_date DATE,
  genre TEXT,
  tags TEXT[], -- Array of tags
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  owners TEXT, -- SteamSpy owners range (e.g., "1,000,000 .. 2,000,000")
  owners_variance INTEGER,
  players_forever INTEGER,
  players_forever_variance INTEGER,
  players_2weeks INTEGER,
  players_2weeks_variance INTEGER,
  average_forever INTEGER, -- Average playtime
  average_2weeks INTEGER,
  median_forever INTEGER, -- Median playtime
  median_2weeks INTEGER,
  score_rank INTEGER,
  positive INTEGER, -- Positive reviews
  negative INTEGER, -- Negative reviews
  userscore INTEGER, -- User score
  languages TEXT[],
  achievements INTEGER,
  screenshots_count INTEGER,
  videos_count INTEGER,
  dlc_count INTEGER,
  header_image TEXT,
  website TEXT,
  metacritic_score INTEGER,
  metacritic_url TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  has_trading_cards BOOLEAN DEFAULT FALSE,
  has_achievements BOOLEAN DEFAULT FALSE,
  has_dlc BOOLEAN DEFAULT FALSE,
  early_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Create crack_status table to track crack information
CREATE TABLE public.crack_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('cracked', 'uncracked', 'drm_free')),
  crack_date DATE,
  cracked_by TEXT,
  drm_protection TEXT[], -- Array of DRM types
  protection_strength TEXT CHECK (protection_strength IN ('weak', 'medium', 'strong', 'unbreakable')),
  crack_quality TEXT CHECK (crack_quality IN ('perfect', 'good', 'buggy', 'broken')),
  notes TEXT,
  source_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_updates table to track game version updates
CREATE TABLE public.game_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  version_number TEXT,
  update_date DATE,
  changelog TEXT,
  breaks_crack BOOLEAN DEFAULT FALSE,
  new_protection_added BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_games_steam_id ON public.games(steam_id);
CREATE INDEX idx_games_title ON public.games(title);
CREATE INDEX idx_games_release_date ON public.games(release_date);
CREATE INDEX idx_games_genre ON public.games(genre);
CREATE INDEX idx_games_owners ON public.games(owners);
CREATE INDEX idx_games_last_synced ON public.games(last_synced_at);

CREATE INDEX idx_crack_status_game_id ON public.crack_status(game_id);
CREATE INDEX idx_crack_status_status ON public.crack_status(status);
CREATE INDEX idx_crack_status_crack_date ON public.crack_status(crack_date);

CREATE INDEX idx_game_updates_game_id ON public.game_updates(game_id);
CREATE INDEX idx_game_updates_date ON public.game_updates(update_date);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crack_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public database)
CREATE POLICY "Allow public read access to games" 
  ON public.games FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to crack_status" 
  ON public.crack_status FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to game_updates" 
  ON public.game_updates FOR SELECT 
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_games_updated_at 
  BEFORE UPDATE ON public.games 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crack_status_updated_at 
  BEFORE UPDATE ON public.crack_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
