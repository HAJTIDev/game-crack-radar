
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import { useSyncSteamSpy } from "@/hooks/useGamesData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const SyncButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { refetch: syncSteamSpy } = useSyncSteamSpy();

  const handleSync = async () => {
    setIsLoading(true);
    toast.info("Starting SteamSpy sync...");
    
    try {
      await syncSteamSpy();
      // Invalidate games query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success("Successfully synced with SteamSpy API!");
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Failed to sync with SteamSpy API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Database className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Syncing..." : "Sync SteamSpy"}
    </Button>
  );
};

export default SyncButton;
