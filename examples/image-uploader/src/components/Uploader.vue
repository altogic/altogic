<template>
    <section
        class="border-dashed h-auto flex flex-col gap-4 border-indigo-100 border-2 w-full max-w-[720px] rounded-2xl p-3 md:p-12"
    >
        <template v-if="files.length === 0">
            <div
                class="border grid gap-1 grid-cols-1 md:grid-cols-2 items-center h-24 md:h-12 p-1 rounded-lg md:rounded-full"
            >
                <label
                    :key="type.id"
                    v-for="type in types"
                    class="h-full w-full cursor-pointer"
                >
                    <input
                        :value="type.id"
                        v-model="selectedTypeId"
                        class="hidden [&:checked+span]:bg-primary [&:checked+span]:text-white"
                        type="radio"
                        name="type"
                    />
                    <span
                        class="transition grid grid-cols-[auto_auto] justify-center items-center gap-2 h-full w-full rounded-md md:rounded-full font-medium text-primary hover:text-indigo-600"
                    >
						<Icon class="shrink-0 !w-5 !h-5" :name="type.icon" />
						<span class="w-fit">
							{{ type.name }}
						</span>
					</span>
                </label>
            </div>
            <div
                class="min-h-[150px] border-dashed transition flex-1 border-indigo-100 border-2 hover:bg-indigo-50 cursor-pointer border px-4 text-center rounded-lg flex justify-center items-center"
                :class="{ 'bg-indigo-50': isDragActive }"
                v-bind="getRootProps()"
            >
                <input v-bind="getInputProps()" accept="image/*" />
                <template v-if="selectedTypeId === 1">
                    <p class="font-medium" v-if="isDragActive">Drop the files here ...</p>
                    <p class="font-medium" v-else>
                        Drag and drop some files here, or click to select files
                    </p>
                </template>
                <p v-else class="font-medium">
                    Paste your files here with
                    <span class="inline-flex bg-gray-300 p-1 rounded"
                    >CTRL + V / ⌘ + V</span
                    >
                </p>
            </div>
        </template>
        <section class="flex flex-col gap-3" v-else>
            <div>
                <h2 class="font-bold tracking-wide text-2xl leading-none">
                    Previews <small class="text-[60%]">({{ files.length }})</small>
                </h2>
                <p class="text-gray-500 text-sm">Your images ready to upload</p>
            </div>
            <div class="grid gap-2 overflow-hidden grid-cols-2 md:grid-cols-4">
                <article
                    class="border overflow-hidden flex items-center justify-center group aspect-square relative p-1 rounded hover:border-indigo-400 transition"
                    :key="index"
                    v-for="(file, index) in files"
                >
                    <div
                        v-if="file.progress"
                        class="absolute inset-0 px-1 gap-1 flex-col flex items-center justify-center bg-white/80"
                    >
                        <ProgressBar v-if="!file.url" :percent="file.progress" />
                        <div
                            class="flex flex-col gap-2 items-center justify-center"
                            v-else
                        >
                            <div
                                class="border-2 border-green-500 h-[50px] w-[50px] flex items-center justify-center rounded-full"
                            >
                                <Icon
                                    :size="30"
                                    class="text-green-500"
                                    name="checkmark-fill"
                                />
                            </div>
                            <Button
                                @click="copy(file.url)"
                                class="text-sm whitespace-nowrap !px-2 !py-1"
                            >Copy URL</Button
                            >
                        </div>
                    </div>

                    <button
                        v-if="!file.progress"
                        class="absolute text-white rounded flex items-center justify-center top-1 right-1 p-1 transition invisible group-hover:visible bg-red-400 h-8 w-8"
                        @click="removeFile(index)"
                    >
                        <Icon name="close" />
                    </button>
                    <img class="object-contain w-full" :src="file.preview" alt="" />
                </article>
            </div>
            <div
                class="grid grid-cols-2 gap-2"
                v-if="!files.every(file => !!file.progress)"
            >
                <Button @click="cancel">Cancel</Button>
                <Button @click="upload" variant="primary">Upload</Button>
            </div>
            <Button
                variant="primary"
                @click="cancel"
                :disabled="!files.every(file => !!file.url)"
            >Go back to uploader</Button
            >
        </section>
    </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Icon from '@/components/Icon.vue';
import { useDropzone } from 'vue3-dropzone';
import Button from '@/components/ui/Button.vue';
import { uploadFile } from '@/libs/altogic';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { useFileStore } from '@/stores/file';
const files = ref([]);
const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
const toast = useToast();
const auth = useAuthStore();
const storage = useFileStore();
const router = useRouter();
const { name, params } = useRoute();

const types = [
    {
        id: 1,
        name: 'From your computer',
        icon: 'computer',
    },
    {
        id: 2,
        name: 'Paste & upload',
        icon: 'paste',
    },
];
const selectedTypeId = ref(1);
const uploadedFiles = ref([]);

onMounted(() => {
    document.addEventListener('paste', onPaste);
});
onUnmounted(() => {
    document.removeEventListener('paste', onPaste);
});

// TODO: 3-) After the upload is done
const stopWatch = watch(
    files,
    newValue => {
        if (newValue.every(file => !!file.url)) {
            if (!auth.isAuthenticated) return;
            if (name === 'home') {
                router.push({ name: 'dashboard' });
            } else {
                storage.addFiles(uploadedFiles.value);
                stopWatch();
            }
        }
    },
    {
        deep: true,
    }
);

// TODO: 5-) Paste detector
const onPaste = async e => {
    if (e.clipboardData.files.length > 0) {
        onDrop([...e.clipboardData.files], []);
    }
};

// TODO: 4-) Drag and drop handler
function onDrop(acceptFiles, rejectReasons) {
    if (rejectReasons.length > 0) {
        toast.error('Something went wrong, please try again');
        return;
    }
    files.value = acceptFiles.map(file => {
        return {
            file,
            progress: null,
            url: null,
            preview: URL.createObjectURL(file),
        };
    });
}
function cancel() {
    files.value = [];
}

async function copy(text) {
    toast.clear();
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    } catch {
        toast.error('Failed to copy');
    }
}

// TODO: 1-) Upload process after the click the upload button
async function upload() {
    uploadedFiles.value = [];
    for (let i = 0; i < files.value.length; i++) {
        const { file } = files.value[i];
        uploadFile(auth.isAuthenticated ? auth.user?.email : 'root', file.name, file, {
            tags: auth.isAuthenticated && name === 'folder' ? [params.slug] : undefined,
            onProgress: (uploaded, total, percent) => {
                // TODO: 2-) For uploading percentage
                files.value[i].progress = percent;
            },
        }).then(({ data, errors }) => {
            if (!errors) {
                files.value[i].url = data.publicPath;
            }
            uploadedFiles.value.push(data);
        });
    }
}

function removeFile(index) {
    files.value = files.value.filter((_, i) => i !== index);
}
</script>
