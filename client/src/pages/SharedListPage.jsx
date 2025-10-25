import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/Header.jsx";
import MovieGrid from "@/components/MovieGrid.jsx";
import MovieDetailsModal from "@/components/MovieDetailsModal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Share2, Loader2 } from "lucide-react";
import { getSharedFavorites, getMovieDetails } from "@/lib/api.js";

export default function SharedListPage() {
    const [, params] = useRoute("/share/:shareId");
    const [, setLocation] = useLocation();
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const [sharedData, setSharedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const shareId = params?.shareId || "";

    // Fetch shared favorites
    useEffect(() => {
        if (!shareId) return;

        const fetchSharedFavorites = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getSharedFavorites(shareId);
                setSharedData(response);
            } catch (err) {
                console.error("Erro ao buscar lista compartilhada:", err);
                setError(err instanceof Error ? err.message : "Erro ao carregar lista");
            } finally {
                setLoading(false);
            }
        };

        fetchSharedFavorites();
    }, [shareId]);

    // Fetch selected movie details
    useEffect(() => {
        if (!selectedMovieId) {
            setSelectedMovie(null);
            return;
        }

        const fetchMovieDetails = async () => {
            setLoadingDetails(true);
            try {
                const data = await getMovieDetails(selectedMovieId);
                setSelectedMovie(data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do filme:", err);
                setSelectedMovie(null);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchMovieDetails();
    }, [selectedMovieId]);

    const handleMovieClick = (id) => setSelectedMovieId(id);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header favoritesCount={0} onFavoritesClick={() => setLocation("/")} />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Carregando lista compartilhada...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !sharedData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header favoritesCount={0} onFavoritesClick={() => setLocation("/")} />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <Share2 className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="font-display font-bold text-2xl">Lista não encontrada</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Este link de compartilhamento não é válido ou expirou.
                        </p>
                        <Button onClick={() => setLocation("/")}>Voltar para a página inicial</Button>
                    </div>
                </main>
            </div>
        );
    }

    const sharedMovies = sharedData.favorites.map((fav) => ({
        id: fav.tmdbMovieId,
        title: fav.title,
        posterPath: fav.posterPath
            ? `https://image.tmdb.org/t/p/w500${fav.posterPath}`
            : null,
        rating: fav.rating,
        year: fav.year,
    }));

    return (
        <div className="min-h-screen flex flex-col">
            <Header favoritesCount={0} onFavoritesClick={() => setLocation("/")} />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Share2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-3xl">Lista Compartilhada</h2>
                            <p className="text-muted-foreground">
                                {sharedMovies.length} {sharedMovies.length === 1 ? "filme" : "filmes"} nesta coleção
                            </p>
                        </div>
                    </div>
                </div>

                <MovieGrid
                    movies={sharedMovies}
                    favorites={new Set()}
                    onFavoriteToggle={() => { }}
                    onMovieClick={handleMovieClick}
                />

                <div className="mt-12 text-center py-8 border-t">
                    <h3 className="font-display font-semibold text-xl mb-2">Gostou desta lista?</h3>
                    <p className="text-muted-foreground mb-4">Crie sua própria lista de filmes favoritos</p>
                    <Button size="lg" onClick={() => setLocation("/")} data-testid="button-create-list">
                        Criar Minha Lista
                    </Button>
                </div>
            </main>

            {selectedMovie && (
                <MovieDetailsModal
                    isOpen={!!selectedMovie}
                    onClose={() => setSelectedMovieId(null)}
                    movie={selectedMovie}
                    isFavorite={false}
                    loading={loadingDetails}
                    onFavoriteToggle={() => { }}
                />
            )}
        </div>
    );
}
