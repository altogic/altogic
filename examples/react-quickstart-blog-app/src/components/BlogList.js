import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import altogic from "../helpers/altogic";

const BlogList = () => {
  // Title state for adding blog
  const [title, setTitle] = useState("");

  // Content state for adding blog
  const [content, setContent] = useState("");

  // Blogs state to store retrieved blgo posts from the Altogic
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    // Since the fetching blog process works asynchronous;
    // We will define new async function and call it normally in the useEffect
    const getBlogs = async () => {
      // We can fetch all the instances in the database by calling altogic.db.model().get() function
      const result = await altogic.db.model("blogs").get();

      // It there are no error message set the blogs state with the retrieved data
      if (!result.errors) {
        setBlogs(result.data);
      }
    };
    getBlogs();
  }, []);

  // This function will be triggered by submitting the Create Blog Post form on the UI.
  const createBlogPost = async (event) => {
    event.preventDefault();

    // We can create an instance in the database by calling altogic.db.model().object().create() function
    const result = await altogic.db.model("blogs").object().create({
      title: title,
      content: content,
    });

    // If we create an blog post instance in the database successfully, we update our blogs state by appending the new blog post.
    if (!result.errors) {
      setBlogs([...blogs, result.data]);
    }
    setTitle("");
    setContent("");
  };

  return (
    <>
      <div className="justify-center flex mb-5">
        <div className="border rounded p-3 w-96 my-4 bg-white">
          {/* Form structure to get the created blog post data from the user. 
          When the form is submitted, createBlogPost() function will be triggered.*/}
          <form onSubmit={createBlogPost} className="text-left">
            <div>
              <label className="text-xs">Blog Title</label>

              <div>
                <input
                  className="border rounded mb-2 w-full text-sm p-1"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs">Blog Content</label>
              <div>
                <textarea
                  className="border rounded mb-2 w-full text-sm h-24"
                  type="text"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="text-sm bg-blue-600 p-1 rounded text-white w-full"
                disabled={title === ""}
              >
                Create Blog Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <h2>Blog Posts</h2>
      <div className="grid grid-cols-3 m-3 px-12">
        {/* We will list blog post by mapping the blogs array state in here */}
        {blogs
          ? blogs.map((blog) => {
              return (
                <div key={blog._id} className="border rounded p-3 m-1 bg-white">
                  {/* Redirects user to the blog post's special page by clicking on it. */}
                  <Link to={`/blog/${blog._id}`}>
                    <div className="text-sm truncate">{blog.title}</div>
                    <div className="text-gray-400 text-sm truncate">
                      {blog.content}
                    </div>
                    <div className="text-right text-xs my-1 text-gray-400 truncate">
                      {blog.createdAt}
                    </div>
                  </Link>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default BlogList;
