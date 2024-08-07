import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { resolve } from 'path';
import * as webpack from 'webpack';

interface CustomWebpackBuilderOptions extends JsonObject {
  customWebpackConfig: string;
}

async function runBuilder(
  options: CustomWebpackBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const configPath = resolve(
    context.workspaceRoot,
    options.customWebpackConfig
  );
  const customWebpackConfig = require(configPath) as webpack.Configuration;

  const compiler = webpack(customWebpackConfig);

  return new Promise<BuilderOutput>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        context.logger.error('Webpack build failed', err as any);
        return reject({ success: false });
      }

      context.logger.info(stats.toString());
      resolve({ success: true });
    });
  });
}

export default createBuilder<JsonObject & CustomWebpackBuilderOptions>(
  runBuilder
);
