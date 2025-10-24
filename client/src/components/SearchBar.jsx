import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/Input";

export default function SearchBar({
    value,
    onChange,
    isLoading = false,
    placeholder = "Pesquisar filmes...",
}) {
    return (
        <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-12 pr-12 h-12 text-base bg-card border-card-border"
                data-testid="input-search"
            />
            {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
            )}
        </div>
    );
}
