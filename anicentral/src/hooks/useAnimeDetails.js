import { useState, useEffect, useCallback } from "react";
import { getAnimeDetails, getMoreCharacters } from "@/lib/anilist";

export function useAnimeDetails(id) {
  const [anime, setAnime] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for pagination
  const [characters, setCharacters] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Reset state on ID change
    setAnime(null);
    setCharacters(null);
    setError(null);
    setIsLoading(true);
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getAnimeDetails(id);
        setAnime(data);
        setCharacters(data.characters); // Initialize characters state
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  // Function to load the next page of characters
  const loadMoreCharacters = useCallback(async () => {
    if (!characters?.pageInfo?.hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = characters.pageInfo.currentPage + 1;
      const newCharactersData = await getMoreCharacters(id, nextPage);

      // Append new characters to the existing list
      setCharacters((prev) => ({
        ...newCharactersData, // new pageInfo
        edges: [...prev.edges, ...newCharactersData.edges], // combined edges
      }));
    } catch (err) {
      console.error("Failed to load more characters:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [id, characters, loadingMore]);

  return {
    anime,
    isLoading,
    error,
    characters,
    loadMoreCharacters,
    loadingMore,
  };
}
