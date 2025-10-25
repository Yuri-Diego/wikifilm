import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import {
    getFavorites,
    removeFavorite,
    getMovieDetails,
    createShareLink,
} from "@/lib/api.js";
import { useLocation } from "wouter";
import EmptyState from "@/components/EmptyState";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import ShareDialog from "@/components/ShareDialog";
import { useToast } from "@/hooks/use-toast";

export default function FavoritesPage() {
    const [, setLocation] = useLocation();
    const { toast } = useToast()

    const [favorites, setFavorites] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState();
    const [loadingDetails, setLoadingDetails] = useState(true);


    const [showShareDialog, setShowShareDialog] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [isLoadingShare, setIsLoadingShare] = useState(false);
    const [shareError, setShareError] = useState(null);

    // fetch favorites movies
    useEffect(() => {
        async function fetchFavorites() {
            try {
                const response = await getFavorites();
                setFavorites(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
                toast({
                    title: "Erro ao buscar favoritos",
                    description: "Não foi possível carregar sua lista de favoritos.",
                    variant: "destructive",
                });
            }
        }
        fetchFavorites();
    }, [toast]);

    // fetch movie details
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
                toast({
                    title: "Erro ao buscar detalhes",
                    description: "Não foi possível carregar os detalhes do filme.",
                    variant: "destructive",
                });
            } finally {
                setLoadingDetails(false);
            }
        }

        fetchMovieDetails();
    }, [selectedMovieId, toast]);

    // create shareLink
    const handleCreateShareLink = async () => {
        setIsLoadingShare(true);
        setShareError(null);

        try {
            const data = await createShareLink();
            const url = `${window.location.origin}/share/${data.shareId}`;
            setShareUrl(url);
            setShowShareDialog(true);
            toast({
                title: "Link criado com sucesso!",
                description: "Seu link de compartilhamento está pronto.",
            });
        } catch (err) {
            setShareError(err instanceof Error ? err.message : "Erro ao criar link");
            console.error("Erro ao criar link de compartilhamento:", err);
            toast({
                title: "Erro ao criar link",
                description: err instanceof Error ? err.message : "Não foi possível criar o link de compartilhamento.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingShare(false);
        }
    };

    const favoritesSet = new Set(favorites.map((f) => f.tmdbMovieId));

    const handleFavoriteToggle = async (id) => {
        try {
            await removeFavorite(id);
            setFavorites((prev) => prev.filter((f) => f.tmdbMovieId !== id));
            toast({
                title: "Removido dos favoritos",
                description: "O filme foi removido da sua lista.",
            });
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            toast({
                title: "Erro ao remover favorito",
                description: "Não foi possível remover o filme da sua lista.",
                variant: "destructive",
            });
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
    }));

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                favoritesCount={favorites.length}
                onFavoritesClick={() => setLocation("/")}
                onShareClick={handleCreateShareLink} // botão do Header aciona o link
                showShareButton={favorites.length > 0}
                isLoading={isLoadingShare}
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="font-display font-bold text-3xl mb-2">
                        Meus Favoritos
                    </h2>
                    <p className="text-muted-foreground">
                        {favorites.length > 0
                            ? `Você tem ${favorites.length} ${favorites.length === 1 ? "filme" : "filmes"
                            } na sua lista`
                            : "Sua lista de favoritos está vazia"}
                    </p>
                </div>

                {shareError && (
                    <p className="text-sm text-red-500 mb-4">{shareError}</p>
                )}

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
                isFavorite={favorites.some(
                    (f) => f.tmdbMovieId === selectedMovieId
                )}
                onFavoriteToggle={handleFavoriteToggle}
            />

            <ShareDialog
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                shareUrl={shareUrl}
            />
        </div>
    );
}
