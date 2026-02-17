import * as React from "react";

/**
 * Tailwind default breakpoints + custom xs
 */
const BREAKPOINTS = {
  xs: 390, // custom
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
}

/**
 * Get current breakpoint based on width
 */
function getBreakpoint(width: number): Breakpoint {
  if (width < BREAKPOINTS.xs) return "xs";
  if (width < BREAKPOINTS.sm) return "sm";
  if (width < BREAKPOINTS.md) return "md";
  if (width < BREAKPOINTS.lg) return "lg";
  if (width < BREAKPOINTS.xl) return "xl";
  return "2xl";
}

/**
 * Safe window size getter (SSR compatible)
 */
function getWindowSize() {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Main responsive hook
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = React.useState<ResponsiveState>(() => {
    const { width, height } = getWindowSize();
    return {
      width,
      height,
      breakpoint: getBreakpoint(width),
      isMobile: width < BREAKPOINTS.md,
    };
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;

    const handleResize = () => {
      // Use requestAnimationFrame for performance
      frameId = window.requestAnimationFrame(() => {
        const { width, height } = getWindowSize();

        setState((prev) => {
          const newBreakpoint = getBreakpoint(width);
          const newIsMobile = width < BREAKPOINTS.md;

          // Prevent unnecessary re-renders
          if (
            prev.width === width &&
            prev.height === height &&
            prev.breakpoint === newBreakpoint &&
            prev.isMobile === newIsMobile
          ) {
            return prev;
          }

          return {
            width,
            height,
            breakpoint: newBreakpoint,
            isMobile: newIsMobile,
          };
        });
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // ensure correct on mount

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return state;
}

/**
 * Backward compatible hook
 * Keeps your old components working
 */
export function useIsMobile(): boolean {
  return useResponsive().isMobile;
}
