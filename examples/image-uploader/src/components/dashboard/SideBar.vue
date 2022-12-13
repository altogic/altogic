<template>
	<div class="bg-[#F5F5F5] flex lg:flex-col gap-4 lg:gap-10 border-r border-[#F0F0F0]">
		<div class="font-medium text-2xl md:text-3xl text-[#1890FF] px-5 pt-5">
			Dashboard
		</div>
		<div class="hidden lg:block">
			<ul class="grid gap-2">
				<li class="group relative">
					<router-link
						to="/"
						active-class="bg-[#BFBFBF] text-black after:bg-[#5F5F5F] after:w-[2px] after:top-0 after:bottom-0  after:absolute after:top-0 after:right-[-1px]"
						class="text-black/40 px-4 group-hover:bg-[#BFBFBF] group-hover:text-black transition flex items-center gap-2 py-2"
					>
						Back to home
					</router-link>
				</li>
				<li class="group relative">
					<router-link
						to="/dashboard"
						active-class="bg-[#BFBFBF] text-black after:bg-[#5F5F5F] after:w-[2px] after:top-0 after:bottom-0  after:absolute after:top-0 after:right-[-1px]"
						class="text-black/40 px-4 group-hover:bg-[#BFBFBF] group-hover:text-black transition flex items-center gap-2 py-2"
					>
						Dashboard
					</router-link>
				</li>
			</ul>
		</div>
		<div class="p-4 ml-auto lg:m-0 lg:mt-auto">
			<Button @click="auth.logout" class="w-full"> Logout </Button>
		</div>
	</div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>
