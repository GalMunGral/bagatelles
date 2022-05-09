const { ConcatSource } = require('webpack-sources');
const AtomicCSS = require('./config');

module.exports = {
  apply(compiler) {
    const dependencies = new Map();
    const declarations = new Map();

    compiler.hooks.thisCompilation.tap('atomic-css', (compilation) => {
      compilation.hooks.succeedModule.tap('atomic-css', (module) => {
        const resource = module.resource;
        const content = module._source && module._source._value;
        if (!content) return;
        if (!dependencies.has(resource)) {
          dependencies.set(resource, new Set());
        }
        const moduleDependencies = dependencies.get(resource);
        Object.keys(AtomicCSS).forEach((pattern) => {
          const matches = content.matchAll(
            new RegExp('(?<=[^\\w-])' + pattern + '(?=[^\\w-])', 'g')
          );
          if (!matches) return;
          Array.from(matches).forEach((match) => {
            const className = match[0];
            moduleDependencies.add(className);
            if (!declarations.has(className)) {
              const css = AtomicCSS[pattern];
              declarations.set(
                className,
                typeof css == 'function' ? css(match) : css
              );
            }
          });
        });
      });

      // 好像全部放在 common.wxss 里比每个页面各自生成一个 wxss 文件体积会更小一点点
      compilation.hooks.optimizeChunkAssets.tapAsync(
        'atomic-css',
        (chunks, callback) => {
          const common = chunks.find((chunk) => chunk.name === 'common');

          const source = new ConcatSource();
          declarations.forEach((block, className) => {
            if (/undefined/.test(block)) return;
            source.add(`.${className} {${block}}\n`);
          });

          if (source.size()) {
            const wxss = common.files.find((f) => /\.wxss/.test(f));
            compilation.assets[wxss] = new ConcatSource(
              compilation.assets[wxss],
              source
            );
          }

          callback();
        }
      );

      // compilation.hooks.optimizeChunks.tap('atomic-css', (chunks) => {
      //   chunks.forEach((chunk) => {
      //     const chunkDependencies = new Set();
      //     const chunkModules = chunk.getModules() || [];
      //     chunkModules.forEach((module) => {
      //       classNames = dependencies.get(module.resource) || [];
      //       classNames.forEach((className) => {
      //         chunkDependencies.add(className);
      //       });
      //     });

      //     const source = new ConcatSource();
      //     chunkDependencies.forEach((className) => {
      //       const block = declarations.get(className);
      //       if (/undefined/.test(block)) return;
      //       source.add(`.${className} {${block}}\n`);
      //     });

      //     if (source.size()) {
      //       compilation.assets[`${chunk.name}.atomic.wxss`] = source;
      //     }
      //   });
      // });

      // compilation.hooks.optimizeChunkAssets.tapAsync(
      //   'atomic-css',
      //   (chunks, callback) => {
      //     chunks.forEach((chunk) => {
      //       const extra = compilation.assets[`${chunk.name}.atomic.wxss`];
      //       if (!extra) return;
      //       const wxss = chunk.files.find((f) => /\.wxss/.test(f));
      //       if (!wxss) {
      //         const js = chunk.files.find((f) => /\.js/.test(f));
      //         const wxss = js.replace('js', 'wxss');
      //         compilation.assets[wxss] = extra;
      //         chunk.files.push(wxss);
      //       } else {
      //         compilation.assets[wxss] = new ConcatSource(
      //           compilation.assets[wxss],
      //           extra
      //         );
      //       }
      //     });
      //     callback();
      //   }
      // );

      // compilation.hooks.afterOptimizeChunkAssets.tap('atomic-css', (chunks) => {
      //   chunks.forEach((chunk) => {
      //     delete compilation.assets[`${chunk.name}.atomic.wxss`];
      //   });
      // });
    });
  },
};
