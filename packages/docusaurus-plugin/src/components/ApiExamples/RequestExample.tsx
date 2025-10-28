import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface RequestExampleProps {
  code: string;
  language?: string;
  title?: string;
}

export function RequestExample({
  code,
  language = "json",
  title = "Request",
}: RequestExampleProps): ReactNode {
  return (
    <div className={styles.exampleBlock}>
      <div className={`${styles.exampleHeader} ${styles.requestHeader}`}>
        {title}
      </div>
      <div className={styles.exampleContent}>
        <pre>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
