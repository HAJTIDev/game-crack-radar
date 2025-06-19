import { useState, useMemo } from "react";
import { Gamepad2, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GameCard from "@/components/GameCard";
import StatsCard from "@/components/StatsCard";
import SearchFilters from "@/components/SearchFilters";
import GameTabs from "@/components/GameTabs";

interface Game {
  id: string;
  title: string;
  releaseDate: string;
  crackDate?: string;
  status: "cracked" | "uncracked";
  drm: string[];
  crackedBy?: string;
  genre: string;
  image: string;
  steamId?: string;
}

const mockGames: Game[] = [
  {
    id: "1",
    title: "Cyberpunk 2077: Phantom Liberty",
    releaseDate: "2023-09-26",
    crackDate: "2023-09-28",
    status: "cracked",
    drm: ["Denuvo", "Steam"],
    crackedBy: "CODEX",
    genre: "RPG",
    image: "/placeholder.svg",
    steamId: "1091500"
  },
  {
    id: "2",
    title: "Assassin's Creed Mirage",
    releaseDate: "2023-10-05",
    status: "uncracked",
    drm: ["Denuvo", "Ubisoft Connect"],
    genre: "Action",
    image: "/placeholder.svg",
    steamId: "2319580"
  },
  {
    id: "3",
    title: "Baldur's Gate 3",
    releaseDate: "2023-08-03",
    crackDate: "2023-08-03",
    status: "cracked",
    drm: ["Steam"],
    crackedBy: "DRM-Free",
    genre: "RPG",
    image: "/placeholder.svg",
    steamId: "1086940"
  },
  {
    id: "4",
    title: "Starfield",
    releaseDate: "2023-09-06",
    crackDate: "2023-09-07",
    status: "cracked",
    drm: ["Steam"],
    crackedBy: "CODEX",
    genre: "RPG",
    image: "/placeholder.svg",
    steamId: "1716740"
  },
  {
    id: "5",
    title: "Forza Motorsport",
    releaseDate: "2023-10-10",
    status: "uncracked",
    drm: ["Denuvo", "Microsoft Store"],
    genre: "Racing",
    image: "/placeholder.svg",
    steamId: "1551360"
  },
  {
    id: "6",
    title: "Marvel's Spider-Man 2",
    releaseDate: "2023-10-20",
    status: "uncracked",
    drm: ["PlayStation Exclusive"],
    genre: "Action",
    image: "/placeholder.svg"
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "cracked" | "uncracked">("all");

  const filteredGames = useMemo(() => {
    return mockGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || game.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const crackedGames = useMemo(() => mockGames.filter(game => game.status === "cracked"), []);
  const uncrackedGames = useMemo(() => mockGames.filter(game => game.status === "uncracked"), []);
  
  const latestCracks = useMemo(() => {
    return crackedGames
      .filter(game => game.crackDate)
      .sort((a, b) => new Date(b.crackDate!).getTime() - new Date(a.crackDate!).getTime())
      .slice(0, 3);
  }, [crackedGames]);

  const getDaysSinceCrack = (crackDate: string) => {
    const days = Math.floor((Date.now() - new Date(crackDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-green-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                CrackWatch
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                <Users className="h-3 w-3 mr-1" />
                Community Driven
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          crackedCount={crackedGames.length}
          uncrackedCount={uncrackedGames.length}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Cracked Games"
            value={crackedGames.length}
            description="Available to play"
            color="green"
            icon={<div className="h-2 w-2 bg-green-400 rounded-full"></div>}
          />
          <StatsCard
            title="Uncracked Games"
            value={uncrackedGames.length}
            description="Still protected"
            color="red"
            icon={<div className="h-2 w-2 bg-red-400 rounded-full"></div>}
          />
          <StatsCard
            title="Latest Crack"
            value={latestCracks.length > 0 ? getDaysSinceCrack(latestCracks[0].crackDate!) : 0}
            description="Days ago"
            color="blue"
            icon={<Clock className="h-4 w-4 text-blue-400" />}
          />
        </div>

        {/* Main Content */}
        <GameTabs
          filteredGames={filteredGames}
          latestCracks={latestCracks}
          uncrackedGames={uncrackedGames}
        />
      </div>
    </div>
  );
};

export default Index;
