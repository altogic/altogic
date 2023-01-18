import { altogicOnlyRead } from '../libs/altogic';
import { Color } from '../types/altogic';

export default class ColorService {
	static async getColors() {
		const { data, errors } = await altogicOnlyRead.db.model('colors').limit(50).get();

		if (errors) throw errors;

		return data as Color[];
	}
}
