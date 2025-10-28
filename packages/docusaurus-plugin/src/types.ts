/**
 * Content loaded by the plugin during loadContent lifecycle
 */
export interface PluginContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // TODO: Define what content structure this plugin loads
  // Example: loaded OpenRPC spec, generated file paths, etc.
}

/**
 * Internal plugin context/state if needed
 */
export interface PluginContext {
  // TODO: Add any internal state the plugin needs to track
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
