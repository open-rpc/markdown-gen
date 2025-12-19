/**
 * User-provided plugin options
 */
export type Options = {
  openRPCSpecPath: string;
  docOutputPath: string;
  showPoweredBy: boolean;
  indexSlug: string | undefined;
};

/**
 * Normalized plugin options with defaults applied
 */
export type PluginOptions = Options & {
  // TODO: Add any computed/normalized options here
};

/**
 * Normalize user options with defaults
 */
export function normalizeOptions(options: Options): PluginOptions {
  return {
    openRPCSpecPath: options.openRPCSpecPath || "./openrpc.json",
    docOutputPath: options.docOutputPath || "./api-reference",
    showPoweredBy:
      options.showPoweredBy === undefined ? true : options.showPoweredBy,
    indexSlug: options.indexSlug === undefined ? undefined : options.indexSlug,
  };
}
