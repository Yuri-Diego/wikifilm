import { z } from 'zod';

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
  private posterUrl = 'https://image.tmdb.org/t/p/w500';
  private backdropUrl = 'https://image.tmdb.org/t/p/original';
  private language = 'pt-BR';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchMovies(query: string, page: number = 1): Promise<{
    movies: MovieSearchResult[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      query: query,
      language: this.language,
      page: String(page),
    });

    const url = `${this.baseUrl}/search/movie?${params.toString()}`;
    console.log(url)

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results = z.array(movieSearchResultSchema).parse(data.results);

    const movies = results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterPath: `${this.posterUrl}${movie.poster_path}`,
      backdropPath: `${this.backdropUrl}${movie.backdrop_path}`,
      rating: movie.vote_average,
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
      overview: movie.overview,
    }));

    return {
      movies,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=${this.language}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    const movie = movieDetailsSchema.parse(data);

    return {
      id: movie.id,
      title: movie.title,
      posterPath: `${this.posterUrl}${movie.poster_path}`,
      backdropPath: `${this.backdropUrl}${movie.backdrop_path}`,
      rating: movie.vote_average,
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
      overview: movie.overview,
      releaseDate: movie.release_date || '',
      runtime: movie.runtime,
      genres: movie.genres.map((g) => g.name),
    };
  }

  async getRecentMovies(currentPage: number = 1) {
    const today = new Date().toISOString().split('T')[0] ?? '1970-01-01';
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: this.language,
      sort_by: 'primary_release_date.desc',
      'primary_release_date.lte': today,
      'vote_count.gte': '10',
      include_adult: 'false',
      page: String(currentPage),
    });

    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results = z.array(movieSearchResultSchema).parse(data.results);

    const filtered = results.filter(
      (movie) => movie.release_date && movie.release_date <= today
    );

    const movies = filtered.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterPath: `${this.posterUrl}${movie.poster_path}`,
      backdropPath: `${this.backdropUrl}${movie.backdrop_path}`,
      rating: movie.vote_average,
      releaseDate: movie.release_date,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear().toString()
        : 'N/A',
      overview: movie.overview,
    }));

    return {
      movies,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
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
