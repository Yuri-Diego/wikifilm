import axios from "axios";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ⚙️ Cria uma instância Axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function handleAxiosError(error) {
  const status = error.response?.status;
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Erro desconhecido";
  console.error(`Erro ${status || ""}: ${message}`);
  throw new Error(message);
}

export async function searchMovies(query) {
    try {
        const response = await api.get(`/movies/search`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function getMovieDetails(movieId) {
    try {
        const response = await api.get(`/movies/${movieId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function getRecentMovies(page = 1) {
    try {
        const response = await api.get(`/movies/recent?page=${page}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function getFavorites() {
    try {
        const response = await api.get("/favorites");
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function addFavorite(movie) {
    try {
        const response = await api.post("/favorites", {
            tmdbMovieId: movie.id,
            title: movie.title,
            posterPath: movie.posterPath,
            backdropPath: movie.backdropPath,
            rating: movie.rating,
            year: movie.year,
            overview: movie.overview,
            releaseDate: movie.releaseDate,
            runtime: movie.runtime,
            genres: movie.genres || [],
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function removeFavorite(tmdbMovieId) {
    try {
        await api.delete(`/favorites/${tmdbMovieId}`);
    } catch (error) {
        const status = error.response?.status;
        if (status !== 204) {
            handleAxiosError(error)
        }
    }
}

export async function createShareLink() {
    try {
        const response = await api.post("/favorites/share");
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export async function getSharedFavorites(shareId) {
    try {
        const response = await api.get(`/favorites/share/${shareId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}
export default api;
