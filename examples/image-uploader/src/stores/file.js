import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import altogic from '@/libs/altogic';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import slugify from 'slugify';
import { useRoute, useRouter } from 'vue-router';

const DEFAULT_LIMIT = 24;

export const useFileStore = defineStore('file', () => {
	const _files = ref(null);
	const _folders = ref(null);
	const filesInfo = ref(null);
	const fileLoading = ref(false);
	const folderLoading = ref(false);
	const auth = useAuthStore();
	const toast = useToast();
	const route = useRoute();
	const router = useRouter();

	async function getFiles({ page = 1, tag = null }) {
		fileLoading.value = true;

		let filter = `userId == '${auth.user._id}' `;
		if (tag) filter += `&& IN(tags, '${tag}')`;

		const { data, errors } = await altogic.storage
			.bucket(auth.isAuthenticated ? auth.user.email : 'root')
			.listFiles(filter, {
				returnCountInfo: true,
				limit: DEFAULT_LIMIT,
				page: page ?? 1,
				sort: {
					field: 'uploadedAt',
					direction: 'desc',
				},
			});
		fileLoading.value = false;
		if (errors) {
			console.log(errors);
			toast.error("Couldn't get files");
			return;
		}
		_files.value = data.data;
		filesInfo.value = data.info;
		return data.data;
	}

	async function getFolders() {
		folderLoading.value = true;
		const { data, errors } = await altogic.db
			.model('folders')
			.filter(`user == '${auth.user._id}'`)
			.get();
		folderLoading.value = false;
		if (errors) {
			toast.error("Couldn't get folders");
			return;
		}
		_folders.value = data;
	}

	async function createFolder(name) {
		const { data, errors } = await altogic.db
			.model('folders')
			.create({ name, user: auth.user._id, slug: slugify(name, { lower: true }) });
		if (errors) {
			toast.error("Couldn't create folder");
			return;
		}
		_folders.value.push(data);
	}

	async function deleteFile({ url, page = 1, tag = null }) {
		let filter = `userId == '${auth.user._id}' `;
		if (tag) filter += `&& IN(tags, '${tag}')`;
		const {
			data: { response },
			errors,
		} = await altogic.endpoint.delete('/file', {
			filter,
			url,
			limit: DEFAULT_LIMIT,
			bucketName: auth.isAuthenticated ? auth.user.email : 'root',
			page: page ?? 1,
		});

		if (errors) {
			return toast.error('Could not delete file');
		}

		_files.value = response.data;
		filesInfo.value = response.info;
		toast.success('File deleted');
		return response.data;
	}

	async function deleteFolder(id) {
		const { errors } = await altogic.db.model('folders').object(id).delete();
		if (errors) {
			toast.error("Couldn't delete folder");
			return;
		}
		toast.success('Folder deleted');
		_folders.value = _folders.value.filter(folder => folder._id !== id);
	}

	function addFiles(files) {
		if (Array.isArray(files)) {
			_files.value.unshift(...files);
		} else {
			_files.value.unshift(files);
		}
		calculateCount();
	}

	function calculateCount() {
		filesInfo.value.count = _files.value.length;
		filesInfo.value.totalPages = Math.ceil(_files.value.length / DEFAULT_LIMIT);
	}

	const files = computed(() => _files.value);
	const folders = computed(() => _folders.value);
	const filteredFiles = computed(() => {
		const tag = route.params.slug;
		if (!tag) return files.value;
		return files.value?.filter(file => file.tags?.includes(route.params.slug));
	});

	return {
		deleteFile,
		getFiles,
		filteredFiles,
		fileLoading,
		getFolders,
		createFolder,
		files,
		folders,
		filesInfo,
		deleteFolder,
		addFiles,
	};
});
