const workerInline = require('../src/index');

module.exports = {
    input: 'index.js',
    output: {
        format: 'iife',
        file: 'bundle.js',
        sourcemap: true,
    },
    plugins: [workerInline()],
};
