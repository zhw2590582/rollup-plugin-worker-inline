(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}(function () { 'use strict';

	var worker = new Worker('./worker.js');
	worker.postMessage('Hi, worker');

}));
