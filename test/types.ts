import * as path from 'path';
import type { RollupOptions } from 'rollup';

import multiInput from '..';

const config: RollupOptions = {
  plugins: [
    multiInput(),
    multiInput({}),
    multiInput({ relative: 'src/' }),
    multiInput({
      transformOutputPath: (output, input) => `awesome/path/${input}/${path.basename(output)}`,
    }),
    multiInput({
      glob: { onlyFiles: false, deep: 1 }
    }),
  ]
};

export default config;
