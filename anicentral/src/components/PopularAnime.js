"use client";
import { useState, useCallback, useEffect } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { fetchPopularAnime } from "@/lib/anilist";
import AnimeCard, { AnimeModal } from "./AnimeCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function PopularAnime() {
  const [popularAnime, setPopularAnime] = useState([]);
  const [popularPage, setPopularPage] = useState(1);
  const [hasNextPopularPage, setHasNextPopularPage] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [expandedAnime, setExpandedAnime] = useState(null);
  const [animationOrigin, setAnimationOrigin] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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

  useEffect(() => {
    setLoadingPopular(true);
    fetchPopularAnime(1, 24).then((data) => {
      setPopularAnime(data.anime);
      setHasNextPopularPage(data.pageInfo.hasNextPage);
      setPopularPage(1);
      setLoadingPopular(false);
    });
  }, []);

  // Fetch more when scrolled to bottom
  const fetchMorePopular = useCallback(() => {
    if (!hasNextPopularPage || loadingPopular) return;
    setLoadingPopular(true);
    fetchPopularAnime(popularPage + 1, 24).then((data) => {
      setPopularAnime((prev) => {
        const existingIds = new Set(prev.map((anime) => anime.id));
        const newAnime = data.anime.filter(
          (anime) => !existingIds.has(anime.id)
        );
        return [...prev, ...newAnime];
      });
      setHasNextPopularPage(data.pageInfo.hasNextPage);
      setPopularPage((prev) => prev + 1);
      setLoadingPopular(false);
    });
  }, [hasNextPopularPage, loadingPopular, popularPage]);

  useInfiniteScroll({
    onFetchMore: fetchMorePopular,
    hasNextPage: hasNextPopularPage,
    isLoading: loadingPopular,
    deps: [popularPage],
    threshold: 200,
  });

  return (
    <>
      <div className="w-[85%] mx-auto mt-8 mb-4">
        <h2 className="text-2xl font-bold text-left">Most Popular</h2>
      </div>
      <div className="w-[85%] flex flex-row flex-wrap items-center justify-center gap-6">
        {popularAnime && popularAnime.length > 0
          ? popularAnime.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={handleCardClick}
              />
            ))
          : Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
        {/* Show skeletons when loading more */}
        {loadingPopular &&
          popularAnime.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`loadmore-skeleton-${i}`} />
          ))}
      </div>
      <AnimeModal
        anime={expandedAnime}
        animationOrigin={animationOrigin}
        onClose={() => setExpandedAnime(null)}
      />
    </>
  );
}
