import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ScreenLoader from './components/ScreenLoader';

export default function App() {
	return <RouterProvider fallbackElement={<ScreenLoader />} router={router} />;
}
