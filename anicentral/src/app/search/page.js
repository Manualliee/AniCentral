"use client";
import { useState, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import AnimeCard, { AnimeModal } from "@/components/AnimeCard";
import { searchAnimeByTitle } from "@/lib/anilist";
import SkeletonCard from "@/components/ui/SkeletonCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedAnime, setExpandedAnime] = useState(null);
  const [animationOrigin, setAnimationOrigin] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const debouncedSearch = useRef(
    debounce(async (value, page = 1) => {
      if (page === 1) setIsSearching(true);
      else setIsLoadingMore(true);
      try {
        const data = await searchAnimeByTitle(value, page, 20);
        setSearchResults(
          page === 1 ? data.anime : (prev) => [...prev, ...data.anime]
        );
        setHasNextPage(data.pageInfo.hasNextPage);
        setCurrentPage(page);
      } catch (error) {
        setSearchResults([]);
        setHasNextPage(false);
      } finally {
        if (page === 1) setIsSearching(false);
        else setIsLoadingMore(false);
      }
    }, 500)
  ).current;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedSearch(searchValue, 1);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value, 1);
  };

  const handleCardClick = (anime, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnimationOrigin({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setExpandedAnime(expandedAnime?.id === anime.id ? null : anime);
  };

  // Use the custom infinite scroll hook
  const fetchMore = useCallback(() => {
    if (searchValue && hasNextPage && !isSearching && !isLoadingMore) {
      debouncedSearch(searchValue, currentPage + 1);
    }
  }, [
    searchValue,
    hasNextPage,
    isSearching,
    isLoadingMore,
    currentPage,
    debouncedSearch,
  ]);

  useInfiniteScroll({
    onFetchMore: fetchMore,
    hasNextPage,
    isLoading: isSearching || isLoadingMore,
    deps: [searchValue, currentPage], // re-run if these change
    threshold: 200,
  });

  return (
    <div className="w-full flex flex-col justify-center px-4 py-8">
      <form
        className="w-full flex justify-center"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search"
          className="w-[70%] text-2xl px-4 py-2 border-0 border-b-2 border-accent focus:outline-none focus:border-b-4 transition-all"
        />
      </form>

      <div className="flex justify-center flex-wrap gap-6 mt-6">
        {isSearching
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={`search-skeleton-${i}`} />
            ))
          : searchResults.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={handleCardClick}
              />
            ))}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`loadmore-skeleton-${i}`} />
          ))}
      </div>
      {isLoadingMore && <div className="mt-4 text-center">Loading more...</div>}
      <AnimeModal
        anime={expandedAnime}
        animationOrigin={animationOrigin}
        onClose={() => setExpandedAnime(null)}
      />
    </div>
  );
}
