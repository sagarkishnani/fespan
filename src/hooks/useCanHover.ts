import { useEffect, useState } from "react";

export const CAN_HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export default function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(CAN_HOVER_QUERY);
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return canHover;
}
