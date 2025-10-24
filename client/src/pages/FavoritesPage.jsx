import { useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/api.js";
import { useLocation } from "wouter";

export default function FavoritesPage() {
    const [, setLocation] = useLocation();
    const [favorites, setFavorites] = useState([]);

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

    const favoritesSet = new Set(favorites.map((f) => f.tmdbMovieId));

    const handleFavoriteToggle = async (id) => {
        try {
            console.log(id)
            await removeFavorite(id);
            setFavorites((prev) =>
                prev.filter((f) => f.tmdbMovieId !== id)
            );
        } catch (error) {
            console.error("Erro ao Remover favorito:", error);
        }
    };

    const handleMovieClick = (id) => {
        setSelectedMovieId(id);
    };

    const favoriteMovies = favorites.map((fav) => ({
        id: fav.tmdbMovieId,
        title: fav.title,
        posterPath: fav.posterPath
            ? `https://image.tmdb.org/t/p/w500${fav.posterPath}`
            : null,
        rating: fav.rating,
        year: fav.year,
    }))

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                favoritesCount={favorites.length}
                onFavoritesClick={() => setLocation("/")}
                // onShareClick={handleShare}
                showShareButton={favorites.length > 0}
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="font-display font-bold text-3xl mb-2">
                        Meus Favoritos
                    </h2>
                    <p className="text-muted-foreground">
                        {favorites.length > 0
                            ? `Você tem ${favorites.length} ${favorites.length === 1 ? "filme" : "filmes"} na sua lista`
                            : "Sua lista de favoritos está vazia"}
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <h1>SEM FAVORITOS</h1>
                ) : (
                    <MovieGrid
                        movies={favoriteMovies}
                        favorites={favoritesSet}
                        onFavoriteToggle={handleFavoriteToggle}
                        onMovieClick={handleMovieClick}
                    />
                )}
            </main>
        </div>
    );
}