(function () {
	'use strict';

	const worker1 = new Worker(URL.createObjectURL(new Blob([(function(){onmessage=function onmessage(a){console.log(a.data);};}).toString().slice(11, -2)])));
	const worker2 = new Worker(URL.createObjectURL(new Blob([(function(){onmessage=function onmessage(a){console.log(a.data);};}).toString().slice(11, -2)])));

	worker1.postMessage('Hi, worker1');
	worker2.postMessage('Hi, worker2');

}());
//# sourceMappingURL=bundle.js.map
