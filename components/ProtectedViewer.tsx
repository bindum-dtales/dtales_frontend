import React, { useEffect } from "react";

interface ProtectedViewerProps {
  /** The portfolio document/viewer content to protect. */
  children: React.ReactNode;
  /** Optional extra classes for the wrapper element. */
  className?: string;
}

/**
 * Keys that open a browser save/print flow when combined with Ctrl/Cmd.
 * DevTools shortcuts are deliberately left alone — inspecting the page is fine,
 * this layer only targets casual downloading.
 */
const BLOCKED_SHORTCUT_KEYS = new Set(["s", "p"]);

/** True while the user is typing, so their shortcuts must keep working. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Client-side content protection for the portfolio document viewer.
 *
 * This raises the bar for casual downloading only. It cannot stop a determined
 * visitor: DevTools, the network tab, screenshots and screen recording all
 * remain available, and that is an accepted trade-off.
 *
 * Everything here is scoped to the wrapper: the pointer handlers are React
 * handlers on this element (they catch events bubbling up from the cover image
 * and from the sanitized document HTML), and the single keyboard listener is
 * attached on mount and removed on unmount, so no other route is affected.
 */
const ProtectedViewer: React.FC<ProtectedViewerProps> = ({ children, className }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      if (!BLOCKED_SHORTCUT_KEYS.has(event.key.toLowerCase())) return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /** Blocks the native context menu ("Save image as…", "Open image in new tab"). */
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  /** Blocks dragging an image out of the page onto the desktop. */
  const handleDragStart = (event: React.DragEvent) => {
    event.preventDefault();
  };

  /** Blocks middle-click, which opens the image in a new tab. */
  const handleAuxClick = (event: React.MouseEvent) => {
    if (event.button === 1 && event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  };

  return (
    <div
      className={className ? `protected-viewer ${className}` : "protected-viewer"}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onAuxClick={handleAuxClick}
    >
      <p className="protected-viewer-print-notice">
        This document is protected and cannot be printed.
      </p>
      {children}
    </div>
  );
};

export default ProtectedViewer;
