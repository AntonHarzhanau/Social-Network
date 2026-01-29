import { useEffect, useState } from "react";

export function useIsBelowLg() {
  const [below, setBelow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setBelow(mq.matches);

    apply();
    mq.addEventListener("change", apply);

    return () => mq.removeEventListener("change", apply);
  }, []);

  return below;
}
