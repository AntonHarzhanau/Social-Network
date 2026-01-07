import { useEffect, useRef } from "react";

interface Args {
    enabled: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
}

export const useInfiniteScrollSentinel = ({
    enabled,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin = "200px",
}: Args) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                if (!hasNextPage) return;
                if (isFetchingNextPage) return;

                fetchNextPage();
            },
            { root: null, rootMargin, threshold: 0 },
        );
        observer.observe(el);

        return () => observer.disconnect();
    }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin]);

    return ref;
}
