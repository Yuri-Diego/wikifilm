import { number, z } from 'zod';

const movieSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string().optional(),
  overview: z.string(),
});

const movieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string().optional(),
  overview: z.string(),
  runtime: z.number().nullable(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
});

export interface MovieSearchResult {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  year: string;
  overview: string;
}

export interface MovieDetails extends MovieSearchResult {
  releaseDate: string;
  runtime: number | null;
  genres: string[];
}

export class TMDbService {
  private apiKey: string;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchMovies(query: string): Promise<MovieSearchResult[]> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results = z.array(movieSearchResultSchema).parse(data.results);

    return results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      rating: movie.vote_average,
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
      overview: movie.overview,
    }));
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    const movie = movieDetailsSchema.parse(data);

    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      rating: movie.vote_average,
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
      overview: movie.overview,
      releaseDate: movie.release_date || '',
      runtime: movie.runtime,
      genres: movie.genres.map((g) => g.name),
    };
  }

  async getRecentMovies(page: number, limit = 15) {
    const today = new Date().toISOString().split('T')[0] ?? '1970-01-01';
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'pt-BR',
      sort_by: 'primary_release_date.desc',
      'primary_release_date.lte': today,
      'vote_count.gte': '10',
      include_adult: 'false',
      page: '1',
    });
    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();

    const results = z.array(movieSearchResultSchema).parse(data.results);

    const filtered = results.filter(
      (movie) => movie.release_date && movie.release_date <= today);

    const limited = filtered.slice(0, limit);

    return limited.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      rating: movie.vote_average,
      releaseDate: movie.release_date,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear().toString()
        : 'N/A',
      overview: movie.overview,
    }));
  }
}

let tmdbService: TMDbService | null = null;

export function getTMDbService(): TMDbService {
  const apiKey = process.env.TMDB_API_KEY;
  
  if (!apiKey) {
    throw new Error("TMDB_API_KEY environment variable is not set");
  }

  if (!tmdbService) {
    tmdbService = new TMDbService(apiKey);
  }

  return tmdbService;
}
