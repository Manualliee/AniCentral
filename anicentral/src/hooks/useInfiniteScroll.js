import { useEffect, useCallback } from "react";

export default function useInfiniteScroll({
  onFetchMore,
  hasNextPage,
  isLoading,
  deps = [],
  threshold = 200,
}) {
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isLoading) return;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight - (scrollY + windowHeight) < threshold) {
      onFetchMore();
    }
  }, [hasNextPage, isLoading, onFetchMore, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleScroll, ...deps]);
}