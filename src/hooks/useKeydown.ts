import { RefObject, useEffect } from "react";

export function useKeydown(
  key: string,
  target: RefObject<HTMLElement>,
  callback: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    const targetElement = target.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback(event);
      }
    };

    if (targetElement) document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (targetElement)
        targetElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, target, callback]);
}
