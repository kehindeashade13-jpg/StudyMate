import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  Menu,
  Star,
  Flame,
  Plus,
  ArrowUp,
  Camera,
  FolderPlus,
  Play,
  FileText,
  ChevronDown,
  Brain,
  Sparkles,
  HelpCircle,
  BookOpen,
  Radio,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Layers,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SourceType, StudyMaterial } from "../types";

export const DashboardView: React.FC = () => {
  const {
    user,
    materials,
    setActiveMaterial,
    setActiveTab,
    openAddMaterialModal,
    setIsSidebarOpen,
    clearAllCourses,
    deleteMaterial,
    setIsAssistantOpen,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQuickPracticeModal, setShowQuickPracticeModal] = useState(false);

  // Handle launching modal from query
  const handleLaunchSearch = () => {
    openAddMaterialModal("upload", searchQuery);
  };

  const handleOpenMaterialMode = (
    mat: StudyMaterial,
    mode: "learn" | "memorise" | "quizzes" | "library"
  ) => {
    setActiveMaterial(mat);
    setActiveTab(mode);
  };

  const handleDeleteDeck = (mat: StudyMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete deck "${mat.title}"?`)) {
      deleteMaterial(mat.id);
    }
  };

  // Helper for subject metadata
  const getSubjectMeta = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "biology":
        return { color: "text-emerald-700 bg-emerald-100 border-emerald-200", emoji: "🧬" };
      case "mathematics":
        return { color: "text-blue-700 bg-blue-100 border-blue-200", emoji: "📐" };
      case "chemistry":
        return { color: "text-teal-700 bg-teal-100 border-teal-200", emoji: "🧪" };
      case "physics":
        return { color: "text-cyan-700 bg-cyan-100 border-cyan-200", emoji: "⚛️" };
      case "history":
        return { color: "text-amber-700 bg-amber-100 border-amber-200", emoji: "🏛️" };
      case "computer science":
        return { color: "text-indigo-700 bg-indigo-100 border-indigo-200", emoji: "💻" };
      case "english":
        return { color: "text-purple-700 bg-purple-100 border-purple-200", emoji: "📖" };
      case "business":
        return { color: "text-rose-700 bg-rose-100 border-rose-200", emoji: "📊" };
      default:
        return { color: "text-slate-700 bg-slate-100 border-slate-200", emoji: "📚" };
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto space-y-5 pb-24 px-1 sm:px-4">
      {/* Top Header Row */}
      <header className="flex items-center justify-between pt-1">
        {/* Left Menu Button (Hamburger) */}
        <button
          id="top-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#0A1931] hover:bg-slate-50 transition cursor-pointer active:scale-95"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-[#0A1931] stroke-[2.2]" />
        </button>

        {/* Right Stats Capsule (ONLY user streaks) */}
        <div
          onClick={() => setActiveTab("progress")}
          className="bg-white border border-slate-200 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-slate-50 transition"
          title={`${user.streakDays || 0} Day Streak`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
          <span className="font-extrabold text-xs text-[#0A1931]">
            {user.streakDays || 0} {user.streakDays === 1 ? "day streak" : "days streak"}
          </span>
        </div>
      </header>

      {/* Hero Greeting with 3D Floating Axolotl Mascot */}
      <section className="flex items-center gap-4 pt-1 sm:pt-3">
        {/* Floating Axolotl Character */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="relative shrink-0"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-xs border-2 border-slate-200 bg-white p-1 flex items-center justify-center">
            <img
              src="/study_mascot.jpg"
              alt="StudyMate Axolotl Mascot"
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/mascot.jpg";
              }}
            />
          </div>
        </motion.div>

        {/* Text Greeting */}
        <div>
          <p className="text-[#1B2A4A]/70 text-base sm:text-lg font-medium tracking-tight">
            What shall we
          </p>
          <h1 className="text-[#0A1931] text-4xl sm:text-5xl font-black tracking-tight leading-none mt-0.5">
            Study?
          </h1>
        </div>
      </section>

      {/* Study Input & Quick Action Box (White Container with Navy Text) */}
      <section className="rounded-3xl bg-white border-2 border-slate-200 p-3.5 sm:p-4 space-y-3 shadow-xs">
        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="dashboard-study-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLaunchSearch()}
              placeholder="Study any topic, paste notes, or ask..."
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm text-[#0A1931] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 focus:border-[#0A1931] shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A1931] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Plus / Action Button */}
          <button
            id="dashboard-search-action-btn"
            onClick={handleLaunchSearch}
            className="w-12 h-12 rounded-2xl bg-[#0A1931] hover:bg-[#1B2A4A] text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 active:scale-95"
            title="Create study set"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 4 Quick Upload Modality Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {/* Upload Button */}
          <button
            id="quick-action-upload-btn"
            onClick={() => openAddMaterialModal("upload")}
            className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-[#0A1931] transition">
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold text-[#0A1931]">Upload</span>
          </button>

          {/* Photo Button */}
          <button
            id="quick-action-photo-btn"
            onClick={() => openAddMaterialModal("photo")}
            className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-[#0A1931] transition">
              <Camera className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#0A1931]">Photo</span>
          </button>

          {/* YouTube Button */}
          <button
            id="quick-action-youtube-btn"
            onClick={() => openAddMaterialModal("youtube")}
            className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-red-600 transition">
              <Play className="w-4 h-4 fill-red-600" />
            </div>
            <span className="text-[11px] font-bold text-[#0A1931]">YouTube</span>
          </button>

          {/* Paste Button */}
          <button
            id="quick-action-paste-btn"
            onClick={() => openAddMaterialModal("paste")}
            className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-[#0A1931] transition">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#0A1931]">Paste</span>
          </button>
        </div>

        {/* Expandable "More" Options */}
        <div className="pt-1">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-full flex items-center justify-center gap-1 text-[#0A1931] hover:text-[#1B2A4A] text-xs font-semibold py-1 cursor-pointer transition"
          >
            <span>More import options</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showMoreMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showMoreMenu && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 mt-1 animate-in fade-in-50">
              <button
                onClick={() => openAddMaterialModal("record")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-2 text-left transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[#0A1931] shrink-0">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#0A1931]">Voice Record</p>
                  <p className="text-[9px] text-[#1B2A4A]/60 truncate">Audio lecture notes</p>
                </div>
              </button>

              <button
                onClick={() => openAddMaterialModal("quizlet")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-2 text-left transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[#0A1931] shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#0A1931]">Quizlet / Anki</p>
                  <p className="text-[9px] text-[#1B2A4A]/60 truncate">Import existing sets</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* "My Decks / Jump back in" Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[#0A1931] font-extrabold text-lg">My Decks</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0A1931] border border-slate-200">
              {materials.length}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("library")}
            className="text-[#0A1931] hover:underline text-xs sm:text-sm font-bold cursor-pointer transition"
          >
            View all ({materials.length})
          </button>
        </div>

        {/* When user has uploaded materials */}
        {materials.length > 0 ? (
          <div className="space-y-3">
            {materials.map((mat) => {
              const meta = getSubjectMeta(mat.subject);
              const cardCount = mat.definitions?.length || 10;
              const quizCount = mat.potentialExamQuestions?.length || 5;

              return (
                <div
                  key={mat.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3.5 text-[#0A1931]"
                >
                  {/* Top Row: Subject & Source Badges + Delete Action */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.color}`}
                      >
                        <span>{meta.emoji}</span>
                        <span>{mat.subject}</span>
                      </span>

                      <span className="text-[10px] font-semibold text-[#0A1931] uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {mat.sourceType}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteDeck(mat, e)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Delete deck"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Deck Title & Summary */}
                  <div>
                    <h3
                      onClick={() => handleOpenMaterialMode(mat, "learn")}
                      className="font-extrabold text-base text-[#0A1931] hover:text-blue-700 transition cursor-pointer leading-snug line-clamp-1"
                    >
                      {mat.title}
                    </h3>
                    <p className="text-xs text-[#1B2A4A]/80 mt-1 line-clamp-2 leading-relaxed">
                      {mat.summary || "Interactive study deck with key terms, quizzes, and structured notes."}
                    </p>
                  </div>

                  {/* Deck Metrics Bar: Flashcards, Quizzes, Mastery */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-[#0A1931]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#0A1931]">
                        <Brain className="w-3.5 h-3.5 text-[#0A1931]" />
                        <strong>{cardCount}</strong> cards
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-[#0A1931]">
                        <HelpCircle className="w-3.5 h-3.5 text-[#0A1931]" />
                        <strong>{quizCount}</strong> questions
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{mat.progressPercent}% mastered</span>
                    </div>
                  </div>

                  {/* Study Actions Bar */}
                  <div className="flex items-center gap-2 pt-0.5">
                    {/* Primary Action Button */}
                    <button
                      onClick={() => handleOpenMaterialMode(mat, "learn")}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0A1931] hover:bg-[#1B2A4A] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Study Deck</span>
                    </button>

                    {/* Quick Mode Chips */}
                    <button
                      onClick={() => handleOpenMaterialMode(mat, "memorise")}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#0A1931] border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Spaced repetition flashcards"
                    >
                      <Brain className="w-3.5 h-3.5 text-[#0A1931]" />
                      <span>Flashcards</span>
                    </button>

                    <button
                      onClick={() => handleOpenMaterialMode(mat, "quizzes")}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#0A1931] border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Quiz drill"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#0A1931]" />
                      <span>Quiz</span>
                    </button>

                    <button
                      onClick={() => handleOpenMaterialMode(mat, "library")}
                      className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A1931] border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Detailed Notes"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#0A1931]" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* "+ New Deck" Card */}
            <button
              onClick={() => openAddMaterialModal("upload")}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0A1931] bg-white transition flex items-center justify-center gap-2 text-[#0A1931] font-bold text-xs cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Import Another Material / Add New Deck</span>
            </button>
          </div>
        ) : (
          /* Empty state: Clean white card */
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-3.5 text-[#0A1931]">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto text-slate-400">
              <FolderPlus className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0A1931]">No study decks uploaded yet</h3>
              <p className="text-xs text-[#1B2A4A]/70 max-w-xs mx-auto mt-1 leading-relaxed">
                StudyMate builds interactive flashcard decks, quizzes, and lessons entirely from your
                uploaded files. Choose an option below to create your first deck:
              </p>
            </div>

            {/* Quick Upload Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => openAddMaterialModal("upload")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1931] text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                <span>Upload PDF</span>
              </button>

              <button
                onClick={() => openAddMaterialModal("photo")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1931] text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Camera / Photo</span>
              </button>

              <button
                onClick={() => openAddMaterialModal("youtube")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1931] text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-red-600" />
                <span>YouTube Video</span>
              </button>

              <button
                onClick={() => openAddMaterialModal("paste")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1931] text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Paste Notes</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Floating Practice Station Button (Bottom Right) */}
      <button
        id="floating-practice-btn"
        onClick={() => setShowQuickPracticeModal(true)}
        className="fixed bottom-20 right-5 z-40 w-13 h-13 rounded-full bg-[#0A1931] hover:bg-[#1B2A4A] text-white flex items-center justify-center shadow-xl shadow-[#0A1931]/25 transition hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        title="Quick Practice Station"
      >
        <Brain className="w-6 h-6 stroke-[2]" />
      </button>

      {/* Modal: Quick Practice */}
      {showQuickPracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-[#0A1931]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#0A1931]" />
                <h3 className="font-extrabold text-base text-[#0A1931]">Practice Station</h3>
              </div>
              <button
                onClick={() => setShowQuickPracticeModal(false)}
                className="text-slate-400 hover:text-[#0A1931] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#1B2A4A]/70">
              Select a learning format to drill and retain your uploaded decks:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowQuickPracticeModal(false);
                  setActiveTab("memorise");
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#0A1931] hover:bg-slate-50 flex items-center gap-3 transition text-left cursor-pointer"
              >
                <Brain className="w-5 h-5 text-[#0A1931] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0A1931]">Flashcards & Recall</p>
                  <p className="text-[11px] text-[#1B2A4A]/60">Spaced repetition memory training</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickPracticeModal(false);
                  setActiveTab("quizzes");
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#0A1931] hover:bg-slate-50 flex items-center gap-3 transition text-left cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 text-[#0A1931] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0A1931]">Diagnostic Quizzes</p>
                  <p className="text-[11px] text-[#1B2A4A]/60">Multiple choice & conceptual checks</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickPracticeModal(false);
                  setActiveTab("learn");
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#0A1931] hover:bg-slate-50 flex items-center gap-3 transition text-left cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#0A1931] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0A1931]">Step-by-Step Lessons</p>
                  <p className="text-[11px] text-[#1B2A4A]/60">Guided breakdown of your material</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
