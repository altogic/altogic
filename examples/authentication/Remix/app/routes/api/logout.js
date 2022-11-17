import { logout } from '~/utils/auth.server';

export const loader = async ({ request }) => {
	return logout(request);
};
