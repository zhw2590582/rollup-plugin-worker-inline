const { readFileSync } = require('fs');
const { resolve, dirname } = require('path');
const MagicString = require('magic-string');
const babel = require('@babel/core');

module.exports = function rollupPluginWorkerInline(configInput = {}) {
    const config = {
        workerRegexp: /new Worker\((["'])(.+?)\1\)/g,
        workerTransform: workerString =>
            babel.transformSync(workerString, {
                presets: ['@babel/preset-env'],
            }).code,
        ...configInput,
    };

    return {
        name: 'rollup-plugin-worker-inline',
        transform(code, id) {
            const workerRegexp = new RegExp(config.workerRegexp.source, config.workerRegexp.flags);
            if (!workerRegexp.test(code)) return;
            const ms = new MagicString(code);
            workerRegexp.lastIndex = 0;

            while (true) {
                const match = workerRegexp.exec(code);
                if (match) {
                    const workerFile = match[2];
                    const workerPath = resolve(dirname(id), workerFile);
                    const workerString = readFileSync(workerPath, 'utf8');
                    const workerTransformString = config.workerTransform(workerString) || '';
                    const workerFileStartIndex = match.index + 'new Worker('.length;
                    const workerFileEndIndex = match.index + match[0].length - ')'.length;
                    ms.overwrite(
                        workerFileStartIndex,
                        workerFileEndIndex,
                        `URL.createObjectURL(new Blob([\`${workerTransformString}\`]))`,
                    );
                } else {
                    break;
                }
            }

            return {
                code: ms.toString(),
                map: ms.generateMap({ hires: true }),
            };
        },
    };
};
