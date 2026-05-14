import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFavorites();
      setFavorites(response.favorites);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (favorite) => {
    try {
      setError(null);
      const response = await apiClient.addFavorite(favorite);
      setFavorites([...favorites, response.favorite]);
      return response.favorite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [favorites]);

  const updateFavorite = useCallback(async (id, data) => {
    try {
      setError(null);
      const response = await apiClient.updateFavorite(id, data);
      setFavorites(favorites.map(f => f._id === id ? response.favorite : f));
      return response.favorite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [favorites]);

  const deleteFavorite = useCallback(async (id) => {
    try {
      setError(null);
      await apiClient.deleteFavorite(id);
      setFavorites(favorites.filter(f => f._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addFavorite,
    updateFavorite,
    deleteFavorite,
  };
}
