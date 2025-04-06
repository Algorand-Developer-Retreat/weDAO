import { useNavigate } from "@remix-run/react";
import { SiLaunchpad } from "react-icons/si";

export default function NavigateToLaunchpadButton() {
  const navigate = useNavigate();

  return (
    <button
      className="flex items-center justify-center bg-surface hover: text-primary text-xl font-bold py-2 px-3 rounded-full border-2 border-primary"
      onClick={() => {
        navigate("/launchpad");
      }}
    >
      Launchpad 🚀
    </button>
  );
}
// This button is used to navigate to the launchpad page. It is a simple button with a background color of primary, white text, and rounded corners. When clicked, it navigates to the /launchpad route using the useNavigate hook from react-router-dom.
