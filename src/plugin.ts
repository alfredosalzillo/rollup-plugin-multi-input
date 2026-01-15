import path from "node:path";
import type FastGlob from "fast-glob";
import fastGlob from "fast-glob";
import type { Plugin } from "rollup";

const pluginName = "rollup-plugin-multi-input";

const doYouNeedRollupMessage = `
  \u001b[31mATTENTION:\u001b[0m Do you still need \u001b[34m${pluginName}\u001b[0m?
  Since Rollup 3, the \u001b[32m[preserveModules](https://rollupjs.org/configuration-options/#output-preservemodules)\u001b[0m
  and \u001b[32m[preserveModulesRoot](https://rollupjs.org/configuration-options/#output-preservemodulesroot)\u001b[0m options are available,
  which can often eliminate the necessity of \u001b[34m${pluginName}\u001b[0m.
`;
const isString = (value: unknown): value is string => typeof value === "string";

/**
 * default multi-input Options
 * */
const defaultOptions = {
	// `path.sep` is used for windows support
	relative: `src${path.sep}`,
};

// extract the output file name from a file name
const outputFileName = (filePath: string) =>
	filePath.replace(/\.[^/.]+$/, "").replace(/\\/g, "/");

export type MultiInputOptions = {
	glob?: FastGlob.Options;
	relative?: string;
	transformOutputPath?: (path: string, fileName: string) => string;
	hideBuildStartMessage?: boolean;
};

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 * */
const multiInput = (options: MultiInputOptions = defaultOptions): Plugin => {
	const {
		glob: globOptions,
		relative = defaultOptions.relative,
		transformOutputPath,
		hideBuildStartMessage,
	} = options;
	return {
		name: pluginName,
		buildStart() {
			if (this.info && hideBuildStartMessage !== false) {
				this.info(doYouNeedRollupMessage);
			}
		},
		options(conf) {
			// flat to enable input to be a string or an array
			const inputs = [conf.input].flat();
			// separate globs inputs string from others to enable input to be a mixed array too
			const globs = inputs.filter(isString);
			const others = inputs.filter((value) => !isString(value));
			const normalizedGlobs = globs.map((glob) => glob.replace(/\\/g, "/"));
			// get files from the globs strings and return as a Rollup entries Object
			const entries = fastGlob
				.sync(normalizedGlobs, globOptions)
				.map((name) => {
					const filePath = path.relative(relative, name);
					const isRelative = !filePath.startsWith(`..${path.sep}`);
					const relativeFilePath = isRelative
						? filePath
						: path.relative(`.${path.sep}`, name);
					if (transformOutputPath) {
						return [
							outputFileName(transformOutputPath(relativeFilePath, name)),
							name,
						];
					}
					return [outputFileName(relativeFilePath), name];
				});
			const input = Object.assign(
				{},
				Object.fromEntries(entries),
				// add no globs input to the result
				...others,
			);
			// return the new configuration with the glob input and the non string inputs
			return {
				...conf,
				input,
			};
		},
	};
};
export default multiInput;
