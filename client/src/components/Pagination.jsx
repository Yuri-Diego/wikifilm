import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    // Limitar totalPages a um máximo razoável para não gerar muitos números
    const maxPages = Math.min(totalPages, 500);

    for (let i = 1; i <= maxPages; i++) {
      if (i === 1 || i === maxPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {/* Primeira página */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg bg-card border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Primeira página"
      >
        <ChevronsLeft size={20} />
      </button>

      {/* Página anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg bg-card border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Página anterior"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Números das páginas */}
      <div className="flex gap-2 flex-wrap justify-center">
        {pageNumbers.map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === pageNum
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border hover:bg-accent'
              } disabled:cursor-not-allowed`}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      {/* Próxima página */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg bg-card border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Próxima página"
      >
        <ChevronRight size={20} />
      </button>

      {/* Última página */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg bg-card border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Última página"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}