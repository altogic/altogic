import { ReactElement } from 'react';
import Header from '../components/Header';
interface ShopLayoutProps {
	children: ReactElement;
}
export default function ShopLayout({ children }: ShopLayoutProps) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
