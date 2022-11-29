import wcSidebar from "../assets/wc-sidebar.jpeg";

export default function AuthSidebar() {
  return (
    <div className="hidden xl:block relative">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={wcSidebar}
        alt="Guess World Cup"
      />
    </div>
  );
}
