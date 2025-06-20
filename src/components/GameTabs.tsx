
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameCard from "./GameCard";
import { Game } from "@/hooks/useGamesData";

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
          All Games ({filteredGames.length})
        </TabsTrigger>
        <TabsTrigger value="latest" className="data-[state=active]:bg-green-600">
          Latest Cracks ({latestCracks.length})
        </TabsTrigger>
        <TabsTrigger value="uncracked" className="data-[state=active]:bg-red-600">
          Uncracked ({uncrackedGames.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        {filteredGames.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No games found. Try adjusting your search or sync with SteamSpy.
          </div>
        )}
      </TabsContent>

      <TabsContent value="latest" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCracks.map((game) => (
            <GameCard key={game.id} game={game} variant="latest" />
          ))}
        </div>
        {latestCracks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No recent cracks found.
          </div>
        )}
      </TabsContent>

      <TabsContent value="uncracked" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uncrackedGames.map((game) => (
            <GameCard key={game.id} game={game} variant="uncracked" />
          ))}
        </div>
        {uncrackedGames.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No uncracked games found.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default GameTabs;
