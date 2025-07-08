import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon, Rainbow } from "lucide-react";
import UrlForm from "@/components/url-form";
import ResultsDisplay from "@/components/results-display";
import { UrlFormData, UrlEntry } from "@shared/schema";
import { createShortUrl, generateShortcode } from "@/lib/url-shortener";
import { saveUrlEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Log } from "../../../Logging Middleware/logger";

export default function ShortenerPage() {
  const [urlForms, setUrlForms] = useState<UrlFormData[]>(Array(5).fill(null).map(() => ({
    longUrl: "",
    validityMinutes: 30,
    customShortcode: ""
  })));
  const [results, setResults] = useState<UrlEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormChange = (index: number, data: UrlFormData) => {
    const newForms = [...urlForms];
    newForms[index] = data;
    setUrlForms(newForms);
  };

  const handleShortenUrls = async () => {
    setIsSubmitting(true);
    Log("shortener", "info", "url-shortener", "Starting URL shortening process");

    try {
      // Filter out empty URLs
      const validForms = urlForms.filter(form => form.longUrl.trim() !== "");
      
      if (validForms.length === 0) {
        toast({
          title: "No URLs to shorten",
          description: "Please enter at least one URL to shorten.",
          variant: "destructive"
        });
        return;
      }

      // Validate and create short URLs
      const newResults: UrlEntry[] = [];
      const usedShortcodes = new Set<string>();
      
      for (const form of validForms) {
        try {
          const shortcode = form.customShortcode || generateShortcode();
          
          // Check if shortcode is already used
          if (usedShortcodes.has(shortcode)) {
            throw new Error(`Shortcode "${shortcode}" is already in use`);
          }
          
          usedShortcodes.add(shortcode);
          
          const urlEntry = createShortUrl(form.longUrl, shortcode, form.validityMinutes || 30);
          saveUrlEntry(urlEntry);
          newResults.push(urlEntry);
          
          Log("shortener", "info", "url-shortener", `Created short URL: ${shortcode}`);
        } catch (error) {
          Log("shortener", "error", "url-shortener", `Failed to create short URL: ${error}`);
          toast({
            title: "URL Shortening Failed",
            description: error instanceof Error ? error.message : "Unknown error occurred",
            variant: "destructive"
          });
        }
      }

      setResults(newResults);
      
      if (newResults.length > 0) {
        toast({
          title: "URLs Shortened Successfully",
          description: `${newResults.length} URL(s) have been shortened.`,
        });
      }
      
    } catch (error) {
      Log("shortener", "error", "url-shortener", `Shortening process failed: ${error}`);
      toast({
        title: "Error",
        description: "An error occurred while shortening URLs.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = () => {
    setUrlForms(Array(5).fill(null).map(() => ({
      longUrl: "",
      validityMinutes: 30,
      customShortcode: ""
    })));
    setResults([]);
    Log("shortener", "info", "url-shortener", "Cleared all forms");
  };

  return (
    <div className="space-y-6">
      <Card className="url-shortener-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <LinkIcon className="h-6 w-6" />
            URL Shortener
          </CardTitle>
          <CardDescription>
            Shorten up to 5 URLs at once. Each URL can have optional custom settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {urlForms.map((form, index) => (
            <UrlForm
              key={index}
              index={index}
              data={form}
              onChange={(data) => handleFormChange(index, data)}
            />
          ))}
          
          <div className="flex gap-4">
            <Button 
              onClick={handleShortenUrls}
              disabled={isSubmitting}
              className="bg-[var(--url-shortener-primary)] hover:bg-[var(--url-shortener-primary)]/90"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Shortening..." : "Shorten URLs"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              disabled={isSubmitting}
            >
              <Rainbow className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && <ResultsDisplay results={results} />}
    </div>
  );
}
