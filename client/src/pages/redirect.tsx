import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, LinkIcon } from "lucide-react";
import { getUrlEntry, updateUrlEntry } from "@/lib/storage";
import { UrlEntry } from "@shared/schema";
import { Log } from "../../../Logging Middleware/logger";

export default function RedirectPage() {
  const params = useParams();
  const shortcode = params.shortcode as string;
  const [urlEntry, setUrlEntry] = useState<UrlEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shortcode) {
      setError("Invalid shortcode");
      setIsLoading(false);
      return;
    }

    const entry = getUrlEntry(shortcode);
    
    if (!entry) {
      setError("URL not found");
      setIsLoading(false);
      Log("redirect", "warn", "url-shortener", `Shortcode not found: ${shortcode}`);
      return;
    }

    // Check if URL has expired
    const now = new Date();
    const expiryTime = new Date(entry.expiryTime);
    
    if (now > expiryTime) {
      setError("URL has expired");
      setIsLoading(false);
      Log("redirect", "warn", "url-shortener", `Expired URL accessed: ${shortcode}`);
      return;
    }

    // Log the click
    const clickData = {
      timestamp: new Date(),
      referrer: document.referrer || "Direct",
      location: "Unknown", // In a real app, you'd get this from an IP geolocation service
      userAgent: navigator.userAgent
    };

    // Mock location data for demonstration
    const mockLocations = ["India", "US", "UK", "Canada", "Australia"];
    clickData.location = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    const updatedEntry = {
      ...entry,
      clickCount: entry.clickCount + 1,
      clicks: [...entry.clicks, clickData]
    };

    updateUrlEntry(updatedEntry);
    setUrlEntry(updatedEntry);
    
    Log("redirect", "info", "url-shortener", `Click tracked for ${shortcode}: ${clickData.referrer} (${clickData.location})`);

    // Redirect after a brief delay
    setTimeout(() => {
      window.location.href = entry.originalUrl;
    }, 1000);
    
    setIsLoading(false);
  }, [shortcode]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleCreateNew = () => {
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">URL Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The shortened URL you're looking for has either expired or doesn't exist.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleGoHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                <Button variant="outline" onClick={handleCreateNew}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Create New URL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (urlEntry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <LinkIcon className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-2">Redirecting...</h2>
              <p className="text-muted-foreground mb-4">
                You are being redirected to:
              </p>
              <p className="text-sm text-primary break-all mb-6 p-3 bg-primary/10 rounded-md">
                {urlEntry.originalUrl}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href = urlEntry.originalUrl}>
                  Go Now
                </Button>
                <Button variant="outline" onClick={handleGoHome}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
