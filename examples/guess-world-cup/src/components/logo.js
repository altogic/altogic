import logoWhite from "../assets/logo-white.webp";
import logo from "../assets/logo.png";

export default function Logo({ className, w, primary }) {
  return (
    <img
      className={className || `w-[${w || "192px"}] h-[120px] mb-6`}
      src={primary ? logo : logoWhite}
      alt="Guess World Cup"
    />
  );
}
