const Core = {};

//Timer with puase and resume functionality
Core.Timer = function (callback, delay) {
	var timerId,
		start,
		remaining = delay;

	this.pause = function () {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	this.resume = function () {
		start = new Date();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};
};

//Interval with start and stop functionality
Core.Interval = function (callback, interval) {
	var timerId,
		duration = interval;

	this.stop = function () {
		clearInterval(timerId);
	};

	this.start = function () {
		timerId = setInterval(callback, duration);
	};
};

export default Core;
