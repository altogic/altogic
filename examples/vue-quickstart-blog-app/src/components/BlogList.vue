<template>
  <div>
    <div class="justify-center flex mb-5">
      <div class="border rounded p-3 w-96 my-4 bg-white">
        <!-- Form structure to get the created blog post data from the user. 
          When the form is submitted, createBlogPost() function will be triggered. -->
        <form @submit="createBlogPost" class="text-left">
          <div>
            <label class="text-xs">Blog Title</label>

            <div>
              <input
                class="border rounded mb-2 w-full text-sm p-1"
                type="text"
                v-model="title"
              />
            </div>
          </div>
          <div>
            <label class="text-xs">Blog Content</label>
            <div>
              <textarea
                class="border rounded mb-2 w-full text-sm h-24"
                type="text"
                v-model="content"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="text-sm bg-blue-600 p-1 rounded text-white w-full"
              :disabled="title == ''"
            >
              Create Blog Post
            </button>
          </div>
        </form>
      </div>
    </div>
    <h2 class="text-center font-semibold">Blog Posts</h2>
    <div class="grid grid-cols-3 m-3 px-12">
      <!-- We will list blog post by mapping the blogs array state in here  -->
      <div
        class="border rounded p-3 m-1 bg-white"
        v-for="blog in blogs"
        :key="blog._id"
      >
        <!--  Redirects user to the blog post's special page by clicking on it. -->
        <router-link :to="`/blog/${blog._id}`">
          <div class="text-sm truncate">{{ blog.title }}</div>
          <div class="text-gray-400 text-sm truncate">
            {{ blog.content }}
          </div>
          <div class="text-right text-xs my-1 text-gray-400 truncate">
            {{ blog.createdAt }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import altogic from "../helpers/altogic";

export default {
  name: "BlogList",
  data() {
    return {
      title: "",
      content: "",
      blogs: [],
    };
  },
  methods: {
    async createBlogPost(event) {
      event.preventDefault();

      // We can create an instance in the database by calling altogic.db.model().object().create() function
      const result = await altogic.db.model("blogs").object().create({
        title: this.title,
        content: this.content,
      });

      // If we create an blog post instance in the database successfully, we update our blogs state by appending the new blog post.
      if (!result.errors) {
        this.blogs = [...this.blogs, result.data];
      }
      this.title = "";
      this.content = "";
    },
  },
  async mounted() {
    const result = await altogic.db.model("blogs").get();
    // It there are no error message set the blogs state with the retrieved data
    if (!result.errors) {
      this.blogs = result.data;
    }
  },
};
</script>