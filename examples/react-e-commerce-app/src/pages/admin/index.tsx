import { useAdminStore } from '../../store';

export { default as Orders } from './Orders';
export { default as AddOrUpdateProduct } from './AddOrUpdateProduct';
export { default as AddCategory } from './AddCategory';
export { default as OrderDetails } from './OrderDetails';
export { default as Products } from './Products';
export { default as Stats } from './Stats';
export { default as Categories } from './Categories';

import { Outlet, useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';

export default function Index() {
	const count = useLoaderData() as number;
	const { setWaitingOrderCount } = useAdminStore();

	useEffect(() => {
		setWaitingOrderCount(count);
	}, []);

	return <Outlet />;
}
