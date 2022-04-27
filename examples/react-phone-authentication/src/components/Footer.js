import Logo from "../images/blue.svg";

function Footer() {
  return (
    <a
      href="https://www.altogic.com"
      className="whitespace-nowrap2 mr-5 mb-5 fixed bottom-0 font-medium right-0 text-slate-100 text-xs inline-flex items-center justify-center px-2 py-2 border border-transparent rounded-md shadow-xl bg-indigo-800 hover:bg-indigo-750 cursor-pointer"
    >
      <img src={Logo} className="h-5" />
      Powered by&nbsp;
      <span
        className="text-slate-100 cursor-pointer"
        href="https://www.altogic.com"
      >
        Altogic
      </span>
    </a>
  );
}

export default Footer;
