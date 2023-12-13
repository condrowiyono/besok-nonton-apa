import { RefObject, useEffect } from "react";

export function useFocusTrap(
  target: RefObject<HTMLElement>,
  shouldMount?: boolean
) {
  useEffect(() => {
    const targetElement = target.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusable = targetElement?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) satisfies NodeListOf<HTMLElement> | undefined;

        const firstEl = focusable?.[0];
        const lastEl = focusable?.[focusable.length - 1];

        if (event.shiftKey && document.activeElement === firstEl) {
          lastEl?.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          firstEl?.focus();
          event.preventDefault();
        }
      }
    };

    if (targetElement && shouldMount) {
      targetElement.focus();
      targetElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [target, shouldMount]);
}
