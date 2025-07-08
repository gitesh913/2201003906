import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, MousePointer } from "lucide-react";
import { UrlEntry } from "@shared/schema";
import { format } from "date-fns";

interface ResultsDisplayProps {
  results: UrlEntry[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const getShortUrl = (shortcode: string) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy HH:mm:ss");
  };

  return (
    <Card className="url-shortener-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle className="h-6 w-6" />
          Shortened URLs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="url-shortener-result rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {result.originalUrl}
                </p>
              </div>
              <div className="url-shortener-short-code px-3 py-1 rounded text-sm font-mono">
                {getShortUrl(result.shortcode)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created: {formatDate(result.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Expires: {formatDate(result.expiryTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MousePointer className="h-4 w-4" />
                <span>Clicks: {result.clickCount}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
