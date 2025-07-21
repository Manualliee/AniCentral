"use client";
import { useState, useEffect } from "react";
import { fetchTrendingAnime } from "@/lib/anilist";
import PopularAnime from "./PopularAnime";
import dynamic from "next/dynamic";

export default function AnimeBrowser() {
  // Trending anime state
  const [trendingAnime, setTrendingAnime] = useState(null);
  const [trendingError, setTrendingError] = useState(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Dynamically import the carousel with SSR disabled
  const TrendingCarousel = dynamic(() => import("./ui/TrendingCarousel"), {
    ssr: false,
  });

  // Fetch trending anime on mount
  useEffect(() => {
    let cancelled = false;
    setTrendingLoading(true);
    fetchTrendingAnime()
      .then((data) => {
        if (!cancelled) {
          setTrendingAnime(data.anime);
          setTrendingError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setTrendingError(err.message);
      })
      .finally(() => {
        if (!cancelled) setTrendingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      {/* Carousel and header */}
      <div className="relative w-full min-w-0 overflow-x-hidden flex flex-col items-center justify-center mb-8">
        {trendingLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <span>Loading trending anime...</span>
          </div>
        ) : trendingError ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <span className="text-red-500">
              Failed to load trending anime: {trendingError}
            </span>
          </div>
        ) : (
          <TrendingCarousel animeList={trendingAnime || []} />
        )}
      </div>

      {/* Popular Anime */}
      <PopularAnime />
    </div>
  );
}
