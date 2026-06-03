import Image, { type ImageProps } from "next/image";

const WEBP_PATH_RE = /\.webp(\?.*)?$/i;
const REMOTE_PROTOCOL_RE = /^https?:\/\//i;

/**
 * Wraps next/image with a <picture> + <source type="image/avif"> negotiation.
 * Modern browsers (Chrome, Firefox, Safari 16+) request the AVIF source;
 * older browsers fall back to the next/image-rendered <img> serving WebP.
 *
 * Only kicks in when `src` is a local string ending in `.webp` — the
 * convention shipped by apply-content's sharp pipeline (Phase O1.5 + Phase
 * AVIF emit .webp and .avif siblings at ingest). SVGs, remote URLs, and
 * other extensions pass straight through to next/image.
 *
 * `display: contents` keeps the wrapping <picture> transparent to layout,
 * which matters when `fill` is set on the inner Image.
 */
export function PictureImage(props: ImageProps) {
  const { src, priority, ...rest } = props;
  const isWrappable =
    typeof src === "string" && WEBP_PATH_RE.test(src) && !REMOTE_PROTOCOL_RE.test(src);
  // jsx-a11y/alt-text can't see that `alt` is required on ImageProps and
  // forwarded via {...props} — every call site provides it.
  // eslint-disable-next-line jsx-a11y/alt-text
  if (!isWrappable) return <Image src={src} priority={priority} {...rest} />;
  const avifSrc = (src as string).replace(WEBP_PATH_RE, ".avif$1");
  // priority on next/image emits <link rel="preload" imagesrcset="..."> in
  // <head> for the WebP, but AVIF-capable browsers fetch the .avif source
  // from <picture> instead — double-fetch waste. Drop priority when wrapping
  // and add our own AVIF preload via the inner Image's fetchPriority.
  return (
    <picture style={{ display: "contents" }}>
      {priority ? (
        <link rel="preload" as="image" href={avifSrc} type="image/avif" />
      ) : null}
      <source srcSet={avifSrc} type="image/avif" />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={src} fetchPriority={priority ? "high" : undefined} {...rest} />
    </picture>
  );
}
