
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameCard from "./GameCard";

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

interface GameTabsProps {
  filteredGames: Game[];
  latestCracks: Game[];
  uncrackedGames: Game[];
}

const GameTabs = ({ filteredGames, latestCracks, uncrackedGames }: GameTabsProps) => {
  return (
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
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="latest" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCracks.map((game) => (
            <GameCard key={game.id} game={game} variant="latest" />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="uncracked" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uncrackedGames.map((game) => (
            <GameCard key={game.id} game={game} variant="uncracked" />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default GameTabs;
