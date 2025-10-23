import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({
  movies,
  favorites,
  onFavoriteToggle,
  onMovieClick,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          {...movie}
          isFavorite={favorites.has(movie.id)}
          onFavoriteToggle={onFavoriteToggle}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
}