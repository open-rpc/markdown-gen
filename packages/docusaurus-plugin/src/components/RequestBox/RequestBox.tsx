import React, { useState, type ReactNode } from "react";
import styles from "./styles.module.css";

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
        <div className={styles.requestHeader}>Request</div>
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
