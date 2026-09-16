import {
  UserProfile,
  StudyMaterial,
  StudyNotes,
  MemorisePack,
  Quiz,
  StepLesson,
  StudyPlan,
  StudyGroup,
  GroupMessage,
  StudyFriend,
  NotificationItem,
  Achievement,
  UserProgressStats,
} from "../types";

export const initialUser: UserProfile = {
  id: "user-me",
  name: "Student",
  email: "student@studymate.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Passionate about active recall, spaced repetition, and turning study materials into understanding!",
  educationLevel: "Undergraduate",
  institution: "University",
  enrolledSubjects: ["Biology", "Mathematics", "Chemistry", "Computer Science", "History", "Business"],
  studyGoals: "Maintain a daily study habit and test understanding with active recall.",
  studyPreference: "both",
  xp: 298,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  isProfilePublic: true,
  allowFriendRequests: true,
  allowGroupInvites: true,
};

// Start with empty materials - the app works purely with whatever the user uploads!
export const initialMaterials: StudyMaterial[] = [];

export const initialNotes: Record<string, StudyNotes> = {};

export const initialMemorise: Record<string, MemorisePack> = {};

export const initialQuizzes: Record<string, Quiz> = {};

export const initialLessons: Record<string, StepLesson> = {};

export const initialStudyGroups: StudyGroup[] = [];

export const initialGroupMessages: Record<string, GroupMessage[]> = {};

export const initialFriends: StudyFriend[] = [
  {
    id: "friend-1",
    name: "John Miller",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    subjects: ["Chemistry", "Mathematics", "Physics"],
    school: "UC Berkeley",
    interests: ["Physical Chemistry", "Thermodynamics", "MCAT Prep"],
    goals: "Targeting top 1% score on national chemistry benchmark.",
    mutualSubjectsCount: 2,
    status: "none",
  },
  {
    id: "friend-2",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    subjects: ["Biology", "Chemistry", "Psychology"],
    school: "Stanford University",
    interests: ["Neuroscience", "Synaptic Plasticity", "Spaced Recall"],
    goals: "Researching neurodegenerative disorders & cellular signaling.",
    mutualSubjectsCount: 3,
    status: "connected",
  },
  {
    id: "friend-3",
    name: "Liam O'Connor",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    subjects: ["Computer Science", "Mathematics"],
    school: "MIT",
    interests: ["Algorithms", "Machine Learning", "Graph Theory"],
    goals: "Competitive programming and master graph optimization.",
    mutualSubjectsCount: 2,
    status: "connected",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "reminder",
    title: "Ready to study?",
    message: "Import your first notes or slides to generate instant flashcards and practice quizzes!",
    timestamp: "10m ago",
    isRead: false,
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "First Upload",
    description: "Import your first study material to activate your AI study toolkit.",
    icon: "🎯",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "ach-2",
    title: "3-Day Study Streak",
    description: "Review study materials for 3 consecutive days.",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "ach-3",
    title: "20 Flashcards Mastered",
    description: "Mark 20 flashcards as 'Easy' or 'Good' in spaced recall mode.",
    icon: "🧠",
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: "ach-4",
    title: "Quiz Champion",
    description: "Score 80%+ on your first AI-generated quiz.",
    icon: "🏆",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

export const initialProgress: UserProgressStats = {
  studyMinutesToday: 0,
  totalStudyMinutes: 0,
  lessonsCompleted: 0,
  flashcardsReviewed: 0,
  flashcardsMastered: 0,
  quizzesCompleted: 0,
  averageQuizScore: 0,
  streakDays: 0,
  subjectMastery: {
    Biology: 0,
    Mathematics: 0,
    Chemistry: 0,
    Physics: 0,
    History: 0,
    "Computer Science": 0,
    English: 0,
    Business: 0,
    Psychology: 0,
    Other: 0,
  },
  weakAreas: [],
};

export const initialStudyPlan: StudyPlan | null = null;
