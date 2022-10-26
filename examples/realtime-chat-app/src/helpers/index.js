export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function dispatchESCPress() {
	const event = new KeyboardEvent('keydown', { code: 'Escape' });
	document.dispatchEvent(event);
}
