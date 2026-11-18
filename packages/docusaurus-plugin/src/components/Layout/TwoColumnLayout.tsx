import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./styles.module.css";

const STORAGE_KEY = "openrpc:request-panel-open";

interface TwoColumnLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function TwoColumnLayout({
  children,
  sidebar,
}: TwoColumnLayoutProps): ReactNode {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const requestPanelId = useId();
  const requestPanelRef = useRef<HTMLDivElement>(null);
  const revealRequestRef = useRef(false);

  useEffect(() => {
    try {
      setIsRequestOpen(window.localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // The panel still works when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!isRequestOpen || !revealRequestRef.current) return;
    revealRequestRef.current = false;
    const panel = requestPanelRef.current;
    if (panel && window.getComputedStyle(panel).position !== "sticky") {
      panel.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }, [isRequestOpen]);

  function toggleRequest() {
    const nextIsOpen = !isRequestOpen;
    revealRequestRef.current = nextIsOpen;
    setIsRequestOpen(nextIsOpen);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(nextIsOpen));
    } catch {
      // Keep the choice for this page even if it cannot be persisted.
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.requestToggle}
          onClick={toggleRequest}
          aria-expanded={isRequestOpen}
          aria-controls={requestPanelId}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M14 4v16" />
          </svg>
          {isRequestOpen ? "Hide request" : "Show request"}
        </button>
      </div>
      <div className={styles.twoColumnLayout} data-request-open={isRequestOpen}>
        <div
          ref={requestPanelRef}
          id={requestPanelId}
          className={styles.sidebar}
          role="region"
          aria-label="Request panel"
          hidden={!isRequestOpen}
        >
          {sidebar}
        </div>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}
