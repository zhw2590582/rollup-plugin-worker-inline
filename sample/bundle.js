(function () {
	'use strict';

	importScripts('./dep.js');

	const worker1 = new Worker(URL.createObjectURL(new Blob([`"use strict";onmessage=function onmessage(a){console.log(a.data)};`])));
	const worker2 = new Worker(URL.createObjectURL(new Blob([`"use strict";onmessage=function onmessage(a){console.log(a.data)};`])));

	worker1.postMessage('Hi, worker1');
	worker2.postMessage('Hi, worker2');

}());
//# sourceMappingURL=bundle.js.map
