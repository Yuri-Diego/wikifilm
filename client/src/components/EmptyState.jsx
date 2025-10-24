import { Film, Search, Heart } from "lucide-react";

export default function EmptyState({ type, query }) {
    const content = {
        search: {
            icon: Search,
            title: "Pesquise seus filmes favoritos",
            description: "Use a barra de pesquisa acima para encontrar filmes",
        },
        favorites: {
            icon: Heart,
            title: "Sua lista está vazia",
            description: "Comece adicionando filmes aos seus favoritos",
        },
        "no-results": {
            icon: Film,
            title: `Nenhum filme encontrado para "${query}"`,
            description: "Tente pesquisar com termos diferentes",
        },
    };

    const { icon: Icon, title, description } = content[type];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="empty-state">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Icon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2" data-testid="text-empty-title">
                {title}
            </h3>
            <p className="text-muted-foreground text-center max-w-md" data-testid="text-empty-description">
                {description}
            </p>
        </div>
    );
}
