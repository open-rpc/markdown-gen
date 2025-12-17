import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface ResponseExampleProps {
  code: string;
  language?: string;
  title?: string;
}

export function ResponseExample({
  code,
  language = "json",
  title = "Response",
}: ResponseExampleProps): ReactNode {
  return (
    <div className={styles.exampleBlock}>
      <div className={`${styles.exampleHeader} ${styles.responseHeader}`}>
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
