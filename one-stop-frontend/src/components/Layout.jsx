import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex bg-[#020617] text-white min-h-screen">
      {/* Main */}
      <div className="flex-1 min-w-0">
        <Navbar />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}