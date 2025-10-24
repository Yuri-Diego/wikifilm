import { Switch, Route } from "wouter";
import HomePage from "@/pages/HomePage.jsx";
import { queryClient } from "@/lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/favorites" component={FavoritesPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
