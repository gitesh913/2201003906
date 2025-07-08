import { Link, useLocation } from "wouter";
import { LinkIcon, BarChart3Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="url-shortener-header text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-8 w-8" />
            <h1 className="text-2xl font-medium">URL Shortener</h1>
          </div>
          
          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                "hover:bg-white/10",
                isActive("/") && "bg-white/20"
              )}
            >
              <LinkIcon className="h-5 w-5" />
              Shortener
            </Link>
            <Link
              href="/stats"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                "hover:bg-white/10",
                isActive("/stats") && "bg-white/20"
              )}
            >
              <BarChart3Icon className="h-5 w-5" />
              Statistics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
