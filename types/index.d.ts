import type { Plugin, PluginHooks } from 'rollup';
import type { Options as FGOptions } from 'fast-glob';

export interface RollupMultiInputOptions {
  /**
   * the fast-glob configuration object
   */
  glob?: FGOptions;

  /**
   * the base path to remove in the dist folder
   */
  relative?: string;

  /**
   * Callback for transforming output file path
   * @param output target file name
   * @param input source file name
   * @returns transformed output file path
   */
  transformOutputPath?: (output: string, input: string) => string;
}

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 */
export default function multiInput(options?: RollupMultiInputOptions): Plugin;
