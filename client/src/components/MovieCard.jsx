import { Heart, Star } from "lucide-react";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useState } from "react";

export default function MovieCard({
  id,
  title,
  posterPath,
  rating,
  year,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(id)}
      data-testid={`card-movie-${id}`}
    >
      <div className="aspect-[2/3] relative w-full h-full">
        {posterPath ? (
          <img
            src={posterPath}
            alt={title}
            className="absolut inset-0 w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Star className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        <Badge
          className="absolute top-1 left-1 z-10 no-default-hover-elevate bg-yellow-300 text-black backdrop-blur-sm py-1 shadow-md transition-transform duration-500 ease-out group-hover:scale-95"
          data-testid={`badge-rating-${id}`}
        >
          <Star className="w-4 h-4 fill-black text-black mr-1.5" />
          <span className="font-black text-base">{rating?.toFixed(1) ?? 'N/A'}</span>
        </Badge>

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            <h3 className="font-display font-semibold text-white text-base line-clamp-2" data-testid={`text-title-${id}`}>
              {title}
            </h3>
            <p className="text-white/70 text-sm">{year}</p>
            <Button
              size="sm"
              variant={isFavorite ? "default" : "outline"}
              className={`w-full ${isFavorite ? "bg-primary" : "bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"}`}
              onClick={handleFavoriteClick}
              data-testid={`button-favorite-${id}`}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
              />
              {isFavorite ? "Nos Favoritos" : "Adicionar aos Favoritos"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
