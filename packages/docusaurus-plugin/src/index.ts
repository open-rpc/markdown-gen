/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO: Remove this once we have a proper implementation nailed down
/* eslint-disable @typescript-eslint/no-unused-vars */

import logger from "@docusaurus/logger";
import type { LoadContext, Plugin } from "@docusaurus/types";
import type { PluginContent } from "./types";
import type { Options } from "./options";
import { normalizeOptions } from "./options";
import { generateDocs } from "./lib";
import fs from "fs/promises";
import path from "path";

const PluginName = "@open-rpc/docusaurus-plugin";

export default function openRPCDocusaurusPlugin(
  context: LoadContext,
  options: Options,
): Plugin<PluginContent> {
  const normalizedOptions = normalizeOptions(options);
  const specPath = path.resolve(
    context.siteDir,
    normalizedOptions.openRPCSpecPath,
  );
  const outputDir = path.resolve(
    context.siteDir,
    normalizedOptions.docOutputPath,
  );
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
      logger.info(`[${PluginName}] loadContent - siteDir: ${context.siteDir}`);
      logger.info(`[${PluginName}] specPath: ${specPath}`);
      logger.info(`[${PluginName}] outputDir: ${outputDir}`);

      if (!(await fs.stat(specPath)).isFile()) {
        throw new Error(`OpenRPC spec file not found: ${specPath}`);
      }

      try {
        const entries = await fs.readdir(outputDir, { withFileTypes: true });
        await Promise.all(
          entries
            .filter((entry) => entry.name !== "index.md")
            .map((entry) => {
              const fullPath = `${outputDir}/${entry.name}`;
              return fs.rm(fullPath, { recursive: true, force: true });
            }),
        );
      } catch {
        // Directory doesn't exist yet, that's fine
      }

      await generateDocs(specPath, outputDir);
      // Return content to be used in contentLoaded
      return {};
    },

    /**
     * Creates routes and sets global data based on loaded content
     */
    async contentLoaded({ content, actions }): Promise<void> {
      logger.info(`[${PluginName}] contentLoaded called`);
      // const { addRoute, setGlobalData } = actions;

      // TODO: Create routes using addRoute() for generated markdown pages
      // TODO: Set global data using setGlobalData() if needed
      // Example:
      // addRoute({
      //   path: '/api',
      //   component: '@theme/DocPage',
      //   exact: false,
      // });
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
