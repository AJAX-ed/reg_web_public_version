"use client";

// =============================================================================
// BootLoader — hacker/terminal-style boot screen shown on first page load.
// -----------------------------------------------------------------------------
// Behavior:
//   • Renders as a fixed full-screen overlay ON TOP of the site. The main page
//     keeps loading/rendering underneath it (it never blocks content).
//   • Plays a timed boot sequence:
//       1. Terminal log lines appear one-by-one, each "typed" character by
//          character with a blinking cursor.
//       2. A progress bar fills across the whole sequence, cycling through
//          phase labels: INITIALIZING... -> LOADING MODULES... ->
//          HANDSHAKE :: SUPABASE -> ACCESS GRANTED.
//       3. On completion, an "ACCESS GRANTED" banner glitch-flashes in, then
//          the loader smoothly fades out to reveal the site.
//   • Background FX: faint matrix-style falling glyph columns + a slow CRT
//     scanline sweep. All pure CSS animations (GPU-composited transforms /
//     opacity) so they stay smooth at 60fps without JS overhead.
//   • Fully skippable: click, tap or press any key after MIN_SKIP_MS.
//   • Only shows once per browser session (sessionStorage flag) so returning
//     visitors and OAuth redirects don't see it again.
//   • Respects prefers-reduced-motion (skips straight to the end state).
//
// HOW TO CUSTOMIZE OR DISABLE:
//   1. Disable completely:  set BOOT_LOADER_CONFIG.enabled = false (below).
//   2. Change duration:     adjust BOOT_LOADER_CONFIG.durationMs (3000–5000
//                           recommended). Line typing + progress bar scale
//                           automatically to whatever total you pick.
//   3. Change the text:     edit BOOT_LOADER_CONFIG.lines (terminal log) and
//                           BOOT_LOADER_CONFIG.phases (progress-bar labels).
//   4. Remove entirely:     delete <BootLoader /> from src/app/layout.tsx
//                           and delete this file (+ the .boot-* / .matrix-* /
//                           .crt-scan CSS block in globals.css).
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

export const BOOT_LOADER_CONFIG = {
  /** Set to false to turn the boot screen off without deleting code. */
  enabled: true,

  /**
   * Total time (ms) before the loader auto-fades away.
   * Recommended range: 3000–5000 ms. Everything else scales to this value.
   */
  durationMs: 4000,

  /** Don't allow skipping before this many ms (prevents accidental early taps). */
  minSkipMs: 900,

  /** Fade-out length (ms) between "sequence done" and unmount. */
  fadeOutMs: 600,

  /** Terminal-style boot log lines, typed one after another. */
  lines: [
    "> initializing cyscom_net.protocol ......... ok",
    "> handshake :: alumni_registry ............. ok",
    "> loading meetup_payload [ONLINE] .......... ok",
    "> mounting registration_form.dll ......... ok",
    "> auth_provider: GOOGLE_OAUTH2 ........... ok",
    "> access_level: GUEST -> VERIFIED",
    "> SYSTEM READY.",
  ],

  /**
   * Progress-bar phase labels, evenly spaced across the boot duration.
   * Each entry is { label, at }: `at` is the fraction (0..1) of durationMs
   * when the label appears. Keep the last one as the "success" message.
   */
  phases: [
    { label: "INITIALIZING...", at: 0.0 },
    { label: "LOADING MODULES...", at: 0.3 },
    { label: "HANDSHAKE :: SUPABASE", at: 0.62 },
    { label: "ACCESS GRANTED", at: 0.92 },
  ],
} as const;

/** Glyph alphabet used for the faint matrix rain background. */
const MATRIX_CHARS = "01αβΔΣ><{}#/\\*%&$?!";

/** Build one falling matrix column of pseudo-random glyphs (deterministic so
 *  server-rendered HTML matches the client — avoids hydration mismatches). */
function matrixColumn(seed: number): string {
  let s = seed * 9301 + 49297; // cheap deterministic PRNG
  const out: string[] = [];
  for (let i = 0; i < 14; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(MATRIX_CHARS[Math.floor((s / 233280) * MATRIX_CHARS.length)]);
  }
  return out.join("\n");
}

