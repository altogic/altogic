<script>
	import { authStore } from '../store/auth.store';
	import { altogic } from '../configs/altogic';

	let changeMode = false;
	let name = $authStore.name || '';
	let errors = null;

	const handleNameChange = () => {
		changeMode = true;
	};

	const handleKeyDown = async (e) => {
		if (e.code === 'Enter') {
			errors = null;

			const { data: updatedUser, errors: apiErrors } = await altogic.db
				.model('users')
				.object($authStore._id)
				.update({ name });

			if (apiErrors) errors = apiErrors.items[0].message;
			else authStore.set(updatedUser);

			changeMode = false;
		}
	};
</script>

<section class="border p-4 w-full">
	{#if changeMode}
		<div class="flex items-center justify-center">
			<input
				type="text"
				class="border-none text-3xl text-center"
				on:keydown={handleKeyDown}
				bind:value={name}
			/>
		</div>
	{:else}
		<div class="space-y-4">
			<h1 class="text-3xl">Hello, {$authStore?.name}</h1>
			<button on:click={handleNameChange} class="border p-2"> Change name </button>
		</div>
	{/if}
	{#if errors}<div>{errors}</div>{/if}
</section>
