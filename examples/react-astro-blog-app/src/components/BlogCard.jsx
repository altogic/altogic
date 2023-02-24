export default function BlogCard({ blog }) {
  return (
    <div
      onClick={() => navigation.navigate(`/blog/${blog.slug}`)}
      class="shadow-lg w-full rounded-xl overflow-hidden cursor-pointer"
    >
      <img src={blog.coverImage} alt="" />
      <div class="p-7 flex flex-col gap-3">
        <span class="text-purple-500 font-[500]">{blog.type}</span>
        <h2 class="font-bold">{blog.title}</h2>
        <span class="text-sm">{blog.content}</span>
      </div>
    </div>
  );
}
