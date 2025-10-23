import { Film, Heart, Share2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useState, useEffect } from "react";

export default function Header({
  favoritesCount,
  onFavoritesClick,
  onShareClick,
  showShareButton = false,
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-xl" data-testid="text-app-title">
            WikiFilm
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {showShareButton && (
            <Button
              variant="outline"
              size="default"
              onClick={onShareClick}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          )}

          <Button
            variant="outline"
            size="default"
            onClick={onFavoritesClick}
            className="relative"
            data-testid="button-favorites"
          >
            <Heart className="w-4 h-4 mr-2" />
            Meus Favoritos
            {favoritesCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center px-1.5"
                data-testid="badge-favorites-count"
              >
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
