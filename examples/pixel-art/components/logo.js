import logoPrimary from "../assets/pixels-logo-a.png";
import logo from "../assets/pixels-logo-c.png";

export default function Logo({ className, w, h, primary }) {
  return (
    <img
      className={className || `w-[${w || "80px"}] h-[${h || "80px"}] mb-6`}
      src={!primary ? logoPrimary.src : logo.src}
      alt="List"
    />
  );
}
