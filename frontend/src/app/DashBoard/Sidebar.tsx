"use client";
import React from "react";
import { FiDatabase, FiCalendar, FiBriefcase, FiFileText, FiZap } from "react-icons/fi";

interface SidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, activeComponent }) => {
  const menuItems = [
    { id: "backend", label: "Backend", icon: <FiDatabase /> },
    { id: "bookings", label: "Bookings", icon: <FiCalendar /> },
    { id: "careers", label: "Careers", icon: <FiBriefcase /> },
    { id: "documents", label: "Documents", icon: <FiFileText /> },
    { id: "events", label: "Events", icon: <FiZap /> },
    { id: "campaign", label: "Campaigns", icon: <FiZap /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-lg">
      <div className="text-2xl font-bold p-6 text-center bg-gray-800 border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveComponent(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all font-medium ${
              activeComponent === item.id
                ? "bg-gray-700 text-white shadow-inner"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
