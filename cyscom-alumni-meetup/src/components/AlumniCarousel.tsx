"use client";

// =============================================================================
// AlumniCarousel — simple, responsive slideshow of alumni profiles.
// One profile is visible at a time with left/right arrow navigation and dot
// indicators. Data comes from ALUMNI_PROFILES in src/config/event.ts — edit
// that array to add/replace alumni (see comments there for instructions).
// =============================================================================
import { useCallback, useEffect, useState } from "react";
import { ALUMNI_PROFILES, type AlumniProfile } from "@/config/event";

/** Generic "no profile picture" silhouette icon shown when photoUrl is empty. */
function AvatarPlaceholder() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-16 w-16 text-text-muted"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="8" r="4" />
      {/* Shoulders / body */}
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
    </svg>
  );
}

/** Single slide: avatar (photo or placeholder), name, and description. */
function AlumniSlide({ alumni }: { alumni: AlumniProfile }) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center sm:px-10">
      {/* Profile picture — real image if provided, otherwise the placeholder */}
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2">
        {alumni.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={alumni.photoUrl}
            alt={alumni.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <AvatarPlaceholder />
        )}
      </div>

      <h3 className="mt-5 text-lg font-bold uppercase tracking-[0.2em] text-text">
        {alumni.name}
      </h3>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted">
        {alumni.description}
      </p>
    </div>
  );
}

export default function AlumniCarousel() {
  const slides = ALUMNI_PROFILES;
  const [index, setIndex] = useState(0);

  // Navigation helpers (wrap around at both ends).
  const goTo = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Keyboard support: left/right arrows move between slides while the
  // carousel region has focus.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // Keep the index valid if the alumni array shrinks during hot-reload.
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight sm:text-3xl">
        Featured <span className="text-accent-blue">Alumni</span>
      </h2>

      <div
        className="card relative outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Alumni profiles"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Slides track — translated horizontally to show one at a time */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((alumni, i) => (
              <div
                key={i}
                className="w-full shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`Alumni ${i + 1} of ${slides.length}`}
                aria-hidden={i !== index}
              >
                <AlumniSlide alumni={alumni} />
              </div>
            ))}
          </div>
        </div>

        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous alumni"
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center
                     justify-center rounded-full border border-border bg-surface-2
                     text-text-muted transition hover:border-accent-blue/50 hover:text-text"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="Next alumni"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center
                     justify-center rounded-full border border-border bg-surface-2
                     text-text-muted transition hover:border-accent-blue/50 hover:text-text"
        >
          ›
        </button>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 pb-5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to alumni ${i + 1}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-accent-blue" : "bg-border hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
