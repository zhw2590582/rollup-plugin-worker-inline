# rollup-plugin-worker-inline

![version](https://badgen.net/npm/v/rollup-plugin-worker-inline)
![license](https://badgen.net/npm/license/rollup-plugin-worker-inline)
[![npm Downloads](https://img.shields.io/npm/dt/rollup-plugin-worker-inline.svg)](https://www.npmjs.com/package/rollup-plugin-worker-inline)

> A simple rollup plugin to create inline worker

## Install

```bash
$ npm install rollup-plugin-worker-inline
```

## Usage

In the `rollup.config.js`, or you can test the sample file [./sample/rollup.config.js](./sample/rollup.config.js)

```js
import workerInline from 'rollup-plugin-worker-inline';

export default {
    // ...
    plugins: [
        workerInline({
            // Get the regularity of the worker path, best not to modify
            workerRegexp: /new Worker\((["'])(.+?)\1\)/g,

            // The worker file passes `@babel/preset-env` and `babel-preset-minify` presets processing by default.
            // Or you can customize the worker output yourself.
            workerTransform: workerString => workerString,
        }),
    ],
    // ...
};
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
