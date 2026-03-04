import { useState } from "react";
import { Search, Upload, Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

interface Team {
  id: string;
  name: string;
  ageGroup: string;
  players: number;
  coaches: number;
  status: 'active' | 'inactive';
}

export function TeamsManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const teams: Team[] = [
    { id: '1', name: 'U8 Rangers', ageGroup: 'U8', players: 15, coaches: 2, status: 'active' },
    { id: '2', name: 'U10 Rangers', ageGroup: 'U10', players: 18, coaches: 3, status: 'active' },
    { id: '3', name: 'U12 Rangers Blue', ageGroup: 'U12', players: 16, coaches: 2, status: 'active' },
    { id: '4', name: 'U12 Rangers White', ageGroup: 'U12', players: 17, coaches: 2, status: 'active' },
    { id: '5', name: 'U14 Rangers', ageGroup: 'U14', players: 20, coaches: 3, status: 'active' },
    { id: '6', name: 'U16 Rangers', ageGroup: 'U16', players: 19, coaches: 2, status: 'active' },
    { id: '7', name: 'U18 Rangers', ageGroup: 'U18', players: 22, coaches: 3, status: 'inactive' },
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.ageGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams Management</h1>
        <p className="text-gray-600">Manage team rosters and import data from Friendly Manager</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import from Friendly Manager
            </Button>
            <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
              <Plus className="w-4 h-4" />
              Add Team
            </Button>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Coaches</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0091f3]/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#0091f3]" />
                    </div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>{team.ageGroup}</TableCell>
                <TableCell>
                  <span className="text-gray-600">{team.players}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{team.coaches}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={team.status === 'active' ? 'default' : 'secondary'}
                    className={team.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  >
                    {team.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Teams</p>
          <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Players</p>
          <p className="text-2xl font-bold text-gray-900">{teams.reduce((sum, t) => sum + t.players, 0)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Coaches</p>
          <p className="text-2xl font-bold text-gray-900">{teams.reduce((sum, t) => sum + t.coaches, 0)}</p>
        </div>
      </div>
    </div>
  );
}
