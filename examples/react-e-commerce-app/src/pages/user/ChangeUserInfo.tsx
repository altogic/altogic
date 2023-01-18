import Button from '../../components/ui/Button';
import { ChangeEvent, FormEvent, useState } from 'react';
import UserService from '../../services/UserService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/auth';
import Input from '../../components/ui/Input';
import UserAvatar from '../../components/UserAvatar';
import { APIError } from 'altogic';

export default function ChangeUserInfo() {
	const { user, setUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(user?.name ?? '');
	const [phone, setPhone] = useState(user?.phone ?? '');

	async function onSelectPhoto(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || !user) return;
		const [file] = e.target.files;
		if (!file) return;
		e.target.value = '';
		try {
			setLoading(true);
			const updatedUser = await UserService.updateProfilePicture(user._id, file);
			setUser(updatedUser);
			// @ts-ignore
		} catch (error: APIError) {
			console.error(error);
			error.items.forEach((item: any) => toast.error(item.message));
		} finally {
			setLoading(false);
		}
	}

	async function submitHandler(e: FormEvent) {
		e.preventDefault();
		if (!user) return;
		try {
			setLoading(true);
			const updatedUser = await UserService.update(user?._id, { name, phone });
			setUser(updatedUser);
			toast.success('Profile updated');
			// @ts-ignore
		} catch (error: APIError) {
			console.error(error);
			error.items.forEach((item: any) => toast.error(item.message));
		} finally {
			setLoading(false);
		}
	}

	// @ts-ignore
	return (
		<section>
			<form className="divide-y divide-gray-200" onSubmit={submitHandler}>
				<div className="py-6 px-4 space-y-4 sm:p-6 sm:px-0 sm:pt-0 lg:pb-8">
					<div>
						<h2 className="text-lg leading-6 font-medium text-gray-900">Update profile</h2>
						<p className="mt-1 text-sm text-gray-500">
							This information will be displayed publicly so be careful what you share.
						</p>
					</div>

					<div className="flex gap-4 flex-col md:flex-row">
						<div className="grid sm:grid-cols-2 gap-4 flex-1">
							<div>
								<div className="col-span-12 sm:col-span-6 flex flex-col gap-1">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Name
									</label>
									<Input
										placeholder="Enter your name"
										value={name}
										id="name"
										required
										onChange={e => setName(e.target.value)}
									/>
								</div>
							</div>
							<div>
								<div className="col-span-12 sm:col-span-6 flex flex-col gap-1">
									<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
										Phone
									</label>
									<Input
										value={phone}
										id="phone"
										required
										onChange={e => setPhone(e.target.value)}
										placeholder="Enter your phone number"
									/>
								</div>
							</div>
							<div>
								<div className="col-span-12 sm:col-span-6 flex flex-col gap-1">
									<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<Input
										defaultValue={user?.email}
										id="email"
										className="read-only:bg-gray-100 read-only:cursor-not-allowed"
										readOnly
									/>
								</div>
							</div>
						</div>
						<div className="sm:-mt-14 flex flex-col lg:flex-row">
							<div className="flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
								<p className="text-sm font-medium text-gray-700" aria-hidden="true">
									Profile Picture
								</p>
								<div className="mt-1 lg:hidden">
									<div className="flex items-center">
										<div className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12">
											<UserAvatar />
										</div>
										<div className="ml-5 rounded-md shadow-sm">
											<Button htmlFor="mobile-user-photo" as="label" variant="white">
												Change
											</Button>
											<input
												id="mobile-user-photo"
												name="user-photo"
												type="file"
												onChange={onSelectPhoto}
												className="hidden"
											/>
										</div>
									</div>
								</div>

								<div className="hidden border shadow relative rounded-full overflow-hidden lg:block">
									<UserAvatar width={200} className="relative" />
									<label
										htmlFor="desktop-user-photo"
										className="absolute transition inset-0 w-full h-full bg-black bg-opacity-60 cursor-pointer flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
									>
										<span>Change</span>
										<input
											type="file"
											id="desktop-user-photo"
											name="user-photo"
											onChange={onSelectPhoto}
											className="hidden"
										/>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="pt-6">
					<div className="px-4 flex justify-end sm:px-6 sm:px-0 gap-5">
						<Button type="submit" loading={loading} className="w-full sm:w-auto">
							Save Profile
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
}
