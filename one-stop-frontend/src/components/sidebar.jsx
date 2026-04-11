import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#020617] p-5 border-r border-gray-800">

      <h1 className="text-xl font-bold text-purple-400 mb-8">
        AI Learn
      </h1>

      <ul className="space-y-5 text-gray-300">

        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/progress">Progress</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/flow">Roadmap</Link></li>
        <li><Link to="/help">Help</Link></li>

      </ul>
    </div>
  );
}