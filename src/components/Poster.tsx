"use client";

import { useEffect, useRef, useState } from "react";
import ReactPortal from "./Portal";
import { useTransition } from "../hooks/useTransition";
import Image from "next/image";
import { Offer, WatchNowOffer } from "@/interfaces/justwatch";
import { formatDuration, formatNumber } from "@/utils/format";

const PREVIEW_WIDTH = 850;
const PREVIEW_TOP = 40;
const CARD_WIDTH = 120;
const CARD_HEIGHT = 180;
const MAX_CREDIT = 10;

interface PosterProps {
  title: string;
  synopsis?: string;
  poster: string;
  backdrop?: string;
  originalReleaseYear?: number;
  runtime?: number;
  genres?: string[];
  credits?: string[];
  offers?: Offer[];
  imdbScore?: number;
  imdbVotes?: number;
  watchNowOffer?: WatchNowOffer;
}

export const Poster = (props: PosterProps) => {
  const {
    title,
    synopsis,
    poster,
    backdrop,
    originalReleaseYear,
    credits,
    genres,
    offers,
    watchNowOffer,
    runtime,
    imdbScore,
    imdbVotes,
  } = props;

  const offersMap = new Map<string, string>(
    offers?.map((offer) => [offer.package.clearName, offer.standardWebURL])
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("");

  const { shouldMount, stage } = useTransition(open, 300);
  const { stage: buttonStage } = useTransition(!open, 300);

  const handlePosterMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const adjustedWidth = (window.innerWidth - PREVIEW_WIDTH) / 2;
    const x = adjustedWidth > 0 ? left - adjustedWidth : left;
    const y = top - PREVIEW_TOP;

    setTransformOrigin(`${x}px ${y}px`);
  };

  const handleClickMask = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && setOpen(false);
  };

  useEffect(() => {
    const modalElement = contentRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusable = modalElement?.querySelectorAll(
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
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (modalElement && shouldMount) {
      modalElement.focus();
      modalElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [shouldMount]);

  return (
    <>
      <button
        type="button"
        title={title}
        onMouseDown={handlePosterMouseDown}
        onClick={() => setOpen(true)}
        className={`block rounded-lg shadow-lg duration-300 h-[180px] w-[120px]`}
        style={{
          opacity: buttonStage === "leave" ? 0 : 1,
          transform: buttonStage === "leave" ? "scale(2)" : "unset",
          transformOrigin,
        }}
      >
        <Image
          alt={`poster-${title}`}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          src={poster}
          className="rounded-lg object-cover h-full w-full"
        />
      </button>

      <ReactPortal wrapperId="react-portal-modal-container">
        {shouldMount && (
          <div className="modal open">
            <div
              className="overlay fixed inset-0 z-10 duration-300 transition-all"
              style={{
                opacity: stage === "enter" ? 1 : 0,
                backgroundColor: stage === "enter" ? "rgba(0,0,0,.5)" : "unset",
                backdropFilter: stage === "enter" ? "blur(8px)" : "unset",
              }}
            />
            <div
              className="fixed inset-0 z-10 overflow-y-auto"
              onClick={handleClickMask}
            >
              <div
                className={`content mx-auto absolute inset-0 max-w-full h-fit rounded-lg shadow-lg z-10 overflow-hidden duration-300`}
                ref={contentRef}
                tabIndex={0}
                style={{
                  width: PREVIEW_WIDTH,
                  top: PREVIEW_TOP,
                  opacity: stage === "enter" ? 1 : 0,
                  transform: stage === "enter" ? "unset" : "scale(.5)",
                  transformOrigin,
                }}
              >
                <div
                  className="content-background absolute inset-0 z-[-1] bg-cover blur-3xl brightness-50 scale-150"
                  style={{ background: `url(${poster}), #181818` }}
                />
                <div className="relative">
                  <Image
                    className="h-[480px] object-cover rounded-t-lg"
                    alt={`backdrop-${title}`}
                    src={backdrop || poster}
                    width={PREVIEW_WIDTH}
                    height={480}
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  {/* <div
                    className="video-wrapper"
                    style={{ width: PREVIEW_WIDTH, height: 480 }}
                  >
                    <iframe
                      className="video"
                      width={PREVIEW_WIDTH}
                      height={480}
                      src="https://www.youtube-nocookie.com/embed/1ZdlAg3j8nI?si=biZ_RRmaCD3SlitD&amp;controls=0&amp;start=8&amp;rel=0&amp;autoplay=1"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div> */}
                  <h1 className="font-bold text-3xl absolute px-4 pb-4 bottom-0 text-shadow-lg">
                    {title}
                  </h1>
                </div>
                <div
                  className="p-4 grid gap-4"
                  style={{
                    gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-4 grid-cols-2">
                      <a
                        href={watchNowOffer?.standardWebURL}
                        target="_blank"
                        className="rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-300 text-center"
                      >
                        Putar di {watchNowOffer?.package.clearName}
                      </a>
                      <button
                        className="rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-300"
                        onClick={() =>
                          navigator.share({
                            title: title,
                            text: synopsis,
                            url: watchNowOffer?.standardWebURL,
                          })
                        }
                      >
                        Bagikan
                      </button>
                    </div>
                    <div className="meta inline-flex items-center gap-4 font-semibold text-gray-400">
                      <span>{originalReleaseYear}</span>
                      <span>{formatDuration(runtime)}</span>
                      <span>
                        {imdbScore} ({formatNumber(imdbVotes)})
                      </span>
                    </div>
                    <p className="line-clamp-5">{synopsis}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="font-sm">
                      <span className="text-gray-400">Cast: </span>
                      {credits?.slice(0, MAX_CREDIT).map((name, idx) => (
                        <span key={name}>
                          <a
                            href={`https://google.com/search?q=${name}`}
                            className="hover:underline"
                            target="_blank"
                          >
                            {name}
                          </a>
                          {idx < Math.min(MAX_CREDIT, credits.length) - 1 &&
                            ", "}
                        </span>
                      ))}
                    </div>
                    <div className="font-sm">
                      <span className="text-gray-400">Genre: </span>
                      {genres?.slice(0, MAX_CREDIT).map((name, idx) => (
                        <span key={name}>
                          <a href="#" className="hover:underline">
                            {name}
                          </a>
                          {idx < Math.min(MAX_CREDIT, genres.length) - 1 &&
                            ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-xl">Putar di</div>
                  <div className="grid gap-4 grid-cols-4">
                    {offersMap.size > 0 ? (
                      <>
                        {Array.from(offersMap.keys()).map((key) => (
                          <a
                            href={offersMap.get(key)}
                            key={key}
                            target="_blank"
                            className="rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-300"
                          >
                            {key}
                          </a>
                        ))}
                      </>
                    ) : (
                      <div>Tidak tersedia</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ReactPortal>
    </>
  );
};

export default Poster;
