import { useEffect, useRef } from 'react';

/**
 * Hook for infinite scroll functionality
 * This is commented out for future use - currently using "Load More" button
 * 
 * Usage:
 * const { loadMoreRef } = useInfiniteScroll({
 *   hasMore: hasMorePages,
 *   loading: isLoading,
 *   onLoadMore: handleLoadMore
 * });
 * 
 * Then add ref={loadMoreRef} to a sentinel element at the bottom
 */
export function useInfiniteScroll({ hasMore, loading, onLoadMore }) {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return { loadMoreRef };
}

