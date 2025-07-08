import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UrlFormData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UrlFormProps {
  index: number;
  data: UrlFormData;
  onChange: (data: UrlFormData) => void;
}

export default function UrlForm({ index, data, onChange }: UrlFormProps) {
  const handleChange = (field: keyof UrlFormData, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <Card className="url-shortener-form">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-primary">URL #{index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <Label htmlFor={`url-${index}`} className="text-sm font-medium text-muted-foreground">
              Long URL *
            </Label>
            <Input
              id={`url-${index}`}
              type="url"
              placeholder="https://example.com/very-long-url"
              value={data.longUrl}
              onChange={(e) => handleChange("longUrl", e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the URL you want to shorten
            </p>
          </div>
          
          <div className="md:col-span-3">
            <Label htmlFor={`validity-${index}`} className="text-sm font-medium text-muted-foreground">
              Validity (minutes)
            </Label>
            <Input
              id={`validity-${index}`}
              type="number"
              placeholder="30"
              min="1"
              max="10080"
              value={data.validityMinutes || ""}
              onChange={(e) => handleChange("validityMinutes", parseInt(e.target.value) || 30)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Default: 30 min
            </p>
          </div>
          
          <div className="md:col-span-3">
            <Label htmlFor={`shortcode-${index}`} className="text-sm font-medium text-muted-foreground">
              Custom Shortcode
            </Label>
            <Input
              id={`shortcode-${index}`}
              type="text"
              placeholder="my-link"
              pattern="[a-zA-Z0-9]+"
              value={data.customShortcode || ""}
              onChange={(e) => handleChange("customShortcode", e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alphanumeric only
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
