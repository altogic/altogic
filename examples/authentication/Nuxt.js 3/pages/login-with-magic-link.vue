<script setup lang="ts">
import altogic from '~/libs/altogic';

const successMessage = ref('');
const loading = ref(false);
const email = ref('');
const errors = ref(null);

definePageMeta({
    middleware: ['guest'],
});
useHead({
    title: 'Login with magic link',
});

async function loginHandler() {
    loading.value = true;
    errors.value = null;
    const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email.value);
    loading.value = false;
    if (apiErrors) {
        errors.value = apiErrors;
    } else {
        email.value = '';
        successMessage.value = 'Email sent! Check your inbox.';
    }
}
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login with magic link</h1>

            <div v-if="successMessage" class="bg-green-600 text-white text-[13px] p-2">
                {{ successMessage }}
            </div>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors.items" :key="index">
                    {{ error.message }}
                </p>
            </div>

            <input v-model="email" type="email" placeholder="Type your email" required />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
                <button
                    :disabled="loading"
                    type="submit"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Send magic link
                </button>
            </div>
        </form>
    </section>
</template>
