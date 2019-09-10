import workerInline from '../src/index';

export default {
    input: 'index.js',
    output: {
        format: 'iife',
        file: 'bundle.js',
        sourcemap: true,
    },
    plugins: [
        workerInline(),
    ],
};
