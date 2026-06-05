"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  /** Path to the video file served from /public (e.g. "/videos/clip.mp4"). */
  src: string;
  /** Optional first-frame image shown while the video loads / when reduced-motion holds the frame. */
  poster?: string;
  className?: string;
  /** Above-the-fold? Eagerly preload. Otherwise it lazy-loads and starts when scrolled into view. */
  priority?: boolean;
};

/**
 * Reusable decorative background video — a muted, looping clip, optimized for mobile:
 *  - `playsInline` so iOS plays it in place instead of hijacking fullscreen (the #1 mobile gotcha)
 *  - `muted` + `autoPlay` + `loop` (autoplay is only allowed while muted)
 *  - pauses while off-screen via IntersectionObserver — saves battery/data, matters with several clips
 *  - honors `prefers-reduced-motion` (holds the first frame instead of animating)
 *  - `object-cover` fills the container; the parent sets the dimensions
 *  - `aria-hidden` since it carries no audio or captions (mood, not content)
 *
 * For an ambient clip. For a video with sound/controls/captions, use a plain <video controls> instead.
 */
export function BackgroundVideo({ src, poster, className, priority = false }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React sets `muted` as an attribute, not the property, but the autoplay policy checks the
    // property — so set it imperatively, or play() gets rejected (the "no autoplay in prod" bug).
    video.muted = true;

    // Reduced-motion: don't animate — hold the first frame / poster.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // Play only while on-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay can be blocked by the browser; ignore */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      disablePictureInPicture
      aria-hidden
    />
  );
}
