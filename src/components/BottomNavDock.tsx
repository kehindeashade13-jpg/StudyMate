import React from "react";
import { useStudy } from "../context/StudyContext";
import {
  Home,
  Gamepad2,
  FolderKanban,
  MessageSquare,
  User,
} from "lucide-react";

export const BottomNavDock: React.FC = () => {
  const { activeTab, setActiveTab } = useStudy();

  const navItems = [
    {
      tab: "dashboard" as const,
      label: "Home",
      icon: Home,
      badge: undefined,
    },
    {
      tab: "quizzes" as const,
      label: "Practice",
      icon: Gamepad2,
      badge: undefined,
    },
    {
      tab: "library" as const,
      label: "Decks",
      icon: FolderKanban,
      badge: undefined,
    },
    {
      tab: "groups" as const,
      label: "Groups",
      icon: MessageSquare,
      badge: undefined,
    },
    {
      tab: "profile" as const,
      label: "Profile",
      icon: User,
      badge: undefined,
    },
  ];

  return (
    <nav
      id="bottom-dock-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around shadow-sm"
    >
      <div className="max-w-md w-full mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.tab ||
            (item.tab === "quizzes" && (activeTab === "quizzes" || activeTab === "memorise"));

          return (
            <button
              key={item.tab}
              id={`dock-tab-${item.tab}`}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer ${
                isActive
                  ? "text-[#0A1931] scale-105"
                  : "text-slate-400 hover:text-[#0A1931] hover:bg-slate-50"
              }`}
              title={item.label}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition ${
                    isActive ? "stroke-[2.5] text-[#0A1931]" : "stroke-[1.8]"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#0A1931] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 font-medium ${
                  isActive ? "text-[#0A1931] font-bold" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
