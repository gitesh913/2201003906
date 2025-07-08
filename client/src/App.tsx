import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ShortenerPage from "@/pages/shortener";
import StatisticsPage from "@/pages/statistics";
import RedirectPage from "@/pages/redirect";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <Switch>
          <Route path="/" component={ShortenerPage} />
          <Route path="/stats" component={StatisticsPage} />
          <Route path="/:shortcode" component={RedirectPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
