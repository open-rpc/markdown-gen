/**
 * Content loaded by the plugin during loadContent lifecycle
 */
export interface PluginContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Internal plugin context/state if needed
 */
export interface PluginContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Redirect item structure
 */
export interface RedirectItem {
  from: string;
  to: string;
}
