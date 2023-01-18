import { APIError } from 'altogic';

export function cn(...classNames: any[]) {
	return classNames.filter(Boolean).join(' ');
}

export function moneyFormat(number: number) {
	return new Intl.NumberFormat('en-EN', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(number);
}

export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function parseAltogicAPIError(errors: APIError) {
	return errors.items.map(item => {
		return {
			error: item.code,
			// @ts-ignore
			field: item.details.field,
			// @ts-ignore
			value: item.details.value
		};
	});
}

export function isMobile() {
	return 'orientation' in window;
}
