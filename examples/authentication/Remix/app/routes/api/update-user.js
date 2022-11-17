import { redirect } from '@remix-run/node';
import { updateUser } from '~/utils/auth.server';

export async function action({ request }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	return updateUser(request, data);
}

export async function loader() {
	return redirect('/profile');
}
