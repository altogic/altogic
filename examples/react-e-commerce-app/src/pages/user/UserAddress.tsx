import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/Textarea';
import useAuthStore from '../../store/auth';
import { FormEvent, useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';

export default function UserAddress() {
	const { user, setUser } = useAuthStore();
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	const [zipCode, setZipCode] = useState('');
	const [detailedAddress, setDetailedAddress] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user?.address) {
			setCity(user?.address?.city);
			setCountry(user?.address?.country);
			setZipCode(user?.address?.zipCode);
			setDetailedAddress(user?.address?.detailedAddress);
		}
	}, []);

	async function submitHandler(e: FormEvent) {
		e.preventDefault();
		if (!user || loading) return;
		try {
			setLoading(true);
			const updatedUser = await UserService.updateAddress({
				country,
				city,
				zipCode,
				detailedAddress
			});
			setUser(updatedUser);
			toast.success('Address updated successfully');
			// @ts-ignore
		} catch (error: APIError) {
			console.error(error);
			error.items.forEach((item: any) => toast.error(item.message));
		} finally {
			setLoading(false);
		}
	}

	return (
		<section>
			<form className="divide-y divide-gray-200" onSubmit={submitHandler}>
				<div className="py-6 px-4 space-y-4 sm:p-6 sm:px-0 sm:pt-0 lg:pb-8">
					<div>
						<h2 className="text-lg leading-6 font-medium text-gray-900">Update address</h2>
						<p className="mt-1 text-sm text-gray-500">This information will not be displayed publicly.</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="flex flex-col gap-1">
							<label htmlFor="country" className="block text-sm font-medium text-gray-700">
								Country
							</label>
							<Input
								value={country}
								onChange={e => setCountry(e.target.value)}
								className="w-full"
								name="country"
								id="country"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="city" className="block text-sm font-medium text-gray-700">
								City
							</label>
							<Input
								value={city}
								onChange={e => setCity(e.target.value)}
								name="city"
								id="city"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="zip" className="block text-sm font-medium text-gray-700">
								Zip Code
							</label>
							<Input
								value={zipCode}
								onChange={e => setZipCode(e.target.value)}
								type="number"
								name="zip"
								id="zip"
								required
							/>
						</div>
						<div className="flex flex-col gap-1 sm:col-span-3">
							<label htmlFor="zip" className="block text-sm font-medium text-gray-700">
								Address
							</label>
							<TextArea
								value={detailedAddress}
								onChange={e => setDetailedAddress(e.target.value)}
								rows={4}
								required
							/>
						</div>
					</div>
				</div>

				<div className="pt-6">
					<div className="px-4 flex justify-end sm:px-6 sm:px-0 gap-5">
						<Button loading={loading} type="submit" className="w-full sm:w-auto">
							Save Address
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
}
