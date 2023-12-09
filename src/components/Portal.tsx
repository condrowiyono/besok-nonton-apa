"use client";

import { ReactNode, useState, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ReactPortalProps = {
  children: ReactNode;
  wrapperId: string;
};

const ReactPortal = ({
  children,
  wrapperId = "react-portal",
}: ReactPortalProps) => {
  const [wrapper, setWrapper] = useState<Element | null>(null);
  const created = useRef(false);

  useLayoutEffect(() => {
    // Find the container-element (if exist).
    let element = document.getElementById(wrapperId);

    created.current = false;
    if (!element) {
      created.current = true;
      const wrapper = document.createElement("div");
      wrapper.setAttribute("id", wrapperId);
      document.body.appendChild(wrapper);
      element = wrapper;
    }

    // Set wrapper state.
    setWrapper(element);

    // Cleanup effect.
    return () => {
      if (created.current && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // Return null on initial rendering.
  if (wrapper === null) return null;

  // Return portal-wrapper component.
  return createPortal(children, wrapper);
};

export default ReactPortal;
