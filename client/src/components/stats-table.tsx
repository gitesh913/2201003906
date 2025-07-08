import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UrlEntry } from "@shared/schema";
import { format } from "date-fns";

interface StatsTableProps {
  entries: UrlEntry[];
  onRefresh: () => void;
}

export default function StatsTable({ entries }: StatsTableProps) {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy\nHH:mm");
  };

  const getShortUrl = (shortcode: string) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const formatClickDetails = (clicks: UrlEntry['clicks']) => {
    if (clicks.length === 0) {
      return <span className="text-muted-foreground italic">No clicks yet</span>;
    }

    const recentClicks = clicks.slice(-3);
    const remainingCount = clicks.length - recentClicks.length;

    return (
      <div className="text-sm space-y-1">
        {recentClicks.map((click, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>🕐 {format(new Date(click.timestamp), "HH:mm")}</span>
            <span>- {click.referrer}</span>
            <span>({click.location})</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-muted-foreground">
            +{remainingCount} more click{remainingCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  const getClickCountColor = (count: number) => {
    if (count === 0) return "text-muted-foreground";
    if (count < 10) return "text-primary";
    if (count < 50) return "text-green-600";
    return "text-purple-600";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Original URL</TableHead>
            <TableHead>Short URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Total Clicks</TableHead>
            <TableHead>Click Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <a 
                  href={entry.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate max-w-[200px] block"
                >
                  {entry.originalUrl}
                </a>
              </TableCell>
              <TableCell>
                <div className="url-shortener-short-code px-2 py-1 rounded text-xs font-mono">
                  {getShortUrl(entry.shortcode)}
                </div>
              </TableCell>
              <TableCell className="whitespace-pre-line text-sm">
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell className="whitespace-pre-line text-sm">
                {formatDate(entry.expiryTime)}
              </TableCell>
              <TableCell>
                <span className={`font-bold ${getClickCountColor(entry.clickCount)}`}>
                  {entry.clickCount}
                </span>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px]">
                  {formatClickDetails(entry.clicks)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
