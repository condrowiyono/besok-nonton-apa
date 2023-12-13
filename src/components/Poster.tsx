"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ReactPortal from "./Portal";
import Image from "next/image";
import { Offer, WatchNowOffer } from "@/interfaces/justwatch";
import { formatDuration, formatNumber } from "@/utils/format";
import { useTransition } from "@/hooks/useTransition";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useKeydown } from "@/hooks/useKeydown";

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
  const [transformOrigin, setTransformOrigin] = useState("bottom center");

  const { shouldMount, stage } = useTransition(open, 250);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const p = searchParams.get("p");

  useEffect(() => {
    setOpen(p === title);
  }, [p, title]);

  const handlePosterMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const adjustedWidth = (window.innerWidth - PREVIEW_WIDTH) / 2;
    const x = adjustedWidth > 0 ? left - adjustedWidth : left;
    const y = top - PREVIEW_TOP;

    setTransformOrigin(`${x}px ${y}px`);
  };

  const handleOpen = () => {
    setOpen(true);

    const newSearch = new URLSearchParams();
    if (query) newSearch.set("q", query);
    newSearch.set("p", title);

    router.replace(`${pathname}?${newSearch.toString()}`);
  };

  const handleClose = () => {
    setOpen(false);

    const newSearch = new URLSearchParams();
    if (query) newSearch.set("q", query);
    router.replace(`${pathname}?${newSearch.toString()}`);
  };

  const handleClickMask = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && handleClose();
  };

  useFocusTrap(contentRef, shouldMount);
  useKeydown("Escape", contentRef, handleClose);

  return (
    <>
      <button
        type="button"
        title={title}
        onMouseDown={handlePosterMouseDown}
        onClick={handleOpen}
        className={clsx("modal trigger block rounded-lg shadow-lg", stage)}
        style={{ transformOrigin }}
      >
        <Image
          alt={`poster-${title}`}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          src={poster}
          placeholder="data:image/png;base64,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"
          className="rounded-lg object-cover h-full w-full"
          draggable={false}
          loading="lazy"
        />
      </button>

      <ReactPortal wrapperId="react-portal-modal-container">
        {shouldMount && (
          <div className={clsx("modal open", stage)}>
            <div className="overlay fixed inset-0 z-10" />
            <div
              className="fixed inset-0 z-10 overflow-y-auto"
              onClick={handleClickMask}
            >
              <div
                className={`content mx-auto absolute inset-0 max-w-full h-fit rounded-lg shadow-lg z-10 overflow-hidden focus:outline-none bg-[#181818]`}
                ref={contentRef}
                tabIndex={0}
                style={{ transformOrigin }}
              >
                <div
                  className="content-background absolute inset-0 z-[-1] bg-cover blur-3xl brightness-50"
                  style={{ backgroundImage: `url(${poster})` }}
                />
                <div className="absolute top-0 right-0 p-4 z-10">
                  <button
                    type="button"
                    className="rounded-full bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-200"
                    onClick={handleClose}
                  >
                    &#x2715;
                  </button>
                </div>
                <div className="relative">
                  <Image
                    className="backdrop h-[480px] object-cover rounded-t-lg"
                    alt={`backdrop-${title}`}
                    src={backdrop || poster}
                    width={PREVIEW_WIDTH}
                    height={480}
                    draggable={false}
                  />
                  {/* <div className="video-wrapper">
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
                <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <a
                        href={watchNowOffer?.standardWebURL}
                        target="_blank"
                        className={`rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-200 text-center ${
                          !watchNowOffer && "opacity-50 cursor-not-allowed"
                        }`}
                        aria-disabled={!watchNowOffer}
                      >
                        Putar di {watchNowOffer?.package.clearName}
                      </a>
                      <button
                        className="rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-200"
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
                  <div className="font-bold text-xl">Tersedia di</div>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                    {offersMap.size > 0 ? (
                      <>
                        {Array.from(offersMap.keys()).map((key) => (
                          <a
                            href={offersMap.get(key)}
                            key={key}
                            target="_blank"
                            className="rounded-lg bg-white text-black font-bold px-4 py-2 hover:bg-gray-200 duration-200"
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
