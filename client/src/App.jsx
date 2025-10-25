import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import HomePage from "@/pages/HomePage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import SharedListPage from "./pages/SharedListPage.jsx";
import NotFound from "./components/not-found.jsx";
import { Toaster } from "./components/ui/toaster.jsx";


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/share/:shareId" component={SharedListPage} />
      <Route component={NotFound} />
    </Switch>
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

export default App
