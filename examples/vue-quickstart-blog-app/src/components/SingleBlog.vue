<template>
  <div class="text-left p-2 lg:mx-64">
    <router-link class="text-xs text-blue-600" to="/">
      Back to Blogs
    </router-link>
    <div class="text-sm mt-5 text-center" v-if="blog">
      <h2 class="text-xl my-2">{{ blog.title }}</h2>
      <div class="text-sm text-gray-600">
        <div v-html="blog.content"></div>
      </div>
      <div class="mt-3 text-xs text-gray-500">{{ blog.createdAt }}</div>
    </div>
  </div>
</template>

<script>
import altogic from "../helpers/altogic";

export default {
  name: "SingleBlog",
  data() {
    return {
      blog: null,
    };
  },
  async mounted() {
    // Fetch the blog data after mounted
    const result = await altogic.db
      .model("blogs")
      .object(this.$route.params.id)
      .get();
    if (!result.errors) {
      this.blog = result.data;
    }
  },
};
</script>