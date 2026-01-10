import { useCallback, useState } from "react";

export function useNaturalSizeMap() {
  const [naturalById, setNaturalById] = useState<
    Record<string, { w: number; h: number }>
  >({});

  const registerNaturalSize = useCallback(
    (id: string, w: number, h: number) => {
      if (!w || !h) return;

      setNaturalById((cur) => (cur[id] ? cur : { ...cur, [id]: { w, h } }));
    },
    [],
  );

  return { naturalById, registerNaturalSize };
}
