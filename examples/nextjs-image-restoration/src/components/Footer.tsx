export default function Footer() {
  return (
    <footer className="h-header bg-white z-50 fixed left-0 right-0 bottom-0">
      <div className="px-4 h-full container mx-auto">
        <div className="border-t flex justify-center items-center h-full">
          <p className="text-gray-500 text-center">
            Made with ❤️ and powered by{" "}
            <a
              href="https://altogic.com/"
              target="_blank"
              className="text-sky-600 font-semibold"
            >
              Altogic
            </a>{" "}
            &{" "}
            <a
              className="text-sky-600 font-semibold"
              target="_blank"
              href="https://replicate.com/"
            >
              Replicate
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
