import ClipLoader from "react-spinners/ClipLoader";

export default function Button({ children, loading, ...params }) {
  return (
    <button disabled={loading} {...params}>
      {loading && (
        <ClipLoader className="mr-2" color="#fff" loading={loading} size={20} />
      )}
      {children}
    </button>
  );
}
