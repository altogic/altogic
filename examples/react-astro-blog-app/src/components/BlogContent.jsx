import { useEffect, useState } from "react";
import { db } from "../utils/altogic.ts";
export default function BlogContent({ slot }) {
  const [blog, setBlog] = useState({});
  const getBlogBySlug = async () => {
    return await db.model("blog").filter(`this.slug == "${slot}"`).get();
  };

  useEffect(() => {
    getBlogBySlug().then((blog) => {
      setBlog(blog.data[0]);
    });
  }, []);

  return (
    <div className="w-full flex justify-center ">
      <div class="flex flex-col gap-5 w-[60%] py-20">
        <img className="w-[100%] mx-auto" src={blog.coverImage} alt="" />
        <div class="flex gap-5 items-center">
          <h2 class="font-bold text-[50px]">{blog.title}</h2>
        </div>
        <div class="flex gap-5 items-center text-[15px]">
          {new Date(blog.createdAt).toDateString()}
        </div>

        <div class="flex gap-5 items-center text-[20px] ">{blog.content}</div>
      </div>
    </div>
  );
}
