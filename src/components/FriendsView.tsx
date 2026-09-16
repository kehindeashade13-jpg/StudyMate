import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  UserPlus,
  Search,
  School,
  Sparkles,
  Shield,
  Check,
  Clock,
  MessageSquare,
  Users2,
  Lock,
  Globe,
  Award,
} from "lucide-react";
import { StudySubject } from "../types";

export const FriendsView: React.FC = () => {
  const {
    user,
    friends,
    sendFriendRequest,
    updatePrivacySettings,
    setActiveTab,
    triggerConfetti,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<StudySubject | "All">("All");

  const filteredFriends = friends.filter((f) => {
    const matchSubj = filterSubject === "All" || f.subjects.includes(filterSubject);
    const matchQuery =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubj && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-400" />
            <span>Find Study Partners</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect with classmates studying the same subjects, share flashcards, and study together.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classmates by name or topic..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Main Grid: Matchmaking List + Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Study Friends Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Subject Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Biology", "Mathematics", "Chemistry", "Physics", "Computer Science"].map(
              (sub) => (
                <button
                  key={sub}
                  onClick={() => setFilterSubject(sub as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterSubject === sub
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60"
                  }`}
                >
                  {sub}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => {
              return (
                <div
                  key={friend.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white">{friend.name}</h3>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <School className="w-3 h-3 text-slate-500" />
                            <span>{friend.school || "University"}</span>
                          </p>
                        </div>
                      </div>

                      {friend.mutualSubjectsCount && friend.mutualSubjectsCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold shrink-0">
                          {friend.mutualSubjectsCount} mutual
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                      🎯 <span className="font-semibold text-white">Goal:</span> {friend.goals}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {friend.subjects.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                      {friend.interests.map((int) => (
                        <span key={int} className="italic">#{int}</span>
                      ))}
                    </div>
                  </div>

                  {/* Connect Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    {friend.status === "connected" ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Connected
                        </span>
                        <button
                          onClick={() => setActiveTab("groups")}
                          className="ml-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                        >
                          Invite to Group
                        </button>
                      </div>
                    ) : friend.status === "pending" ? (
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Request Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          sendFriendRequest(friend.id);
                          triggerConfetti();
                        }}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect Study Partner</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Student Privacy & Study Preferences (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Student Privacy Controls</h3>
                <p className="text-[11px] text-slate-400">Control your visibility to classmates</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Profile Visibility</p>
                  <p className="text-[11px] text-slate-400">Allow classmates to find your profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.isProfilePublic}
                  onChange={(e) =>
                    updatePrivacySettings({
                      isProfilePublic: e.target.checked,
                      allowFriendRequests: user.allowFriendRequests,
                      allowGroupInvites: user.allowGroupInvites,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Study Partner Requests</p>
                  <p className="text-[11px] text-slate-400">Receive connection requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.allowFriendRequests}
                  onChange={(e) =>
                    updatePrivacySettings({
                      isProfilePublic: user.isProfilePublic,
                      allowFriendRequests: e.target.checked,
                      allowGroupInvites: user.allowGroupInvites,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Study Group Invites</p>
                  <p className="text-[11px] text-slate-400">Allow invites to peer groups</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.allowGroupInvites}
                  onChange={(e) =>
                    updatePrivacySettings({
                      isProfilePublic: user.isProfilePublic,
                      allowFriendRequests: user.allowFriendRequests,
                      allowGroupInvites: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300">
              🔒 <strong>Private by default:</strong> Your study materials and notes are never shared publicly unless you explicitly share them to a specific study group.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
