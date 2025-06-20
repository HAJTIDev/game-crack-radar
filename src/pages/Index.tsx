
import { useState, useMemo } from "react";
import { Gamepad2, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GameCard from "@/components/GameCard";
import StatsCard from "@/components/StatsCard";
import SearchFilters from "@/components/SearchFilters";
import GameTabs from "@/components/GameTabs";
import SyncButton from "@/components/SyncButton";
import { useGamesData } from "@/hooks/useGamesData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "cracked" | "uncracked">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  
  const { data: gamesData, isLoading, error } = useGamesData(currentPage, pageSize);
  const games = gamesData?.games || [];
  const totalCount = gamesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "cracked" && game.crack_status?.status === "cracked") ||
        (selectedStatus === "uncracked" && game.crack_status?.status === "uncracked");
      return matchesSearch && matchesStatus;
    });
  }, [games, searchTerm, selectedStatus]);

  // For stats, we need to calculate from all games, not just current page
  const crackedGames = useMemo(() => 
    games.filter(game => game.crack_status?.status === "cracked"), [games]);
  
  const uncrackedGames = useMemo(() => 
    games.filter(game => game.crack_status?.status === "uncracked"), [games]);
  
  const latestCracks = useMemo(() => {
    return crackedGames
      .filter(game => game.crack_status?.crack_date)
      .sort((a, b) => new Date(b.crack_status!.crack_date!).getTime() - new Date(a.crack_status!.crack_date!).getTime())
      .slice(0, 3);
  }, [crackedGames]);

  const getDaysSinceCrack = (crackDate: string) => {
    const days = Math.floor((Date.now() - new Date(crackDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    console.error("Error loading games:", error);
  }

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
              <SyncButton />
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                <Users className="h-3 w-3 mr-1" />
                SteamSpy Powered
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Games"
            value={totalCount}
            description="In database"
            color="blue"
            icon={<Gamepad2 className="h-4 w-4 text-blue-400" />}
          />
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
            value={latestCracks.length > 0 ? getDaysSinceCrack(latestCracks[0].crack_status!.crack_date!) : 0}
            description="Days ago"
            color="blue"
            icon={<Clock className="h-4 w-4 text-blue-400" />}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading games...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">Error loading games. Please try syncing with SteamSpy.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && totalCount === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Games Found</h3>
            <p className="text-gray-400 mb-6">
              The database is empty. Click "Sync SteamSpy" to load game data.
            </p>
            <SyncButton />
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && totalCount > 0 && (
          <>
            <GameTabs
              filteredGames={filteredGames}
              latestCracks={latestCracks}
              uncrackedGames={uncrackedGames}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="bg-gray-800/50 rounded-lg p-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "text-white hover:bg-gray-700"}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                            className={currentPage === page 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <PaginationItem>
                        <span className="text-gray-400 px-2">...</span>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "text-white hover:bg-gray-700"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            
            <div className="text-center mt-4 text-gray-400 text-sm">
              Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount} games
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
