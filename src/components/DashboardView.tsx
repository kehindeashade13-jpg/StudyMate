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
    studyGroups,
    sendGroupMessage,
    triggerConfetti,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQuickPracticeModal, setShowQuickPracticeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<StudyMaterial | null>(null);

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

  const handleShareDeck = (mat: StudyMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Study deck "${mat.title}" on StudyMate: ${window.location.origin}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    if (studyGroups && studyGroups.length > 0) {
      sendGroupMessage(
        studyGroups[0].id,
        `📚 Shared deck "${mat.title}" with our study group! Practice flashcards & quizzes.`,
        false
      );
    }
    setToastMessage(`Shared "${mat.title}"! Link copied to clipboard.`);
    triggerConfetti();
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteDeck = (mat: StudyMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeckToDelete(mat);
  };

  const handleConfirmDelete = () => {
    if (deckToDelete) {
      deleteMaterial(deckToDelete.id);
      setToastMessage(`Deleted deck "${deckToDelete.title}".`);
      setDeckToDelete(null);
      setTimeout(() => setToastMessage(null), 3000);
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
    <div className="max-w-md sm:max-w-xl mx-auto space-y-5 pb-24 px-2 sm:px-4 pt-2">
      {/* Hero Greeting with StudyMate Logo */}
      <section className="flex items-center gap-3.5 sm:gap-4 pt-1 sm:pt-2">
        {/* Floating StudyMate Logo */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="relative shrink-0"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white p-1 flex items-center justify-center">
            <img
              src="/studymate_logo.jpg"
              alt="StudyMate Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl shadow-2xs"
            />
          </div>
        </motion.div>

        {/* Text Greeting */}
        <div>
          <p className="text-slate-500 text-sm sm:text-base font-medium tracking-tight">
            What shall we
          </p>
          <h1 className="text-[#0F172A] text-3xl sm:text-4xl font-black tracking-tight leading-none mt-0.5">
            Study?
          </h1>
        </div>
      </section>

      {/* Study Input & Quick Action Box (White Container with Indigo Accent) */}
      <section className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 space-y-3 shadow-xs">
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
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Plus / Action Button (Rich Indigo #6366F1) */}
          <button
            id="dashboard-search-action-btn"
            onClick={handleLaunchSearch}
            className="w-11 h-11 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 active:scale-95"
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
            className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-[#6366F1] group-hover:text-white flex items-center justify-center text-[#6366F1] transition shadow-2xs">
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold text-[#0F172A]">Upload</span>
          </button>

          {/* Photo Button */}
          <button
            id="quick-action-photo-btn"
            onClick={() => openAddMaterialModal("photo")}
            className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-[#6366F1] group-hover:text-white flex items-center justify-center text-[#6366F1] transition shadow-2xs">
              <Camera className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#0F172A]">Photo</span>
          </button>

          {/* YouTube Button */}
          <button
            id="quick-action-youtube-btn"
            onClick={() => openAddMaterialModal("youtube")}
            className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-red-600 transition shadow-2xs">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[11px] font-bold text-[#0F172A]">YouTube</span>
          </button>

          {/* Paste Button */}
          <button
            id="quick-action-paste-btn"
            onClick={() => openAddMaterialModal("paste")}
            className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 flex flex-col items-center justify-center gap-1 transition shadow-2xs group cursor-pointer active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-[#6366F1] group-hover:text-white flex items-center justify-center text-[#6366F1] transition shadow-2xs">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#0F172A]">Paste</span>
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

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleShareDeck(mat, e)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                        title="Share deck"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteDeck(mat, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete deck"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

      {/* Delete Confirmation Modal */}
      {deckToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-[#0A1931]">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-[#0A1931]">Delete Study Deck?</h3>
              <p className="text-xs text-[#1B2A4A]/70">
                Are you sure you want to delete <span className="font-bold text-[#0A1931]">"{deckToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setDeckToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-[#0A1931] hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Delete Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0A1931] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
