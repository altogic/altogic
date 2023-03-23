<script>
	import '../app.css';
	import { authStore } from '../store/auth.store.js';
	export let data;
	authStore.set(data.user);
</script>

<slot />
