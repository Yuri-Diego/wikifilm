import axios from "axios";

export async function searchMovies(query) {
    try {
        const response = await axios.get(`/api/movies/search`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to search movies");
    }
}

export async function getMovieDetails(movieId) {
    try {
        const response = await axios.get(`/api/movies/${movieId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch movie details");
    }
}

export async function getRecentMovies() {
    try {
        const response = await axios.get(`/api/movies/recent`)
    } catch (error) {
        throw new Error("Failed to fetch recent movies");
    }
}

export async function getFavorites() {
    try {
        const response = await axios.get("/api/favorites");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch favorites");
    }
}

export async function addFavorite(movie) {
    try {
        const response = await axios.post("/api/favorites", {
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
        const message =
            error.response?.data?.error || "Failed to add favorite";
        throw new Error(message);
    }
}

export async function removeFavorite(tmdbMovieId) {
    try {
        await axios.delete(`/api/favorites/${tmdbMovieId}`);
    } catch (error) {
        const status = error.response?.status;
        if (status !== 204) {
            throw new Error("Failed to remove favorite");
        }
    }
}

export async function createShareLink() {
    try {
        const response = await axios.post("/api/favorites/share");
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.error || "Failed to create share link";
        throw new Error(message);
    }
}

export async function getSharedFavorites(shareId) {
    try {
        const response = await axios.get(`/api/favorites/share/${shareId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch shared favorites");
    }
}
