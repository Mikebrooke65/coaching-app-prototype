import { ApiClient } from './api-client';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  teamId?: string;
  coachId?: string;
  ageGroup?: string;
  skillCategory?: string;
  minDeliveries?: number;
}

export interface LessonDeliveryRow {
  id: string;
  lessonName: string;
  skillCategory: string;
  coachName: string;
  teamName: string;
  ageGroup: string;
  dateDelivered: string;
  lessonVersion: number;
  notes: string | null;
}

export interface CoachActivityRow {
  coachId: string;
  coachName: string;
  lessonsDelivered: number;
  gameFeedbackCount: number;
  lastActivityDate: string | null;
  teamsCoached: string[];
}

export interface TeamTrainingRow {
  teamName: string;
  ageGroup: string;
  lessonName: string;
  skillCategory: string;
  dateDelivered: string;
  coachName: string;
  lessonVersion: number;
}

export interface FilterOptions {
  teams: { id: string; name: string; ageGroup: string }[];
  coaches: { id: string; name: string }[];
  skillCategories: string[];
}

// ============================================================================
// Reporting API Client
// ============================================================================

export class ReportingApi extends ApiClient {
  
  /**
   * Fetch lesson deliveries with filters
   */
  async getLessonDeliveries(filters: ReportFilters): Promise<LessonDeliveryRow[]> {
    try {
      let query = this.supabase
        .from('lesson_deliveries')
        .select(`
          id,
          delivery_date,
          notes,
          lessons!inner(title, skill_category, version),
          teams!inner(name, age_group),
          users!inner(first_name, last_name)
        `)
        .order('delivery_date', { ascending: false })
        .limit(100);

      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('delivery_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('delivery_date', filters.dateTo);
      }
      if (filters.teamId) {
        query = query.eq('team_id', filters.teamId);
      }
      if (filters.coachId) {
        query = query.eq('coach_id', filters.coachId);
      }
      if (filters.ageGroup) {
        query = query.eq('teams.age_group', filters.ageGroup);
      }
      if (filters.skillCategory) {
        query = query.eq('lessons.skill_category', filters.skillCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to LessonDeliveryRow format
      return (data || []).map((row: any) => ({
        id: row.id,
        lessonName: row.lessons.title,
        skillCategory: row.lessons.skill_category,
        coachName: `${row.users.first_name} ${row.users.last_name}`,
        teamName: `${row.teams.age_group} ${row.teams.name}`,
        ageGroup: row.teams.age_group,
        dateDelivered: row.delivery_date,
        lessonVersion: row.lessons.version || 1,
        notes: row.notes,
      }));
    } catch (error) {
      console.error('Error fetching lesson deliveries:', error);
      throw new Error('Failed to load lesson deliveries. Please try again.');
    }
  }

  /**
   * Fetch coach activity summary with filters
   */
  async getCoachActivity(filters: ReportFilters): Promise<CoachActivityRow[]> {
    try {
      // This is a complex query - we'll fetch data and aggregate in JS
      // In production, consider creating a database view for better performance
      
      const { data: coaches, error: coachesError } = await this.supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('role', ['coach', 'manager', 'admin']);

      if (coachesError) throw coachesError;

      const results: CoachActivityRow[] = [];

      for (const coach of coaches || []) {
        // Count lesson deliveries
        let deliveriesQuery = this.supabase
          .from('lesson_deliveries')
          .select('id, delivery_date', { count: 'exact', head: false })
          .eq('coach_id', coach.id);

        if (filters.dateFrom) {
          deliveriesQuery = deliveriesQuery.gte('delivery_date', filters.dateFrom);
        }
        if (filters.dateTo) {
          deliveriesQuery = deliveriesQuery.lte('delivery_date', filters.dateTo);
        }

        const { data: deliveries, error: deliveriesError } = await deliveriesQuery;
        if (deliveriesError) throw deliveriesError;

        // Count game feedback
        let feedbackQuery = this.supabase
          .from('game_feedback')
          .select('id, created_at', { count: 'exact', head: false })
          .eq('created_by', coach.id);

        if (filters.dateFrom) {
          feedbackQuery = feedbackQuery.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          feedbackQuery = feedbackQuery.lte('created_at', filters.dateTo);
        }

        const { data: feedback, error: feedbackError } = await feedbackQuery;
        if (feedbackError) throw feedbackError;

        // Get teams coached
        const { data: teamMembers, error: teamMembersError } = await this.supabase
          .from('team_members')
          .select('teams(name, age_group)')
          .eq('user_id', coach.id)
          .in('role', ['coach', 'manager']);

        if (teamMembersError) throw teamMembersError;

        const teamsCoached = (teamMembers || [])
          .map((tm: any) => `${tm.teams.age_group} ${tm.teams.name}`)
          .filter((name, index, self) => self.indexOf(name) === index); // unique

        // Find last activity date
        const deliveryDates = (deliveries || []).map((d: any) => new Date(d.delivery_date));
        const feedbackDates = (feedback || []).map((f: any) => new Date(f.created_at));
        const allDates = [...deliveryDates, ...feedbackDates];
        const lastActivityDate = allDates.length > 0 
          ? new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString()
          : null;

        results.push({
          coachId: coach.id,
          coachName: `${coach.first_name} ${coach.last_name}`,
          lessonsDelivered: deliveries?.length || 0,
          gameFeedbackCount: feedback?.length || 0,
          lastActivityDate,
          teamsCoached,
        });
      }

      // Sort by lessons delivered descending
      return results.sort((a, b) => b.lessonsDelivered - a.lessonsDelivered);
    } catch (error) {
      console.error('Error fetching coach activity:', error);
      throw new Error('Failed to load coach activity. Please try again.');
    }
  }

  /**
   * Fetch team training history with filters
   */
  async getTeamTraining(filters: ReportFilters): Promise<TeamTrainingRow[]> {
    try {
      let query = this.supabase
        .from('lesson_deliveries')
        .select(`
          delivery_date,
          lessons!inner(title, skill_category, version),
          teams!inner(name, age_group),
          users!inner(first_name, last_name)
        `)
        .order('delivery_date', { ascending: false })
        .limit(100);

      // Apply filters
      if (filters.teamId) {
        query = query.eq('team_id', filters.teamId);
      }
      if (filters.ageGroup) {
        query = query.eq('teams.age_group', filters.ageGroup);
      }
      if (filters.dateFrom) {
        query = query.gte('delivery_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('delivery_date', filters.dateTo);
      }
      if (filters.skillCategory) {
        query = query.eq('lessons.skill_category', filters.skillCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to TeamTrainingRow format
      return (data || []).map((row: any) => ({
        teamName: `${row.teams.age_group} ${row.teams.name}`,
        ageGroup: row.teams.age_group,
        lessonName: row.lessons.title,
        skillCategory: row.lessons.skill_category,
        dateDelivered: row.delivery_date,
        coachName: `${row.users.first_name} ${row.users.last_name}`,
        lessonVersion: row.lessons.version || 1,
      }));
    } catch (error) {
      console.error('Error fetching team training:', error);
      throw new Error('Failed to load team training history. Please try again.');
    }
  }

  /**
   * Fetch filter options (teams, coaches, skill categories)
   */
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      // Fetch teams
      const { data: teams, error: teamsError } = await this.supabase
        .from('teams')
        .select('id, name, age_group')
        .order('age_group')
        .order('name');

      if (teamsError) throw teamsError;

      // Fetch coaches
      const { data: coaches, error: coachesError } = await this.supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('role', ['coach', 'manager', 'admin'])
        .order('first_name');

      if (coachesError) throw coachesError;

      // Fetch skill categories (from lessons table)
      const { data: lessons, error: lessonsError } = await this.supabase
        .from('lessons')
        .select('skill_category');

      if (lessonsError) throw lessonsError;

      // Get unique skill categories
      const skillCategories = [...new Set((lessons || []).map((l: any) => l.skill_category))].sort();

      return {
        teams: (teams || []).map(t => ({
          id: t.id,
          name: `${t.age_group} ${t.name}`,
          ageGroup: t.age_group,
        })),
        coaches: (coaches || []).map(c => ({
          id: c.id,
          name: `${c.first_name} ${c.last_name}`,
        })),
        skillCategories,
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw new Error('Failed to load filter options. Please try again.');
    }
  }
}

// Export singleton instance
export const reportingApi = new ReportingApi();
