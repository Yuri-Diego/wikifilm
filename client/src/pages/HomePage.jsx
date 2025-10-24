import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header.jsx";
import MovieGrid from "@/components/MovieGrid.jsx";
import { getRecentMovies, addFavorite, removeFavorite, getFavorites } from "@/lib/api.js";

export default function HomePage() {
    const [, setLocation] = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Fetch recent movies
    useEffect(() => {
        async function fetchRecentMovies() {
            try {
                setLoading(true);
                const response = await getRecentMovies();
                setMovies(response.data);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentMovies();
    }, []);

    // Fetch Favorites movies
    useEffect(() => {
        async function fetchFavorites() {
            try {
                const response = await getFavorites();
                setFavorites(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
            }
        }
        fetchFavorites();
    }, []);


    const handleFavoriteToggle = async (id) => {
        try {
            if (favorites.some((f) => f.tmdbMovieId === id)) {
                await removeFavorite(id);
                setFavorites((prev) =>
                    prev.filter((f) => f.tmdbMovieId !== id)
                );
            } else {
                const movie = movies.find((m) => m.id === id)
                if (!movie) return;
                const newFav = await addFavorite(movie);
                setFavorites((prev) => [...prev, newFav.data]);
            }
        } catch (error) {
            console.error("Erro ao alterar favorito:", error);
        }
    };

    const handleMovieClick = (id) => {
        setSelectedMovieId(id);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header
                    favoritesCount={favorites.length}
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
                favoritesCount={favorites.length}
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

                {movies.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        Nenhum filme encontrado
                    </div>
                ) : (
                    <MovieGrid
                        movies={movies.map((movie) => ({
                            id: movie.id,
                            title: movie.title,
                            posterPath: movie.posterPath
                                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                                : null,
                            rating: movie.rating ?? 0,
                            year: movie.releaseDate?.split('-')[0] ?? 'N/A',
                        }))}
                        favorites={new Set(favorites.map((f) => f.tmdbMovieId))}
                        onFavoriteToggle={handleFavoriteToggle}
                        onMovieClick={handleMovieClick}
                    />
                )}
            </main>
        </div>
    );
}