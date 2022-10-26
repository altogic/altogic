import { useEffect, useState } from 'react';

export default function useInternetConnection() {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const handleStatus = () => setIsOnline(navigator.onLine);

	useEffect(() => {
		window.addEventListener('online', handleStatus);
		window.addEventListener('offline', handleStatus);
		return () => {
			window.removeEventListener('online', handleStatus);
			window.removeEventListener('offline', handleStatus);
		};
	}, []);

	return isOnline;
}
