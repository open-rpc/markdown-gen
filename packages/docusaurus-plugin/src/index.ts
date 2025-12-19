/* eslint-disable @typescript-eslint/no-unused-vars */

import logger from "@docusaurus/logger";
import type { LoadContext, Plugin } from "@docusaurus/types";
import type { PluginContent } from "./types";
import type { Options, PluginOptions } from "./options";
import { normalizeOptions } from "./options";
import { cleanUpExistingDocs, generateDocs } from "./lib";
import fs from "fs/promises";
import path from "path";
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import { DereffedOpenrpcDocument } from "@open-rpc/markdown-generator";

const PluginName = "@open-rpc/docusaurus-plugin";

async function rebuildDocs(
  specPath: string,
  outputDir: string,
  options: PluginOptions,
) {
  try {
    await generateDocs(specPath, outputDir, options);
    await cleanUpExistingDocs(specPath, outputDir);
  } catch (err) {
    logger.error(`[${PluginName}] generateDocs failed: ${err}`);
    logger.error(
      `[${PluginName}] Stack: ${err instanceof Error ? err.stack : "no stack"}`,
    );
    throw err;
  }
  // Return content to be used in contentLoaded
  return {};
}

export default async function openRPCDocusaurusPlugin(
  context: LoadContext,
  options: Options,
): Promise<Plugin<PluginContent>> {
  const normalizedOptions = normalizeOptions(options);
  const specPath = path.resolve(
    context.siteDir,
    normalizedOptions.openRPCSpecPath,
  );
  const outputDir = path.resolve(
    context.siteDir,
    normalizedOptions.docOutputPath,
  );

  await rebuildDocs(specPath, outputDir, normalizedOptions);

  return {
    name: PluginName,

    /**
     * Returns paths to watch for hot reload in dev mode
     */
    getPathsToWatch(): string[] {
      logger.info(`[${PluginName}] getPathsToWatch called`);
      return [normalizedOptions.openRPCSpecPath];
      // TODO: Return glob patterns for files to watch (e.g., OpenRPC JSON specs)
    },

    getClientModules() {
      // This path will resolve relative to the plugin's dist folder when published

      return ["./components.css"];
    },

    /**
     * Loads content - runs on startup and on hot reload
     * This is where you'd read OpenRPC specs and generate markdown/mdx files
     */
    async loadContent(): Promise<PluginContent> {
      logger.info(`[${PluginName}] loadContent called`);
      return {};
    },

    /**
     * Creates routes and sets global data based on loaded content
     */
    async contentLoaded({ content, actions }): Promise<void> {
      logger.info(`[${PluginName}] contentLoaded called`);
      await rebuildDocs(specPath, outputDir, normalizedOptions);
    },

    /**
     * Runs after all plugins have loaded their content
     * Useful for cross-plugin coordination
     */
    async allContentLoaded({ allContent, actions }): Promise<void> {
      //logger.info(`[${PluginName}] allContentLoaded called`);
      // TODO: Coordinate with other plugins if needed
    },

    /**
     * Runs after the build is complete
     * Useful for post-build file operations or cleanup
     */
    async postBuild(props): Promise<void> {
      logger.info(`[${PluginName}] postBuild called`);
      // TODO: Post-build operations (cleanup, additional file generation, etc.)
    },
  };
}

export type { Options, PluginOptions } from "./options";
export type { PluginContent } from "./types";
