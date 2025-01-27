export const delayAction = (callback, delay = 2000) => {
	setTimeout(() => {
		callback();
	}, delay);
};
