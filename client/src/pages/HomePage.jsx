import Header from '@/components/Header.jsx'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col items-center gap-8 mb-8">
                    <div className="text-center space-y-2">
                        <h2 className="font-display font-bold text-4xl">
                            Descubra seus filmes favoritos
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Pesquise, salve e compartilhe sua lista de filmes
                        </p>
                    </div>
                    
                </div>

                
            </main>

        
        </div>
    );
}