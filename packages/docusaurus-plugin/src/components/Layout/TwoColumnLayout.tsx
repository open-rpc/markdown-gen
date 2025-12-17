import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface TwoColumnLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function TwoColumnLayout({
  children,
  sidebar,
}: TwoColumnLayoutProps): ReactNode {
  return (
    <div className={styles.twoColumnLayout}>
      <div className={styles.mainContent}>{children}</div>
      <div className={styles.sidebar}>{sidebar}</div>
    </div>
  );
}
