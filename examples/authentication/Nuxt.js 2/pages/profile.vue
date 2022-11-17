<script>
import Avatar from '~/components/Avatar';
import Sessions from '~/components/Sessions';
import UserInfo from '~/components/UserInfo';
export default {
	middleware: ['auth'],
	components: {
		Avatar,
		Sessions,
		UserInfo,
	},
};
</script>
<template>
	<div>
		<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
			<Avatar />
			<UserInfo />
			<Sessions />
			<a href="/api/logout" class="bg-gray-400 rounded py-2 px-3 text-white"> Logout </a>
		</section>
	</div>
</template>
