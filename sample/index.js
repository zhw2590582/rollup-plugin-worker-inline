importScripts('./dep.js');

const worker1 = new Worker('./worker.js');
const worker2 = new Worker('./worker.js');

worker1.postMessage('Hi, worker1');
worker2.postMessage('Hi, worker2');