export default function BootLoader() {
  const [visible, setVisible] = useState(true); // mounted at all?
  const [fading, setFading] = useState(false); // playing fade-out?
  const [done, setDone] = useState(false); // sequence finished (banner shown)?
  const [progress, setProgress] = useState(0); // 0..100 progress bar
  const [phaseIdx, setPhaseIdx] = useState(0); // active phase-label index
  // Typed terminal output: completed lines + the line currently being typed.
  const [printedLines, setPrintedLines] = useState<string[]>([]);
  const [typingLine, setTypingLine] = useState("");
  const dismissed = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Stop everything, show ACCESS GRANTED briefly, then fade out & unmount. */
  const finish = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    // Jump the terminal to its fully-printed final state.
    setPrintedLines([...BOOT_LOADER_CONFIG.lines]);
    setTypingLine("");
    setPhaseIdx(BOOT_LOADER_CONFIG.phases.length - 1);
    setProgress(100);
    setDone(true);
    // Small beat on "ACCESS GRANTED" before the fade begins.
    timers.current.push(
      setTimeout(() => setFading(true), Math.min(500, BOOT_LOADER_CONFIG.fadeOutMs))
    );
    timers.current.push(
      setTimeout(() => setVisible(false), BOOT_LOADER_CONFIG.fadeOutMs + 500)
    );
  }, []);

  // --- lifecycle: boot sequence + one-time-per-session check + skip ---------
  useEffect(() => {
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

    // Accessibility: users who prefer reduced motion get an instant pass.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const cfg = BOOT_LOADER_CONFIG;
    const total = cfg.durationMs;

    // Reserve ~12% of the duration for the "ACCESS GRANTED" beat at the end;
    // the typing + progress share the remaining time.
    const seqEnd = total * 0.88;
    const perLine = seqEnd / cfg.lines.length; // time budget per log line
    const typeSpeed = Math.max(10, (perLine * 0.6) / 20); // ms per char (~20-char avg line)

    // --- Type the terminal lines character-by-character ---------------------
    let charTimer: ReturnType<typeof setTimeout>;
    const typeAll = () => {
      let lineIdx = 0;
      let charIdx = 0;
      const typeNext = () => {
        if (dismissed.current) return;
        const line = cfg.lines[lineIdx];
        if (line === undefined) return; // all done (finish() handles the rest)
        if (charIdx <= line.length) {
          setTypingLine(line.slice(0, charIdx));
          charIdx++;
          charTimer = setTimeout(typeNext, typeSpeed);
          return;
        }
        // Line finished typing -> commit it, start next line at its slot.
        setPrintedLines((prev) => [...prev, line]);
        setTypingLine("");
        lineIdx++;
        charIdx = 0;
        if (lineIdx < cfg.lines.length) {
          charTimer = setTimeout(typeNext, perLine * 0.25); // short pause between lines
        }
      };
      typeNext();
    };
    typeAll();

    // --- Progress bar + phase labels (requestAnimationFrame, 60fps) ---------
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / seqEnd) * 100);
      setProgress(pct);
      const frac = elapsed / total;
      let idx = 0;
      for (let i = 0; i < cfg.phases.length; i++) {
        if (frac >= cfg.phases[i].at) idx = i;
      }
      setPhaseIdx(idx);
      if (pct < 100 && !dismissed.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Auto-finish once the sequence completes.
    timers.current.push(setTimeout(finish, seqEnd));

    // Allow skipping via click / any key / touch after a short minimum delay.
    const skipTimer = setTimeout(() => {
      const skip = () => finish();
      window.addEventListener("click", skip);
      window.addEventListener("keydown", skip);
      window.addEventListener("touchstart", skip);
      timers.current.push(
        setTimeout(() => {
          window.removeEventListener("click", skip);
          window.removeEventListener("keydown", skip);
          window.removeEventListener("touchstart", skip);
        }, total)
      );
    }, cfg.minSkipMs);

    // Prevent background scroll while the overlay is up.
    document.documentElement.style.overflow = "hidden";

    return () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(charTimer);
      clearTimeout(skipTimer);
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [finish]);

  if (!visible) return null;

  const phase = BOOT_LOADER_CONFIG.phases[phaseIdx];
  const granted = done || phaseIdx === BOOT_LOADER_CONFIG.phases.length - 1;

  // --- markup ---------------------------------------------------------------
  return (
    <div
      aria-hidden="true"
      className={
        "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#07070f] font-mono transition-opacity ease-out " +
        (fading ? "pointer-events-none opacity-0" : "opacity-100")
      }
      style={{ transitionDuration: `${BOOT_LOADER_CONFIG.fadeOutMs}ms` }}
    >
      {/* Faint matrix-style falling glyph columns (pure CSS, very low opacity) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="matrix-column"
            style={{
              left: `${(i * 100) / 14 + 2}%`,
              animationDuration: `${5 + (i % 6)}s`,
              animationDelay: `${-(i * 0.9)}s`,
              opacity: 0.05,
            }}
          >
            {matrixColumn(i)}
          </span>
        ))}
        {/* Slow CRT scanline sweep across the whole screen */}
        <span className="crt-scan" />
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

          {/* Typed log lines (fixed height so layout never jumps) */}
          <div className="min-h-[10.5rem] select-none text-[#a5b4d4]">
            {printedLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <p>
              {typingLine}
              {!done && <span className="boot-cursor" />}
            </p>
          </div>

          {/* Progress bar + current phase label */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#171936]">
              <div
                className="h-full rounded-full bg-[#3b82f6]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] tabular-nums text-[#8b93b8]">
              {Math.round(progress)}%
            </span>
          </div>
          <p
            className={
              "mt-2 text-[11px] uppercase tracking-widest transition-colors duration-300 " +
              (granted ? "text-[#60a5fa]" : "text-[#4b537a]")
            }
          >
            {phase.label}
          </p>

          {/* ACCESS GRANTED banner — glitch-slams in when the boot completes */}
          {done && (
            <p className="boot-granted mt-2 text-[13px] font-bold tracking-[0.3em] text-[#60a5fa]">
              ▸ ACCESS GRANTED
            </p>
          )}

          <p className="mt-3 select-none text-[10px] text-[#4b537a]">
            press any key / tap to skip
          </p>
        </div>
      </div>
    </div>
  );
}
