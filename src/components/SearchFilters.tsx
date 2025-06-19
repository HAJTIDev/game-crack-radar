
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: "all" | "cracked" | "uncracked";
  setSelectedStatus: (status: "all" | "cracked" | "uncracked") => void;
  crackedCount: number;
  uncrackedCount: number;
}

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedStatus, 
  setSelectedStatus, 
  crackedCount, 
  uncrackedCount 
}: SearchFiltersProps) => {
  return (
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
          ✅ Cracked ({crackedCount})
        </Button>
        <Button
          variant={selectedStatus === "uncracked" ? "default" : "outline"}
          onClick={() => setSelectedStatus("uncracked")}
          className={selectedStatus === "uncracked" 
            ? "bg-red-600 hover:bg-red-700" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          ❌ Uncracked ({uncrackedCount})
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
