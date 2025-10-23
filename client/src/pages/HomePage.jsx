import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header.jsx";
import MovieGrid from "@/components/MovieGrid.jsx";
import { getRecentMovies } from "@/lib/api.js";

export default function HomePage() {
    const [, setLocation] = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    // Fetch recent movies
    useEffect(() => {
        async function fetchRecentMovies() {
            try {
                setLoading(true);
                const response = await getRecentMovies();
                console.log("getRecentMovies data:", response.data);
                setMovies(response.data);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentMovies();
    }, []);

    // Garante que sejam sempre arrays
    const favoritesList = Array.isArray(movies) ? movies : [];
    const moviesList = Array.isArray(movies) ? movies : [];
    const favoritesSet = new Set(favoritesList.map((fav) => fav.tmdbMovieId));

    const handleFavoriteToggle = (id) => {
        console.log("Favorite toggle for movie:", id);
        // Implementar lógica de favoritos aqui
    };

    const handleMovieClick = (id) => {
        console.log("Movie clicked:", id);
        setSelectedMovieId(id);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header
                    favoritesCount={0}
                    onFavoritesClick={() => setLocation("/favorites")}
                />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Carregando filmes...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                favoritesCount={favoritesSet.size}
                onFavoritesClick={() => setLocation("/favorites")}
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="font-display font-bold text-4xl">
                        Filmes em alta
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Descubra os filmes mais populares do momento
                    </p>
                </div>

                {moviesList.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        Nenhum filme encontrado
                    </div>
                ) : (
                    <MovieGrid
                        movies={moviesList.map((movie) => ({
                            id: movie.id,
                            title: movie.title,
                            posterPath: movie.posterPath
                                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                                : null,
                            rating: movie.rating ?? 0,
                            year: movie.releaseDate?.split('-')[0] ?? 'N/A',
                        }))}
                        favorites={favoritesSet}
                        onFavoriteToggle={handleFavoriteToggle}
                        onMovieClick={handleMovieClick}
                    />
                )}
            </main>
        </div>
    );
}