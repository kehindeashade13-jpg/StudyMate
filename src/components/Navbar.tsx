import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  BookOpen,
  Search,
  Plus,
  Flame,
  Zap,
  Bell,
  Check,
  CheckCheck,
  Globe,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Menu,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    openAddMaterialModal,
    setIsSearchOpen,
    setIsAssistantOpen,
    setIsSidebarOpen,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setIsAuthModalOpen,
  } = useStudy();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // If on dashboard, the custom top bar is embedded in DashboardView matching IMG_8794.jpeg
  if (activeTab === "dashboard") {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabLabels: Record<string, string> = {
    library: "My Decks & Notes",
    learn: "Interactive Lesson",
    memorise: "Memorise & Flashcards",
    quizzes: "Quizzes & Practice",
    groups: "Study Groups",
    friends: "Find Friends",
    plan: "Study Plan",
    progress: "Progress & Badges",
    profile: "Student Profile",
    landing: "About StudyMate",
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#0A1931]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-15 flex items-center justify-between gap-3">
        {/* Left: Back to Home button & Menu */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0A1931] text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0A1931] transition cursor-pointer"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="border-l border-slate-200 pl-2.5 hidden sm:block">
            <h2 className="text-sm font-bold text-[#0A1931] tracking-tight">
              {tabLabels[activeTab] || "StudyMate"}
            </h2>
          </div>
        </div>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-xs sm:max-w-sm hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 text-xs hover:border-[#0A1931] transition"
          >
            <span className="flex items-center gap-2 text-[#0A1931]">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search decks, notes, quizzes...</span>
            </span>
            <kbd className="text-[10px] bg-slate-100 text-[#0A1931] px-1.5 py-0.5 rounded border border-slate-200">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Import Button */}
          <button
            onClick={() => openAddMaterialModal("upload")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1931] hover:bg-[#1B2A4A] text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Streak Badge (Only streak kept) */}
          <div
            onClick={() => setActiveTab("progress")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0A1931] text-xs font-bold cursor-pointer hover:bg-slate-50 transition shadow-2xs"
            title={`${user.streakDays} Day Study Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
            <span>{user.streakDays}d streak</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0A1931] transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A1931] text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-[#0A1931]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-[#0A1931] flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#0A1931]" /> Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-[#0A1931] hover:underline font-semibold"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                          n.isRead
                            ? "bg-slate-50 border-slate-100 text-[#1B2A4A]/60"
                            : "bg-slate-100 border-slate-200 text-[#0A1931]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#0A1931]">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 text-[#0A1931] transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0A1931]/30"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
