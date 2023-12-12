import { useEffect, useRef, useState } from "react";

import {
  Canceller,
  clearAnimationFrameTimeout,
  setAnimationFrameTimeout,
} from "@/utils/setAnimationFrameTimeout";

export type Stage = "entering" | "idle" | "leaving";

export function useTransition(state: boolean, timeout: number) {
  // the stage of transition - 'entering' | 'idle' | 'leaving'
  const [stage, setStage] = useState<Stage>(state ? "idle" : "entering");

  // the timer for should mount
  const timer = useRef<Canceller>({});
  const [shouldMount, setShouldMount] = useState(state);

  useEffect(
    function handleStateChange() {
      clearAnimationFrameTimeout(timer.current);

      // when true - trans from to enter
      // when false - trans enter to leave, unmount after timeout
      if (state) {
        setStage("entering");
        setShouldMount(true);
        timer.current = setAnimationFrameTimeout(() => {
          setStage("idle");
        });
      } else {
        setStage("leaving");
        timer.current = setAnimationFrameTimeout(() => {
          setShouldMount(false);
        }, timeout);
      }

      return () => {
        clearAnimationFrameTimeout(timer.current);
      };
    },
    [state, timeout]
  );

  return {
    stage,
    shouldMount,
  };
}
