import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import { getFavorites, removeFavorite, getMovieDetails } from "@/lib/api.js";
import { useLocation } from "wouter";
import EmptyState from "@/components/EmptyState";
import MovieDetailsModal from "@/components/MovieDetailsModal";

export default function FavoritesPage() {
    const [, setLocation] = useLocation();
    const [favorites, setFavorites] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState();
    const [loadingDetails, setLoadingDetails] = useState(true)

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

    // Fetch movie details
    useEffect(() => {
        async function fetchMovieDetails() {
            if (!selectedMovieId) {
                setSelectedMovie(null);
                return;
            }

            try {
                setLoadingDetails(true);
                const response = await getMovieDetails(selectedMovieId);
                console.log("Movie details:", response);
                setSelectedMovie(response.data || response);
            } catch (error) {
                console.error("Erro ao buscar detalhes do filme:", error);
                setSelectedMovie(null);
            } finally {
                setLoadingDetails(false);
            }
        }

        fetchMovieDetails();
    }, [selectedMovieId]);


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

    const handleCloseModal = () => {
        setSelectedMovieId(null);
        setSelectedMovie(null);
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
                    <EmptyState type="favorites" />
                ) : (
                    <MovieGrid
                        movies={favoriteMovies}
                        favorites={favoritesSet}
                        onFavoriteToggle={handleFavoriteToggle}
                        onMovieClick={handleMovieClick}
                    />
                )}
            </main>

            <MovieDetailsModal
                isOpen={selectedMovie !== null}
                onClose={handleCloseModal}
                movie={selectedMovie}
                loading={loadingDetails}
                isFavorite={favorites.some((f) => f.tmdbMovieId === selectedMovieId)}
                onFavoriteToggle={handleFavoriteToggle}
            />
        </div>
    );
}