"use client";

// =============================================================================
// BootLoader — hacker/terminal-style boot screen shown on first page load.
// -----------------------------------------------------------------------------
// Behavior:
//   • Renders as a fixed full-screen overlay ON TOP of the site. The main page
//     keeps loading/rendering underneath it (it never blocks content).
//   • Types out fake "boot" log lines, then fills a progress bar.
//   • Auto-dismisses after ~2.6s (see BOOT_DURATION_MS below), with a smooth
//     fade-out transition. Also skippable via any click / keypress / touch.
//   • Only shows once per browser session (sessionStorage flag) so returning
//     visitors and OAuth redirects don't see it again.
//
// HOW TO CUSTOMIZE OR DISABLE:
//   1. Disable completely:  set BOOT_LOADER_CONFIG.enabled = false (below).
//   2. Change timing:       adjust BOOT_LOADER_CONFIG.durationMs.
//   3. Change the text:     edit BOOT_LOADER_CONFIG.lines array.
//   4. Remove entirely:     delete <BootLoader /> from src/app/layout.tsx
//                           and delete this file.
// =============================================================================

import { useEffect, useRef, useState } from "react";

export const BOOT_LOADER_CONFIG = {
  /** Set to false to turn the boot screen off without deleting code. */
  enabled: true,
  /** Total time (ms) before the loader auto-fades away. Keep within 2–4s. */
  durationMs: 2600,
  /** Terminal-style boot log lines, typed one after another. */
  lines: [
    "> initializing cyscom_net.protocol ......... ok",
    "> handshake :: alumni_registry ............ ok",
    "> loading meetup_payload [ONLINE] ......... ok",
    "> access_level: GUEST -> VERIFIED",
    "> SYSTEM READY.",
  ],
} as const;

export default function BootLoader() {
  const [visible, setVisible] = useState(true); // mounted at all?
  const [fading, setFading] = useState(false); // playing fade-out?
  const [linesShown, setLinesShown] = useState(0); // how many log lines revealed
  const [progress, setProgress] = useState(0); // 0..100 progress bar
  const dismissed = useRef(false);

  // --- lifecycle: timers + one-time-per-session check + skip handlers -------
  useEffect(() => {
    // Respect the disable switch.
    if (!BOOT_LOADER_CONFIG.enabled) {
      setVisible(false);
      return;
    }

    // Skip the loader if it already played in this browser tab/session
    // (e.g. after returning from the Google OAuth redirect).
    try {
      if (sessionStorage.getItem("cyscom-booted") === "1") {
        setVisible(false);
        return;
      }
      sessionStorage.setItem("cyscom-booted", "1");
    } catch {
      /* private-mode storage errors are non-fatal */
    }

    const total = BOOT_LOADER_CONFIG.durationMs;
    const lineCount = BOOT_LOADER_CONFIG.lines.length;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reveal terminal lines progressively across the boot duration.
    for (let i = 1; i <= lineCount; i++) {
      timers.push(setTimeout(() => setLinesShown(i), (total * 0.18) * i));
    }

    // Animate the progress bar smoothly with requestAnimationFrame.
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / total) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Auto-dismiss once the boot completes.
    const finish = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      setLinesShown(lineCount);
      setProgress(100);
      setFading(true); // start CSS fade-out
      timers.push(setTimeout(() => setVisible(false), 500)); // unmount after fade
    };
    timers.push(setTimeout(finish, total));

    // Allow the user to skip by clicking or pressing any key after a short
    // minimum delay (so an accidental early click doesn't kill the vibe).
    const minSkipDelay = setTimeout(() => {
      const skip = () => finish();
      window.addEventListener("click", skip);
      window.addEventListener("keydown", skip);
      window.addEventListener("touchstart", skip);
      return () => {
        window.removeEventListener("click", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("touchstart", skip);
      };
    }, 800);

    // Prevent background scroll while the overlay is up.
    document.documentElement.style.overflow = "hidden";

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(minSkipDelay);
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  // --- markup ---------------------------------------------------------------
  return (
    <div
      aria-hidden="true"
      className={
        "fixed inset-0 z-[9999] flex items-center justify-center bg-[#07070f] font-mono transition-opacity duration-500 " +
        (fading ? "opacity-0 pointer-events-none" : "opacity-100")
      }
    >
      {/* Faint matrix-style falling glyph columns (pure CSS, very low opacity) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="matrix-column"
            style={{
              left: `${(i * 100) / 12 + 2}%`,
              animationDuration: `${4 + (i % 5)}s`,
              animationDelay: `${-(i * 0.7)}s`,
              opacity: 0.06,
            }}
          >
            {"01αβΔΣ><{}#/\\*".repeat(8).split("").join("\n")}
          </span>
        ))}
      </div>

      {/* Terminal window */}
      <div className="relative mx-4 w-full max-w-md rounded-lg border border-[#23264d] bg-[#0b0c1a]/95 shadow-lg">
        {/* Fake title bar */}
        <div className="flex items-center gap-1.5 border-b border-[#23264d] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#37406b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#37406b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]/70" />
          <span className="ml-2 text-[10px] uppercase tracking-widest text-[#8b93b8]">
            cyscom://boot
          </span>
        </div>

        <div className="px-4 py-4 text-[12px] leading-relaxed sm:text-[13px]">
          <p className="mb-3 select-none text-[#60a5fa]">
            CYSCOM ALUMNI MEETUP — BOOTING SYSTEM...
          </p>

          {/* Typed log lines */}
          <div className="min-h-[7.5rem] select-none text-[#a5b4d4]">
            {BOOT_LOADER_CONFIG.lines.slice(0, linesShown).map((line, i) => (
              <p key={i} className="boot-line">
                {line}
              </p>
            ))}
            <span className="boot-cursor" />
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#171936]">
              <div
                className="h-full rounded-full bg-[#3b82f6] transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] text-[#8b93b8] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <p className="mt-3 select-none text-[10px] text-[#4b537a]">
            press any key / tap to skip
          </p>
        </div>
      </div>
    </div>
  );
}
