import { X, Heart, Calendar, Clock, Star } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MovieDetailsModal({
  isOpen,
  onClose,
  movie,
  loading,
  isFavorite,
  onFavoriteToggle,
}) {
  const isMobile = useIsMobile();
  // Loading state
  if (loading || !movie) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Carregando detalhes do filme...</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="w-5 h-5 " />
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Construir URLs das imagens
  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : null;

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto" data-testid="modal-movie-details">
        <div className="relative">
          {/* Backdrop Image */}
          {backdropUrl && !isMobile && (
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          )}


          {/* Content */}
          <div className="p-8">
            <div className="flex gap-6 flex-col md:flex-row">
              {/* Poster */}
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full md:w-48 rounded-lg shadow-lg flex-shrink-0"
                />
              )}

              {/* Movie Info */}
              <div className="flex-1 space-y-4">
                {/* Title & Rating */}
                <div>
                  <h2
                    className="font-display font-semibold text-3xl mb-3"
                    data-testid="text-movie-title"
                  >
                    {movie.title}
                  </h2>

                  {/* Rating */}
                  {movie.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">
                          {movie.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-sm">/10</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badges: Year, Runtime, Genres */}
                <div className="flex flex-wrap gap-3">
                  {movie.releaseDate && (
                    <Badge variant="secondary" className="gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {movie.releaseDate.split('-')[0]}
                    </Badge>
                  )}
                  {movie.runtime && (
                    <Badge variant="secondary" className="gap-1.5">
                      <Clock className="w-3 h-3" />
                      {movie.runtime} min
                    </Badge>
                  )}
                  {movie.genres?.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <div className="prose prose-sm max-w-none">
                    <p
                      className="text-muted-foreground leading-relaxed"
                      data-testid="text-movie-overview"
                    >
                      {movie.overview}
                    </p>
                  </div>
                )}

                {/* Favorite Button */}
                <Button
                  size="lg"
                  variant={isFavorite ? "default" : "outline"}
                  onClick={() => onFavoriteToggle(movie.id)}
                  data-testid="button-toggle-favorite"
                  className="w-full md:w-auto"
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`}
                  />
                  {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}