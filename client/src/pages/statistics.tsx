import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, Download, Trash2 } from "lucide-react";
import StatsTable from "@/components/stats-table";
import { UrlEntry } from "@shared/schema";
import { getAllUrlEntries, clearAllUrlEntries } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Log } from "../../../Logging Middleware/logger";

export default function StatisticsPage() {
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const entries = getAllUrlEntries();
    setUrlEntries(entries);
    Log("stats", "info", "url-shortener", `Loaded ${entries.length} URL entries`);
  };

  const handleExportStats = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalUrls: urlEntries.length,
        totalClicks: urlEntries.reduce((sum, entry) => sum + entry.clickCount, 0),
        urls: urlEntries.map(entry => ({
          originalUrl: entry.originalUrl,
          shortcode: entry.shortcode,
          createdAt: entry.createdAt,
          expiryTime: entry.expiryTime,
          clickCount: entry.clickCount,
          clicks: entry.clicks
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `url-shortener-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Statistics Exported",
        description: "Your statistics have been exported successfully.",
      });
      
      Log("stats", "info", "url-shortener", "Statistics exported");
    } catch (error) {
      Log("stats", "error", "url-shortener", `Export failed: ${error}`);
      toast({
        title: "Export Failed",
        description: "Failed to export statistics.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllStats = () => {
    if (window.confirm("Are you sure you want to clear all statistics? This action cannot be undone.")) {
      clearAllUrlEntries();
      setUrlEntries([]);
      toast({
        title: "Statistics Cleared",
        description: "All statistics have been cleared.",
      });
      Log("stats", "info", "url-shortener", "All statistics cleared");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="url-shortener-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BarChart3Icon className="h-6 w-6" />
            URL Statistics
          </CardTitle>
          <CardDescription>
            View detailed analytics for all shortened URLs in your session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {urlEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Statistics Available</h3>
              <p>Create some shortened URLs first to see statistics here.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <StatsTable entries={urlEntries} onRefresh={loadStats} />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleExportStats}
                  className="bg-[var(--url-shortener-secondary)] hover:bg-[var(--url-shortener-secondary)]/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Statistics
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearAllStats}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
