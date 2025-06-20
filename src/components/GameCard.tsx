
import { Calendar, Shield, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Game } from "@/hooks/useGamesData";

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

  const getSteamImageUrl = (steamId: number) => {
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
        className={game.crack_status?.status === "cracked" 
          ? "border-green-400/30 text-green-400" 
          : "border-red-400/30 text-red-400"
        }
      >
        {game.crack_status?.status === "cracked" ? "✅ Cracked" : "❌ Uncracked"}
      </Badge>
    );
  };

  return (
    <Card className={getCardClassName()}>
      {game.header_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={game.header_image || getSteamImageUrl(game.steam_id)} 
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = getSteamImageUrl(game.steam_id);
            }}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-white text-sm leading-none">{game.title}</h3>
            <p className="text-xs text-gray-400">{game.genre}</p>
            <p className="text-xs text-blue-400">Steam ID: {game.steam_id}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {game.release_date && (
            <div className="flex items-center space-x-2 text-xs">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-gray-400">Released:</span>
              <span className="text-white">{formatDate(game.release_date)}</span>
            </div>
          )}
          
          {game.crack_status?.crack_date && variant !== "uncracked" && (
            <div className="flex items-center space-x-2 text-xs">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-gray-400">Cracked:</span>
              <span className="text-green-400">{formatDate(game.crack_status.crack_date)}</span>
            </div>
          )}

          {variant === "latest" && game.crack_status?.crack_date && (
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="h-3 w-3 text-blue-400" />
              <span className="text-gray-400">Days ago:</span>
              <span className="text-blue-400">{getDaysSinceCrack(game.crack_status.crack_date)}</span>
            </div>
          )}

          {variant === "uncracked" && game.release_date && (
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="h-3 w-3 text-red-400" />
              <span className="text-gray-400">Protected for:</span>
              <span className="text-red-400">
                {Math.floor((Date.now() - new Date(game.release_date).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          )}
          
          {game.crack_status?.cracked_by && (
            <div className="flex items-center space-x-2 text-xs">
              <Users className={`h-3 w-3 ${variant === "latest" ? "text-yellow-400" : "text-blue-400"}`} />
              <span className="text-gray-400">By:</span>
              <span className={variant === "latest" ? "text-yellow-400" : "text-blue-400"}>{game.crack_status.cracked_by}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <span className="text-xs text-gray-400">
            {variant === "uncracked" ? "Active DRM:" : variant === "latest" ? "DRM Bypassed:" : "DRM Protection:"}
          </span>
          <div className="flex flex-wrap gap-1">
            {game.crack_status?.drm_protection?.map((protection, index) => (
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
            )) || (
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                Unknown
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
