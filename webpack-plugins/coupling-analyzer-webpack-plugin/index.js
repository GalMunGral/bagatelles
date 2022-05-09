const fs = require('fs');
const packages = [
  /src\/album/,
  /src\/api/,
  /src\/team/,
  /src\/request/,
  /src\/mine/,
  /src\/hooks/,
  /src\/pages\/.+?(?=\/)/,
];

const f = fs.createWriteStream('deps.txt');

module.exports = {
  apply(compiler) {
    let deps;
    compiler.hooks.compilation.tap(
      'AccessDependenciesPlugin',
      (compilation) => {
        compilation.hooks.finishModules.tap(
          'AccessDependenciesPlugin',
          (modules) => {
            modules.forEach((module) => {
              let r;
              if ((r = packages.find((reg) => reg.test(module.resource)))) {
                const from = module.resource.match(r)[0];
                module.dependencies.forEach((dep) => {
                  // console.log(dep.module);
                  let r;
                  if (
                    dep.module &&
                    (r = packages.find((reg) => reg.test(dep.module.resource)))
                  ) {
                    const to = dep.module.resource.match(r)[0];
                    if (!deps) deps = {};
                    if (!deps[from]) deps[from] = {};
                    if (!deps[from][to]) deps[from][to] = [];
                    deps[from][to].push(module.resource);
                  }
                });
              }
            });
          }
        );
      }
    );
    compiler.hooks.done.tap('hey', () => {
      if (!deps) return;
      Object.keys(deps).forEach((k) => {
        if (deps[k] instanceof Set) {
          deps[k] = [...deps[k]];
        }
      });
      f.write(JSON.stringify(deps, null, 4));
    });
  },
};
