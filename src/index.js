const { readFileSync } = require('fs');
const { resolve, dirname } = require('path');
const MagicString = require('magic-string');
const babel = require('@babel/core');

module.exports = function rollupPluginWorkerInline(configInput = {}) {
    const workerRegexp = /new Worker\((["'])(.+?)\1\)/g;
    const importScriptRegexp = /importScript\((["'])(.+?)\1\)/g;

    const config = {
        workerTransform: workerString =>
            babel.transformSync(workerString, {
                presets: ['@babel/preset-env', 'minify'],
            }).code,
        ...configInput,
    };

    return {
        name: 'rollup-plugin-worker-inline',
        transform(code, id) {
            if (!workerRegexp.test(code)) return;
            const ms = new MagicString(code);
            workerRegexp.lastIndex = 0;

            while (true) {
                const match = workerRegexp.exec(code);
                if (match) {
                    const workerFile = match[2];
                    const workerPath = resolve(dirname(id), workerFile);
                    const workerString = readFileSync(workerPath, 'utf8');
                    this.addWatchFile(workerPath);
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
