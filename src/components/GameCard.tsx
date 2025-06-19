
import { Calendar, Shield, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

interface GameCardProps {
  game: Game;
  variant?: "default" | "latest" | "uncracked";
}

const GameCard = ({ game, variant = "default" }: GameCardProps) => {
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

  const getSteamImageUrl = (steamId: string) => {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/capsule_616x353.jpg`;
  };

  const getCardClassName = () => {
    switch (variant) {
      case "latest":
        return "bg-gradient-to-br from-green-900/20 to-gray-800/50 border-green-700/50 overflow-hidden";
      case "uncracked":
        return "bg-gradient-to-br from-red-900/20 to-gray-800/50 border-red-700/50 overflow-hidden";
      default:
        return "bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors overflow-hidden";
    }
  };

  const getStatusBadge = () => {
    if (variant === "latest") {
      return <Badge variant="outline" className="border-green-400/30 text-green-400">🔥 Fresh</Badge>;
    }
    if (variant === "uncracked") {
      return <Badge variant="outline" className="border-red-400/30 text-red-400">🔒 Protected</Badge>;
    }
    return (
      <Badge 
        variant="outline" 
        className={game.status === "cracked" 
          ? "border-green-400/30 text-green-400" 
          : "border-red-400/30 text-red-400"
        }
      >
        {game.status === "cracked" ? "✅ Cracked" : "❌ Uncracked"}
      </Badge>
    );
  };

  return (
    <Card className={getCardClassName()}>
      {game.steamId && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={getSteamImageUrl(game.steamId)} 
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
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-gray-400">Released:</span>
            <span className="text-white">{formatDate(game.releaseDate)}</span>
          </div>
          
          {game.crackDate && variant !== "uncracked" && (
            <div className="flex items-center space-x-2 text-xs">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-gray-400">Cracked:</span>
              <span className="text-green-400">{formatDate(game.crackDate)}</span>
            </div>
          )}

          {variant === "latest" && game.crackDate && (
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="h-3 w-3 text-blue-400" />
              <span className="text-gray-400">Days ago:</span>
              <span className="text-blue-400">{getDaysSinceCrack(game.crackDate)}</span>
            </div>
          )}

          {variant === "uncracked" && (
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="h-3 w-3 text-red-400" />
              <span className="text-gray-400">Protected for:</span>
              <span className="text-red-400">
                {Math.floor((Date.now() - new Date(game.releaseDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          )}
          
          {game.crackedBy && (
            <div className="flex items-center space-x-2 text-xs">
              <Users className={`h-3 w-3 ${variant === "latest" ? "text-yellow-400" : "text-blue-400"}`} />
              <span className="text-gray-400">By:</span>
              <span className={variant === "latest" ? "text-yellow-400" : "text-blue-400"}>{game.crackedBy}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <span className="text-xs text-gray-400">
            {variant === "uncracked" ? "Active DRM:" : variant === "latest" ? "DRM Bypassed:" : "DRM Protection:"}
          </span>
          <div className="flex flex-wrap gap-1">
            {game.drm.map((protection, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={
                  variant === "uncracked" 
                    ? "text-xs bg-red-900/30 text-red-300 border border-red-700/30"
                    : "text-xs bg-gray-700 text-gray-300"
                }
              >
                {variant === "uncracked" ? `🛡️ ${protection}` : protection}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
