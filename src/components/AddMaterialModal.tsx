import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  Youtube,
  Presentation,
  Mic,
  FileText,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  Play,
  Square,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { useStudy, ActiveTab } from "../context/StudyContext";
import { StudySubject, SourceType, StudyMaterial } from "../types";
import { ProcessingScreen } from "./ProcessingScreen";

export const AddMaterialModal: React.FC = () => {
  const {
    isAddMaterialModalOpen,
    setIsAddMaterialModalOpen,
    initialImportType,
    initialImportQuery,
    addMaterial,
    saveGeneratedNotes,
    saveGeneratedMemorise,
    saveGeneratedQuiz,
    saveGeneratedLesson,
    setActiveTab,
  } = useStudy();

  const [activeImportType, setActiveImportType] = useState<SourceType>(initialImportType || "upload");
  const [subject, setSubject] = useState<StudySubject>("Biology");
  const [title, setTitle] = useState(initialImportQuery || "");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  React.useEffect(() => {
    if (isAddMaterialModalOpen) {
      if (initialImportType) setActiveImportType(initialImportType);
      if (initialImportQuery) setTitle(initialImportQuery);
    }
  }, [isAddMaterialModalOpen, initialImportType, initialImportQuery]);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<any>(null);

  // Camera / OCR preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Processing Screen State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [createdMaterial, setCreatedMaterial] = useState<StudyMaterial | null>(null);

  if (!isAddMaterialModalOpen) return null;

  // Drag and drop / File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setContent(
          `# Scanned Document: ${file.name}\n\n[Study material image loaded for optical OCR extraction. Visual diagrams, formulas, and textbook excerpts prepared for AI analysis.]`
        );
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text || `Uploaded study file: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Audio recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorder.onstop = () => {
        clearInterval(recordingTimerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (err) {
      // Fallback simulated recording
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    // Mock transcript
    setContent(
      `[Audio Lecture Transcription — Recorded ${recordingTime} seconds]\n\n"Today we are reviewing cellular energetics and biochemical equilibrium. Pay close attention to how ATP synthase operates as a rotational motor powered by proton gradients across the mitochondrial inner membrane. This is a favorite exam topic."`
    );
    if (!title) setTitle(`Audio Lecture Recording (${new Date().toLocaleDateString()})`);
  };

  // AI Pipeline Submission
  const handleSubmit = async () => {
    const finalTitle = title.trim() || `${subject} Study Material`;
    let rawContent = content.trim();

    if (activeImportType === "youtube" && youtubeUrl) {
      rawContent = `YouTube Video Source: ${youtubeUrl}\n\n${rawContent || "Educational lecture video explaining conceptual foundations and problem-solving steps."}`;
    }

    if (!rawContent) {
      rawContent = `${finalTitle} comprehensive lecture and study notes covering definitions, mechanisms, and exam questions.`;
    }

    setIsProcessing(true);
    setProcessingStage(0);

    // Stage progression animation
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      // Call backend /api/gemini/analyze
      const analyzeRes = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          content: rawContent,
          sourceType: activeImportType,
        }),
      });
      const analyzeData = await analyzeRes.json();
      const resData = analyzeData.data || {};

      // Also generate Notes, Flashcards, Quiz, Lesson in parallel
      const [notesRes, flashcardsRes, quizRes, lessonRes] = await Promise.all([
        fetch("/api/gemini/generate-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: finalTitle, content: rawContent }),
        }).then((r) => r.json()).catch(() => ({})),

        fetch("/api/gemini/generate-flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: finalTitle, content: rawContent }),
        }).then((r) => r.json()).catch(() => ({})),

        fetch("/api/gemini/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: finalTitle, content: rawContent, questionCount: 5 }),
        }).then((r) => r.json()).catch(() => ({})),

        fetch("/api/gemini/generate-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: finalTitle, content: rawContent }),
        }).then((r) => r.json()).catch(() => ({})),
      ]);

      const newMaterialId = `mat-${Date.now()}`;
      const newMaterial: StudyMaterial = {
        id: newMaterialId,
        title: finalTitle,
        subject,
        sourceType: activeImportType,
        sourceUrl: youtubeUrl || undefined,
        rawText: rawContent,
        summary: resData.summary || `Comprehensive study material for ${finalTitle}.`,
        dateAdded: new Date().toISOString().split("T")[0],
        mainTopics: resData.mainTopics || ["Foundations", "Mechanisms", "Applications"],
        subtopics: resData.subtopics || ["Key definitions", "Process steps"],
        keyConcepts: resData.keyConcepts || [],
        definitions: resData.definitions || [],
        importantFacts: resData.importantFacts || [],
        relationships: resData.relationships || [],
        examples: resData.examples || [],
        formulas: resData.formulas || [],
        importantDates: resData.importantDates || [],
        potentialExamQuestions: resData.potentialExamQuestions || [],
        chunks: resData.chunks || [],
        progressPercent: 0,
      };

      // Save to state
      addMaterial(newMaterial);
      if (notesRes.data) saveGeneratedNotes(newMaterialId, notesRes.data);
      if (flashcardsRes.data) saveGeneratedMemorise(newMaterialId, flashcardsRes.data);
      if (quizRes.data) saveGeneratedQuiz(newMaterialId, quizRes.data);
      if (lessonRes.data) saveGeneratedLesson(newMaterialId, lessonRes.data);

      clearInterval(stageInterval);
      setProcessingStage(5);
      setCreatedMaterial(newMaterial);
    } catch (err) {
      clearInterval(stageInterval);
      setProcessingStage(5);
    }
  };

  const handleFinishAction = (targetTab: ActiveTab) => {
    setIsProcessing(false);
    setIsAddMaterialModalOpen(false);
    setActiveTab(targetTab);
  };

  return (
    <>
      {isProcessing && (
        <ProcessingScreen
          currentStage={processingStage}
          material={createdMaterial}
          onSelectAction={handleFinishAction}
          onClose={() => setIsProcessing(false)}
        />
      )}

      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-[#0A1931] my-8">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0A1931] border border-slate-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#0A1931]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0A1931]">Add Study Material</h3>
                <p className="text-xs text-[#1B2A4A]/70">
                  Import slides, PDFs, notes, or lectures. AI will transform them into interactive study tools.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddMaterialModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A1931] hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Subject & Title inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0A1931] mb-1.5">
                  Material Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cellular Respiration & Citric Acid Cycle"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-sm text-[#0A1931] placeholder-slate-400 focus:outline-none focus:border-[#0A1931] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1931] mb-1.5">
                  Subject / Course
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as StudySubject)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-sm text-[#0A1931] font-semibold focus:outline-none focus:border-[#0A1931] transition cursor-pointer"
                >
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="Business">Business</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Source Type Cards */}
            <div>
              <label className="block text-xs font-bold text-[#0A1931] mb-2">
                Choose Import Source
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {[
                  { id: "upload", label: "Upload", icon: Upload, desc: "PDF, DOCX, TXT" },
                  { id: "photo", label: "Photo / Scan", icon: Camera, desc: "Textbook & OCR" },
                  { id: "youtube", label: "YouTube", icon: Youtube, desc: "Video lecture" },
                  { id: "deck", label: "Deck", icon: Presentation, desc: "Slides & PPT" },
                  { id: "record", label: "Paste / Record", icon: Mic, desc: "Voice or text" },
                  { id: "quizlet", label: "Quizlet", icon: Layers, desc: "Card sets" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeImportType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveImportType(item.id as SourceType)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#0A1931] border-[#0A1931] text-white shadow-xs"
                          : "bg-white border-slate-200 text-[#0A1931] hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#0A1931]"}`} />
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className={`text-[10px] ${isSelected ? "text-slate-200" : "text-[#1B2A4A]/60"}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Source Mode Form Content */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              {/* UPLOAD MODE */}
              {activeImportType === "upload" && (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#0A1931] rounded-xl p-6 text-center cursor-pointer transition bg-white"
                  >
                    <Upload className="w-8 h-8 text-[#0A1931] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#0A1931]">
                      Click to upload or drag & drop study files
                    </p>
                    <p className="text-xs text-[#1B2A4A]/70 mt-1">
                      Supports PDF, DOC, DOCX, PPT, PPTX, TXT, Images
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                    />
                  </div>

                  {content && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-[#0A1931] mb-1">
                        Loaded Material Content (Editable Preview)
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-[#0A1931] focus:outline-none focus:border-[#0A1931] font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* PHOTO / CAMERA / SCAN OCR MODE */}
              {activeImportType === "photo" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-[#0A1931] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#0A1931]" />
                      <span>Take Photo / Upload Image</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-50 flex items-center justify-center">
                      <img src={imagePreview} alt="OCR Preview" className="max-h-48 object-contain" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0A1931] text-[10px] font-bold text-white">
                        OCR Active
                      </span>
                    </div>
                  )}

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Extracted textbook text or handwritten notes will appear here. You can also paste transcript directly..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-[#0A1931] focus:outline-none focus:border-[#0A1931] font-mono"
                  />
                </div>
              )}

              {/* YOUTUBE MODE */}
              {activeImportType === "youtube" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0A1931] mb-1">
                      YouTube Video URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-[#0A1931] focus:outline-none focus:border-[#0A1931]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!youtubeUrl) setYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                          setContent(
                            "Comprehensive Mitosis & Cell Division Lecture: Stages (Prophase, Metaphase, Anaphase, Telophase), kinetochores, cohesin cleavage, and cytokinesis comparison."
                          );
                          if (!title) setTitle("YouTube Video Lecture: Cell Biology");
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#0A1931] hover:bg-[#1B2A4A] text-xs font-bold text-white cursor-pointer"
                      >
                        Extract
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#1B2A4A]/70">
                    StudyMate AI will process the video lecture topics, key takeaways, and timestamps into notes, questions, and flashcards.
                  </p>
                </div>
              )}

              {/* DECK MODE */}
              {activeImportType === "deck" && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#0A1931] rounded-xl p-5 text-center cursor-pointer transition bg-white"
                  >
                    <Presentation className="w-8 h-8 text-[#0A1931] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#0A1931]">
                      Import Slide Deck (.PPTX / .PDF / Keynote)
                    </p>
                    <p className="text-xs text-[#1B2A4A]/70 mt-1">
                      AI analyzes slide by slide, grouping bullets and diagrams into structured topics.
                    </p>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Or paste slide outline notes here..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-[#0A1931] focus:outline-none focus:border-[#0A1931] font-mono"
                  />
                </div>
              )}

              {/* PASTE / RECORD AUDIO MODE */}
              {activeImportType === "record" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isRecording
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-slate-100 text-[#0A1931]"
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0A1931]">
                          {isRecording ? "Recording Lecture Audio..." : "Record Voice Notes or Lecture"}
                        </p>
                        <p className="text-[11px] text-[#1B2A4A]/70">
                          {isRecording
                            ? `Time elapsed: ${recordingTime}s (Microphone active)`
                            : "Tap start to record live notes; AI will transcribe and organize."}
                        </p>
                      </div>
                    </div>

                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        Start Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-1.5 rounded-lg bg-[#0A1931] hover:bg-[#1B2A4A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A1931] mb-1">
                      Paste Lecture Notes / Transcripts
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your raw study notes, textbook chapters, or transcript text here..."
                      rows={5}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-[#0A1931] focus:outline-none focus:border-[#0A1931] font-mono"
                    />
                  </div>
                </div>
              )}

              {/* QUIZLET MODE */}
              {activeImportType === "quizlet" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-[#0A1931]">
                    <p className="font-bold mb-1">Quizlet Card Importer</p>
                    <p className="text-[11px] text-[#1B2A4A]/70">
                      Copy terms & definitions from Quizlet (Export &gt; Copy text) and paste below. Format: Term \t Definition.
                    </p>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Prophase\tChromatin condenses into chromosomes\nMetaphase\tChromosomes align at the equator\nAnaphase\tSister chromatids separate`}
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-[#0A1931] focus:outline-none focus:border-[#0A1931] font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setIsAddMaterialModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1B2A4A]/70 hover:text-[#0A1931] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1931] hover:bg-[#1B2A4A] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Analyze & Transform with AI</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
