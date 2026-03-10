import { ApiClient, ApiError } from './api-client';
import type { Game, GameFeedbackRecord, TeamMember, User } from '../types/database';

export class GamesApi extends ApiClient {
  // Get games for a specific team
  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return this.query<Game>('games', {
      match: { team_id: teamId },
      order: { column: 'game_date', ascending: false },
    });
  }

  // Get a single game
  async getGame(gameId: string): Promise<Game> {
    return this.queryOne<Game>('games', gameId);
  }

  // Create a new game
  async createGame(game: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.insert<Game>('games', {
      ...game,
      created_by: user?.id,
    });
  }

  // Update game score
  async updateGameScore(
    gameId: string,
    teamScore: number,
    opponentScore: number
  ): Promise<Game> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.update<Game>('games', gameId, {
      team_score: teamScore,
      opponent_score: opponentScore,
      status: 'completed',
      updated_by: user?.id,
    });
  }

  // Get team members (players) for a team
  async getTeamPlayers(teamId: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select(`
        user:users!inner(*)
      `)
      .eq('team_id', teamId)
      .eq('role', 'player')
      .eq('users.role', 'player');

    if (error) throw new ApiError(error.message);
    
    // Extract user objects and filter to only players
    return data
      .map((tm: any) => tm.user)
      .filter((user: User) => user && user.role === 'player');
  }

  // Get feedback for a game
  async getGameFeedback(gameId: string): Promise<GameFeedbackRecord[]> {
    return this.query<GameFeedbackRecord>('game_feedback', {
      match: { game_id: gameId },
      order: { column: 'created_at', ascending: false },
    });
  }

  // Create game feedback
  async createGameFeedback(
    feedback: Omit<GameFeedbackRecord, 'id' | 'created_at' | 'updated_at' | 'created_by'>
  ): Promise<GameFeedbackRecord> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.insert<GameFeedbackRecord>('game_feedback', {
      ...feedback,
      created_by: user?.id,
    });
  }

  // Update game feedback
  async updateGameFeedback(
    feedbackId: string,
    feedbackText: string
  ): Promise<GameFeedbackRecord> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.update<GameFeedbackRecord>('game_feedback', feedbackId, {
      feedback_text: feedbackText,
      updated_by: user?.id,
    });
  }

  // Delete game feedback
  async deleteGameFeedback(feedbackId: string): Promise<void> {
    return this.delete('game_feedback', feedbackId);
  }

  // Get most recent past game for a team
  async getMostRecentPastGame(teamId: string): Promise<Game | null> {
    const { data, error } = await this.supabase
      .from('games')
      .select('*')
      .eq('team_id', teamId)
      .lt('game_date', new Date().toISOString())
      .order('game_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new ApiError(error.message);
    }
    return data as Game;
  }

  // Get past games for a team (for scrolling)
  async getPastGames(teamId: string): Promise<Game[]> {
    return this.query<Game>('games', {
      match: { team_id: teamId },
      order: { column: 'game_date', ascending: false },
    }).then(games => 
      games.filter(game => new Date(game.game_date) < new Date())
    );
  }
}

export const gamesApi = new GamesApi();
