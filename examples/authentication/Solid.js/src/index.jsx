/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { Router } from '@solidjs/router';
import './assets/app.css';
import { AuthProvider } from './context/AuthContext';

render(
	() => (
		<Router>
			<AuthProvider>
				<App />
			</AuthProvider>
		</Router>
	),
	document.getElementById('root')
);
