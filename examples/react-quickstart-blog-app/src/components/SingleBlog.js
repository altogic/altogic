import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import altogic from "../helpers/altogic";

const SingleBlog = () => {
  // Stores the id value of the params in URL
  const { id } = useParams();

  // Single blog instance fecthed from the database
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const getBlog = async () => {
      // Gets the single blog object with given ID
      const result = await altogic.db.model("blogs").object(id).get();
      if (!result.errors) {
        setBlog(result.data);
      }
    };
    getBlog();
  }, []);
  return (
    <div className="text-left p-2 lg:mx-64">
      <Link className="text-xs text-blue-600" to="/">
        Back to Blogs
      </Link>
      {blog ? (
        <div className="text-sm mt-5 text-center ">
          <h2 className="text-xl my-2 ">{blog.title}</h2>
          <div className="text-sm text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </div>
          <div className="mt-3 text-xs text-gray-500">{blog.createdAt}</div>
        </div>
      ) : null}
    </div>
  );
};

export default SingleBlog;
