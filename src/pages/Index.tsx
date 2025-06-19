
import { useState, useMemo } from "react";
import { Search, Filter, Calendar, Shield, Users, Gamepad2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const crackedGames = mockGames.filter(game => game.status === "cracked");
  const uncrackedGames = mockGames.filter(game => game.status === "uncracked");
  const latestCracks = crackedGames
    .filter(game => game.crackDate)
    .sort((a, b) => new Date(b.crackDate!).getTime() - new Date(a.crackDate!).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getDaysSinceCrack = (crackDate: string) => {
    const days = Math.floor((Date.now() - new Date(crackDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getSteamImageUrl = (steamId: string, imageType: 'header' | 'capsule' = 'header') => {
    if (imageType === 'header') {
      return `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg`;
    }
    return `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/capsule_616x353.jpg`;
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
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              onClick={() => setSelectedStatus("all")}
              className={selectedStatus === "all" 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              All Games
            </Button>
            <Button
              variant={selectedStatus === "cracked" ? "default" : "outline"}
              onClick={() => setSelectedStatus("cracked")}
              className={selectedStatus === "cracked" 
                ? "bg-green-600 hover:bg-green-700" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              ✅ Cracked ({crackedGames.length})
            </Button>
            <Button
              variant={selectedStatus === "uncracked" ? "default" : "outline"}
              onClick={() => setSelectedStatus("uncracked")}
              className={selectedStatus === "uncracked" 
                ? "bg-red-600 hover:bg-red-700" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              ❌ Uncracked ({uncrackedGames.length})
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-green-400">Cracked Games</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{crackedGames.length}</div>
              <p className="text-xs text-gray-400">Available to play</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                <span className="text-sm font-medium text-red-400">Uncracked Games</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{uncrackedGames.length}</div>
              <p className="text-xs text-gray-400">Still protected</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Latest Crack</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {latestCracks.length > 0 ? getDaysSinceCrack(latestCracks[0].crackDate!) : 0}
              </div>
              <p className="text-xs text-gray-400">Days ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
              All Games
            </TabsTrigger>
            <TabsTrigger value="latest" className="data-[state=active]:bg-green-600">
              Latest Cracks
            </TabsTrigger>
            <TabsTrigger value="uncracked" className="data-[state=active]:bg-red-600">
              Uncracked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <Card key={game.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors overflow-hidden">
                  {game.steamId && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={getSteamImageUrl(game.steamId, 'capsule')} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-white text-sm leading-none">{game.title}</h3>
                        <p className="text-xs text-gray-400">{game.genre}</p>
                        {game.steamId && (
                          <p className="text-xs text-blue-400">Steam ID: {game.steamId}</p>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={game.status === "cracked" 
                          ? "border-green-400/30 text-green-400" 
                          : "border-red-400/30 text-red-400"
                        }
                      >
                        {game.status === "cracked" ? "✅ Cracked" : "❌ Uncracked"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">Released:</span>
                        <span className="text-white">{formatDate(game.releaseDate)}</span>
                      </div>
                      
                      {game.crackDate && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Shield className="h-3 w-3 text-green-400" />
                          <span className="text-gray-400">Cracked:</span>
                          <span className="text-green-400">{formatDate(game.crackDate)}</span>
                        </div>
                      )}
                      
                      {game.crackedBy && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Users className="h-3 w-3 text-blue-400" />
                          <span className="text-gray-400">By:</span>
                          <span className="text-blue-400">{game.crackedBy}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-xs text-gray-400">DRM Protection:</span>
                      <div className="flex flex-wrap gap-1">
                        {game.drm.map((protection, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-gray-700 text-gray-300"
                          >
                            {protection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="latest" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestCracks.map((game) => (
                <Card key={game.id} className="bg-gradient-to-br from-green-900/20 to-gray-800/50 border-green-700/50 overflow-hidden">
                  {game.steamId && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={getSteamImageUrl(game.steamId, 'capsule')} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-white text-sm leading-none">{game.title}</h3>
                        <p className="text-xs text-gray-400">{game.genre}</p>
                        {game.steamId && (
                          <p className="text-xs text-blue-400">Steam ID: {game.steamId}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-green-400/30 text-green-400">
                        🔥 Fresh
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Shield className="h-3 w-3 text-green-400" />
                        <span className="text-gray-400">Cracked:</span>
                        <span className="text-green-400">{formatDate(game.crackDate!)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span className="text-gray-400">Days ago:</span>
                        <span className="text-blue-400">{getDaysSinceCrack(game.crackDate!)}</span>
                      </div>
                      
                      {game.crackedBy && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Users className="h-3 w-3 text-yellow-400" />
                          <span className="text-gray-400">By:</span>
                          <span className="text-yellow-400">{game.crackedBy}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-xs text-gray-400">DRM Bypassed:</span>
                      <div className="flex flex-wrap gap-1">
                        {game.drm.map((protection, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-gray-700 text-gray-300"
                          >
                            {protection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="uncracked" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uncrackedGames.map((game) => (
                <Card key={game.id} className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-red-700/50 overflow-hidden">
                  {game.steamId && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={getSteamImageUrl(game.steamId, 'capsule')} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-white text-sm leading-none">{game.title}</h3>
                        <p className="text-xs text-gray-400">{game.genre}</p>
                        {game.steamId && (
                          <p className="text-xs text-blue-400">Steam ID: {game.steamId}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-red-400/30 text-red-400">
                        🔒 Protected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">Released:</span>
                        <span className="text-white">{formatDate(game.releaseDate)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="h-3 w-3 text-red-400" />
                        <span className="text-gray-400">Protected for:</span>
                        <span className="text-red-400">
                          {Math.floor((Date.now() - new Date(game.releaseDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-xs text-gray-400">Active DRM:</span>
                      <div className="flex flex-wrap gap-1">
                        {game.drm.map((protection, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-red-900/30 text-red-300 border border-red-700/30"
                          >
                            🛡️ {protection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
