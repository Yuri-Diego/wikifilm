import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header.jsx";
import MovieGrid from "@/components/MovieGrid.jsx";
import { getRecentMovies, addFavorite, removeFavorite, getFavorites, getMovieDetails, searchMovies } from "@/lib/api.js";
import EmptyState from "@/components/EmptyState";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import SearchBar from "@/components/SearchBar";
import { debounce } from "lodash";


export default function HomePage() {
    const [, setLocation] = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState();
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

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

    // Fetch search movies
    const fetchSearchResults = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const response = await searchMovies(query);
            setSearchResults(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // debounce para pesquisa
    const debouncedFetch = useMemo(
        () => debounce(fetchSearchResults, 500),
        []
    );

    useEffect(() => {
        debouncedFetch(searchQuery);
        return () => debouncedFetch.cancel();
    }, [searchQuery, debouncedFetch]);

    const handleFavoriteToggle = async (id) => {
        try {
            if (favorites.some((f) => f.tmdbMovieId === id)) {
                await removeFavorite(id);
                setFavorites((prev) =>
                    prev.filter((f) => f.tmdbMovieId !== id)
                );
            } else {
                const movie = [...movies, ...searchResults].find((m) => m.id === id);
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

    const handleCloseModal = () => {
        setSelectedMovieId(null);
        setSelectedMovie(null);
    };

    const favoritesSet = useMemo(
        () => new Set(favorites.map((f) => f.tmdbMovieId)),
        [favorites]
    );

    const displayedMovies = searchQuery.trim() ? searchResults : movies;
    const isShowingSearchResults = searchQuery.trim().length > 0;

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
                <div className="flex flex-col items-center gap-8 mb-8">
                    <div className="text-center space-y-2">
                        <h2 className="font-display font-bold text-4xl">
                            {isShowingSearchResults 
                                ? "Resultados da Pesquisa" 
                                : "Filmes em Alta"}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {isShowingSearchResults
                                ? `${searchResults.length} ${searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
                                : "Descubra os filmes mais populares do momento"}
                        </p>
                    </div>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        isLoading={isSearching}
                    />
                </div>

                {isSearching && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Buscando filmes...</p>
                    </div>
                )}

                {!isSearching && displayedMovies.length > 0 && (
                    <MovieGrid
                        movies={displayedMovies.map((movie) => ({
                            id: movie.id,
                            title: movie.title,
                            posterPath: movie.posterPath
                                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                                : null,
                            rating: movie.rating ?? 0,
                            year: movie.year,
                        }))}
                        favorites={favoritesSet}
                        onFavoriteToggle={handleFavoriteToggle}
                        onMovieClick={handleMovieClick}
                    />
                )}
            </main >


            <MovieDetailsModal
                isOpen={selectedMovie !== null}
                onClose={handleCloseModal}
                movie={selectedMovie}
                loading={loadingDetails}
                isFavorite={favorites.some((f) => f.tmdbMovieId === selectedMovieId)}
                onFavoriteToggle={handleFavoriteToggle}
            />

        </div >
    );
}