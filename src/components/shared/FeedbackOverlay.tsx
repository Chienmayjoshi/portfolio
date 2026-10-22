"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Shell for the feedback popup (FeedbackPopup / FeedbackAggregate) when it
// should not expand in place. From `md` up it is Figma's popup card — node
// 8125:1623 inside 8129:29734: 600px, 20px radius, 40px padding, the
// 0 4 16 / 6% shadow, over a rgba(26,26,26,0.6) overlay (node 8125:1622). Below
// `md` it is a bottom sheet with the same surface, per direct instruction (the
// frames are desktop only). This replaces the right-hand panel an earlier pass
// built, since the frames draw a centred card. It only presents.
//
// Portalled to <body>: the deck stacks its slides under masks and transforms,
// which would clip or re-parent a fixed child. Body scroll is locked while it
// is open, so the deck behind can't scroll; `overscroll-contain` keeps a
// scroll that reaches the panel's end from chaining into the page.
//
// Dialog behaviour, by hand (no dependency): role=dialog + aria-modal, focus
// moves in on open and returns to the trigger on close, Tab wraps inside, Esc
// and a backdrop click close.
//
// Motion (not GSAP): mount/unmount state, per CLAUDE.md's split. Reduced
// motion gets a plain fade. The parent keeps rendering the same `children` while
// `open` goes false, so the card does not change as it slides away.
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface FeedbackOverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

export default function FeedbackOverlay({
  open,
  onClose,
  label,
  children,
}: FeedbackOverlayProps) {
  const reduce = useReducedMotion();
  // Portals can't render during hydration; false on the server, true after.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the panel itself, not the first control: the first control is
    // "Cancel", and a screen reader should hear the dialog's name first.
    panelRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  const ease = [0.32, 0.72, 0, 1] as const;
  // md+: a centred popup (Figma's frame), fading and settling up a little.
  // Below: a bottom sheet sliding up from the edge. Read when rendering — the
  // panel only mounts after an interaction, so it is the live width.
  const wide = window.matchMedia("(min-width: 768px)").matches;
  const hidden = reduce
    ? { opacity: 0 }
    : wide
      ? { opacity: 0, y: 12, scale: 0.98 }
      : { y: "100%" };
  const shown = reduce
    ? { opacity: 1 }
    : wide
      ? { opacity: 1, y: 0, scale: 1 }
      : { y: 0 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-24px">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(26,26,26,0.6)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={{ duration: reduce ? 0.15 : 0.4, ease }}
            className="relative flex max-h-[92dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-[20px] bg-bg-surface px-20px pt-12px pb-[max(24px,env(safe-area-inset-bottom))] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] outline-none md:max-h-[calc(100dvh-48px)] md:w-[600px] md:rounded-[20px] md:p-[40px]"
          >
            {/* Grab handle: the bottom sheet's cue only. */}
            <span
              aria-hidden="true"
              className="mx-auto mb-16px h-[4px] w-[40px] shrink-0 rounded-full bg-border-default md:hidden"
            />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
