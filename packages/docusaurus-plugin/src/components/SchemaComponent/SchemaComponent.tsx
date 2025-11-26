import React, { PropsWithChildren } from "react";
import styles from "./style.module.css";

export const SchemaComponent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.schemaComponent}>{children}</div>;
};
