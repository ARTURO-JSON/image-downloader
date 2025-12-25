import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScrollMovies(onLoadMore, hasMore, isLoading) {
  const observerTarget = useRef(null);

  const handleIntersection = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection]);

  return observerTarget;
}
