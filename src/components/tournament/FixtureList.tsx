import type { Event } from '../../types/database';

interface FixtureListProps {
  fixtures: Event[];
  highlightTeamId?: string;
}

export function FixtureList({ fixtures, highlightTeamId }: FixtureListProps) {
  if (fixtures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No fixtures available
      </div>
    );
  }

  // Group fixtures by round_number
  const grouped = new Map<number, Event[]>();
  for (const f of fixtures) {
    const round = f.round_number ?? 0;
    if (!grouped.has(round)) grouped.set(round, []);
    grouped.get(round)!.push(f);
  }
  const sortedRounds = [...grouped.keys()].sort((a, b) => a - b);

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatus = (fixture: Event): { label: string; color: string } => {
    if (fixture.team_score != null && fixture.opponent_score != null) {
      return { label: `${fixture.team_score} - ${fixture.opponent_score}`, color: 'text-green-700 bg-green-100' };
    }
    return { label: 'Scheduled', color: 'text-gray-600 bg-gray-100' };
  };

  const involvesTeam = (fixture: Event) =>
    highlightTeamId && fixture.target_teams?.includes(highlightTeamId);

  return (
    <div className="space-y-6">
      {sortedRounds.map((round) => (
        <div key={round}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Round {round}
          </h3>
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {grouped.get(round)!.map((fixture) => {
              const { date, time } = formatDateTime(fixture.event_date);
              const status = getStatus(fixture);
              const highlighted = involvesTeam(fixture);

              return (
                <div
                  key={fixture.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  style={highlighted ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{fixture.title}</p>
                    <p className="text-xs text-gray-500">
                      {date} · {time}
                      {fixture.location && ` · ${fixture.location}`}
                      {fixture.pitch && ` · ${fixture.pitch}`}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
