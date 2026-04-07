import type { StandingsRowWithName } from '../../lib/tournament-api';

interface StandingsTableProps {
  standings: StandingsRowWithName[];
  highlightTeamId?: string;
  loading?: boolean;
}

export function StandingsTable({ standings, highlightTeamId, loading }: StandingsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((h) => (
                  <th key={h} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(10)].map((_, j) => (
                    <td key={j} className="px-3 py-3 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No standings available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((row, index) => {
              const isHighlighted = highlightTeamId && row.team_id === highlightTeamId;
              return (
                <tr
                  key={row.team_id}
                  style={isHighlighted ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : undefined}
                >
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{row.team_name}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.played}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.won}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.drawn}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.lost}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.goals_for}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.goals_against}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{row.goal_difference}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
