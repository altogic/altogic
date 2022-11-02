import { useLoaderData, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UserDetail from '../components/UserDetail';
import UserLinks from '../components/UserLinks';
import CopyCurrentLink from '../components/CopyCurrentLink';
import { useEffect } from 'react';
import EditLink from '../components/EditLink';
import { useAuthStore, useLinkStore } from '../store';
import AddLink from '../components/AddLink';
import AddLinkButton from '../components/AddLinkButton';
import LogoutButton from '../components/LogoutButton';

export default function UserProfile() {
	const { username } = useParams();
	const { user } = useAuthStore();
	const { links: data } = useLoaderData();
	const { setLinks, links } = useLinkStore();

	useEffect(() => {
		setLinks(data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isMe = user ? user.username === username : false;
	const picture = isMe ? user?.profilePicture : links[0]?.belongsTo.profilePicture;
	const bio = isMe ? user?.bio : links[0]?.belongsTo.bio;
	const title = isMe ? 'My Profile' : links.length === 0 ? 'No profile found' : `${username}'s profile`;
	const hasProfile = isMe || links.length > 0;

	return (
		<>
			<div className="bg-black text-white flex justify-center">
				<div className="w-full py-16 px-4 gap-8 max-w-2xl grid grid-rows-[auto_1fr]">
					{/* if profile exist show profile and its data  */}
					{hasProfile ? (
						<>
							<UserDetail bio={bio} image={picture} name={username} />
							{/* if there is no link, show add button  */}
							{links.length === 0 ? (
								<div>
									<div className="text-center text-2xl">
										<p className="text-3xl">You haven't added a link yet.</p>
										<div className="flex items-center gap-2 justify-center mt-2">
											<p>Click this button to add</p>
											<AddLinkButton />
										</div>
									</div>
								</div>
							) : (
								// show links
								<UserLinks setLinks={setLinks} links={links} />
							)}
							{/* the buttons on the top */}
							<div className="absolute top-2 right-2 sm:top-[27px] sm:right-[13px] flex items-center gap-2">
								<CopyCurrentLink />
								{isMe && (
									<>
										<AddLinkButton />
										<LogoutButton />
									</>
								)}
							</div>
						</>
					) : (
						/* if profile doesn't exist show 404 :) */
						<div className="flex gap-5 items-center flex-col justify-center">
							<h1 className="text-center text-4xl md:text-7xl">No Matching Profile</h1>
							<img
								src="https://media.tenor.com/troIbBHPB4MAAAAC/desculpa.gif"
								alt="404"
								className="rounded-xl"
							/>
						</div>
					)}
				</div>
			</div>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<EditLink />
			<AddLink />
		</>
	);
}
