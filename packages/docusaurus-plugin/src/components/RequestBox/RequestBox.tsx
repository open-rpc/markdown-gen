import React, { useState, useRef, useEffect, type ReactNode } from "react";
import styles from "./styles.module.css";

// Template generators for copy functionality
const templates = {
  curl: (url: string, body: string): string => {
    const escapedJson = body.replace(/'/g, "'\\''");
    return `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '${escapedJson}' \\
  ${url}`;
  },
  fetch: (url: string, body: string): string => {
    return `await fetch('${url}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${body}),
}).then((res) => res.json());`;
  },
};

interface RequestBoxProps {
  request: string;
  onResponse?: (response: string) => void;
}

export function RequestBox({
  request,
  onResponse,
}: RequestBoxProps): ReactNode {
  // TODO: support by-position better, default should be by-position (either)
  const [serverUrl, setServerUrl] = useState("http://localhost:8545");
  const [requestCode, setRequestCode] = useState(() => {
    try {
      const parsed = JSON.parse(request);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return request;
    }
  });
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const copyAs = async (format: keyof typeof templates) => {
    try {
      const text = templates[format](serverUrl, requestCode);
      await navigator.clipboard.writeText(text);
      setDropdownOpen(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestCode,
      });

      const responseText = await response.text();

      if (onResponse) {
        onResponse(responseText);
      }
    } catch (error) {
      console.error("Request error:", error);
      const errorResponse = JSON.stringify(
        {
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : "Unknown error",
          },
          id: null,
        },
        null,
        2,
      );
      if (onResponse) {
        onResponse(errorResponse);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.exampleBlock}>
      <div className={styles.exampleHeader}>
        <div className={styles.exampleHeaderRow}>
          <div className={styles.requestHeader}>Request</div>
          <div className={styles.copyDropdown} ref={dropdownRef}>
            <button
              className={styles.copyButton}
              onClick={() => !copied && setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {copied ? "Copied" : "Copy ▾"}
            </button>
            {dropdownOpen && (
              <div
                className={styles.dropdownMenu}
                style={{ background: "#ffffff" }}
              >
                <button
                  className={styles.dropdownItem}
                  onClick={() => copyAs("curl")}
                  style={{ background: "#ffffff" }}
                >
                  Copy as Curl
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => copyAs("fetch")}
                  style={{ background: "#ffffff" }}
                >
                  Copy as Fetch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.requestControlsContainer}>
        <div className={styles.requestControls}>
          <label className={styles.serverLabel}>Server URL:</label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            className={styles.serverInput}
            placeholder="http://localhost:8545"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={styles.sendButton}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <textarea
          value={requestCode}
          onChange={(e) => setRequestCode(e.target.value)}
          className={styles.requestTextarea}
          spellCheck={false}
          placeholder='{"jsonrpc": "2.0", "method": "...", "params": [], "id": 1}'
        />
      </div>
    </div>
  );
}
