import React from "react";
import {
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  GraduationCap,
  HelpCircle,
  FileText,
  ArrowRight,
  ListOrdered,
  Calendar,
  X,
} from "lucide-react";
import { StudyMaterial } from "../types";
import { useStudy, ActiveTab } from "../context/StudyContext";

interface ProcessingScreenProps {
  currentStage?: number; // 0 to 5
  material?: StudyMaterial | null;
  onSelectAction: (tab: ActiveTab) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

const processingStages = [
  "Reading your material",
  "Identifying key concepts",
  "Organizing topics & definitions",
  "Creating your study plan",
  "Preparing your interactive learning tools",
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  currentStage = 0,
  material = null,
  onSelectAction,
  isVisible = true,
  onClose,
}) => {
  if (!isVisible) return null;

  const isComplete = currentStage >= 5 && material !== null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {!isComplete ? (
          <div className="text-center py-6">
            {/* Animated Brain / Orbit */}
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Understanding your material…
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
              StudyMate AI is analyzing structure, formulas, definitions, and relationships to transform raw content into deep understanding.
            </p>

            {/* Stages Checkmarks */}
            <div className="space-y-3 max-w-sm mx-auto text-left">
              {processingStages.map((stageText, idx) => {
                const isPast = currentStage > idx;
                const isCurrent = currentStage === idx;

                return (
                  <div
                    key={stageText}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                      isPast
                        ? "bg-blue-950/50 text-blue-300 border border-blue-800/40"
                        : isCurrent
                        ? "bg-slate-800/80 text-white border border-slate-700 shadow-sm"
                        : "text-slate-600"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{stageText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Ready Screen */
          <div className="py-2">
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-white">Your study material is ready!</h3>
                <p className="text-xs text-emerald-300/80">
                  AI successfully identified key topics, formulas, exam questions, and structured lessons for:
                </p>
                <p className="text-sm font-bold text-white mt-0.5">{material.title}</p>
              </div>
            </div>

            {/* AI Identified Insights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Main Topics</span>
                <span className="text-base font-bold text-blue-400">{material.mainTopics?.length || 4}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Definitions</span>
                <span className="text-base font-bold text-purple-400">{material.definitions?.length || 3}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Key Concepts</span>
                <span className="text-base font-bold text-emerald-400">{material.keyConcepts?.length || 3}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Exam Questions</span>
                <span className="text-base font-bold text-amber-400">{material.potentialExamQuestions?.length || 2}</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-300 mb-3">
              Choose what you want to study first:
            </h4>

            {/* Study Mode Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => onSelectAction("learn")}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-white group-hover:text-blue-300">
                    <span>Step-by-Step AI Tutor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Progressive 6-lesson path with instant understanding checks.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onSelectAction("memorise")}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-white group-hover:text-purple-300">
                    <span>Memorise Mode</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Interactive flashcards, mnemonics, and spaced active recall.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onSelectAction("quizzes")}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-white group-hover:text-amber-300">
                    <span>AI Diagnostic Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test comprehension and remediate with "Study My Weak Areas".
                  </p>
                </div>
              </button>

              <button
                onClick={() => onSelectAction("library")}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-white group-hover:text-emerald-300">
                    <span>Structured Notes</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clean notes with highlights, formulas, and common mistakes.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSelectAction("dashboard")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => onSelectAction("learn")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
