import { useState, useEffect } from 'react';
import { competitionsApi } from '../../lib/competitions-api';
import type { Competition, CompetitionTeam, Team } from '../../types/database';

export function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [compTeams, setCompTeams] = useState<(CompetitionTeam & { team?: Team })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', competition_type: 'wcr' as 'wcr' | 'other', start_date: '', end_date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [comps, allTeams] = await Promise.all([
        competitionsApi.getCompetitions(),
        competitionsApi.query<Team>('teams'),
      ]);
      setCompetitions(comps);
      setTeams(allTeams);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompTeams = async (compId: string) => {
    const ct = await competitionsApi.getCompetitionTeams(compId);
    setCompTeams(ct);
  };

  const selectComp = (comp: Competition) => {
    setSelectedComp(comp);
    loadCompTeams(comp.id);
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editingId) {
        await competitionsApi.updateCompetition(editingId, formData);
      } else {
        await competitionsApi.createCompetition(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', competition_type: 'wcr', start_date: '', end_date: '' });
      await loadData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (comp: Competition) => {
    setFormData({ name: comp.name, competition_type: comp.competition_type, start_date: comp.start_date, end_date: comp.end_date });
    setEditingId(comp.id);
    setShowForm(true);
  };

  const handleClose = async (comp: Competition) => {
    if (!confirm(`Close "${comp.name}" now? This sets the end date to today.`)) return;
    await competitionsApi.closeCompetition(comp.id);
    await loadData();
    if (selectedComp?.id === comp.id) setSelectedComp({ ...comp, status: 'closed', end_date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = async (comp: Competition) => {
    if (!confirm(`Delete "${comp.name}"? This cannot be undone.`)) return;
    await competitionsApi.deleteCompetition(comp.id);
    if (selectedComp?.id === comp.id) { setSelectedComp(null); setCompTeams([]); }
    await loadData();
  };

  const handleLinkTeam = async (teamId: string) => {
    if (!selectedComp) return;
    await competitionsApi.linkTeam(selectedComp.id, teamId);
    await loadCompTeams(selectedComp.id);
  };

  const handleUnlinkTeam = async (teamId: string) => {
    if (!selectedComp) return;
    await competitionsApi.unlinkTeam(selectedComp.id, teamId);
    await loadCompTeams(selectedComp.id);
  };

  const handleCleanup = async () => {
    if (!selectedComp) return;
    if (!confirm('Remove all lite users from this competition\'s teams?')) return;
    const result = await competitionsApi.cleanupLiteUsers(selectedComp.id);
    alert(`Cleanup complete: ${result.removed} lite users removed, ${result.retained} full users retained.`);
  };

  const linkedTeamIds = compTeams.map((ct: any) => ct.team_id);
  const availableTeams = teams.filter(t => !linkedTeamIds.includes(t.id));
  const isActive = (comp: Competition) => competitionsApi.isCompetitionActive(comp);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading competitions...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Competitions</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', competition_type: 'wcr', start_date: '', end_date: '' }); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + New Competition
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow border">
          <h2 className="font-semibold mb-3">{editingId ? 'Edit' : 'New'} Competition</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Competition name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <select value={formData.competition_type} onChange={e => setFormData({ ...formData, competition_type: e.target.value as 'wcr' | 'other' })}
              className="border rounded-lg px-3 py-2">
              <option value="wcr">WCR (Club)</option>
              <option value="other">Other (Tournament/Social)</option>
            </select>
            <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Competition List */}
        <div className="col-span-2">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map(comp => (
                <tr key={comp.id} className={`border-b hover:bg-gray-50 cursor-pointer ${selectedComp?.id === comp.id ? 'bg-blue-50' : ''}`}
                  onClick={() => selectComp(comp)}>
                  <td className="p-3 font-medium">{comp.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${comp.competition_type === 'wcr' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {comp.competition_type === 'wcr' ? 'WCR' : 'Other'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isActive(comp) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {isActive(comp) ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{comp.start_date} → {comp.end_date}</td>
                  <td className="p-3">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleEdit(comp)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Edit</button>
                      {isActive(comp) && (
                        <button onClick={() => handleClose(comp)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Close Now</button>
                      )}
                      <button onClick={() => handleDelete(comp)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {competitions.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No competitions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Team Linking Panel */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedComp ? (
            <>
              <h3 className="font-semibold mb-3">Teams in "{selectedComp.name}"</h3>
              <div className="space-y-2 mb-4">
                {compTeams.map((ct: any) => (
                  <div key={ct.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{ct.team?.age_group} {ct.team?.name}</span>
                    <button onClick={() => handleUnlinkTeam(ct.team_id)} className="text-xs text-red-600 hover:underline">Remove</button>
                  </div>
                ))}
                {compTeams.length === 0 && <p className="text-sm text-gray-400">No teams linked</p>}
              </div>
              {availableTeams.length > 0 && (
                <select onChange={e => { if (e.target.value) handleLinkTeam(e.target.value); e.target.value = ''; }}
                  className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="">
                  <option value="" disabled>+ Add team...</option>
                  {availableTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.age_group} {t.name}</option>
                  ))}
                </select>
              )}
              {selectedComp.competition_type === 'other' && selectedComp.status === 'closed' && (
                <button onClick={handleCleanup} className="mt-4 w-full px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200">
                  Cleanup Lite Users
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Select a competition to manage teams</p>
          )}
        </div>
      </div>
    </div>
  );
}
