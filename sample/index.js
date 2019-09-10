const worker = new Worker('./worker.js');

worker.postMessage('Hi, worker');
