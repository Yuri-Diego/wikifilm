import { Film, Heart, Share2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header({
  favoritesCount,
  onFavoritesClick,
  onShareClick,
  showShareButton = false,
}) {
  const [isDark, setIsDark] = useState(false);
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const isFavoritesPage = location === "/favorites";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setLocation("/")}
        >
          <Film className="w-6 h-6 text-primary" />
          { (
            <h1 className="font-display font-bold text-xl tracking-tight" data-testid="text-app-title">
              WikiFilm
            </h1>
          )}
        </div>

        {/* AÇÕES */}
        <div className="flex items-center gap-2 sm:gap-4">
          {showShareButton && (
            <Button
              variant="outline"
              size={isMobile ? "icon" : "default"}
              onClick={onShareClick}
              className={`flex items-center justify-center h-10 ${isMobile ? "w-10 p-0" : "px-3 sm:px-4"}`}
              title={isMobile ? "Compartilhar" : ""}
            >
              <Share2 className="w-4 h-4" />
              {!isMobile && <span className="ml-1 font-medium">Compartilhar</span>}
            </Button>
          )}

          <Button
            variant="outline"
            size={isMobile ? "icon" : "default"}
            onClick={onFavoritesClick}
            className={`relative flex items-center justify-center h-10 ${isMobile ? "w-20 p-4" : "px-3 sm:px-4"}`}
            title={isMobile ? "Meus Favoritos" : ""}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFavoritesPage
                  ? "text-red-500 fill-red-500"
                  : "text-muted-foreground group-hover:text-red-400 group-hover:fill-red-400"
                }`}
            />
            {!isMobile && <span className="ml-1 font-medium">Favoritos</span>}
            {favoritesCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground h-4 min-w-4 flex items-center justify-center text-[10px] rounded-full"
              >
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="flex items-center justify-center h-10 w-10"
            title={isDark ? "Modo claro" : "Modo escuro"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}