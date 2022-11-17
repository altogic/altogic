import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore', 'acceptHMRUpdate'],
            },
        ],
        '@nuxtjs/tailwindcss',
    ],
    imports: {
        dirs: ['stores'],
    },
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config',
        exposeConfig: false,
        injectPosition: 0,
        viewer: true,
    },
});
