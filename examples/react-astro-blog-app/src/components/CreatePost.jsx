import { useEffect, useState } from "react";
import { endpoint, storage } from "../utils/altogic.ts";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [imagePreview, setImagePreview] = useState();
  const handleUpload = () => {
    document.getElementById("fileUpload").click();
  };

  const createStory = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await uploadImage(title, file);
    if (data) {
      await endpoint
        .post("/blog", {
          title,
          content,
          coverImage: data.publicPath,
        })
        .then((res) => {
          if (res) {
            alert("Blog Created");
            setFile(null);
            setTitle("");
            setContent("");
          }
        });
    }
  };

  const uploadImage = async (fileName, file) => {
    return await storage.bucket("root").upload(fileName, file);
  };

  useEffect(() => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }, [file]);
  return (
    <form
      class="w-100 h-100 shadow-lg flex flex-col gap-5 p-10"
      onSubmit={createStory}
    >
      <input
        onChange={(e) => setFile(e.target.files[0])}
        id="fileUpload"
        type="file"
        hidden
      />

      <div
        onClick={handleUpload}
        class=" cursor-pointer w-full h-48 border-gray-200 border-2 flex justify-center items-center text-gray-600 "
      >
        {file ? (
          <img
            class="w-96 h-full overflow-hidden object-cover"
            src={imagePreview}
          ></img>
        ) : (
          <span>Add Image</span>
        )}
      </div>
      <span>Story Title</span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        class="w-96 border-2 h-10 px-2"
        type="text"
      />
      <span>Story Content</span>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        class="w-96 border-2 h-80 resize-none p-2"
      ></textarea>

      <button
        disabled={loading}
        type="submit"
        class="w-full bg-blue-500 h-10 text-white"
      >
        {loading ? "Loading..." : "Publish"}
      </button>
    </form>
  );
}
