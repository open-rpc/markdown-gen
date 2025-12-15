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

const PluginName = "@open-rpc/docusaurus-plugin";

export default function openRPCDocusaurusPlugin(
  context: LoadContext,
  options: Options,
): Plugin<PluginContent> {
  const normalizedOptions = normalizeOptions(options);

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

      if (!(await fs.stat(normalizedOptions.openRPCSpecPath)).isFile()) {
        throw new Error(
          `OpenRPC spec file not found: ${normalizedOptions.openRPCSpecPath}`,
        );
      }

      await fs.rm(normalizedOptions.docOutputPath, {
        recursive: true,
        force: true,
      });

      await generateDocs(
        normalizedOptions.openRPCSpecPath,
        normalizedOptions.docOutputPath,
      );
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
