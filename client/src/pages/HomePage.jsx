import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header.jsx";
import MovieGrid from "@/components/MovieGrid.jsx";
import { getRecentMovies, addFavorite, removeFavorite, getFavorites, getMovieDetails, searchMovies } from "@/lib/api.js";
import EmptyState from "@/components/EmptyState";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { debounce } from "lodash";


export default function HomePage() {
    const [, navigate] = useLocation();
    
    const getUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            query: params.get('query') || '',
            page: parseInt(params.get('page') || '1', 10)
        };
    };
    
    const urlParams = getUrlParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState();
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlParams.query);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const [currentPage, setCurrentPage] = useState(urlParams.page);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    const lastSearchQuery = useRef(urlParams.query);
    const lastSearchPage = useRef(urlParams.page);
    const hasInitialized = useRef(false);

    // Effect para carregamento INICIAL
    useEffect(() => {
        if (hasInitialized.current) return;
        
        async function initialLoad() {
            
            if (searchQuery.trim()) {
                // Tem busca na URL
                try {
                    setIsSearching(true);
                    const response = await searchMovies(searchQuery, currentPage);
                    setSearchResults(response.data.movies || []);
                    setTotalPages(response.data.totalPages);
                    setTotalResults(response.data.totalResults);
                } catch (error) {
                    console.error("Erro ao buscar filmes:", error);
                } finally {
                    setIsSearching(false);
                    setLoading(false);
                }
            } else {
                // Sem busca, carregar filmes recentes
                try {
                    setLoading(true);
                    const response = await getRecentMovies(currentPage);
                    setMovies(response.data.movies);
                    setTotalPages(response.data.totalPages);
                    setTotalResults(response.data.totalResults);
                } catch (error) {
                    console.error("Erro ao buscar filmes:", error);
                } finally {
                    setLoading(false);
                }
            }
            
            hasInitialized.current = true;
        }
        
        initialLoad();
    }, []);

    // Sincronizar URL
    useEffect(() => {
        if (!hasInitialized.current) return;
        
        const params = new URLSearchParams();
        
        if (searchQuery.trim()) {
            params.set('query', searchQuery);
        }
        
        if (currentPage > 1 || searchQuery.trim()) {
            params.set('page', String(currentPage));
        }
        
        const newSearch = params.toString();
        const newUrl = newSearch ? `/?${newSearch}` : '/';
        
        if (window.location.pathname + window.location.search !== newUrl) {
            window.history.pushState({}, '', newUrl);
        }
    }, [searchQuery, currentPage]);

    // Listener back/done button
    useEffect(() => {
        const handlePopState = () => {
            const params = getUrlParams();
            setSearchQuery(params.query);
            setCurrentPage(params.page);
            lastSearchQuery.current = params.query;
            lastSearchPage.current = params.page;
            
            if (params.query.trim()) {
                fetchSearchResults(params.query, params.page);
            }
        };
        
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Fetch Favorites
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
    const fetchSearchResults = async (query, page = 1) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            setCurrentPage(1);
            return;
        }

        try {
            setIsSearching(true);
            const response = await searchMovies(query, page);
            setSearchResults(response.data.movies || []);
            setTotalPages(response.data.totalPages);
            setTotalResults(response.data.totalResults);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // debounce para pesquisa
    const debouncedFetch = useMemo(
        () => debounce((query, page) => {
            fetchSearchResults(query, page);
        }, 500),
        []
    );

    useEffect(() => {
        if (!hasInitialized.current) return;
        
        const isQueryChanged = searchQuery !== lastSearchQuery.current;
        const isPageChanged = currentPage !== lastSearchPage.current;

        if (searchQuery.trim()) {
            // Modo BUSCA
            if (isQueryChanged) {
                lastSearchQuery.current = searchQuery;
                lastSearchPage.current = 1;
                setCurrentPage(1);
                debouncedFetch(searchQuery, 1);
            }
            else if (isPageChanged) {
                lastSearchPage.current = currentPage;
                fetchSearchResults(searchQuery, currentPage);
            }
        } else {
            // Modo FILMES RECENTES
            if (isQueryChanged) {
                // Limpou a busca
                setSearchResults([]);
                setIsSearching(false);
                lastSearchQuery.current = "";
                lastSearchPage.current = 1;
                setCurrentPage(1);
                
                // Buscar filmes recentes página 1
                (async () => {
                    try {
                        setLoading(true);
                        const response = await getRecentMovies(1);
                        setMovies(response.data.movies);
                        setTotalPages(response.data.totalPages);
                        setTotalResults(response.data.totalResults);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (error) {
                        console.error("Erro ao buscar filmes:", error);
                    } finally {
                        setLoading(false);
                    }
                })();
            } else if (isPageChanged) {
                lastSearchPage.current = currentPage;
                
                (async () => {
                    try {
                        setLoading(true);
                        const response = await getRecentMovies(currentPage);
                        setMovies(response.data.movies);
                        setTotalPages(response.data.totalPages);
                        setTotalResults(response.data.totalResults);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (error) {
                        console.error("Erro ao buscar filmes:", error);
                    } finally {
                        setLoading(false);
                    }
                })();
            }
        }

        return () => debouncedFetch.cancel();
    }, [searchQuery, currentPage, debouncedFetch]);

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

    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const favoritesSet = useMemo(
        () => new Set(favorites.map((f) => f.tmdbMovieId)),
        [favorites]
    );

    const displayedMovies = searchQuery.trim() ? searchResults : movies;
    const isShowingSearchResults = searchQuery.trim().length > 0;

    if ((loading || isSearching) && !hasInitialized.current) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header
                    favoritesCount={favorites.length}
                    onFavoritesClick={() => navigate("/favorites")}
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
                onFavoritesClick={() => navigate("/favorites")}
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
                                ? `Página ${currentPage} de ${totalPages} • ${totalResults} resultados`
                                : `Página ${currentPage} de ${totalPages} • ${totalResults} filmes`}
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
                    <>
                        <MovieGrid
                            movies={displayedMovies.map((movie) => ({
                                id: movie.id,
                                title: movie.title,
                                posterPath: movie.posterPath,
                                rating: movie.rating ?? 0,
                                year: movie.year,
                            }))}
                            favorites={favoritesSet}
                            onFavoriteToggle={handleFavoriteToggle}
                            onMovieClick={handleMovieClick}
                        />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isLoading={loading || isSearching}
                            />
                        )}
                    </>
                )}

                {!isSearching && displayedMovies.length === 0 && (
                    <EmptyState
                        type={isShowingSearchResults ? "no-results" : "search"}
                        query={searchQuery}
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