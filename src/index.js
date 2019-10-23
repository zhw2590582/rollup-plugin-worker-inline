const { readFileSync } = require('fs');
const { resolve, dirname } = require('path');
const MagicString = require('magic-string');
const babel = require('@babel/core');

function babelTransform(code) {
    return babel.transformSync(code, {
        presets: [
            '@babel/preset-env',
            [
                'minify',
                {
                    builtIns: false,
                },
            ],
        ],
    }).code;
}

module.exports = function rollupPluginWorkerInline(cfg = {}) {
    const workerRegexp = /new Worker\((["'])(.+?)\1\)/g;

    const config = {
        transform: code => babelTransform(code),
        ...cfg,
    };

    return {
        name: 'rollup-plugin-worker-inline',
        transform(code, id) {
            if (!workerRegexp.test(code)) return;
            const workerMs = new MagicString(code);
            workerRegexp.lastIndex = 0;

            while (true) {
                const match = workerRegexp.exec(code);
                if (match) {
                    const workerFile = match[2];
                    const workerPath = resolve(dirname(id), workerFile);
                    const workerString = readFileSync(workerPath, 'utf8');
                    this.addWatchFile(workerPath);
                    const workerTransformString = config.transform(workerString) || '';
                    const workerFileStartIndex = match.index + 'new Worker('.length;
                    const workerFileEndIndex = match.index + match[0].length - ')'.length;
                    workerMs.overwrite(
                        workerFileStartIndex,
                        workerFileEndIndex,
                        `URL.createObjectURL(new Blob([\`${workerTransformString}\`]))`,
                    );
                } else {
                    break;
                }
            }

            return {
                code: workerMs.toString(),
                map: workerMs.generateMap({ hires: true }),
            };
        },
    };
};
