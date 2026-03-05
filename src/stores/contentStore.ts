import { create } from 'zustand';
import type { Lesson, Session, Skill, Team } from '../types/database';

interface ContentState {
  // Content data
  lessons: Lesson[];
  sessions: Session[];
  skills: Skill[];
  teams: Team[];
  
  // Loading states
  isLoadingLessons: boolean;
  isLoadingSessions: boolean;
  isLoadingSkills: boolean;
  isLoadingTeams: boolean;
  
  // Error states
  lessonsError: string | null;
  sessionsError: string | null;
  skillsError: string | null;
  teamsError: string | null;
  
  // Actions
  setLessons: (lessons: Lesson[]) => void;
  setSessions: (sessions: Session[]) => void;
  setSkills: (skills: Skill[]) => void;
  setTeams: (teams: Team[]) => void;
  
  setLoadingLessons: (loading: boolean) => void;
  setLoadingSessions: (loading: boolean) => void;
  setLoadingSkills: (loading: boolean) => void;
  setLoadingTeams: (loading: boolean) => void;
  
  setLessonsError: (error: string | null) => void;
  setSessionsError: (error: string | null) => void;
  setSkillsError: (error: string | null) => void;
  setTeamsError: (error: string | null) => void;
  
  // Getters
  getLessonById: (id: string) => Lesson | undefined;
  getSessionById: (id: string) => Session | undefined;
  getSkillById: (id: string) => Skill | undefined;
  getTeamById: (id: string) => Team | undefined;
  
  getLessonsBySkill: (skillId: string) => Lesson[];
  getSessionsBySkill: (skillId: string) => Session[];
}

export const useContentStore = create<ContentState>((set, get) => ({
  // Initial state
  lessons: [],
  sessions: [],
  skills: [],
  teams: [],
  
  isLoadingLessons: false,
  isLoadingSessions: false,
  isLoadingSkills: false,
  isLoadingTeams: false,
  
  lessonsError: null,
  sessionsError: null,
  skillsError: null,
  teamsError: null,

  // Setters
  setLessons: (lessons) => set({ lessons }),
  setSessions: (sessions) => set({ sessions }),
  setSkills: (skills) => set({ skills }),
  setTeams: (teams) => set({ teams }),
  
  setLoadingLessons: (loading) => set({ isLoadingLessons: loading }),
  setLoadingSessions: (loading) => set({ isLoadingSessions: loading }),
  setLoadingSkills: (loading) => set({ isLoadingSkills: loading }),
  setLoadingTeams: (loading) => set({ isLoadingTeams: loading }),
  
  setLessonsError: (error) => set({ lessonsError: error }),
  setSessionsError: (error) => set({ sessionsError: error }),
  setSkillsError: (error) => set({ skillsError: error }),
  setTeamsError: (error) => set({ teamsError: error }),

  // Getters
  getLessonById: (id) => get().lessons.find((l) => l.id === id),
  
  getSessionById: (id) => get().sessions.find((s) => s.id === id),
  
  getSkillById: (id) => get().skills.find((s) => s.id === id),
  
  getTeamById: (id) => get().teams.find((t) => t.id === id),
  
  getLessonsBySkill: (skillId) => get().lessons.filter((l) => l.skill_id === skillId),
  
  getSessionsBySkill: (skillId) => get().sessions.filter((s) => s.skill_id === skillId),
}));
