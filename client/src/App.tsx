import { Switch, Route } from "wouter";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { trpc } from "./lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import ComponentShowcase from "./pages/ComponentShowcase";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
      transformer: superjson,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <LanguageProvider>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/showcase" component={ComponentShowcase} />
                <Route component={NotFound} />
              </Switch>
              <Toaster position="top-center" />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
