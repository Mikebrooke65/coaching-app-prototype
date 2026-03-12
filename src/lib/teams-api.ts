import { ApiClient, ApiError } from './api-client';
import type { Team } from '../types/database';

export class TeamsApi extends ApiClient {
  // Get a single team by ID
  async getTeam(teamId: string): Promise<Team> {
    return this.queryOne<Team>('teams', teamId);
  }

  // Update team game configuration (game_players and half_duration)
  async updateTeamConfig(
    teamId: string,
    gamePlayers: number,
    halfDuration: number
  ): Promise<Team> {
    return this.update<Team>('teams', teamId, {
      game_players: gamePlayers,
      half_duration: halfDuration,
    });
  }
}

export const teamsApi = new TeamsApi();
