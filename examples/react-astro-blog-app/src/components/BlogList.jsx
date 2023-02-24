import { useEffect, useState } from "react";
import BlogCard from "./BlogCard.jsx";
import { db } from "../utils/altogic.ts";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const getBlogs = async () => {
    return await db.model("blog").get();
  };

  useEffect(() => {
    getBlogs().then((blogs) => {
      setBlogs(blogs.data);
    });
  }, []);

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center w-full justify-center gap-14 text-start mb-20">
      {blogs.length > 0 && blogs.map((blog) => <BlogCard blog={blog} />)}
    </div>
  );
}
